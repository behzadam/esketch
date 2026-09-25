# 03 — Retry Pulse

Watch a flaky effect fail, then recover via `Schedule`.

## Learn

- `Effect.retry`
- `Schedule.spaced` / `Schedule.recurs`
- Tagged errors

## TODO

Wrap `flaky` with `Effect.retry(...)` so attempts 1–3 fail (red pulses) and attempt 4 turns the canvas green.

Without retry, the fiber dies on the first failure.
