/**
 * Goal: wrap existing Promise APIs and exit back to Promises.
 * Docs: https://effect.website/ (FAQ: adopt Effect incrementally)
 */
import { Effect } from "effect"

// Existing non-Effect API
const legacyFetchUser = (id: string): Promise<{ id: string; name: string }> =>
  Promise.resolve({ id, name: "Ada" })

// TODO: enter Effect world with Effect.tryPromise / Effect.promise
export const getUserEffect = (id: string) =>
  Effect.tryPromise({
    try: () => legacyFetchUser(id),
    catch: (e) => new Error(String(e)),
  })

// TODO: exit with Effect.runPromise for callers that still want Promises
export const getUserPromise = (id: string) => Effect.runPromise(getUserEffect(id))

export const program = getUserEffect("1")

Effect.runPromise(program).then(console.log, console.error)
