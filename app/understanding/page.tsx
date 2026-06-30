export const revalidate = 60;

import { sbFetch, sbFetchWithCount } from "@/lib/supabase";

interface ErrorLog {
  workflow_name: string;
  node_name: string | null;
  error_type: string;
  error_message: string;
  timestamp: string;
}

interface Feedback {
  target_type: string;
  content: string;
  created_at: string;
}

function timeAgo(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export default async function UnderstandingPage() {
  const [{ count: errorCount, data: recentErrors }, recentFeedback] = await Promise.all([
    sbFetchWithCount("error_logs", {
      select: "workflow_name,node_name,error_type,error_message,timestamp",
      resolved: "eq.false",
      order: "timestamp.desc",
      limit: "5",
    }, 60) as Promise<{ count: number; data: ErrorLog[] }>,
    sbFetch("agent_feedback", {
      select: "target_type,content,created_at",
      order: "created_at.desc",
      limit: "5",
    }, 60) as Promise<Feedback[]>,
  ]);

  const failureModes = [
    {
      title: "Grader artifact truncation",
      status: "resolved",
      desc: "The /grade_card endpoint reads only the first 6000 chars of a session artifact. Content beyond that is invisible to the grader. Lesson written 2026-06-30: keep artifacts under 6000 chars or front-load all evidence.",
    },
    {
      title: "Stale-card false detection",
      status: "ongoing",
      desc: "Claudis sometimes concludes a directive is already complete when the evidence is ambiguous. The grader catches this — but it burns a session. The fix is better stale-card verification before declaring done.",
    },
    {
      title: "Webhook 404 after n8n activation",
      status: "known",
      desc: "Newly activated n8n workflows return 404 until n8n restarts (docker restart n8n). Lesson written. Applied reliably since documentation.",
    },
    {
      title: "Haiku prompt caching silence",
      status: "known",
      desc: "Haiku 4.5 silently ignores cache_control — returns cache_creation_input_tokens: 0 with no error. Don't attempt prompt caching with Haiku.",
    },
    {
      title: "n8n empty array branch death",
      status: "known",
      desc: "Empty arrays in n8n Code nodes silently kill downstream branches. Fix: normalize/guard node returning a sentinel item when input is empty.",
    },
  ];

  const openQuestions = [
    "Does lesson retrieval actually change behavior, or does it feel like it does? The inject_context mechanism increments times_applied but we have no direct measure of lesson influence on output.",
    "Is the close-session discipline consistent enough to trust the lesson store? If sessions close without writing lessons, the store drifts from actual system knowledge.",
    "What is the right balance between context richness and context window pressure? LEAN_BOOT.md has grown significantly — at what point does boot context crowd out working memory?",
    "Are the three prior grader FAILs (5939bc2b ×2, 3c1d70dd ×1) on obsolete nodes, or do they represent real quality gaps worth revisiting?",
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Understanding Claudis</h1>
        <p className="text-slate-500 text-lg leading-relaxed">
          A transparency layer. Where Claudis is reliable, where it fails, and what
          remains genuinely uncertain. Live error and feedback data from Supabase.
        </p>
      </div>

      {/* Live error status */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold text-slate-800">System health</h2>
          <span className={`text-xs px-3 py-1 rounded-full font-mono ${
            errorCount === 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {errorCount === 0 ? "✓ no unresolved errors" : `${errorCount} unresolved error${errorCount !== 1 ? "s" : ""}`}
          </span>
        </div>
        {errorCount > 0 && recentErrors.length > 0 && (
          <div className="space-y-3">
            {recentErrors.map((e, i) => (
              <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-mono text-sm font-semibold text-red-800">
                    {e.workflow_name}{e.node_name ? ` / ${e.node_name}` : ""}
                  </p>
                  <p className="text-xs text-red-500">{timeAgo(e.timestamp)}</p>
                </div>
                <p className="text-red-700 text-sm">{e.error_message.slice(0, 200)}</p>
              </div>
            ))}
          </div>
        )}
        {errorCount === 0 && (
          <p className="text-slate-400 text-sm">All error_logs resolved. System operating normally.</p>
        )}
      </section>

      {/* Known failure modes */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Known failure modes</h2>
        <div className="space-y-4">
          {failureModes.map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-slate-800 text-sm">{f.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                  f.status === "resolved"
                    ? "bg-green-100 text-green-700"
                    : f.status === "ongoing"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {f.status}
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open questions */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Open questions</h2>
        <p className="text-slate-500 text-sm mb-6">
          Things that remain genuinely uncertain about how Claudis works.
        </p>
        <div className="space-y-3">
          {openQuestions.map((q, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3">
              <span className="text-indigo-400 font-mono text-sm shrink-0">?</span>
              <p className="text-slate-600 text-sm leading-relaxed">{q}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent grader feedback */}
      {recentFeedback.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent grader feedback</h2>
          <p className="text-slate-500 text-sm mb-6">
            The latest annotations from the grader system — verdicts on completed work.
          </p>
          <div className="space-y-3">
            {recentFeedback.map((f, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-indigo-600">{f.target_type}</span>
                  <span className="text-xs text-slate-400">{timeAgo(f.created_at)}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {f.content.slice(0, 300)}{f.content.length > 300 ? "…" : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
