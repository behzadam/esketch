# 09 — Deferred Handshake

One fiber waits; a click completes the promise once for everyone.

## Learn

- `Deferred.make`
- `Deferred.await`
- `Deferred.succeed`

## TODO

1. `yield* Deferred.await(deferred)`, then write the RGB into the refs and mark `"ready"`.
2. On click: `Deferred.succeed(handshake, [196, 92, 38])`.

When done: click once — the circle turns solid orange and the label flips to “handshake done”.
