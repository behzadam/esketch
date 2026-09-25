# Esketch

Learn [Effect](https://effect.website/) by seeing it — each sketch is a small p5.js canvas driven by Effect (streams, retries, layers, scopes, fibers, queues).

## Run

```bash
pnpm install
pnpm dev
```

Open the URL Vite prints (usually http://localhost:5173). Pick a sketch in the sidebar.

```bash
pnpm typecheck
```

## How to practice

1. Open the sketch’s `src/sketches/NN-…/sketch.ts`
2. Fill in the `TODO`s (READMEs in each folder explain the goal)
3. Save — Vite HMR reloads; watch the canvas

Leaving a sketch unmounts p5 and interrupts Effect fibers via `createSketchRuntime().dispose()`.

## Sketches

- [x] [01 · Hello Canvas](src/sketches/01-hello-canvas) — `succeed` / `sync` / `runSync`
- [ ] [02 · Clock Stream](src/sketches/02-clock-stream) — `Stream.tick` + `Ref`
- [ ] [03 · Retry Pulse](src/sketches/03-retry-pulse) — `Schedule` + `retry`
- [ ] [04 · Layer Palette](src/sketches/04-layer-palette) — `Context.Service` + `Layer`
- [ ] [05 · Scope Trail](src/sketches/05-scope-trail) — `acquireRelease` / Scope
- [ ] [06 · Fiber Interrupt](src/sketches/06-fiber-interrupt) — `forkChild` + `Fiber.interrupt`
- [ ] [07 · Queue Particles](src/sketches/07-queue-particles) — `Queue.offer` / `take`
- [ ] [08 · PubSub Ripples](src/sketches/08-pubsub-ripples) — `PubSub.publish` / `subscribe`
- [ ] [09 · Deferred Handshake](src/sketches/09-deferred-handshake) — `Deferred.await` / `succeed`
- [ ] [10 · Semaphore Lanes](src/sketches/10-semaphore-lanes) — `Semaphore.withPermit`
- [ ] [11 · TxRef Transfer](src/sketches/11-txref-transfer) — `TxRef` + `Effect.tx`

## Layout

```
src/
  main.ts              # hash router + p5 mount
  lib/effect-p5.ts     # fork / dispose helpers
  sketches/NN-name/    # sketch.ts + README.md
```

## Author

- X: [@behzad_pro](https://x.com/behzad_pro)
- LinkedIn: [behzadam](https://www.linkedin.com/in/behzadam)
