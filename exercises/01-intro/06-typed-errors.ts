/**
 * Goal: typed errors with Schema.TaggedError + catchTag / catchAll / mapError.
 * Docs: https://effect.website/docs/error-management/expected-errors
 */
import { Effect, Schema } from "effect"

class NotFound extends Schema.TaggedError<NotFound>()("NotFound", {
  id: Schema.String,
}) {}

class Unauthorized extends Schema.TaggedError<Unauthorized>()("Unauthorized", {
  reason: Schema.String,
}) {}

type User = { id: string; name: string }

const loadUser = (id: string): Effect.Effect<User, NotFound | Unauthorized> => {
  if (id === "admin") {
    return Effect.fail(new Unauthorized({ reason: "nope" }))
  }
  if (id === "missing") {
    return Effect.fail(new NotFound({ id }))
  }
  return Effect.succeed({ id, name: "Ada" })
}

export const program = Effect.gen(function* () {
  // TODO: call loadUser("missing") and catchTag NotFound → return a fallback user
  // TODO: also try catchAll and mapError to unify error messages
  const user = yield* loadUser("missing").pipe(
    Effect.catchTag("NotFound", (e) => Effect.succeed({ id: e.id, name: "fallback" } satisfies User)),
  )
  return user
})

Effect.runPromise(program).then(console.log, console.error)
