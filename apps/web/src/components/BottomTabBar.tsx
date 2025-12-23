"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * 底部导航（4 Tab）
 * - 设计目标：所有页面统一复用，避免每页重复写导航
 * - MVP 先用文字+emoji，后续再换成图标（lucide-react 等）
 */
export default function BottomTabBar() {
  const pathname = usePathname();

  // 判断某个 tab 是否处于“激活状态”
  // 例如：/industries/801080 也应当算在 industries tab 下
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const tabs = [
    { href: "/industries", label: "行业", icon: "≡" },
    { href: "/watchlist", label: "自选", icon: "♡" },
    { href: "/review", label: "复盘", icon: "↻" },
    { href: "/me", label: "我的", icon: "☺" },
  ];

  return (
    // fixed：固定在底部
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white">
      {/* max-w-md：让它在桌面上看起来像手机宽度；你做 H5 很实用 */}
      <div className="mx-auto grid h-14 max-w-md grid-cols-4">
        {tabs.map((t) => {
          const active = isActive(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={[
                "flex flex-col items-center justify-center text-xs",
                active ? "text-black font-medium" : "text-gray-500",
              ].join(" ")}
            >
              <div className="text-lg leading-none">{t.icon}</div>
              <div>{t.label}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
