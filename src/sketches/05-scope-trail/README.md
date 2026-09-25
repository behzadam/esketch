# 05 — Scope Trail

Own a mouse trail buffer with `acquireRelease`.

## Learn

- `Effect.acquireRelease`
- `Effect.scoped` (via sketch runtime `run`)
- cleanup on interrupt / leave

## TODO

Acquire a `Ref<Trail>` (and an `alive` flag) with `acquireRelease`. On release, clear the trail and set `alive` to `false`.

Navigate away and back — release should run (check the console / “released” hint if you surface it).
