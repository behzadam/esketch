/**
 * Goal: Schema.Struct + decode / encode (Effect 4).
 * Docs: https://effect.website/docs/schema/introduction
 */
import { Effect, Schema } from "effect"

// TODO: define a User schema with id: Int, email: string
export const User = Schema.Struct({
  id: Schema.Int,
  email: Schema.String,
})

export type User = typeof User.Type

const raw: unknown = { id: 1, email: "ada@example.com" }

export const program = Effect.gen(function* () {
  // TODO: Schema.decodeUnknownEffect(User)(raw) and encode back
  const decoded = yield* Schema.decodeUnknownEffect(User)(raw)
  const encoded = yield* Schema.encodeEffect(User)(decoded)
  return { decoded, encoded }
})

Effect.runPromise(program).then(console.log, console.error)
