/**
 * Goal: timeouts and interruption.
 * Docs: https://effect.website/docs/concurrency/interruption
 */
import { Effect } from "effect"

const slow = Effect.sleep("2 seconds").pipe(Effect.as("done"))

export const program = Effect.gen(function* () {
  // TODO: timeout slow to 100ms and recover with a fallback string
  const result = yield* slow.pipe(
    Effect.timeout("100 millis"),
    Effect.catchTag("TimeoutError", () => Effect.succeed("timed out")),
  )
  return result
})

Effect.runPromise(program).then(console.log, console.error)
