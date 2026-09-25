import p5 from "p5"
import { Effect, Ref, Stream } from "effect"
import { createSketchRuntime, readRef } from "../../lib/effect-p5"

export const meta = {
  id: "02-clock-stream",
  title: "Clock Stream",
  concept: "Stream.tick + Ref",
}

export const createSketch = (host: HTMLElement) => {
  const runtime = createSketchRuntime()

  const sketch = new p5((p) => {
    let angleRef: Ref.Ref<number> | null = null

    p.setup = () => {
      p.createCanvas(host.clientWidth || 640, host.clientHeight || 420)
      p.angleMode(p.RADIANS)

      runtime.run(
        Effect.gen(function* () {
          const ref = yield* Ref.make(0)
          angleRef = ref

          // TODO: Stream.tick("16 millis") and on each tick update ref:
          //   Ref.update(ref, (a) => a + 0.04)
          // Hint: yield* Stream.runForEach(Stream.tick("16 millis"), () => Ref.update(...))
          void Stream
          void ref
        }),
      )
    }

    p.draw = () => {
      const angle = angleRef ? readRef(angleRef) : 0
      const cx = p.width / 2
      const cy = p.height / 2
      const r = Math.min(p.width, p.height) * 0.35

      p.background(28, 27, 25)
      p.stroke(244, 242, 238)
      p.strokeWeight(3)
      p.noFill()
      p.circle(cx, cy, r * 2)
      p.line(cx, cy, cx + Math.cos(angle) * r, cy + Math.sin(angle) * r)
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
