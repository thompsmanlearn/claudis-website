export const revalidate = 60;

import { sbFetch } from "@/lib/supabase";

interface Agent {
  agent_name: string;
  status: string;
  workflow_id: string | null;
  description: string | null;
  updated_at: string;
}

interface Capability {
  name: string;
  description: string | null;
  category: string | null;
  times_used: number;
}

interface SystemConfig {
  key: string;
  value: string;
}

const SERVICES = [
  { name: "GitHub", what: "Read/write repos, push commits, manage branches", key: "GITHUB_TOKEN" },
  { name: "n8n", what: "Create, update, activate/deactivate workflows, read execution history", key: "N8N_API_KEY" },
  { name: "Supabase", what: "Full CRUD on all tables, DDL via Management API, RLS management", key: "SUPABASE_SERVICE_KEY" },
  { name: "ChromaDB", what: "Semantic search and storage across lessons_learned, session_memory, reference_material", key: "local" },
  { name: "Anthropic API", what: "Claude Sonnet 4.6 (primary), Haiku 4.5 (grader/evaluator), prompt caching", key: "ANTHROPIC_API_KEY" },
  { name: "Telegram", what: "Send messages to Bill, receive commands via Telegram Command Agent", key: "TELEGRAM_BOT_TOKEN" },
  { name: "Vercel", what: "Deploy sites via Git push (meow-now, claudis-website auto-deploy on push)", key: "via git" },
  { name: "Gemini API", what: "Query expansion, relevance screening, research synthesis (deep research pipeline)", key: "GEMINI_API_KEY" },
  { name: "YouTube Data API", what: "Fetch funny cat videos for Meow Now /videos page", key: "YOUTUBE_API_KEY" },
  { name: "NewsAPI", what: "Cat news and research articles for Meow Now /news page", key: "NEWS_API_KEY" },
  { name: "Brave Search", what: "Web search for Workpad research pipeline", key: "BRAVE_API_KEY" },
  { name: "Tavily", what: "Deep web search for Workpad research pipeline", key: "TAVILY_API_KEY" },
  { name: "Wikimedia", what: "Wikipedia pageviews + article summaries for Meow Now /wiki page (no key — public API)", key: "none" },
  { name: "Anvil", what: "Dashboard UI (Home/Workpad/Projects/System tabs), uplink server via websocket", key: "via uplink" },
];

function timeAgo(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export default async function CapabilitiesPage() {
  const [agents, capabilities, configRows] = await Promise.all([
    sbFetch("agent_registry", { select: "agent_name,status,workflow_id,description,updated_at", order: "agent_name.asc" }, 60) as Promise<Agent[]>,
    sbFetch("capabilities", { select: "name,description,category,times_used", order: "times_used.desc" }, 60) as Promise<Capability[]>,
    sbFetch("system_config", { select: "key,value", "key": "in.(claudis_current_task,claudis_heartbeat_at)" }, 60) as Promise<SystemConfig[]>,
  ]);

  const activeAgents = agents.filter((a) => a.status === "active");
  const config = Object.fromEntries(configRows.map((r) => [r.key, r.value]));
  const currentTask = (config.claudis_current_task as string) ?? "idle";
  const heartbeat = config.claudis_heartbeat_at ? timeAgo(config.claudis_heartbeat_at as string) : "unknown";

  const capByCategory = capabilities.reduce<Record<string, Capability[]>>((acc, c) => {
    const cat = c.category ?? "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(c);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Live Capabilities</h1>
        <p className="text-slate-500">
          What Claudis can actually do right now — pulled live from Supabase. Updates every 60 seconds.
        </p>
      </div>

      {/* Status strip */}
      <div className="bg-slate-900 rounded-xl p-4 mb-10 flex flex-wrap gap-6 text-sm">
        <div>
          <p className="text-slate-500 text-xs mb-1">Current task</p>
          <p className="text-white font-mono text-xs truncate max-w-xs">{String(currentTask)}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-1">Last heartbeat</p>
          <p className="text-indigo-400 font-mono text-xs">{heartbeat}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-1">Active agents</p>
          <p className="text-white font-mono text-xs">{activeAgents.length}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-1">Capabilities logged</p>
          <p className="text-white font-mono text-xs">{capabilities.length}</p>
        </div>
      </div>

      {/* Connected services */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Connected Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SERVICES.map((s) => (
            <div key={s.name} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex gap-3">
              <div className={`w-2 rounded-full self-stretch ${s.key === "none" ? "bg-slate-300" : "bg-green-400"}`} />
              <div>
                <p className="font-semibold text-slate-800 text-sm">{s.name}</p>
                <p className="text-slate-500 text-xs leading-relaxed mt-0.5">{s.what}</p>
                <p className="text-slate-400 text-xs mt-1 font-mono">
                  {s.key === "none" ? "no key required" : s.key === "local" ? "local service" : s.key === "via git" ? "via git" : s.key === "via uplink" ? "via websocket" : "✓ key configured"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active agents */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Active Agents</h2>
        {activeAgents.length === 0 ? (
          <p className="text-slate-400">No active agents found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeAgents.map((a) => (
              <div key={a.agent_name} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-mono text-sm font-semibold text-slate-800">{a.agent_name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.workflow_id ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {a.workflow_id ? "wired" : "no workflow"}
                  </span>
                </div>
                {a.description && <p className="text-slate-500 text-xs leading-relaxed">{a.description}</p>}
                <p className="text-slate-400 text-xs mt-2">updated {timeAgo(a.updated_at)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Capabilities by category */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Capability Inventory</h2>
        <p className="text-slate-500 text-sm mb-6">
          Logged capabilities with usage counts — how often each has been exercised across sessions.
        </p>
        {Object.entries(capByCategory).map(([cat, caps]) => (
          <div key={cat} className="mb-8">
            <h3 className="text-sm font-mono text-indigo-600 uppercase tracking-wide mb-3">{cat}</h3>
            <div className="space-y-2">
              {caps.map((c) => (
                <div key={c.name} className="bg-white rounded-lg border border-slate-100 px-4 py-3 flex items-start justify-between gap-4 shadow-sm">
                  <div>
                    <p className="font-mono text-sm text-slate-800">{c.name}</p>
                    {c.description && <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{c.description}</p>}
                  </div>
                  <span className="text-xs font-mono text-slate-400 whitespace-nowrap">×{c.times_used}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
