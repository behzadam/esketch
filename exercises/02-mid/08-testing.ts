/**
 * Goal: test Effect programs (export pure Effects; assert with Effect.runPromise).
 * Docs: https://effect.website/docs/additional-resources/testing
 *
 * Run: pnpm test
 */
import { Effect, Schema } from "effect"

export class ParseError extends Schema.TaggedError<ParseError>()("ParseError", {
  input: Schema.String,
}) {}

export const parsePositiveInt = (input: string) =>
  Effect.gen(function* () {
    const n = Number(input)
    // TODO: fail with ParseError when NaN or <= 0
    if (Number.isNaN(n) || n <= 0) {
      return yield* Effect.fail(new ParseError({ input }))
    }
    return n
  })
