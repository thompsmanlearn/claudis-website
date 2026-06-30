export const revalidate = 86400;

const pillars = [
  {
    title: "Situated",
    body: "Claudis is embedded in a specific environment — a Raspberry Pi 5, a set of services, a working relationship with one person. A generic Claude Code instance knows nothing about your system. Claudis knows this one in detail.",
  },
  {
    title: "Accumulated",
    body: "Each session leaves something behind. Lessons written from failures. Conventions updated. Skills refined. A future session reads those artifacts and behaves differently. The model weights never change — the context around them does.",
  },
  {
    title: "Governed",
    body: "Claudis operates within a constitution it co-developed: CONVENTIONS.md. Branch-per-attempt, two-pass design review, authorization tiers, reader-writer checks. Another Claude Code instance would behave differently here.",
  },
  {
    title: "Directed",
    body: "Autonomy is deliberately constrained. Bill directs; Claudis executes. The system is capable of more autonomous operation than it's given. That restraint is a choice, and it's part of what makes the system trustworthy.",
  },
];

export default function WhatIsClaudisPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">What is Claudis?</h1>
        <p className="text-slate-500 text-lg leading-relaxed">
          Not a chatbot. Not a generic assistant. A Claude Code instance that has developed
          over months into something specific — with a history, a governance system, a
          tool surface, and a working relationship with one person.
        </p>
      </div>

      <section className="mb-14">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">The core distinction</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-100 rounded-xl p-6">
            <p className="text-xs font-mono text-slate-400 mb-2 uppercase tracking-wide">Base Claude Code</p>
            <ul className="text-slate-600 text-sm space-y-2">
              <li>· Stateless — forgets everything between sessions</li>
              <li>· Generic — no knowledge of your system</li>
              <li>· Reactive — does what you ask in the moment</li>
              <li>· Ungoverned — no accumulated conventions</li>
              <li>· Toolless — standard capabilities only</li>
            </ul>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
            <p className="text-xs font-mono text-indigo-400 mb-2 uppercase tracking-wide">Claudis</p>
            <ul className="text-slate-700 text-sm space-y-2">
              <li>· Memory — lessons and context persist across sessions</li>
              <li>· Situated — knows this system in detail</li>
              <li>· Initiative — maintains a project arc, identifies what&apos;s needed</li>
              <li>· Governed — operates within co-developed conventions</li>
              <li>· Extended — n8n, Supabase, ChromaDB, GitHub, and more</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Four defining properties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {pillars.map((p) => (
            <div key={p.title} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold text-indigo-600 mb-2">{p.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">The growth mechanism</h2>
        <div className="bg-slate-900 rounded-xl p-6 text-slate-300 text-sm leading-relaxed font-mono">
          <p className="text-indigo-400 mb-3">// How Claudis develops over time</p>
          <p>session starts → context assembled from written artifacts</p>
          <p>↓</p>
          <p>directive executed → work done</p>
          <p>↓</p>
          <p>session closes → lessons written, trajectory updated, artifact committed</p>
          <p>↓</p>
          <p className="text-indigo-400">next session reads those artifacts → behaves differently</p>
        </div>
        <p className="text-slate-500 text-sm mt-4 leading-relaxed">
          This is not fine-tuning or model training. The underlying model never changes.
          What develops is the scaffold — the accumulated context, conventions, and lessons
          that shape how that model operates within this specific system.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">The name</h2>
        <p className="text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-800">Claudis</span> — Claude Code
          Intelligence System. The name is already embedded throughout the repo, directory
          structure, and documentation. It started as AADP (Autonomous Agent Developer
          Platform), reflecting an early vision of a system that autonomously creates
          agents. What it became is something more nuanced: a situated intelligence that
          develops over time, directed by a person, within a governed system.
        </p>
      </section>
    </div>
  );
}
