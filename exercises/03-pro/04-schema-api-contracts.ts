/**
 * Goal: use Schema as an API contract (decode request, encode response).
 * Docs: https://effect.website/docs/schema/introduction
 */
import { Effect, Schema } from "effect"

export const CreateUserRequest = Schema.Struct({
  email: Schema.String,
  age: Schema.Int.check(Schema.isGreaterThan(0)),
})

export const UserResponse = Schema.Struct({
  id: Schema.String,
  email: Schema.String,
  age: Schema.Int,
})

export const handleCreateUser = (body: unknown) =>
  Effect.gen(function* () {
    // TODO: decode CreateUserRequest, create id, encode UserResponse
    const req = yield* Schema.decodeUnknownEffect(CreateUserRequest)(body)
    const res = { id: crypto.randomUUID(), email: req.email, age: req.age }
    return yield* Schema.encodeEffect(UserResponse)(res)
  })

export const program = handleCreateUser({ email: "ada@example.com", age: 36 })

Effect.runPromise(program).then(console.log, console.error)
