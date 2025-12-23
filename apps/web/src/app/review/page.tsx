import BottomTabBar from '@/components/BottomTabBar';

export default function ReviewPage() {
  return (
    <>
      <main className="p-4 pb-16">
        <h1 className="text-lg font-semibold">复盘中心</h1>
        <p className="text-sm text-gray-500 mt-1">证伪队列（MVP）</p>
      </main>
      <BottomTabBar />
    </>
  );
}
