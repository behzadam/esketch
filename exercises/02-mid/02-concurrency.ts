/**
 * Goal: structured concurrency with Effect.all / forEach / fibers.
 * Docs: https://effect.website/docs/concurrency/basic-concurrency
 */
import { Effect } from "effect"

const task = (n: number) =>
  Effect.sleep(`${n * 50} millis`).pipe(Effect.as(n))

export const program = Effect.gen(function* () {
  // TODO: Effect.all on [task(1), task(2), task(3)] with concurrency: "unbounded"
  const all = yield* Effect.all([task(1), task(2), task(3)], {
    concurrency: "unbounded",
  })

  // TODO: Effect.forEach([1,2,3,4], task, { concurrency: 2 })
  const each = yield* Effect.forEach([1, 2, 3, 4], task, { concurrency: 2 })

  return { all, each }
})

Effect.runPromise(program).then(console.log, console.error)
