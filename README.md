# Effect Zero-to-Hero

Learn [Effect](https://effect.website/) from scratch with a checklist and runnable exercises.

## How to use

1. Pick one unchecked item below.
2. Open the linked exercise file.
3. Implement the `TODO`s.
4. Run it:

```bash
pnpm practice exercises/01-intro/01-effect-type.ts
```

5. Mark the item `[x]` when done.

Also useful:

```bash
pnpm typecheck
pnpm test
```

Docs: [effect.website](https://effect.website/) · [LLM guide](https://effect.website/)

---

## Intro — foundations

- [ ] [What is Effect? Why `Effect<A, E, R>`](exercises/01-intro/01-effect-type.ts)
- [ ] [`Effect.succeed` / `fail` / `sync` / `promise` / `tryPromise`](exercises/01-intro/02-constructors.ts)
- [ ] [`Effect.map` / `flatMap` / piping](exercises/01-intro/03-map-flatmap.ts)
- [ ] [`Effect.gen` + `yield*`](exercises/01-intro/04-gen-yield.ts)
- [ ] [Running: `runSync` / `runPromise` / `runFork`](exercises/01-intro/05-running.ts)
- [ ] [Typed errors (`Schema.TaggedError`) + `catchTag` / `catchAll` / `mapError`](exercises/01-intro/06-typed-errors.ts)
- [ ] [Schema basics (`Schema.Struct`, decode/encode)](exercises/01-intro/07-schema-basics.ts)
- [ ] [Layers & services (`Context.Service`, `Layer.succeed`, `Effect.provide`)](exercises/01-intro/08-layers-services.ts)

## Mid — real apps

- [ ] [Resource safety (`Effect.acquireRelease`, `Scope`)](exercises/02-mid/01-resources-scope.ts)
- [ ] [Concurrency (`Effect.all`, `Effect.forEach`, fibers)](exercises/02-mid/02-concurrency.ts)
- [ ] [Interrupts & timeouts](exercises/02-mid/03-interrupt-timeout.ts)
- [ ] [Retry / schedule / backoff](exercises/02-mid/04-retry-schedule.ts)
- [ ] [Config (`Config`, env)](exercises/02-mid/05-config.ts)
- [ ] [Logging & tracing (OpenTelemetry basics)](exercises/02-mid/06-logging-tracing.ts)
- [ ] [HTTP client patterns with Effect](exercises/02-mid/07-http-client.ts)
- [ ] [Testing with Effect](exercises/02-mid/08-testing.ts) · [test file](exercises/02-mid/08-testing.test.ts)

## Pro — production

- [ ] [Complex Layer graphs / composition](exercises/03-pro/01-layer-graphs.ts)
- [ ] [Streams (`effect/Stream`)](exercises/03-pro/02-streams.ts)
- [ ] [Workflows / durable patterns](exercises/03-pro/03-workflows.ts)
- [ ] [Schema → API contracts](exercises/03-pro/04-schema-api-contracts.ts)
- [ ] [Observability in prod](exercises/03-pro/05-observability-prod.ts)
- [ ] [Incremental adoption in existing TS codebases](exercises/03-pro/06-incremental-adoption.ts)
- [ ] [Effect + AI / LLM-friendly patterns](exercises/03-pro/07-llm-patterns.ts)
