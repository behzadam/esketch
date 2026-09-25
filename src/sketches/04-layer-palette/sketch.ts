import p5 from "p5"
import { Context, Effect, Layer, Ref } from "effect"
import { createSketchRuntime, readRef } from "../../lib/effect-p5"

type Theme = { bg: [number, number, number]; fg: [number, number, number] }

class ThemeService extends Context.Service<
  ThemeService,
  { readonly theme: Theme }
>()("sketches/ThemeService") {}

const SolarLive = Layer.succeed(
  ThemeService,
  ThemeService.of({
    theme: { bg: [255, 236, 179], fg: [196, 92, 38] },
  }),
)

const NocturneLive = Layer.succeed(
  ThemeService,
  ThemeService.of({
    theme: { bg: [28, 27, 25], fg: [120, 200, 255] },
  }),
)

export const meta = {
  id: "04-layer-palette",
  title: "Layer Palette",
  concept: "Context.Service + Layer + provide",
}

export const createSketch = (host: HTMLElement) => {
  const runtime = createSketchRuntime()

  const sketch = new p5((p) => {
    let themeRef: Ref.Ref<Theme> | null = null
    let useNocturne = false

    const loadTheme = () => {
      runtime.fork(
        Effect.gen(function* () {
          const ref = themeRef ?? (yield* Ref.make<Theme>({ bg: [180, 180, 180], fg: [40, 40, 40] }))
          themeRef = ref

          // TODO: yield* ThemeService, then Ref.set(ref, service.theme)
          // TODO: pipe Effect.provide(useNocturne ? NocturneLive : SolarLive)
          void ThemeService
          void SolarLive
          void NocturneLive
          yield* Ref.set(ref, { bg: [180, 180, 180] as [number, number, number], fg: [40, 40, 40] as [number, number, number] })
        }),
      )
    }

    p.setup = () => {
      p.createCanvas(host.clientWidth || 640, host.clientHeight || 420)
      loadTheme()
    }

    p.draw = () => {
      const theme = themeRef
        ? readRef(themeRef)
        : { bg: [180, 180, 180] as [number, number, number], fg: [40, 40, 40] as [number, number, number] }
      p.background(...theme.bg)
      p.fill(...theme.fg)
      p.noStroke()
      p.circle(p.width / 2, p.height / 2, 120)
      p.fill(theme.fg[0], theme.fg[1], theme.fg[2], 200)
      p.textAlign(p.CENTER, p.CENTER)
      p.textSize(16)
      p.text("click to swap layer", p.width / 2, p.height / 2 + 100)
    }

    p.mousePressed = () => {
      useNocturne = !useNocturne
      loadTheme()
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
