/**
 * Goal: model a multi-step workflow as composed Effects (durable thinking).
 * Docs: https://effect.website/docs/getting-started/building-pipelines
 *
 * Stretch: explore @effect/workflow for durable workflows in production.
 */
import { Effect, Schema } from "effect"

class StepFailed extends Schema.TaggedError<StepFailed>()("StepFailed", {
  step: Schema.String,
}) {}

const validate = (input: string) =>
  input.length > 0 ? Effect.succeed(input.trim()) : Effect.fail(new StepFailed({ step: "validate" }))

const enrich = (input: string) => Effect.succeed({ input, ts: Date.now() })

const persist = (row: { input: string; ts: number }) =>
  Effect.succeed({ id: "persisted", ...row })

export const program = Effect.gen(function* () {
  // TODO: chain validate → enrich → persist; add compensation/logging on failure
  const v = yield* validate("hello")
  const e = yield* enrich(v)
  return yield* persist(e)
})

Effect.runPromise(program).then(console.log, console.error)
