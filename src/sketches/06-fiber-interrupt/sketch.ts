import p5 from "p5"
import { Effect, Fiber, Ref } from "effect"
import { createSketchRuntime, readRef } from "../../lib/effect-p5"

export const meta = {
  id: "06-fiber-interrupt",
  title: "Fiber Interrupt",
  concept: "fork + Fiber.interrupt",
}

export const createSketch = (host: HTMLElement) => {
  const runtime = createSketchRuntime()

  const sketch = new p5((p) => {
    let tRef: Ref.Ref<number> | null = null
    let runningRef: Ref.Ref<boolean> | null = null
    let fiber: Fiber.Fiber<void, never> | null = null

    p.setup = () => {
      p.createCanvas(host.clientWidth || 640, host.clientHeight || 420)

      runtime.fork(
        Effect.gen(function* () {
          const t = yield* Ref.make(0)
          const running = yield* Ref.make(true)
          tRef = t
          runningRef = running

          const loop = Effect.forever(
            Effect.gen(function* () {
              yield* Ref.update(t, (n) => n + 0.05)
              yield* Effect.sleep("16 millis")
            }),
          )

          // TODO: fork the loop and keep the Fiber handle
          // Hint: fiber = yield* Effect.forkChild(loop)
          void Fiber
          yield* loop
        }),
      )
    }

    p.draw = () => {
      const t = tRef ? readRef(tRef) : 0
      const running = runningRef ? readRef(runningRef) : false
      const x = p.width / 2 + Math.cos(t) * 120
      const y = p.height / 2 + Math.sin(t) * 80

      p.background(28, 27, 25)
      p.fill(120, 200, 255)
      p.noStroke()
      p.circle(x, y, 36)
      p.fill(244, 242, 238)
      p.textAlign(p.CENTER, p.CENTER)
      p.textSize(16)
      p.text(running ? "press Space to interrupt" : "interrupted", p.width / 2, p.height - 28)
    }

    p.keyPressed = () => {
      if (p.key !== " ") return
      // TODO: interrupt the fiber and set runningRef to false
      // Hint: if (fiber) Effect.runFork(Fiber.interrupt(fiber).pipe(Effect.zipRight(Ref.set(runningRef!, false))))
      void fiber
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
