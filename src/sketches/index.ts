import type { SketchModule } from "../lib/sketch"
import * as hello from "./01-hello-canvas/sketch"
import * as clock from "./02-clock-stream/sketch"
import * as retry from "./03-retry-pulse/sketch"
import * as layer from "./04-layer-palette/sketch"
import * as scope from "./05-scope-trail/sketch"
import * as fiber from "./06-fiber-interrupt/sketch"
import * as queue from "./07-queue-particles/sketch"
import * as pubsub from "./08-pubsub-ripples/sketch"
import * as deferred from "./09-deferred-handshake/sketch"
import * as semaphore from "./10-semaphore-lanes/sketch"
import * as txref from "./11-txref-transfer/sketch"

export const sketches: SketchModule[] = [
  hello,
  clock,
  retry,
  layer,
  scope,
  fiber,
  queue,
  pubsub,
  deferred,
  semaphore,
  txref,
]

export const getSketch = (id: string) =>
  sketches.find((s) => s.meta.id === id) ?? sketches[0]
