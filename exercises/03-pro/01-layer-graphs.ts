/**
 * Goal: compose multiple Layers into a graph (Effect 4 Context.Service).
 * Docs: https://effect.website/docs/requirements-management/layers
 */
import { Context, Effect, Layer } from "effect"

export class Logger extends Context.Service<
  Logger,
  { readonly info: (msg: string) => Effect.Effect<void> }
>()("effect-zero-to-hero/Logger") {}

export class Db extends Context.Service<
  Db,
  { readonly get: (id: string) => Effect.Effect<string> }
>()("effect-zero-to-hero/Db") {}

const LoggerLive = Layer.succeed(
  Logger,
  Logger.of({
    info: (msg) => Effect.sync(() => console.log(msg)),
  }),
)

// TODO: DbLive that depends on Logger (Layer.effect + Layer.provide)
const DbLive = Layer.effect(
  Db,
  Effect.gen(function* () {
    const logger = yield* Logger
    return Db.of({
      get: (id: string) =>
        Effect.gen(function* () {
          yield* logger.info(`get ${id}`)
          return `row:${id}`
        }),
    })
  }),
).pipe(Layer.provide(LoggerLive))

const AppLive = Layer.merge(LoggerLive, DbLive)

export const program = Effect.gen(function* () {
  const db = yield* Db
  return yield* db.get("1")
}).pipe(Effect.provide(AppLive))

Effect.runPromise(program).then(console.log, console.error)
