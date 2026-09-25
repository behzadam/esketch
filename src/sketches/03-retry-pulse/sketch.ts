import p5 from "p5"
import { Effect, Ref, Schedule, Schema } from "effect"
import { createSketchRuntime, readRef } from "../../lib/effect-p5"

class Flaky extends Schema.TaggedError<Flaky>()("Flaky", {
  attempt: Schema.Number,
}) {}

export const meta = {
  id: "03-retry-pulse",
  title: "Retry Pulse",
  concept: "Schedule + Effect.retry",
}

export const createSketch = (host: HTMLElement) => {
  const runtime = createSketchRuntime()

  const sketch = new p5((p) => {
    let statusRef: Ref.Ref<"pending" | "fail" | "ok"> | null = null
    let attemptRef: Ref.Ref<number> | null = null

    p.setup = () => {
      p.createCanvas(host.clientWidth || 640, host.clientHeight || 420)

      runtime.fork(
        Effect.gen(function* () {
          const status = yield* Ref.make<"pending" | "fail" | "ok">("pending")
          const attempts = yield* Ref.make(0)
          statusRef = status
          attemptRef = attempts

          let n = 0
          const flaky = Effect.suspend(() => {
            n += 1
            return Effect.gen(function* () {
              yield* Ref.set(attempts, n)
              if (n < 4) {
                yield* Ref.set(status, "fail")
                return yield* Effect.fail(new Flaky({ attempt: n }))
              }
              yield* Ref.set(status, "ok")
              return "ok" as const
            })
          })

          // TODO: retry flaky with Schedule.recurs(5) or Schedule.spaced("200 millis")
          // Hint: yield* flaky.pipe(Effect.retry(Schedule.spaced("200 millis")))
          void Schedule
          yield* flaky
        }),
      )
    }

    p.draw = () => {
      const status = statusRef ? readRef(statusRef) : "pending"
      const attempt = attemptRef ? readRef(attemptRef) : 0
      const pulse = 0.5 + 0.5 * Math.sin(p.millis() / 200)

      if (status === "ok") p.background(46, 125, 50)
      else if (status === "fail") p.background(160 + 40 * pulse, 40, 40)
      else p.background(60, 60, 70)

      p.fill(255)
      p.noStroke()
      p.textAlign(p.CENTER, p.CENTER)
      p.textSize(22)
      p.text(`${status} · attempt ${attempt}`, p.width / 2, p.height / 2)
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
