import p5 from "p5"
import { Effect, Ref } from "effect"
import { createSketchRuntime, readRef } from "../../lib/effect-p5"

type Trail = Array<{ x: number; y: number }>

export const meta = {
  id: "05-scope-trail",
  title: "Scope Trail",
  concept: "acquireRelease + Scope",
}

export const createSketch = (host: HTMLElement) => {
  const runtime = createSketchRuntime()

  const sketch = new p5((p) => {
    let trailRef: Ref.Ref<Trail> | null = null
    let aliveRef: Ref.Ref<boolean> | null = null

    p.setup = () => {
      p.createCanvas(host.clientWidth || 640, host.clientHeight || 420)

      runtime.run(
        Effect.gen(function* () {
          // TODO: wrap trail buffer in Effect.acquireRelease:
          //   acquire: log + Ref.make<Trail>([])
          //   release: clear trail + mark alive false
          // Then assign trailRef / aliveRef and keep the scope open
          // Hint:
          //   const trail = yield* Effect.acquireRelease(
          //     Ref.make<Trail>([]).pipe(Effect.tap(() => Effect.sync(() => console.log("trail open")))),
          //     (ref) => Ref.set(ref, []).pipe(Effect.zipRight(Ref.set(alive!, false)), Effect.asVoid),
          //   )
          const trail = yield* Ref.make<Trail>([])
          const alive = yield* Ref.make(true)
          trailRef = trail
          aliveRef = alive
          // Without acquireRelease, leaving the sketch won't clear via release.
          yield* Effect.never
        }),
      )
    }

    p.draw = () => {
      p.background(244, 242, 238)
      if (!trailRef || !aliveRef) return

      const alive = readRef(aliveRef)
      const trail = readRef(trailRef)

      if (alive && p.mouseX > 0) {
        const next = [...trail, { x: p.mouseX, y: p.mouseY }].slice(-80)
        Effect.runSync(Ref.set(trailRef, next))
      }

      p.noFill()
      p.stroke(196, 92, 38)
      p.strokeWeight(3)
      p.beginShape()
      for (const pt of readRef(trailRef)) p.vertex(pt.x, pt.y)
      p.endShape()

      p.noStroke()
      p.fill(100)
      p.textSize(14)
      p.text(alive ? "move mouse · leave sketch to release" : "released", 16, 24)
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
