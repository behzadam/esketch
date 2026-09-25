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

      // TODO: use Effect.sync to compute canvas center { x, y }
      // TODO: use Effect.succeed for a radius (e.g. 48)
      // Hint: const point = Effect.runSync(Effect.sync(() => ({ x: w / 2, y: h / 2 })))
      void Effect
      x = 40
      y = 40
      radius = 20
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
