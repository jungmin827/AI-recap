import { create } from 'zustand';
import { StatResult } from '@types/schema';

interface ResultStore {
  result: StatResult | null;
  setResult: (r: StatResult) => void;
  getResult: () => StatResult | null;
  clearResult: () => void;
}

const KEY = 'ai_recap_result';

function saveToSession(r: StatResult) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(KEY, JSON.stringify(r));
}
function loadFromSession(): StatResult | null {
  if (typeof window === 'undefined') return null;
  const t = window.sessionStorage.getItem(KEY);
  if (!t) return null;
  try { return JSON.parse(t) as StatResult; } catch { return null; }
}
function clearSession() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(KEY);
}

export const useResultStore = create<ResultStore>((set, get) => ({
  result: null,
  setResult: (r) => {
    set({ result: r });
    saveToSession(r);
  },
  getResult: () => {
    const current = get().result;
    if (current) return current;
    const fromSession = loadFromSession();
    if (fromSession) set({ result: fromSession });
    return fromSession;
  },
  clearResult: () => {
    set({ result: null });
    clearSession();
  },
}));

