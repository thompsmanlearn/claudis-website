export const revalidate = 3600;

import { sbFetch } from "@/lib/supabase";

const steps = [
  {
    n: 1,
    title: "Git pull on claudis/",
    why: "Ensures directives are current before anything else loads. If the pull fails, Claudis telegrams the operator and stops — stale directives are worse than no session.",
    what: "Checks GitHub for new commits. The claudis/ repo is the source of truth for all context files.",
  },
  {
    n: 1.5,
    title: "Boot heartbeat",
    why: "Records that a session is alive. The dashboard and notification channels can see what Claudis is working on.",
    what: "Session state is written to the system so external tools can display current status.",
  },
  {
    n: 2,
    title: "Read DIRECTIVES.md",
    why: "Establishes the session goal before loading any other context. Everything that follows is shaped by what the directive says.",
    what: "A single file that the operator edits to direct the session. May reference a backlog card or be a project node.",
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
    title: "Check operator input channel",
    why: "The operator can submit questions, comments, or commands between sessions. Checked here so input shapes the session before execution begins.",
    what: "Commands can redirect the session goal. Questions get answered. Comments become lessons.",
  },
  {
    n: 5,
    title: "Stale card check + design review check",
    why: "Before any work begins, verify the directive isn't already complete. Also check if this card creates a new agent, table, or pattern — those require two-pass review.",
    what: "Reads acceptance criteria from the project backlog and checks actual system state. Stops and notifies the operator if stale or review-required.",
  },
  {
    n: 6,
    title: "Skills resolution",
    why: "Loads only the skills relevant to this directive. Keeps context lean — irrelevant skill files are not loaded.",
    what: "A local service resolves which skills match the directive text, applying a confidence threshold. Each matched skill's documentation is then read.",
  },
  {
    n: 7,
    title: "Read CONTEXT.md + TRAJECTORY.md",
    why: "System facts and project arc — where we are, where we have been, what is next. The session's map and compass.",
    what: "CONTEXT.md is stable facts about the system. TRAJECTORY.md is updated every session close — it is the living record of the project's development.",
  },
  {
    n: 8,
    title: "Live state ping",
    why: "Grounds the session in actual system state rather than assumed state. Active agents, unresolved errors, pending tasks, hardware health.",
    what: "A live query across system state checks what is actually running and what needs attention. Results appear in the boot summary.",
  },
  {
    n: 9,
    title: "Pending feedback scan",
    why: "Grader verdicts, annotations, and correction flags from prior sessions. Surface before execution so they can inform the work.",
    what: "Queries the feedback store for unprocessed annotations. Grader failures on prior work appear here — the session sees them and can course-correct.",
  },
  {
    n: 10,
    title: "Lesson retrieval",
    why: "What has Claudis learned that is relevant to this specific task? Injected before execution so past failures shape current behavior.",
    what: "A semantic search across the lessons store returns the most relevant past learnings, ranked by closeness to the current directive.",
  },
  {
    n: 11,
    title: "Execute directive",
    why: "By this point Claudis is not a generic Claude Code instance. It has a project history, active constraints, relevant lessons, and live system state.",
    what: "Work begins. No confirmation pause.",
  },
];

export default async function ContextPage() {
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
          This is what happens between the operator setting a session goal and Claudis executing the first action.
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
            This is the most recently written lesson in Claudis&apos;s lesson store.
            A lesson like this would be injected at step 10 if semantically relevant to the session directive.
          </p>
          <div className="bg-slate-900 rounded-xl p-6">
            <p className="text-indigo-400 text-xs font-mono mb-2 uppercase tracking-wide">
              lessons store · most recent
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
          lessons to memory, updates the project trajectory, commits session
          artifacts, and writes a handoff note. Those artifacts become the context
          for the next session. Each session makes the next one smarter.
        </p>
      </div>
    </div>
  );
}
