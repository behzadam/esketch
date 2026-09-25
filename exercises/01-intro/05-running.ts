/**
 * Goal: run Effects with runSync / runPromise / runFork.
 * Docs: https://effect.website/docs/getting-started/running-effects
 */
import { Effect, Fiber } from "effect"

const syncProgram = Effect.succeed(1)
const asyncProgram = Effect.promise(() => Promise.resolve(2))

// TODO: run syncProgram with Effect.runSync and log the value
const syncValue = Effect.runSync(syncProgram)
console.log("runSync:", syncValue)

// TODO: run asyncProgram with Effect.runPromise
Effect.runPromise(asyncProgram).then((v) => console.log("runPromise:", v))

// TODO: fork asyncProgram with Effect.runFork, then Fiber.join via runPromise
const fiber = Effect.runFork(asyncProgram)
Effect.runPromise(Fiber.join(fiber)).then((v) => console.log("runFork+join:", v))
