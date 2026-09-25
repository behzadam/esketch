import p5 from "p5"
import { Effect, Queue, Ref } from "effect"
import { createSketchRuntime, readRef } from "../../lib/effect-p5"

type Particle = { x: number; y: number; vx: number; vy: number; life: number }

export const meta = {
  id: "07-queue-particles",
  title: "Queue Particles",
  concept: "Queue offer / take",
}

export const createSketch = (host: HTMLElement) => {
  const runtime = createSketchRuntime()

  const sketch = new p5((p) => {
    let particlesRef: Ref.Ref<Particle[]> | null = null
    let queue: Queue.Queue<Particle> | null = null

    p.setup = () => {
      p.createCanvas(host.clientWidth || 640, host.clientHeight || 420)

      runtime.run(
        Effect.gen(function* () {
          const q = yield* Queue.unbounded<Particle>()
          const particles = yield* Ref.make<Particle[]>([])
          queue = q
          particlesRef = particles

          // Producer: emit a particle on an interval
          yield* Effect.forkChild(
            Effect.forever(
              Effect.gen(function* () {
                // TODO: Queue.offer a particle at canvas center with random velocity
                // Hint:
                // yield* Queue.offer(q, {
                //   x: p.width / 2, y: p.height / 2,
                //   vx: (Math.random() - 0.5) * 4,
                //   vy: (Math.random() - 0.5) * 4,
                //   life: 1,
                // })
                yield* Effect.sleep("120 millis")
              }),
            ),
          )

          // Consumer: take from queue into the particles ref
          yield* Effect.forever(
            Effect.gen(function* () {
              // TODO: const particle = yield* Queue.take(q)
              // then Ref.update(particles, (xs) => [...xs, particle].slice(-200))
              void Queue
              yield* Effect.sleep("16 millis")
            }),
          )
        }),
      )
    }

    p.draw = () => {
      p.background(244, 242, 238)
      if (!particlesRef) return

      const next = readRef(particlesRef)
        .map((pt) => ({
          ...pt,
          x: pt.x + pt.vx,
          y: pt.y + pt.vy,
          life: pt.life - 0.01,
        }))
        .filter((pt) => pt.life > 0)

      Effect.runSync(Ref.set(particlesRef, next))

      for (const pt of next) {
        p.noStroke()
        p.fill(196, 92, 38, pt.life * 255)
        p.circle(pt.x, pt.y, 10)
      }

      p.fill(100)
      p.textSize(14)
      p.text(`particles: ${next.length} · queue wired: ${queue ? "yes" : "no"}`, 16, 24)
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
