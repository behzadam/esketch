# 10 — Semaphore Lanes

Five cars want to drive; a semaphore of size **2** lets only two move at a time.

## Learn

- `Semaphore.make`
- `semaphore.withPermit` (auto acquire / release)

## TODO

Wrap each car’s drive loop body in `gate.withPermit(...)` so at most two cars are orange/moving together.

When done: you should never see more than `active permits in use: 2 / 2`.
