/**
 * Goal: produce and fold a Stream.
 * Docs: https://effect.website/docs/stream/introduction
 */
import { Effect, Stream } from "effect"

export const program = Effect.gen(function* () {
  // TODO: Stream.range(1, 5), map * 2, runCollect
  const collected = yield* Stream.range(1, 5).pipe(
    Stream.map((n) => n * 2),
    Stream.runCollect,
  )
  return collected
})

Effect.runPromise(program).then(console.log, console.error)
