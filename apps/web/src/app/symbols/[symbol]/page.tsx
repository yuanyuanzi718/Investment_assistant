import BottomTabBar from "@/components/BottomTabBar";
import Link from "next/link";

async function getAnalysis(symbol: string) {
  const res = await fetch(
    `http://localhost:3001/v1/symbols/${encodeURIComponent(symbol)}/analysis?period=5y`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch analysis");
  return res.json();
}

export default async function SymbolPage({
  params,
}: {
  params: { symbol: string };
}) {
  const { symbol } = await params;
  const data = await getAnalysis(symbol);

  // 默认展示第一个 Tab（现金流），下一步我们做“可切换双Tab”
  const tab = data.tabs?.[0];

  return (
    <>
      <main className="p-4 pb-16 space-y-3">
        {/* 顶部：前收价（非实时） */}
        <div className="rounded-xl border p-3 bg-white">
          <div className="font-semibold">
            {data.name}{" "}
            <span className="text-xs text-gray-500">{data.market}</span>
          </div>
          <div className="text-xs text-gray-500">
            {data.industry.name} ·{" "}
            {data.industry.cycle_flag ? "周期" : "非周期"}
          </div>
          <div className="mt-2 text-2xl font-bold">
            ¥ {data.prev_close?.price ?? "--"}
          </div>
          <div className="text-xs text-gray-500">
            收盘（{data.prev_close?.date ?? "—"}）
          </div>
        </div>

        {/* Tab 占位：下一步做真正切换 */}
        <div className="flex gap-2">
          <span className="px-3 py-2 rounded-xl border bg-black text-white text-sm">
            股息现金流
          </span>
          <span className="px-3 py-2 rounded-xl border bg-white text-sm">
            景气型
          </span>
        </div>

        {/* 结论条（一页结论型） */}
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
            {tab.metrics.map((m: any) => (
              <div key={m.key} className="flex justify-between text-sm">
                <span>{m.name}</span>
                <span className="text-gray-600">{String(m.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 证伪条件 */}
        <div className="rounded-xl border p-3 bg-white">
          <div className="text-sm font-medium">证伪条件</div>
          <ul className="mt-2 space-y-2 text-sm text-gray-700">
            {tab.falsify_rules.map((r: any, idx: number) => (
              <li key={idx}>• {r.rule}</li>
            ))}
          </ul>
        </div>

        <Link href="/industries" className="text-xs text-gray-500 underline">
          返回行业
        </Link>
      </main>

      <BottomTabBar />
    </>
  );
}
