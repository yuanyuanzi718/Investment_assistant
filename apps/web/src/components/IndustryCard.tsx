import Link from 'next/link';

/**
 * 行业卡组件（MVP版）
 * 目标：
 * 1) 把 “行业列表项 UI” 封装成可复用组件
 * 2) 通过 Link 跳到行业详情页 /industries/[code]
 */

// 用 TypeScript 定义这个组件需要哪些字段（props）
// 好处：后面你从后端拿到数据，字段不对会直接报错，减少踩坑。
export type IndustryItem = {
  industry_code: string;
  industry_name: string;
  cheapness_percentile: number; // 便宜度分位，比如 12
  cheapness_label: string;      // 极便宜/便宜/适中/偏贵…
  valuation_basis: 'PE' | 'PB'; // 口径
  cycle_flag?: boolean;         // 可选：周期/非周期
};

export default function IndustryCard({ item }: { item: IndustryItem }) {
  return (
    // Link：点击整张卡进入行业详情页
    <Link
      href={`/industries/${item.industry_code}`}
      className="block rounded-xl border p-3 bg-white"
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">{item.industry_name}</div>

        {/* 可选展示：周期/非周期 */}
        {typeof item.cycle_flag === 'boolean' ? (
          <span className="text-xs px-2 py-0.5 rounded-full border text-gray-600">
            {item.cycle_flag ? '周期' : '非周期'}
          </span>
        ) : null}
      </div>

      <div className="text-sm text-gray-600 mt-1">
        便宜度：{item.cheapness_percentile}% · {item.cheapness_label} · 口径：{item.valuation_basis}
      </div>
    </Link>
  );
}
