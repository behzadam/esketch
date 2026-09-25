/**
 * Goal: write sequential logic with Effect.gen + yield*.
 * Docs: https://effect.website/docs/getting-started/using-generators
 */
import { Effect } from "effect"

const step1 = Effect.succeed(10)
const step2 = (n: number) => Effect.succeed(n * 2)
const step3 = (n: number) => Effect.succeed(`result=${n}`)

export const program = Effect.gen(function* () {
  // TODO: yield* step1, then step2, then step3 — return the final string
  const a = yield* step1
  const b = yield* step2(a)
  return yield* step3(b)
})

Effect.runPromise(program).then(console.log, console.error)
