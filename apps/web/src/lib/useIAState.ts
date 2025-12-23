"use client";

import { useEffect, useState } from "react";
import { loadState, saveState } from "./localState";
import type { IAState } from "./localState";

/**
 * React hook：让你在页面里像用“全局状态”一样用 localStorage
 * - state：当前状态
 * - update：更新状态并写入 localStorage
 */
export function useIAState() {
  const [state, setState] = useState<IAState>(() => loadState());

  useEffect(() => {
    // 首次加载时同步一遍
    setState(loadState());
  }, []);

  const update = (fn: (prev: IAState) => IAState) => {
    setState((prev) => {
      const next = fn(prev);
      saveState(next);
      return next;
    });
  };

  return { state, update };
}
