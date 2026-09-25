# 02 — Clock Stream

Drive a rotating hand from an Effect `Stream`.

## Learn

- `Stream.tick`
- `Stream.runForEach`
- `Ref` for frame state

## TODO

Pipe `Stream.tick("16 millis")` into `Ref.update` so the hand angle advances every frame tick.

When done: the hand spins smoothly. Leaving the sketch should stop the stream (runtime dispose).
