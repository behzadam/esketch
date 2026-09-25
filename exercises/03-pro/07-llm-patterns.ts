/**
 * Goal: write Effect in a style LLMs (and humans) can follow — gen, tagged errors, explicit deps.
 * Docs: https://effect.website/ (LLMs ❤️ Effect / LLM guide)
 */
import { Context, Effect, Layer, Schema } from "effect"

class LlmError extends Schema.TaggedError<LlmError>()("LlmError", {
  message: Schema.String,
}) {}

export class Llm extends Context.Service<
  Llm,
  { readonly complete: (prompt: string) => Effect.Effect<string, LlmError> }
>()("effect-zero-to-hero/Llm") {}

const LlmLive = Layer.succeed(
  Llm,
  Llm.of({
    complete: (prompt) =>
      prompt.trim().length === 0
        ? Effect.fail(new LlmError({ message: "empty prompt" }))
        : Effect.succeed(`echo: ${prompt}`),
  }),
)

export const program = Effect.gen(function* () {
  // TODO: call Llm.complete with a prompt; catch LlmError to a fallback
  const llm = yield* Llm
  return yield* llm.complete("Explain Effect in one sentence").pipe(
    Effect.catchTag("LlmError", (e) => Effect.succeed(`fallback: ${e.message}`)),
  )
}).pipe(Effect.provide(LlmLive))

Effect.runPromise(program).then(console.log, console.error)
