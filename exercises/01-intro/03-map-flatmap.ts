/**
 * Goal: transform Effects with map / flatMap / pipe.
 * Docs: https://effect.website/docs/getting-started/building-pipelines
 */
import { Effect, pipe } from "effect"

const fetchId = Effect.succeed(1)
const fetchUser = (id: number) => Effect.succeed({ id, name: `user-${id}` })

// TODO: map fetchId to string `"id:1"`
export const mapped = fetchId.pipe(Effect.map((id) => String(id)))

// TODO: flatMap fetchId into fetchUser
export const flatMapped = fetchId.pipe(Effect.flatMap((id) => fetchUser(id)))

// TODO: rewrite with pipe(fetchId, Effect.map(...), Effect.flatMap(...))
export const piped = pipe(
  fetchId,
  Effect.map((id) => id),
  Effect.flatMap(fetchUser),
)

export const program = Effect.gen(function* () {
  // TODO: run mapped, flatMapped, piped and return a summary object
  return { mapped: yield* mapped, flatMapped: yield* flatMapped, piped: yield* piped }
})

Effect.runPromise(program).then(console.log, console.error)
