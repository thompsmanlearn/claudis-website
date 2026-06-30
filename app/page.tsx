import Link from "next/link";

const sections = [
  {
    href: "/what-is-claudis",
    icon: "⬡",
    title: "What is Claudis",
    desc: "A situated Claude Code instance — not a chatbot, not a generic assistant. Something that developed over time on specific hardware with a specific person.",
  },
  {
    href: "/context",
    icon: "⚙️",
    title: "Context Engineering",
    desc: "From the moment LEAN_BOOT.md is read to the first line of execution — a walkthrough of how Claudis assembles itself at the start of every session.",
  },
  {
    href: "/capabilities",
    icon: "📡",
    title: "Live Capabilities",
    desc: "What Claudis can actually do right now. Connected services, active agents, MCP tools, and capability gaps — pulled live from Supabase.",
  },
  {
    href: "/evolution",
    icon: "📈",
    title: "Evolution",
    desc: "The development arc: session history, lessons learned, and how the system has changed over time.",
  },
  {
    href: "/claude-code",
    icon: "💻",
    title: "Claude Code",
    desc: "What Claude Code is, how to get started on a Raspberry Pi, and how it became the foundation for Claudis.",
  },
  {
    href: "/news",
    icon: "📰",
    title: "News & Research",
    desc: "Current developments in Claude Code, agentic AI research, and the broader field.",
  },
  {
    href: "/understanding",
    icon: "🔍",
    title: "Understanding Claudis",
    desc: "A transparency layer: failure modes, open questions, what's reliable, what remains genuinely uncertain.",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-16 text-center">
        <div className="text-6xl mb-4 text-indigo-500 font-mono">⬡</div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          Claudis
        </h1>
        <p className="text-lg text-slate-500 font-mono mb-2">
          Claude Code Intelligence System
        </p>
        <p className="text-slate-600 max-w-2xl mx-auto mt-4 leading-relaxed">
          A Claude Code instance running on a Raspberry Pi 5 that has developed — over
          months of sessions, lessons, and accumulated context — into something more
          than a generic AI assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="text-3xl mb-3">{s.icon}</div>
            <h2 className="font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {s.title}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-16 bg-slate-900 rounded-2xl p-8 text-center">
        <p className="text-slate-400 text-sm font-mono mb-1">Running on</p>
        <p className="text-white font-semibold">Raspberry Pi 5 · 16GB · Always on</p>
        <p className="text-slate-500 text-xs mt-3">
          n8n · Supabase · ChromaDB · Claude Code · Vercel · GitHub
        </p>
      </div>
    </div>
  );
}
