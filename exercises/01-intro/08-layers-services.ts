/**
 * Goal: Context.Service + Layer + Effect.provide (Effect 4 style).
 * Docs: https://effect.website/docs/requirements-management/services
 */
import { Context, Effect, Layer } from "effect"

// TODO: define a Greeter service with { greet: (name: string) => Effect<string> }
export class Greeter extends Context.Service<
  Greeter,
  { readonly greet: (name: string) => Effect.Effect<string> }
>()("effect-zero-to-hero/Greeter") {}

const GreeterLive = Layer.succeed(
  Greeter,
  Greeter.of({
    greet: (name) => Effect.succeed(`Hello, ${name}`),
  }),
)

export const program = Effect.gen(function* () {
  // TODO: yield* Greeter and call greet("Effect")
  const greeter = yield* Greeter
  return yield* greeter.greet("Effect")
}).pipe(Effect.provide(GreeterLive))

Effect.runPromise(program).then(console.log, console.error)
