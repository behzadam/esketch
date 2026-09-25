import type p5 from "p5"

export type SketchMeta = {
  id: string
  title: string
  concept: string
  create: (host: HTMLElement) => p5
}

export type SketchModule = {
  meta: Omit<SketchMeta, "create">
  createSketch: (host: HTMLElement) => p5
}
