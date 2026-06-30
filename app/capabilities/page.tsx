export const revalidate = 60;

import { sbFetch } from "@/lib/supabase";

interface Agent {
  agent_name: string;
  status: string;
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

interface ConnectedService {
  name: string;
  description: string | null;
  key_type: string;
  category: string;
  active: boolean;
}

function keyTypeLabel(key_type: string): string {
  if (key_type === "none") return "no key required";
  if (key_type === "local") return "local service";
  if (key_type === "via_git") return "via git";
  if (key_type === "via_websocket") return "via websocket";
  return "key configured";
}

function timeAgo(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export default async function CapabilitiesPage() {
  const [agents, capabilities, configRows, services] = await Promise.all([
    sbFetch("agent_registry", { select: "agent_name,status,description,updated_at", order: "agent_name.asc" }, 60) as Promise<Agent[]>,
    sbFetch("capabilities", { select: "name,description,category,times_used", times_used: "gt.0", order: "times_used.desc" }, 60) as Promise<Capability[]>,
    sbFetch("system_config", { select: "key,value", "key": "in.(claudis_current_task,claudis_heartbeat_at)" }, 60) as Promise<SystemConfig[]>,
    sbFetch("connected_services", { select: "name,description,key_type,category,active", active: "eq.true", order: "category.asc,name.asc" }, 60) as Promise<ConnectedService[]>,
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

  const servicesByCategory = services.reduce<Record<string, ConnectedService[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Live Capabilities</h1>
        <p className="text-slate-500">
          What Claudis can actually do right now — pulled live from the system. Updates every 60 seconds.
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
          <p className="text-slate-500 text-xs mb-1">Connected services</p>
          <p className="text-white font-mono text-xs">{services.length}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-1">Capabilities exercised</p>
          <p className="text-white font-mono text-xs">{capabilities.length}</p>
        </div>
      </div>

      {/* Connected services */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Connected Services</h2>
        <p className="text-slate-500 text-sm mb-5">
          External services and tools Claudis has live connections to.
        </p>
        {services.length === 0 ? (
          <p className="text-slate-400 text-sm">Loading services…</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(servicesByCategory).map(([cat, catServices]) => (
              <div key={cat}>
                <h3 className="text-xs font-mono text-indigo-600 uppercase tracking-wide mb-3">{cat}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {catServices.map((s) => (
                    <div
                      key={s.name}
                      className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block shrink-0" />
                        <span className="font-medium text-slate-800 text-sm">{s.name}</span>
                        <span className="ml-auto text-xs font-mono text-slate-400">{keyTypeLabel(s.key_type)}</span>
                      </div>
                      {s.description && (
                        <p className="text-slate-500 text-xs leading-relaxed pl-3.5">{s.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
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
                <p className="font-mono text-sm font-semibold text-slate-800 mb-1">{a.agent_name}</p>
                {a.description && <p className="text-slate-500 text-xs leading-relaxed">{a.description}</p>}
                <p className="text-slate-400 text-xs mt-2">updated {timeAgo(a.updated_at)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Capabilities by category */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Capability Inventory</h2>
        <p className="text-slate-500 text-sm mb-6">
          Capabilities exercised at least once across sessions, with usage counts.
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
