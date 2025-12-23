"use client";

import { useEffect, useMemo, useState } from "react";
import BottomTabBar from "@/components/BottomTabBar";
import WatchlistRow, { WatchlistRowVM } from "@/components/WatchlistRow";
import { useIAState } from "@/lib/useIAState";
import type { StyleId } from "@/lib/localState";

/**
 * 自选页（MVP）
 * - 数据源：localStorage 的 watchlist
 * - 页面行为：逐个请求后端 analysis，拼出列表 VM
 * - 先不做性能优化（并发、缓存、React Query），先学习“数据流”
 */

type AnalysisPayload = any;

type Filter = "all" | "unreviewed";

export default function WatchlistPage() {
  const { state } = useIAState();

  // 当前展示的风格（你原型里有“仅看待复盘/更多筛选”，这里先做一个“按风格查看结论”）
  const [styleView, setStyleView] = useState<StyleId>("prosperity");

  // 简单筛选：全部 / 仅看待复盘
  const [filter, setFilter] = useState<Filter>("all");

  const [rows, setRows] = useState<WatchlistRowVM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const list = state.watchlist;
    if (!list.length) {
      setRows([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);

      // ✅ 1) 拉取“待复盘事件流”
      const evRes = await fetch(
        "http://localhost:3001/v1/events/falsify?status=unreviewed&limit=50",
        {
          cache: "no-store",
        }
      );
      const evJson = await evRes.json();
      const events: Array<{ event_id: string; symbol: string }> =
        evJson.items ?? [];

      // ✅ 2) 排除已经复盘过的事件（本地）
      const unreviewed = events.filter(
        (e) => !state.reviewedEventIds.includes(e.event_id)
      );

      // ✅ 3) 建立 symbol -> 是否有未复盘事件 的索引（O(1) 查询）
      const hasEventBySymbol = new Set(unreviewed.map((e) => e.symbol));

      // ✅ 4) 并发拉取自选股分析，拼装 VM
      const results = await Promise.all(
        list.map(async (w) => {
          const res = await fetch(
            `http://localhost:3001/v1/symbols/${encodeURIComponent(w.symbol)}/analysis?period=5y`,
            { cache: "no-store" }
          );
          const a: any = await res.json();

          const tabCash = a.tabs.find(
            (t: any) => t.style_id === "dividend_cashflow"
          );
          const tabPros = a.tabs.find((t: any) => t.style_id === "prosperity");
          const tabView =
            a.tabs.find((t: any) => t.style_id === styleView) ??
            tabPros ??
            tabCash;

          return {
            symbol: a.symbol,
            name: a.name,
            market: a.market,
            prevClose: a.prev_close,

            // ✅ 关键：由事件流决定（不再用 analysis.has_unreviewed_event）
            hasUnreviewedEvent: hasEventBySymbol.has(a.symbol),

            styleOverview: {
              dividend_cashflow: {
                score: tabCash?.overall?.score ?? 0,
                label: tabCash?.overall?.label ?? "—",
              },
              prosperity: {
                score: tabPros?.overall?.score ?? 0,
                label: tabPros?.overall?.label ?? "—",
              },
            },
            oneLine: tabView?.thesis?.one_line ?? "暂无结论",
          };
        })
      );

      if (cancelled) return;
      setRows(results);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [state.watchlist, styleView, state.reviewedEventIds]);

  const filteredRows = useMemo(() => {
    if (filter === "unreviewed")
      return rows.filter((r) => r.hasUnreviewedEvent);
    return rows;
  }, [rows, filter]);

  return (
    <>
      <main className="p-4 pb-16 space-y-3">
        <div>
          <h1 className="text-lg font-semibold">自选股票</h1>
          <p className="text-sm text-gray-500 mt-1">
            显示前收价 + 一页结论（MVP）
          </p>
        </div>

        {/* 筛选条（MVP 两个维度） */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            className={`px-3 py-1 rounded-full border ${filter === "all" ? "bg-black text-white" : "bg-white"}`}
            onClick={() => setFilter("all")}
          >
            全部
          </button>
          <button
            className={`px-3 py-1 rounded-full border ${filter === "unreviewed" ? "bg-black text-white" : "bg-white"}`}
            onClick={() => setFilter("unreviewed")}
          >
            仅看待复盘
          </button>

          <div className="w-full" />

          <button
            className={`px-3 py-1 rounded-full border ${styleView === "dividend_cashflow" ? "bg-black text-white" : "bg-white"}`}
            onClick={() => setStyleView("dividend_cashflow")}
          >
            结论：现金流
          </button>
          <button
            className={`px-3 py-1 rounded-full border ${styleView === "prosperity" ? "bg-black text-white" : "bg-white"}`}
            onClick={() => setStyleView("prosperity")}
          >
            结论：景气
          </button>
        </div>

        {/* 内容区 */}
        {loading ? (
          <div className="text-sm text-gray-500">加载中…</div>
        ) : state.watchlist.length === 0 ? (
          <div className="text-sm text-gray-500">
            还没有自选。去行业详情页点击标的进入个股页，然后点“加入自选”。
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="text-sm text-gray-500">没有符合筛选条件的自选项</div>
        ) : (
          <div className="space-y-2">
            {filteredRows.map((vm) => (
              <WatchlistRow key={vm.symbol} vm={vm} />
            ))}
          </div>
        )}
      </main>

      <BottomTabBar />
    </>
  );
}
