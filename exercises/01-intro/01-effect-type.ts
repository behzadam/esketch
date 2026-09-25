/**
 * Goal: understand Effect<A, E, R> — Success, Error, Requirements.
 * Docs: https://effect.website/docs/getting-started/the-effect-type
 */
import { Effect } from "effect"

// TODO: annotate the type of `program` explicitly as Effect<number, never, never>
export const program = Effect.succeed(42)

// TODO: explain in a comment what A, E, and R mean for this Effect

Effect.runPromise(program).then(console.log, console.error)
