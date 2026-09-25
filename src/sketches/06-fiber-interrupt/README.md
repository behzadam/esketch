# 06 — Fiber Interrupt

Fork an animation fiber and stop it cleanly with Space.

## Learn

- `Effect.fork`
- `Fiber.interrupt`
- cooperative cancellation via `Effect.sleep` in a loop

## TODO

1. `fiber = yield* Effect.forkChild(loop)` instead of running `loop` on the main fiber.
2. On Space, `Fiber.interrupt(fiber)` and set `running` to `false`.

When done: orbiting circle freezes on Space and the label switches to “interrupted”.
