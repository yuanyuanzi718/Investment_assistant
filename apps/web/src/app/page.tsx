// apps/web/src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  // 默认进入“行业机会榜”
  redirect('/industries');
}
