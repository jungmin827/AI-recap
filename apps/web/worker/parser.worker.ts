import { analyzeMessages } from '@logic/parsers';

self.onmessage = function (e) {
  const { type, text } = e.data;
  if (type === 'START' && typeof text === 'string') {
    try {
      const result = analyzeMessages(text);
      // 분석 성공 시
      self.postMessage({ type: 'SUCCESS', result });
    } catch (err) {
      // 분석 에러 시
      self.postMessage({ type: 'ERROR', error: (err instanceof Error ? err.message : String(err)) });
    }
  } else {
    self.postMessage({ type: 'ERROR', error: '잘못된 메시지 포맷' });
  }
};

