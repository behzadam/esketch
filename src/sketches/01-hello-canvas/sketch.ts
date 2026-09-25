import p5 from "p5"
import { Effect } from "effect"
import { createSketchRuntime } from "../../lib/effect-p5"

export const meta = {
  id: "01-hello-canvas",
  title: "Hello Canvas",
  concept: "Effect.succeed / sync / runSync",
}

export const createSketch = (host: HTMLElement) => {
  const runtime = createSketchRuntime()

  const sketch = new p5((p) => {
    let x = 40
    let y = 40
    let radius = 20

    p.setup = () => {
      const w = host.clientWidth || 640
      const h = host.clientHeight || 420
      p.createCanvas(w, h)
      p.noStroke()

      const point = Effect.runSync(
        Effect.sync(() => ({ x: w / 2, y: h / 2 })),
      )
      const r = Effect.runSync(Effect.succeed(48))
      x = point.x
      y = point.y
      radius = r
    }

    p.draw = () => {
      p.background(244, 242, 238)
      p.fill(196, 92, 38)
      p.circle(x, y, radius * 2)
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
