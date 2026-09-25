import p5 from "p5"
import { Effect, PubSub, Ref } from "effect"
import { createSketchRuntime, readRef } from "../../lib/effect-p5"

type Ripple = { x: number; y: number; r: number; life: number }

export const meta = {
  id: "08-pubsub-ripples",
  title: "PubSub Ripples",
  concept: "PubSub publish / subscribe",
}

export const createSketch = (host: HTMLElement) => {
  const runtime = createSketchRuntime()

  const sketch = new p5((p) => {
    let ripplesRef: Ref.Ref<Ripple[]> | null = null
    let hub: PubSub.PubSub<{ x: number; y: number }> | null = null

    p.setup = () => {
      p.createCanvas(host.clientWidth || 640, host.clientHeight || 420)

      runtime.run(
        Effect.gen(function* () {
          const pubsub = yield* PubSub.unbounded<{ x: number; y: number }>()
          const ripples = yield* Ref.make<Ripple[]>([])
          hub = pubsub
          ripplesRef = ripples

          // Two subscribers — each click fans out to both
          for (let i = 0; i < 2; i++) {
            yield* Effect.forkChild(
              Effect.scoped(
                Effect.gen(function* () {
                  // TODO: subscribe + forever take messages into ripplesRef
                  // Hint:
                  //   const sub = yield* PubSub.subscribe(pubsub)
                  //   yield* Effect.forever(
                  //     Effect.gen(function* () {
                  //       const msg = yield* PubSub.take(sub)
                  //       yield* Ref.update(ripples, (xs) =>
                  //         [...xs, { ...msg, r: 8, life: 1 }].slice(-40),
                  //       )
                  //     }),
                  //   )
                  void PubSub
                  void ripples
                  yield* Effect.never
                }),
              ),
            )
          }

          yield* Effect.never
        }),
      )
    }

    p.draw = () => {
      p.background(28, 27, 25)
      if (!ripplesRef) return

      const next = readRef(ripplesRef)
        .map((r) => ({ ...r, r: r.r + 2.5, life: r.life - 0.015 }))
        .filter((r) => r.life > 0)

      Effect.runSync(Ref.set(ripplesRef, next))

      for (const r of next) {
        p.noFill()
        p.stroke(120, 200, 255, r.life * 255)
        p.strokeWeight(2)
        p.circle(r.x, r.y, r.r * 2)
      }

      p.noStroke()
      p.fill(244, 242, 238)
      p.textSize(14)
      p.text(`click to publish · hub: ${hub ? "yes" : "no"} · ripples: ${next.length}`, 16, 24)
    }

    p.mousePressed = () => {
      if (!hub) return
      // TODO: publish click position to all subscribers
      // Hint: Effect.runFork(PubSub.publish(hub, { x: p.mouseX, y: p.mouseY }))
      void PubSub
    }

    p.windowResized = () => {
      p.resizeCanvas(host.clientWidth, host.clientHeight)
    }
  }, host)

  const originalRemove = sketch.remove.bind(sketch)
  sketch.remove = () => {
    runtime.dispose()
    originalRemove()
  }

  return sketch
}
