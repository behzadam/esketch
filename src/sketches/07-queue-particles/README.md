# 07 — Queue Particles

Emit particles from a producer fiber into a `Queue`; consume them for drawing.

## Learn

- `Queue.unbounded`
- `Queue.offer` / `Queue.take`
- structured concurrency with forked fibers

## TODO

1. Producer: `Queue.offer` a particle every ~120ms.
2. Consumer: `Queue.take` and append into the particles `Ref`.

When done: particles spray from the center continuously.
