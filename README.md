# QueueCraft — Support ticket triage

A full-stack TypeScript application for prioritizing support work. Built as a portfolio project for Gael Gatsimbanyi.

## Features
- Create validated tickets with category, priority, and assignee.
- Search the queue and filter by status.
- Update tickets with optimistic concurrency control: stale writes return HTTP 409.
- Persist ticket data and audit events in Cloudflare D1 (SQLite).
- Write updates and their activity event in an atomic database batch.
- Show resolution rate and unresolved priority counts.
- Suggest priority through explainable keyword rules (not a trained AI model).
- Load optional example records through the same API as ordinary tickets.

## Architecture
React UI → API route handlers → parameterized D1 queries → SQLite.

`lib/tickets.ts` owns validation and triage rules; `db/schema.ts` owns schema and indexes; `app/api/tickets` owns HTTP behavior; `app/page.tsx` owns the interface. Drizzle generates versioned schema migrations. Inputs render as text, and SQL uses bound parameters.

## Run locally
Use Node 22.13 or later. Install dependencies with the package manager matching the committed lockfile. Run `npm run db:generate` only after schema edits. Apply migrations to the local D1 binding using Wrangler (`npx wrangler d1 migrations apply DB --local` with the generated preview configuration), then run `npm run dev`. The Sites preview helper applies local migrations in the managed environment. Run `npm run build` to create a Worker-compatible build. The hosted workspace is private by default.

## Checks
`node --experimental-strip-types --test tests/triage.test.ts` tests validation boundaries and triage rules. `npx tsc --noEmit` checks TypeScript. API smoke checks should cover creation, invalid input, updates, activity history, stale-write conflict, and persistence after refresh.

## Tradeoffs and limits
- This first version is a single-workspace app protected by private hosting, not a multi-tenant SaaS. It has no app-level roles or per-user ownership.
- Queue listing is capped at 1,000 tickets. Production scale would need server-side search and cursor pagination.
- Priority rules are intentionally simple and may misclassify negation. Users review and override them.
- An initial creation is represented by the ticket timestamp; subsequent edits appear in the activity log.

## Interview discussion
Explain why the update includes a version field, why audit writes share a transaction, and how prepared statements differ from SQL string concatenation. Extend the system yourself with cursor pagination, team roles, or a labeled evaluation dataset for better triage before claiming deeper expertise.
