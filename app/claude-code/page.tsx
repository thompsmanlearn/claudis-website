export const revalidate = 86400;

const piSteps = [
  { step: "1", title: "Hardware", desc: "Raspberry Pi 5 (8GB+ RAM recommended, 16GB ideal). Fast SD card or SSD. Stable power supply. Always-on network connection." },
  { step: "2", title: "Claude Code", desc: "Install Node.js, then npm install -g @anthropic-ai/claude-code. Requires an Anthropic API key — set ANTHROPIC_API_KEY in your environment." },
  { step: "3", title: "Connect services", desc: "Start small: Supabase for memory, GitHub for version control. Add n8n, ChromaDB, and a Telegram bot as the system grows." },
  { step: "4", title: "Write LEAN_BOOT.md", desc: "Your startup sequence. This is the file Claude Code reads to assemble context — directives, conventions, context, tools. It defines what your instance becomes." },
  { step: "5", title: "First session", desc: "Run claude in your project directory. Give it a small, concrete directive. Close the session intentionally — write a lesson, commit an artifact." },
  { step: "6", title: "Iterate", desc: "Each session your instance accumulates context. After 30 days you will have something meaningfully different from the base Claude Code installation." },
];

export default function ClaudeCodePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Claude Code</h1>
        <p className="text-slate-500 text-lg leading-relaxed">
          Anthropic&apos;s CLI for Claude — a general-purpose coding and systems agent that
          runs in your terminal. The foundation Claudis is built on.
        </p>
      </div>

      <section className="mb-14">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">What it is</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "A capable starting point", body: "Out of the box, Claude Code can write and edit code, run shell commands, read and navigate repositories, use web search, and manage files. It's a genuine software engineering assistant." },
            { title: "Context-aware by default", body: "Claude Code reads CLAUDE.md files in your project to understand conventions, structure, and preferences. This is the foundation the Claudis context engineering layer builds on." },
            { title: "Tool-extensible", body: "MCP (Model Context Protocol) lets you connect Claude Code to external services — databases, APIs, custom tools. Every Claudis capability beyond the baseline comes through MCP." },
            { title: "Not a product — a substrate", body: "Claude Code is what you start with. What it becomes depends entirely on the context you build around it. Claudis is one answer to the question of what that context could look like." },
          ].map((c) => (
            <div key={c.title} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-2">{c.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Getting started on a Raspberry Pi</h2>
        <p className="text-slate-500 text-sm mb-8">
          A Pi is an ideal host — always on, low power, capable enough for Claude Code and the services around it.
          This is the path Claudis took.
        </p>
        <div className="space-y-4">
          {piSteps.map((s) => (
            <div key={s.step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                {s.step}
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Key concepts</h2>
        <div className="bg-slate-900 rounded-xl p-6 space-y-4 text-sm font-mono">
          {[
            ["CLAUDE.md", "Per-project instructions. Claude Code reads this at session start. The equivalent of CONVENTIONS.md in Claudis."],
            ["MCP tools", "Model Context Protocol — the extension mechanism. Each MCP server adds callable tools. Claudis uses a custom MCP server at ~/aadp/mcp-server/server.py."],
            ["Context window", "The amount of conversation Claude Code can hold in memory at once. Managing this — keeping context lean — is one of the key engineering challenges."],
            ["Permissions", "Claude Code asks before taking actions it hasn't been pre-approved for. You can configure approved commands in settings.json to reduce interruption."],
          ].map(([term, def]) => (
            <div key={term}>
              <span className="text-indigo-400">{term}</span>
              <span className="text-slate-400"> — </span>
              <span className="text-slate-300">{def}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">The difference context makes</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          The gap between a fresh Claude Code installation and Claudis is not capability — it&apos;s context.
          The base model is identical. What differs is everything around it: the startup sequence,
          the accumulated lessons, the governance conventions, the connected tools, and the months
          of sessions that shaped how it operates.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Anyone can install Claude Code in an afternoon. Building a Claudis-like system takes
          months of deliberate sessions, failed experiments written up as lessons, and consistent
          close-session discipline. The investment compounds — each session makes the next one better.
        </p>
      </section>
    </div>
  );
}
