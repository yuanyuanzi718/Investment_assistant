"use client";

import { useEffect, useMemo, useState } from "react";
import BottomTabBar from "@/components/BottomTabBar";
import FalsifyCard, { FalsifyEvent } from "@/components/FalsifyCard";
import { useIAState } from "@/lib/useIAState";

export default function ReviewPage() {
  const { state, update } = useIAState();

  const [events, setEvents] = useState<FalsifyEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const res = await fetch(
        "http://localhost:3001/v1/events/falsify?status=unreviewed&limit=50",
        {
          cache: "no-store",
        }
      );
      const json = await res.json();
      if (cancelled) return;
      setEvents(json.items ?? []);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ✅ 排除已复盘（本地）
  const unreviewed = useMemo(
    () => events.filter((e) => !state.reviewedEventIds.includes(e.event_id)),
    [events, state.reviewedEventIds]
  );

  const markReviewed = (id: string) => {
    update((prev) => ({
      ...prev,
      reviewedEventIds: Array.from(new Set([...prev.reviewedEventIds, id])),
    }));
  };

  return (
    <>
      <main className="p-4 pb-16 space-y-3">
        <div>
          <h1 className="text-lg font-semibold">复盘中心</h1>
          <p className="text-sm text-gray-500 mt-1">待处理证伪事件</p>
        </div>

        {loading ? (
          <div className="text-sm text-gray-500">加载中…</div>
        ) : unreviewed.length === 0 ? (
          <div className="text-sm text-gray-500">暂无待复盘事件</div>
        ) : (
          <div className="space-y-2">
            {unreviewed.map((e) => (
              <FalsifyCard key={e.event_id} e={e} onReviewed={markReviewed} />
            ))}
          </div>
        )}
      </main>

      <BottomTabBar />
    </>
  );
}
