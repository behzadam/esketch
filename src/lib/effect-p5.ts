import { Effect, Fiber, type Scope } from "effect"
import { Ref } from "effect"

export type SketchRuntime = {
  readonly run: <A, E>(effect: Effect.Effect<A, E, Scope.Scope>) => void
  readonly fork: <A, E>(effect: Effect.Effect<A, E>) => void
  readonly dispose: () => void
}

/**
 * Forks sketch lifecycle effects and interrupts them on dispose (nav / HMR).
 */
export const createSketchRuntime = (): SketchRuntime => {
  const fibers: Fiber.Fiber<unknown, unknown>[] = []

  const track = <A, E>(fiber: Fiber.Fiber<A, E>) => {
    fibers.push(fiber as Fiber.Fiber<unknown, unknown>)
    return fiber
  }

  return {
    run(effect) {
      track(Effect.runFork(Effect.scoped(effect)))
    },
    fork(effect) {
      track(Effect.runFork(effect))
    },
    dispose() {
      for (const fiber of fibers.splice(0)) {
        Effect.runFork(Fiber.interrupt(fiber))
      }
    },
  }
}

/** Sync read for p5 `draw` loops. */
export const readRef = <A>(ref: Ref.Ref<A>): A => Ref.getUnsafe(ref)
