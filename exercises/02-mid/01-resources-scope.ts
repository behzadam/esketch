/**
 * Goal: acquireRelease + Scope for safe resource cleanup.
 * Docs: https://effect.website/docs/resource-management/scope
 */
import { Effect } from "effect"

const openDb = Effect.sync(() => {
  console.log("open")
  return { query: (sql: string) => Effect.succeed([{ sql }]) }
})

const closeDb = (_db: { query: (sql: string) => Effect.Effect<unknown> }) =>
  Effect.sync(() => console.log("close"))

export const program = Effect.gen(function* () {
  // TODO: wrap openDb/closeDb with Effect.acquireRelease and run a query
  const db = yield* Effect.acquireRelease(openDb, closeDb)
  return yield* db.query("select 1")
}).pipe(Effect.scoped)

Effect.runPromise(program).then(console.log, console.error)
