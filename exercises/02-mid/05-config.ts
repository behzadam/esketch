/**
 * Goal: read typed Config from the environment (Effect 4).
 * Docs: https://effect.website/docs/configuration
 */
import { Config, Effect } from "effect"

// TODO: define Config for PORT (Int, default 3000) and APP_NAME (string)
const appConfig = Config.all({
  port: Config.Int("PORT").pipe(Config.withDefault(3000)),
  name: Config.String("APP_NAME").pipe(Config.withDefault("effect-zero-to-hero")),
})

export const program = Effect.gen(function* () {
  const config = yield* appConfig
  return config
})

Effect.runPromise(program).then(console.log, console.error)
