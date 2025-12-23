/**
 * localStorage 匿名状态（MVP）
 * - 你后面加账号登录时，可以把这些状态同步到服务端
 */

export type StyleId = "dividend_cashflow" | "prosperity";

export type IAState = {
  watchlist: Array<{
    symbol: string;
    market: "A" | "HK";
    enabledStyles: StyleId[]; // 这个股票开启哪些风格提醒
  }>;
  styleThresholds: Record<StyleId, { buy_lt: number; watch_lt: number }>;
  // ✅ 新增：已复盘事件（只存事件 id）
  reviewedEventIds: string[];
};

const KEY = "ia_state_v1";

const defaultState: IAState = {
  watchlist: [],
  styleThresholds: {
    dividend_cashflow: { buy_lt: 30, watch_lt: 60 },
    prosperity: { buy_lt: 20, watch_lt: 50 },
  },
  reviewedEventIds: [],
};

export function loadState(): IAState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

export function saveState(s: IAState) {
  localStorage.setItem(KEY, JSON.stringify(s));
}
