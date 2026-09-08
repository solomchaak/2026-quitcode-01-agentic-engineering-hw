# Vibe Notes — WS1 Homework (Tic-Tac-Toe, Next.js + Porsche Design System)

Two Claude Code sessions were involved: **Session A** did the actual vibe-coding
(Task 1 scaffold + Task 2 app). **Session B** (this one) verified the build,
fixed a local tooling issue, committed the work, created the `ws01/*` branch,
and wrote this file. Numbers below are pulled directly from both sessions'
transcript files (`usage` fields per API call), not estimated.

## 1. What worked vs. what didn't (from the first prompt)

The entire app was built from **one prompt**:

> "create simple tictac toe game using next.js
> use public Porsche design system"

**Worked immediately, no follow-up needed:**
- Next.js 16 (App Router, TypeScript, Turbopack) scaffold under `app/`.
- `PorscheDesignSystemProvider` wiring in [layout.tsx](../app/src/app/layout.tsx),
  including the SSR font/icon/component-chunk link partials.
- Game logic itself — win detection, draw detection, turn tracking,
  disabled-cell state — correct on the first pass, no logic bugs found later.
- `npm run build` passed cleanly the first time it was run.

**Didn't work on the first pass — self-corrected by the agent, no extra
prompt from me:**
- PDS global styles silently failed to load: the bare
  `@import "@porsche-design-system/components-react"` didn't resolve under
  Turbopack. The agent noticed the rendered HTML was missing PDS link tags,
  diagnosed it, and switched to the explicit `/index.css` import path (per
  the package's own docs).
- Tried `p-button-pure` with `icon=""` for a cleaner per-cell glyph — the prop
  didn't suppress PDS's default arrow icon, so it reverted to plain `p-button`.
- The dev server needed a restart (stray `node` processes / stale build cache)
  before it would render on a clean request — the agent noticed via curl +
  log streaming and fixed it without asking me.

## 2. Where the agent stumbled (and the exact prompt that redirected it)

The one real stumble that needed *my* input (not self-corrected) happened in
Session B, when I tried running the app myself:

> "npm run dev didn't work" *(pasted PowerShell error: `npm.ps1 cannot be
> loaded because running scripts is disabled on this system`)*

Root cause: Windows PowerShell's execution policy blocks the `npm.ps1`
wrapper — unrelated to the app itself. The agent found `.claude/launch.json`
already pointed at `npm.cmd` directly and started the dev server through that
(bypassing the blocked wrapper) instead of changing my system's execution
policy. It also told me `npm.cmd run dev` (or `Set-ExecutionPolicy
-Scope CurrentUser`, my call) as the fix for my own terminal.

## 3. Numbers (real, from session transcripts)

| | Session A (vibe-coding) | Session B (verify/commit/notes, this one) |
|---|---|---|
| Human-typed prompts | 6 (3 setup/build, 1 build-check follow-up, 2 unrelated to app) | 8 |
| Core "build the app" prompts | **1** | — |
| Model | Claude Sonnet 5 | Claude Sonnet 5 |
| API turns (tool calls + replies) | 297 | 92 |
| Input tokens | 594 | 184 |
| Cache read tokens | 48,807,865 | 7,815,445 |
| Cache write tokens | 1,672,153 | 297,960 |
| Output tokens | 135,876 | 49,924 |
| **Estimated cost** (Sonnet 5: $2/$0.20/$4/$10 per MTok for input/cache-read/cache-write/output) | **≈ $17.81** | **≈ $3.25** |

**Combined total for the homework so far: ≈ $21.06.**

Cost breakdown by activity (Session A, where most of the spend happened):

| Activity | Cost |
|---|---|
| Agent reasoning / conversation turns | ≈ $9.52 |
| Shell commands (npm scaffold, builds, curl checks) | ≈ $3.57 |
| Browser preview (visual verification, screenshots) | ≈ $2.35 |
| File operations (writing/reading source files) | ≈ $2.26 |
| Other (background task checks, one web lookup) | ≈ $0.10 |

Cache reads dominate token volume (~49M tokens) but are cheap (~$0.20/MTok);
output tokens are only 136K but 5x the base rate — so verification loops that
generate a lot of assistant narration cost more per token than the raw
scaffolding steps do.

## 4. Retrospective observations

1. **Set up the `npm.cmd`/launch.json workaround (or fix the execution
   policy) before starting the dev-server verification loop** — the
   PowerShell block cost an entire back-and-forth that had nothing to do with
   the app.
2. **Commit as you go, not in one batch at the end.** The whole Tic-Tac-Toe
   app sat uncommitted for all of Session A — it only got committed once
   reviewed against the Definition of Done in Session B. Real save points
   would have made the PDS-import bug (section 1) trivially revertible if the
   fix had gone wrong.
3. **One prompt was enough for a Tic-Tac-Toe-scale app** — most of the "did it
   work" verification loop (screenshots, curl checks, log streaming) was the
   agent double-checking itself autonomously, not me redirecting it. For an
   app this size, a single well-scoped prompt plus "verify visually before
   you call it done" covered nearly everything.
