import BottomTabBar from '@/components/BottomTabBar';
import IndustryCard, { IndustryItem } from '@/components/IndustryCard';

async function getRank() {
  const res = await fetch('http://localhost:3001/v1/industries/rank', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default async function IndustriesPage() {
  const data = await getRank();

  return (
    <>
      <main className="p-4 pb-16 space-y-3">
        <div>
          <h1 className="text-lg font-semibold">行业机会榜</h1>
          <p className="text-sm text-gray-500">便宜优先</p>
        </div>

        <div className="space-y-2">
          {data.items.map((it: IndustryItem) => (
            <IndustryCard key={it.industry_code} item={it} />
          ))}
        </div>
      </main>

      <BottomTabBar />
    </>
  );
}
