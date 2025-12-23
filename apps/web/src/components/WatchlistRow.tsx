import Link from "next/link";
import type { StyleId } from "@/lib/localState";

/**
 * 自选列表行组件（MVP）
 * - 展示：名称/代码/前收价/两风格评分/一页结论/待复盘角标
 */
export type WatchlistRowVM = {
  symbol: string;
  name: string;
  market: "A" | "HK";
  prevClose?: { price: number; date: string };
  // 两种风格的总评
  styleOverview: Record<StyleId, { score: number; label: string }>;
  // 当前展示的一页结论（例如：跟随当前筛选风格）
  oneLine: string;
  hasUnreviewedEvent?: boolean;
};

export default function WatchlistRow({ vm }: { vm: WatchlistRowVM }) {
  return (
    <Link
      href={`/symbols/${encodeURIComponent(vm.symbol)}`}
      className="block rounded-xl border p-3 bg-white"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium flex items-center gap-2">
            {vm.name}
            {vm.hasUnreviewedEvent ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                待复盘
              </span>
            ) : null}
          </div>
          <div className="text-xs text-gray-500">
            {vm.symbol} · {vm.market}
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-semibold">
            ¥ {vm.prevClose?.price ?? "--"}
          </div>
          <div className="text-xs text-gray-500">
            {vm.prevClose?.date ?? "—"} 收盘
          </div>
        </div>
      </div>

      {/* 两风格评分 */}
      <div className="mt-2 flex gap-2 text-xs">
        <span className="px-2 py-1 rounded-full bg-gray-100">
          现金流 {vm.styleOverview.dividend_cashflow.score} ·{" "}
          {vm.styleOverview.dividend_cashflow.label}
        </span>
        <span className="px-2 py-1 rounded-full bg-gray-100">
          景气 {vm.styleOverview.prosperity.score} ·{" "}
          {vm.styleOverview.prosperity.label}
        </span>
      </div>

      {/* 一页结论 */}
      <div className="mt-2 text-xs text-gray-600 line-clamp-2">
        {vm.oneLine}
      </div>
    </Link>
  );
}
