/**
 * Goal: wrap fetch in Effect.tryPromise with typed errors.
 * Docs: https://effect.website/docs/error-management/expected-errors
 *
 * Tip: later explore @effect/platform HttpClient for production HTTP.
 */
import { Effect, Schema } from "effect"

class HttpError extends Schema.TaggedError<HttpError>()("HttpError", {
  status: Schema.optionalKey(Schema.Int),
  message: Schema.String,
}) {}

const Todo = Schema.Struct({
  userId: Schema.Int,
  id: Schema.Int,
  title: Schema.String,
  completed: Schema.Boolean,
})

export const fetchTodo = (id: number) =>
  Effect.gen(function* () {
    // TODO: tryPromise fetch https://jsonplaceholder.typicode.com/todos/{id}
    const res = yield* Effect.tryPromise({
      try: () => fetch(`https://jsonplaceholder.typicode.com/todos/${id}`),
      catch: (e) => new HttpError({ message: String(e) }),
    })
    if (!res.ok) {
      return yield* Effect.fail(new HttpError({ status: res.status, message: "bad status" }))
    }
    const json = yield* Effect.tryPromise({
      try: () => res.json(),
      catch: (e) => new HttpError({ message: String(e) }),
    })
    return yield* Schema.decodeUnknownEffect(Todo)(json)
  })

export const program = fetchTodo(1)

Effect.runPromise(program).then(console.log, console.error)
