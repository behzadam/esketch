/**
 * Goal: structured logging and basic tracing annotations.
 * Docs: https://effect.website/docs/observability/logging
 */
import { Effect } from "effect"

export const program = Effect.gen(function* () {
  // TODO: Effect.log / logInfo / logWarning around a small workflow
  yield* Effect.log("starting")
  yield* Effect.logInfo("working")
  const value = yield* Effect.succeed(42)
  // TODO: add Effect.withSpan("demo-span") around this program when you explore tracing
  yield* Effect.logWarning(`done with ${value}`)
  return value
}).pipe(Effect.withSpan("demo-span"))

Effect.runPromise(program).then(console.log, console.error)
