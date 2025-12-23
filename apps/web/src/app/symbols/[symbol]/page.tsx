"use client";

import { useMemo, useState, useEffect, use } from "react";
import BottomTabBar from "@/components/BottomTabBar";
import { useIAState } from "@/lib/useIAState";
import type { StyleId } from "@/lib/localState";

/**
 * ✅ 这个页面现在是 Client Component
 * 好处：可以用 useState（Tab切换）、弹窗、localStorage 等
 * 代价：数据 fetch 不能用 async/await 在组件外直接拿（要用 useEffect 或直接 fetch + state）
 */

type AnalysisTab = {
  style_id: StyleId;
  style_name: string;
  overall: { score: number; label: string };
  valuation: {
    basis: "PE" | "PB";
    percentile: number;
    period: string;
    zone: string;
  };
  thesis: { one_line: string };
  metrics: Array<{
    key: string;
    name: string;
    value: any;
    status: "green" | "yellow" | "red";
  }>;
  falsify_rules: Array<{ rule: string; severity: string }>;
  logic_chains?: Array<{
    conclusion: string;
    because: string;
    catalyst: string;
    risk: string;
  }>;
};

type AnalysisPayload = {
  symbol: string;
  name: string;
  market: "A" | "HK";
  industry: { code: string; name: string; cycle_flag: boolean };
  prev_close: { price: number; date: string };
  tabs: AnalysisTab[];
};

function statusDot(status: "green" | "yellow" | "red") {
  if (status === "green") return "bg-green-500";
  if (status === "yellow") return "bg-yellow-500";
  return "bg-red-500";
}

export default function SymbolPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol: rawSymbol } = use(params);
  const symbol = decodeURIComponent(rawSymbol);

  const { state, update } = useIAState();

  const [data, setData] = useState<AnalysisPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<StyleId>("dividend_cashflow");

  // 弹窗（提醒设置）
  const [reminderOpen, setReminderOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/v1/symbols/${encodeURIComponent(symbol)}/analysis?period=5y`,
          { cache: "no-store" }
        );
        const json = await res.json();
        setData(json);
      } finally {
        setLoading(false);
      }
    })();
  }, [symbol]);

  const tab = useMemo(() => {
    if (!data) return null;
    return data.tabs.find((t) => t.style_id === active) ?? data.tabs[0];
  }, [data, active]);

  const inWatchlist = state.watchlist.some((w) => w.symbol === symbol);

  const toggleWatchlist = () => {
    if (!data) return;
    update((prev) => {
      const exists = prev.watchlist.some((w) => w.symbol === symbol);

      // 你允许同一只股票两个 Tab 都能打分，所以默认开启两种风格
      const nextWatchlist = exists
        ? prev.watchlist.filter((w) => w.symbol !== symbol)
        : [
            ...prev.watchlist,
            {
              symbol,
              market: data.market,
              enabledStyles: ["dividend_cashflow", "prosperity"] as StyleId[],
            },
          ];

      return { ...prev, watchlist: nextWatchlist };
    });
  };

  // 当前股票启用哪些风格提醒（如果不在自选里，就默认全开）
  const enabledStyles: StyleId[] = inWatchlist
    ? (state.watchlist.find((w) => w.symbol === symbol)?.enabledStyles ?? [
        "dividend_cashflow",
        "prosperity",
      ])
    : ["dividend_cashflow", "prosperity"];

  // 保存提醒设置：阈值（全局）+ 该股票启用风格（局部）
  const saveReminder = (next: {
    thresholds: typeof state.styleThresholds;
    enabledStyles: StyleId[];
  }) => {
    update((prev) => {
      const wl = prev.watchlist.slice();
      const idx = wl.findIndex((w) => w.symbol === symbol);
      if (idx >= 0) wl[idx] = { ...wl[idx], enabledStyles: next.enabledStyles };
      return { ...prev, watchlist: wl, styleThresholds: next.thresholds };
    });
  };

  if (loading) {
    return (
      <>
        <main className="p-4 pb-16">加载中…</main>
        <BottomTabBar />
      </>
    );
  }

  if (!data || !tab) {
    return (
      <>
        <main className="p-4 pb-16">暂无数据</main>
        <BottomTabBar />
      </>
    );
  }

  return (
    <>
      <main className="p-4 pb-16 space-y-3">
        {/* 头部：前收价 + 加入自选 + 提醒设置 */}
        <div className="rounded-xl border p-3 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold">
                {data.name}{" "}
                <span className="text-xs text-gray-500">{data.market}</span>
              </div>
              <div className="text-xs text-gray-500">
                {data.industry.name} ·{" "}
                {data.industry.cycle_flag ? "周期" : "非周期"}
              </div>
            </div>

            <button
              onClick={toggleWatchlist}
              className="px-3 py-1.5 rounded-xl border text-sm"
            >
              {inWatchlist ? "已自选✅" : "+ 加入自选"}
            </button>
          </div>

          <div className="mt-2 text-2xl font-bold">
            ¥ {data.prev_close?.price ?? "--"}
          </div>
          <div className="text-xs text-gray-500">
            收盘（{data.prev_close?.date ?? "—"}）
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-gray-600">
              估值：{tab.valuation.percentile}% 分位（{tab.valuation.basis} /
              5y）
            </div>
            <button
              onClick={() => setReminderOpen(true)}
              className="px-3 py-1.5 rounded-xl border text-sm"
            >
              提醒设置
            </button>
          </div>
        </div>

        {/* Tabs：可切换 */}
        <div className="flex gap-2">
          <button
            className={`px-3 py-2 rounded-xl border text-sm ${
              active === "dividend_cashflow"
                ? "bg-black text-white"
                : "bg-white"
            }`}
            onClick={() => setActive("dividend_cashflow")}
          >
            股息现金流
          </button>
          <button
            className={`px-3 py-2 rounded-xl border text-sm ${
              active === "prosperity" ? "bg-black text-white" : "bg-white"
            }`}
            onClick={() => setActive("prosperity")}
          >
            景气型
          </button>
        </div>

        {/* 一页结论型：结论条 */}
        <div className="rounded-xl border p-3 bg-white">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{tab.overall.label}</span>
            <span className="text-gray-600">
              {tab.overall.score}分 · {tab.valuation.zone}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-700">
            {tab.thesis.one_line}
          </div>
        </div>

        {/* 关键指标 */}
        <div className="rounded-xl border p-3 bg-white">
          <div className="text-sm font-medium">关键指标</div>
          <div className="mt-2 space-y-2">
            {tab.metrics.map((m) => (
              <div
                key={m.key}
                className="flex items-center justify-between text-sm"
              >
                <span>{m.name}</span>
                <span className="flex items-center gap-2">
                  <span className="text-gray-600">{String(m.value)}</span>
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${statusDot(m.status)}`}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 研报逻辑链（你原型里想要的“关键假设/逻辑变化”基础） */}
        <div className="rounded-xl border p-3 bg-white">
          <div className="text-sm font-medium">研报逻辑链</div>

          {tab.logic_chains?.length ? (
            <div className="mt-2 space-y-2">
              {tab.logic_chains.map((x, idx) => (
                <div key={idx} className="rounded-xl border p-2">
                  <div className="text-sm font-medium">{x.conclusion}</div>
                  <div className="mt-1 text-xs text-gray-600">
                    因为：{x.because}
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    催化：{x.catalyst}
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    风险：{x.risk}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-2 text-sm text-gray-500">
              暂无结构化逻辑（MVP 可后补）
            </div>
          )}
        </div>

        {/* 证伪条件 */}
        <div className="rounded-xl border p-3 bg-white">
          <div className="text-sm font-medium">证伪条件</div>
          <ul className="mt-2 space-y-2 text-sm text-gray-700">
            {tab.falsify_rules.map((r, idx) => (
              <li key={idx}>• {r.rule}</li>
            ))}
          </ul>
        </div>
      </main>

      {/* ✅ 提醒设置弹窗（最小版） */}
      <ReminderDialog
        open={reminderOpen}
        onClose={() => setReminderOpen(false)}
        thresholds={state.styleThresholds}
        enabledStyles={enabledStyles}
        onSave={saveReminder}
      />

      <BottomTabBar />
    </>
  );
}

/**
 * 提醒设置弹窗（MVP）
 * - 你的设定：阈值按风格不同（现金流 vs 景气）
 * - enabledStyles：对“某一只股票”开启哪些风格监控
 */
function ReminderDialog(props: {
  open: boolean;
  onClose: () => void;
  thresholds: Record<StyleId, { buy_lt: number; watch_lt: number }>;
  enabledStyles: StyleId[];
  onSave: (next: {
    thresholds: Record<StyleId, { buy_lt: number; watch_lt: number }>;
    enabledStyles: StyleId[];
  }) => void;
}) {
  if (!props.open) return null;

  const toggleStyle = (style: StyleId) => {
    const set = new Set(props.enabledStyles);
    if (set.has(style)) {
      set.delete(style);
    } else {
      set.add(style);
    }
    props.onSave({
      thresholds: props.thresholds,
      enabledStyles: Array.from(set) as StyleId[],
    });
  };

  const setThreshold = (
    style: StyleId,
    key: "buy_lt" | "watch_lt",
    value: number
  ) => {
    props.onSave({
      thresholds: {
        ...props.thresholds,
        [style]: { ...props.thresholds[style], [key]: value },
      },
      enabledStyles: props.enabledStyles,
    });
  };

  const rowTitle = (style: StyleId) =>
    style === "dividend_cashflow" ? "股息现金流" : "景气型";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-4">
        <div className="text-lg font-semibold">提醒设置</div>

        <div className="mt-3 space-y-4">
          {(["dividend_cashflow", "prosperity"] as StyleId[]).map((style) => (
            <div key={style} className="rounded-xl border p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{rowTitle(style)}</div>
                <button
                  onClick={() => toggleStyle(style)}
                  className={`px-3 py-1 rounded-xl border text-sm ${
                    props.enabledStyles.includes(style)
                      ? "bg-black text-white"
                      : ""
                  }`}
                >
                  {props.enabledStyles.includes(style) ? "已开启" : "未开启"}
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <label className="space-y-1">
                  <div className="text-xs text-gray-600">可买分位 &lt;</div>
                  <input
                    className="w-full rounded-lg border px-2 py-2"
                    type="number"
                    value={props.thresholds[style].buy_lt}
                    onChange={(e) =>
                      setThreshold(style, "buy_lt", Number(e.target.value))
                    }
                  />
                </label>

                <label className="space-y-1">
                  <div className="text-xs text-gray-600">观察分位 &lt;</div>
                  <input
                    className="w-full rounded-lg border px-2 py-2"
                    type="number"
                    value={props.thresholds[style].watch_lt}
                    onChange={(e) =>
                      setThreshold(style, "watch_lt", Number(e.target.value))
                    }
                  />
                </label>
              </div>

              <div className="mt-2 text-xs text-gray-500">
                仅做“逻辑证伪/假设变化”提醒，不构成投资建议
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={props.onClose}
            className="flex-1 px-3 py-2 rounded-xl border"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
