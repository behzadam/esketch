import p5 from "p5"
import { Deferred, Effect, Ref } from "effect"
import { createSketchRuntime, readRef } from "../../lib/effect-p5"

export const meta = {
  id: "09-deferred-handshake",
  title: "Deferred Handshake",
  concept: "Deferred.await / succeed",
}

export const createSketch = (host: HTMLElement) => {
  const runtime = createSketchRuntime()

  const sketch = new p5((p) => {
    let statusRef: Ref.Ref<"waiting" | "ready"> | null = null
    let colorRef: Ref.Ref<[number, number, number]> | null = null
    let handshake: Deferred.Deferred<[number, number, number]> | null = null

    p.setup = () => {
      p.createCanvas(host.clientWidth || 640, host.clientHeight || 420)

      runtime.fork(
        Effect.gen(function* () {
          const deferred = yield* Deferred.make<[number, number, number]>()
          const status = yield* Ref.make<"waiting" | "ready">("waiting")
          const color = yield* Ref.make<[number, number, number]>([80, 80, 90])
          handshake = deferred
          statusRef = status
          colorRef = color

          // TODO: await the deferred, then set status + color from the result
          // Hint:
          //   const rgb = yield* Deferred.await(deferred)
          //   yield* Ref.set(status, "ready")
          //   yield* Ref.set(color, rgb)
          void Deferred
          yield* Effect.never
        }),
      )
    }

    p.draw = () => {
      const status = statusRef ? readRef(statusRef) : "waiting"
      const rgb = colorRef ? readRef(colorRef) : ([80, 80, 90] as [number, number, number])
      const pulse = 0.5 + 0.5 * Math.sin(p.millis() / 280)

      p.background(244, 242, 238)
      p.noStroke()
      p.fill(...rgb, status === "waiting" ? 120 + 80 * pulse : 255)
      p.circle(p.width / 2, p.height / 2, status === "ready" ? 140 : 90 + 20 * pulse)

      p.fill(60)
      p.textAlign(p.CENTER, p.CENTER)
      p.textSize(18)
      p.text(
        status === "waiting" ? "click to complete Deferred" : "handshake done",
        p.width / 2,
        p.height / 2 + 110,
      )
    }

    p.mousePressed = () => {
      if (!handshake || !statusRef) return
      if (readRef(statusRef) !== "waiting") return
      // TODO: succeed the deferred with an accent color
      // Hint: Effect.runFork(Deferred.succeed(handshake, [196, 92, 38]))
      void Deferred
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
