/**
 * Goal: retry with Schedule (backoff / jitter).
 * Docs: https://effect.website/docs/scheduling/repetition
 */
import { Effect, Schedule, Schema } from "effect"

class Transient extends Schema.TaggedError<Transient>()("Transient", {
  attempt: Schema.Int,
}) {}

let attempts = 0
const flaky = Effect.suspend(() => {
  attempts += 1
  return attempts < 3
    ? Effect.fail(new Transient({ attempt: attempts }))
    : Effect.succeed("ok")
})

export const program = Effect.gen(function* () {
  // TODO: retry flaky with Schedule.recurs(5) or exponential backoff
  const value = yield* flaky.pipe(
    Effect.retry(Schedule.recurs(5)),
  )
  return { value, attempts }
})

Effect.runPromise(program).then(console.log, console.error)
