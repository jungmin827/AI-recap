import React, { useRef, useState } from 'react';
import JSZip from 'jszip';

// 타입은 간략화, 실제로는 @types/schema의 StatResult 사용
interface ResultType {
  mbtiCode: string;
  scores: Record<string, number>;
  topInterests: string[];
}

type Status = 'IDLE' | 'UNZIPPING' | 'ANALYZING' | 'COMPLETE' | 'ERROR';

import { useRouter } from 'next/navigation';
import { useResultStore } from '../store/resultStore';

export default function UploadZone() {
  const [status, setStatus] = useState<Status>('IDLE');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const setResult = useResultStore((s) => s.setResult);

  // Web Worker 선언
  const workerRef = useRef<Worker | null>(null);

  // ZIP에서 conversations.json 추출 구현
  async function extractConversationsJson(file: File): Promise<string> {
    setStatus('UNZIPPING');
    setProgress(20);
    const zip = await JSZip.loadAsync(file);
    const target = Object.values(zip.files).find(f => f.name.endsWith('conversations.json'));
    if (!target) throw new Error('conversations.json 파일 없음');
    setProgress(40);
    return await target.async('string');
  }

  // drag & drop, input 파일 선택 핸들러
  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setStatus('UNZIPPING');
    setProgress(0);
    let jsonStr = '';
    try {
      jsonStr = await extractConversationsJson(files[0]);
    } catch(e: any) {
      setStatus('ERROR');
      setError(e.message || 'ZIP 처리 실패');
      return;
    }
    setStatus('ANALYZING');
    setProgress(60);
    // WebWorker 로드 및 메시지 전달
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('../worker/parser.worker.ts', import.meta.url));
    }
    workerRef.current.onmessage = function(e) {
      const { type, result, error } = e.data;
      if (type === 'SUCCESS') {
        setStatus('COMPLETE');
        setProgress(100);
        setResult(result);
        router.push('/report');
      } else {
        setStatus('ERROR');
        setError(error || '분석 실패');
      }
    };
    // worker에 분석 명령
    workerRef.current.postMessage({ type: 'START', text: jsonStr });
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
  }
  function onClick() {
    inputRef.current?.click();
  }
  function reset() {
    setStatus('IDLE');
    setProgress(0);
    setError(null);
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }
  return (
    <div className="w-full max-w-md mx-auto my-12 p-8 border rounded bg-white/80">
      <div
        className="border-2 border-dashed p-8 cursor-pointer text-center"
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        onClick={onClick}
        style={{ opacity: status === 'ANALYZING' ? 0.7 : 1 }}
      >
        {status === 'IDLE' && <>이메일로 받은 <b>package.zip</b> 파일을 드래그&드롭 혹은 클릭하여 업로드하세요.</>}
        {status === 'UNZIPPING' && <>압축 해제 중...<div className="mt-2 w-2/3 mx-auto bg-gray-200 h-2"><div className="bg-blue-400 h-2" style={{width: progress+"%"}} /></div></>}
        {status === 'ANALYZING' && <>AI 분석 중(1~3초)...<div className="mt-2 w-2/3 mx-auto bg-gray-200 h-2"><div className="bg-green-500 h-2" style={{width: progress+"%"}} /></div></>}
        {status === 'COMPLETE' && <span className="text-green-700">분석 성공! 결과 리포트로 이동하세요.</span>}
        {status === 'ERROR' && <span className="text-red-700">오류: {error}</span>}
      </div>
      <input
        type="file"
        accept=".zip"
        ref={inputRef}
        onChange={onChange}
        className="hidden"
      />
      {status !== 'IDLE' && (
        <button className="mt-4 text-blue-600 underline" onClick={reset} type="button">다시 선택</button>
      )}
    </div>
  );
}

