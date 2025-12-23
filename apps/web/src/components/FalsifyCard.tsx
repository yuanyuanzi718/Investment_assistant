import Link from "next/link";

export type FalsifyEvent = {
  event_id: string;
  symbol: string;
  style_id: string;
  confidence: string;
  falsified_hypothesis: string;
  evidence: { source: string; date: string; summary: string };
  action_suggestion: string[];
};

export default function FalsifyCard(props: {
  e: FalsifyEvent;
  onReviewed: (id: string) => void;
}) {
  const { e } = props;

  return (
    <div className="rounded-xl border p-3 bg-white">
      <div className="text-sm font-medium">
        [证伪] {e.symbol} · {e.style_id} · 置信：{e.confidence}
      </div>

      <div className="mt-2 text-sm">假设：{e.falsified_hypothesis}</div>

      <div className="mt-2 text-xs text-gray-600">
        证据：{e.evidence.source}（{e.evidence.date}）{e.evidence.summary}
      </div>

      <div className="mt-2 text-sm space-y-1">
        {e.action_suggestion.map((x, idx) => (
          <div key={idx}>• {x}</div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <Link
          href={`/symbols/${encodeURIComponent(e.symbol)}`}
          className="px-3 py-2 rounded-xl border text-sm"
        >
          打开个股
        </Link>
        <button
          onClick={() => props.onReviewed(e.event_id)}
          className="px-3 py-2 rounded-xl bg-black text-white text-sm"
        >
          标记已复盘
        </button>
      </div>
    </div>
  );
}
