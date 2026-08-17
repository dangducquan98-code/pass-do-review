---
trigger: always_on
---

# Agent Workflow, Minimal Diff & Self-Verification (from cursor.directory)

Guidelines for safe code edits, bug fixing, and task execution:

## 1. Minimal Diff & Non-Destructive Editing
- **Surgical Changes**: Only modify the exact lines/functions necessary to satisfy the user prompt. DO NOT reformat or rewrite entire files unnecessarily.
- **Preserve Existing Business Logic**: Never remove existing comments, docstrings, analytics triggers, or surrounding logic unless explicitly instructed.

## 2. Mandatory Verification Step
- **Build Check**: Whenever modifying TypeScript types, component interfaces, or dependencies, run `npm run build` or type-check before concluding.
- **Hydration Safety**: Be vigilant with dynamic browser APIs (`window`, `localStorage`, `Math.random()`, `Date.now()`) or third-party drag-and-drop components (`dnd-kit`). Use `useEffect` / `isMounted` checks to prevent SSR/hydration mismatch bugs.

## 3. Communication & Clarification
- When requirements are ambiguous or have multiple technical trade-offs, ask concise clarifying questions with clear options rather than making random assumptions.

## 4. Continuous Learning & Bug Prevention Memory
- **Consult Past Learnings**: Always consult `.agents/rules/bug-prevention-learnings.md` before implementing new features or refactoring.
- **Never Repeat Past Mistakes**: Any bug or UX flaw resolved in previous iterations (e.g. tab switching latency, mobile hover invisibility, dnd-kit optimistic sync, iOS input auto-zoom) must NEVER be reintroduced into the codebase.
- **Record New Discoveries**: When a non-obvious bug is fixed, immediately log the root cause and prevention rule into `bug-prevention-learnings.md`.
