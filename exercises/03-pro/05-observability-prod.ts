/**
 * Goal: annotate spans/logs so production debugging is tractable.
 * Docs: https://effect.website/docs/observability/tracing
 *
 * Stretch: wire OpenTelemetry exporter (@effect/opentelemetry).
 */
import { Effect } from "effect"

const loadOrder = (id: string) =>
  Effect.succeed({ id, total: 99 }).pipe(Effect.withSpan("loadOrder", { attributes: { id } }))

const charge = (order: { id: string; total: number }) =>
  Effect.succeed({ ok: true, charged: order.total }).pipe(
    Effect.withSpan("charge"),
    Effect.tap(() => Effect.logInfo(`charged ${order.total}`)),
  )

export const program = Effect.gen(function* () {
  // TODO: nest spans + annotate with order id
  const order = yield* loadOrder("ord_1")
  return yield* charge(order)
}).pipe(Effect.withSpan("checkout"))

Effect.runPromise(program).then(console.log, console.error)
