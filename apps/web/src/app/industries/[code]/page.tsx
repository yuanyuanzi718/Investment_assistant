import BottomTabBar from "@/components/BottomTabBar";
import StockRow, { StockItem } from "@/components/StockRow";

async function getIndustryDetail(code: string) {
  const res = await fetch(`http://localhost:3001/v1/industries/${code}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch industry detail");
  return res.json();
}

export default async function IndustryDetailPage({
  params,
}: {
  params: { code: string };
}) {
  const { code } = await params;
  const data = await getIndustryDetail(code);
  console.log(data, "data");

  return (
    <>
      <main className="p-4 pb-16 space-y-3">
        <div>
          <h1 className="text-lg font-semibold">{data.industry_name}</h1>
          <p className="text-sm text-gray-500">行业详情（MVP）</p>
        </div>

        <div className="rounded-xl border p-3 bg-white">
          <div className="font-medium">估值概览</div>
          <div className="text-sm text-gray-600 mt-1">
            便宜度：{data.cheapness_percentile}% · {data.cheapness_label} ·
            口径：{data.valuation_basis}
          </div>
        </div>

        <div className="rounded-xl border p-3 bg-white">
          <div className="font-medium">研报共识摘要（3条）</div>
          <ul className="mt-2 space-y-2 text-sm text-gray-700">
            {(data.research_summary ?? []).map((x: any, idx: number) => (
              <li key={idx}>• {x.point}</li>
            ))}
          </ul>
        </div>

        {/* ✅ 推荐标的 */}
        <div className="space-y-2">
          <div className="text-sm font-medium">推荐标的</div>
          {(data.symbols ?? []).map((s: StockItem) => (
            <StockRow key={s.symbol} item={s} />
          ))}
        </div>
      </main>

      <BottomTabBar />
    </>
  );
}
