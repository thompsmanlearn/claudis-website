export const revalidate = 3600;

import { sbFetch } from "@/lib/supabase";

const steps = [
  {
    n: 1,
    title: "Git pull on claudis/",
    why: "Ensures directives are current before anything else loads. If the pull fails, Claudis telegrams Bill and stops — stale directives are worse than no session.",
    what: "Checks GitHub for new commits. The claudis/ repo is the source of truth for all context files.",
  },
  {
    n: 1.5,
    title: "Boot heartbeat → Supabase",
    why: "Writes claudis_current_task and claudis_heartbeat_at to system_config. The system knows a session is alive.",
    what: "First line of the first DIRECTIVES.md is written to Supabase so external systems (Anvil dashboard, Telegram) can see what Claudis is working on.",
  },
  {
    n: 2,
    title: "Read DIRECTIVES.md",
    why: "Establishes the session goal before loading any other context. Everything that follows is shaped by what the directive says.",
    what: "A single file that Bill edits to direct the session. May reference a backlog card (Run: B-NNN) or be a project node with a UUID.",
  },
  {
    n: 3,
    title: "Read PROTECTED.md",
    why: "Constraints load before capabilities. Claudis knows what it must not touch before it knows what it can do.",
    what: "Lists load-bearing agents, protected workflows, and files that require explicit approval before modification.",
  },
  {
    n: 4,
    title: "Read CONVENTIONS.md",
    why: "The operating constitution. Governs how Claudis behaves for the entire session — branch-per-attempt, two-pass review, error surfacing channels, naming conventions.",
    what: "A living document co-developed over many sessions. If CONVENTIONS.md conflicts with anything else, it wins.",
  },
  {
    n: 4.5,
    title: "Check Bill input channel",
    why: "Bill can submit questions, comments, or commands to Supabase between sessions. Checked here so his input shapes the session before execution begins.",
    what: "Queries bill_input table. Commands replace DIRECTIVES.md for the session. Questions get answered. Comments become lessons.",
  },
  {
    n: 5,
    title: "Stale card check + design review check",
    why: "Before any work begins, verify the directive isn't already complete. Also check if this card creates a new agent/table/pattern — those require two-pass review.",
    what: "Reads acceptance criteria from aadp_project_nodes or BACKLOG.md, checks actual system state. Stops and telegrams Bill if stale or review-required.",
  },
  {
    n: 6,
    title: "Skills resolution via stats server",
    why: "Loads only the skills relevant to this directive. Confidence threshold ≥ 0.6. Keeps context lean — irrelevant skill files are not loaded.",
    what: "POST to localhost:9100/resolve_skills with directive text. Returns skill names and confidence scores. Each matched skill's SKILL.md is then read.",
  },
  {
    n: 7,
    title: "Read CONTEXT.md + TRAJECTORY.md",
    why: "System facts (hardware, services, credentials location) and project arc (where we are, where we've been, what's next). The session's map and compass.",
    what: "CONTEXT.md is stable facts. TRAJECTORY.md is updated every session close — it's the living record of the project's development.",
  },
  {
    n: 8,
    title: "Live state ping",
    why: "Grounds the session in actual system state rather than assumed state. Active agents, unresolved errors, pending tasks, hardware health.",
    what: "mcp__aadp__system_status + Supabase query across agent_registry, error_logs, work_queue. Results appear in the boot summary.",
  },
  {
    n: 9,
    title: "Pending feedback scan",
    why: "Grader verdicts, annotations, and correction flags from prior sessions. Surface before execution so they can inform the work.",
    what: "Queries agent_feedback WHERE processed = false. Grader FAILs on prior nodes appear here — the session sees them and can course-correct.",
  },
  {
    n: 10,
    title: "Lesson retrieval",
    why: "What has Claudis learned that's relevant to this specific task? Injected before execution so past failures shape current behavior.",
    what: "POST to localhost:9100/inject_context_v3. Returns semantically matched lessons from ChromaDB lessons_learned collection, ranked by distance.",
  },
  {
    n: 11,
    title: "Execute directive",
    why: "By this point Claudis is not a generic Claude Code instance. It has a project history, active constraints, relevant lessons, and live system state.",
    what: "Work begins. No confirmation pause.",
  },
];

export default async function ContextPage() {
  // Pull a real recent lesson as a live example
  let sampleLesson: { title: string; content: string } | null = null;
  try {
    const lessons = await sbFetch(
      "lessons_learned",
      { select: "title,content", order: "created_at.desc", limit: "1" },
      3600
    );
    if (lessons.length > 0) sampleLesson = lessons[0];
  } catch {
    sampleLesson = null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Context Engineering</h1>
        <p className="text-slate-500 text-lg leading-relaxed">
          Most people think of prompting as writing a good instruction. What runs Claudis
          is closer to context architecture — a structured sequence that assembles the
          right information in the right order before any work begins.
        </p>
        <p className="text-slate-500 mt-3">
          This is what happens between Bill typing a session goal and Claudis executing the first action.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-indigo-200" />
        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.n} className="relative pl-16">
              <div className="absolute left-0 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold font-mono shadow-sm">
                {step.n}
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm mb-2 leading-relaxed">
                  <span className="font-medium text-indigo-600">Why: </span>{step.why}
                </p>
                <p className="text-slate-500 text-sm leading-relaxed">
                  <span className="font-medium text-slate-700">What: </span>{step.what}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {sampleLesson && (
        <div className="mt-14">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Live example: most recent lesson injection
          </h2>
          <p className="text-slate-500 text-sm mb-4">
            This is the most recently written lesson in Claudis&apos;s lessons_learned store.
            A lesson like this would be injected at step 10 if semantically relevant to the session directive.
          </p>
          <div className="bg-slate-900 rounded-xl p-6">
            <p className="text-indigo-400 text-xs font-mono mb-2 uppercase tracking-wide">
              lessons_learned · most recent
            </p>
            <p className="text-white font-semibold mb-3">{sampleLesson.title}</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              {sampleLesson.content.slice(0, 500)}
              {sampleLesson.content.length > 500 && "…"}
            </p>
          </div>
        </div>
      )}

      <div className="mt-12 bg-indigo-50 border border-indigo-200 rounded-xl p-6">
        <h3 className="font-semibold text-indigo-800 mb-2">The session loop</h3>
        <p className="text-indigo-700 text-sm leading-relaxed">
          Context engineering doesn&apos;t stop at session start. At close, Claudis writes
          lessons to ChromaDB and Supabase, updates TRAJECTORY.md, commits session
          artifacts, and writes a handoff note. Those artifacts become the context
          for the next session. Each session makes the next one smarter.
        </p>
      </div>
    </div>
  );
}
