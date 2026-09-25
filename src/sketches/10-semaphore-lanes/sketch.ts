import p5 from "p5"
import { Effect, Ref, Semaphore } from "effect"
import { createSketchRuntime, readRef } from "../../lib/effect-p5"

type Car = { id: number; x: number; lane: number; active: boolean }

export const meta = {
  id: "10-semaphore-lanes",
  title: "Semaphore Lanes",
  concept: "Semaphore.withPermit",
}

export const createSketch = (host: HTMLElement) => {
  const runtime = createSketchRuntime()

  const sketch = new p5((p) => {
    let carsRef: Ref.Ref<Car[]> | null = null
    let activeRef: Ref.Ref<number> | null = null

    p.setup = () => {
      p.createCanvas(host.clientWidth || 640, host.clientHeight || 420)

      runtime.fork(
        Effect.gen(function* () {
          // Only 2 cars may move at once
          const gate = yield* Semaphore.make(2)
          const cars = yield* Ref.make<Car[]>(
            Array.from({ length: 5 }, (_, id) => ({
              id,
              x: 40,
              lane: id,
              active: false,
            })),
          )
          const active = yield* Ref.make(0)
          carsRef = cars
          activeRef = active

          for (let id = 0; id < 5; id++) {
            yield* Effect.forkChild(
              Effect.forever(
                Effect.gen(function* () {
                  // TODO: wrap the drive section in gate.withPermit(...)
                  // Hint:
                  //   yield* gate.withPermit(
                  //     Effect.gen(function* () {
                  //       yield* Ref.update(active, (n) => n + 1)
                  //       yield* Ref.update(cars, (xs) =>
                  //         xs.map((c) => (c.id === id ? { ...c, active: true, x: 40 } : c)),
                  //       )
                  //       for (let step = 0; step < 40; step++) {
                  //         yield* Ref.update(cars, (xs) =>
                  //           xs.map((c) => (c.id === id ? { ...c, x: c.x + 12 } : c)),
                  //         )
                  //         yield* Effect.sleep("40 millis")
                  //       }
                  //       yield* Ref.update(cars, (xs) =>
                  //         xs.map((c) => (c.id === id ? { ...c, active: false, x: 40 } : c)),
                  //       )
                  //       yield* Ref.update(active, (n) => n - 1)
                  //     }),
                  //   )
                  //   yield* Effect.sleep("200 millis")
                  void Semaphore
                  void gate
                  void id
                  yield* Effect.sleep("500 millis")
                }),
              ),
            )
          }
        }),
      )
    }

    p.draw = () => {
      p.background(244, 242, 238)
      const cars = carsRef ? readRef(carsRef) : []
      const active = activeRef ? readRef(activeRef) : 0
      const laneH = p.height / 6

      for (let i = 0; i < 5; i++) {
        const y = laneH * (i + 0.75)
        p.stroke(200)
        p.strokeWeight(1)
        p.line(20, y + 18, p.width - 20, y + 18)
      }

      for (const car of cars) {
        const y = laneH * (car.lane + 0.75)
        p.noStroke()
        p.fill(car.active ? [196, 92, 38] : [160, 160, 165])
        p.rect(car.x, y - 10, 36, 20, 4)
      }

      p.fill(60)
      p.noStroke()
      p.textSize(14)
      p.text(`active permits in use: ${active} / 2`, 16, 24)
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
