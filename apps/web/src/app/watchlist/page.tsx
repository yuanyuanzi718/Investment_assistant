import BottomTabBar from '@/components/BottomTabBar';

export default function WatchlistPage() {
  return (
    <>
      <main className="p-4 pb-16">
        <h1 className="text-lg font-semibold">自选</h1>
        <p className="text-sm text-gray-500 mt-1">匿名本地 localStorage（MVP）</p>
      </main>
      <BottomTabBar />
    </>
  );
}
