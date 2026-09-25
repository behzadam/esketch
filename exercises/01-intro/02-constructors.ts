/**
 * Goal: build Effects with succeed / fail / sync / promise / tryPromise.
 * Docs: https://effect.website/docs/getting-started/creating-effects
 */
import { Effect, Schema } from "effect"

class DemoError extends Schema.TaggedError<DemoError>()("DemoError", {
  message: Schema.String,
}) {}

// TODO: Effect.succeed a string
export const ok = Effect.succeed("todo")

// TODO: Effect.fail with DemoError
export const boom = Effect.fail(new DemoError({ message: "todo" }))

// TODO: Effect.sync for a sync side-effect (e.g. Date.now())
export const syncNow = Effect.sync(() => 0)

// TODO: Effect.promise wrapping Promise.resolve(1)
export const fromPromise = Effect.promise(() => Promise.resolve(0))

// TODO: Effect.tryPromise that can fail with DemoError
export const tryAsync = Effect.tryPromise({
  try: () => Promise.resolve(0),
  catch: () => new DemoError({ message: "caught" }),
})

export const program = Effect.gen(function* () {
  // TODO: yield* ok, syncNow, fromPromise, tryAsync (skip boom unless you catch it)
  return "todo"
})

Effect.runPromise(program).then(console.log, console.error)
