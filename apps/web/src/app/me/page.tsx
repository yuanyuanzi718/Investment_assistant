import BottomTabBar from '@/components/BottomTabBar';

export default function MePage() {
  return (
    <>
      <main className="p-4 pb-16">
        <h1 className="text-lg font-semibold">我的</h1>
        <p className="text-sm text-gray-500 mt-1">市场 A+HK / 分位周期 5y / 风格阈值</p>
      </main>
      <BottomTabBar />
    </>
  );
}
