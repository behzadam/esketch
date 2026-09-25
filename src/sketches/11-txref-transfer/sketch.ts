import p5 from "p5"
import { Effect, Ref, TxRef } from "effect"
import { createSketchRuntime, readRef } from "../../lib/effect-p5"

export const meta = {
  id: "11-txref-transfer",
  title: "TxRef Transfer",
  concept: "TxRef + Effect.tx",
}

export const createSketch = (host: HTMLElement) => {
  const runtime = createSketchRuntime()

  const sketch = new p5((p) => {
    let leftRef: Ref.Ref<number> | null = null
    let rightRef: Ref.Ref<number> | null = null
    let totalRef: Ref.Ref<number> | null = null
    let flashRef: Ref.Ref<number> | null = null

    let leftTx: TxRef.TxRef<number> | null = null
    let rightTx: TxRef.TxRef<number> | null = null

    const syncView = Effect.gen(function* () {
      if (!leftTx || !rightTx || !leftRef || !rightRef || !totalRef) return
      const l = yield* TxRef.get(leftTx)
      const r = yield* TxRef.get(rightTx)
      yield* Ref.set(leftRef, l)
      yield* Ref.set(rightRef, r)
      yield* Ref.set(totalRef, l + r)
    })

    p.setup = () => {
      p.createCanvas(host.clientWidth || 640, host.clientHeight || 420)

      runtime.fork(
        Effect.gen(function* () {
          const left = yield* TxRef.make(50)
          const right = yield* TxRef.make(50)
          leftTx = left
          rightTx = right
          leftRef = yield* Ref.make(50)
          rightRef = yield* Ref.make(50)
          totalRef = yield* Ref.make(100)
          flashRef = yield* Ref.make(0)
          yield* syncView
        }),
      )
    }

    p.draw = () => {
      const left = leftRef ? readRef(leftRef) : 50
      const right = rightRef ? readRef(rightRef) : 50
      const total = totalRef ? readRef(totalRef) : 100
      const flash = flashRef ? readRef(flashRef) : 0
      if (flashRef && flash > 0) {
        Effect.runSync(Ref.update(flashRef, (n) => Math.max(0, n - 0.04)))
      }

      p.background(28 + flash * 40, 27, 25)
      const maxH = p.height * 0.55
      const barW = 80
      const baseY = p.height * 0.75

      p.noStroke()
      p.fill(196, 92, 38)
      p.rect(p.width * 0.28 - barW / 2, baseY - (left / 100) * maxH, barW, (left / 100) * maxH, 6)
      p.fill(120, 200, 255)
      p.rect(p.width * 0.72 - barW / 2, baseY - (right / 100) * maxH, barW, (right / 100) * maxH, 6)

      p.fill(244, 242, 238)
      p.textAlign(p.CENTER, p.CENTER)
      p.textSize(16)
      p.text(`left ${left}`, p.width * 0.28, baseY + 28)
      p.text(`right ${right}`, p.width * 0.72, baseY + 28)
      p.text(`total ${total} (always 100) · click to transfer`, p.width / 2, 28)
    }

    p.mousePressed = () => {
      if (!leftTx || !rightTx || !flashRef) return
      const amount = 5 + Math.floor(Math.random() * 15)
      const toRight = p.mouseX < p.width / 2

      runtime.fork(
        Effect.gen(function* () {
          // TODO: transfer `amount` atomically with Effect.tx + TxRef get/set
          // Hint:
          //   yield* Effect.tx(
          //     Effect.gen(function* () {
          //       const l = yield* TxRef.get(leftTx!)
          //       const r = yield* TxRef.get(rightTx!)
          //       if (toRight && l >= amount) {
          //         yield* TxRef.set(leftTx!, l - amount)
          //         yield* TxRef.set(rightTx!, r + amount)
          //       } else if (!toRight && r >= amount) {
          //         yield* TxRef.set(leftTx!, l + amount)
          //         yield* TxRef.set(rightTx!, r - amount)
          //       }
          //     }),
          //   )
          //   yield* syncView
          //   yield* Ref.set(flashRef!, 1)
          void TxRef
          void amount
          void toRight
          void syncView
        }),
      )
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
