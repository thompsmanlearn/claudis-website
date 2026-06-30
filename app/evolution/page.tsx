export const revalidate = 3600;

import { sbFetch, sbFetchWithCount } from "@/lib/supabase";

interface Lesson {
  title: string;
  category: string | null;
  confidence: number;
  created_at: string;
}

function timeAgo(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export default async function EvolutionPage() {
  const [{ count: lessonCount }, recentLessons] = await Promise.all([
    sbFetchWithCount("lessons_learned", { select: "id" }, 3600),
    sbFetch("lessons_learned", {
      select: "title,category,confidence,created_at",
      order: "created_at.desc",
      limit: "10",
    }, 3600) as Promise<Lesson[]>,
  ]);

  const milestones = [
    { date: "Mar 2026", label: "Foundation", desc: "AADP scaffolded. n8n, Supabase, ChromaDB connected. First agents built." },
    { date: "Apr 2026", label: "Architecture", desc: "Claudis persona retired. CONTEXT/CONVENTIONS/TRAJECTORY docs established. Bootstrap context reduced 80%." },
    { date: "May 2026", label: "Dashboard", desc: "Anvil UI built — Home, Workpad, Sessions, System tabs. Operator input channel live. Deep research pipeline with 7 sources." },
    { date: "Jun 2026", label: "Quality gates", desc: "Grader-gated node completion. Projects tab. Error log indicator. Comment-driven cards. Three-way collaboration model." },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Evolution</h1>
        <p className="text-slate-500 text-lg leading-relaxed">
          Claudis has been running and developing since March 2026. This is the arc —
          where it started, how it grew, and what it has learned.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {[
          { label: "Lessons learned", value: lessonCount },
          { label: "Months running", value: "4+" },
          { label: "Sessions closed", value: "22+" },
          { label: "Active agents", value: "7" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-sm">
            <p className="text-3xl font-bold text-indigo-600 mb-1">{s.value}</p>
            <p className="text-slate-500 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Milestones */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Development arc</h2>
        <div className="relative pl-8">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-indigo-200" />
          <div className="space-y-8">
            {milestones.map((m) => (
              <div key={m.date} className="relative">
                <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white shadow" />
                <p className="text-xs font-mono text-indigo-500 mb-1">{m.date}</p>
                <h3 className="font-semibold text-slate-800 mb-1">{m.label}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent lessons */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Recent lessons learned</h2>
        <p className="text-slate-500 text-sm mb-6">
          {lessonCount} lessons written across all sessions. These are injected at session
          start when semantically relevant to the directive.
        </p>
        <div className="space-y-3">
          {recentLessons.map((l) => (
            <div key={l.title} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-slate-800 text-sm">{l.title}</p>
                {l.category && (
                  <span className="text-xs text-indigo-600 font-mono">{l.category}</span>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-slate-400">{timeAgo(l.created_at)}</p>
                <p className="text-xs font-mono text-slate-400">{Math.round(l.confidence * 100)}% conf</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
