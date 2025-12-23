import Link from "next/link";

/**
 * 标的行组件（行业详情页、自选页都会复用）
 * 点击整行进入个股页：/symbols/[symbol]
 */
export type StockItem = {
  symbol: string;
  name: string;
  market: "A" | "HK";
  valuation_percentile?: number | null;
  one_line_reason?: string;
  style_fit?: {
    dividend_cashflow?: { score: number | null; label: string };
    prosperity?: { score: number | null; label: string };
  };
};

export default function StockRow({ item }: { item: StockItem }) {
  return (
    <Link
      href={`/symbols/${encodeURIComponent(item.symbol)}`}
      className="block rounded-xl border p-3 bg-white"
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">{item.name}</div>
        <div className="text-xs text-gray-500">{item.market}</div>
      </div>

      <div className="mt-1 text-xs text-gray-600">
        估值分位：{item.valuation_percentile ?? "--"}%
      </div>

      {/* 两个风格分 */}
      {item.style_fit ? (
        <div className="mt-2 flex gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-gray-100">
            现金流 {item.style_fit.dividend_cashflow?.score ?? "--"}
          </span>
          <span className="px-2 py-1 rounded-full bg-gray-100">
            景气 {item.style_fit.prosperity?.score ?? "--"}
          </span>
        </div>
      ) : null}

      {item.one_line_reason ? (
        <div className="mt-2 text-xs text-gray-500 line-clamp-2">
          {item.one_line_reason}
        </div>
      ) : null}
    </Link>
  );
}
