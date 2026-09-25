# 08 — PubSub Ripples

Broadcast each click to every subscriber — unlike a Queue, nobody competes for the message.

## Learn

- `PubSub.unbounded`
- `PubSub.subscribe` / `PubSub.take`
- `PubSub.publish`

## TODO

1. In each subscriber fiber: `PubSub.subscribe`, then forever `PubSub.take` and append a ripple.
2. On click: `PubSub.publish` the mouse position.

When done: every click spawns **two** ripples at the same point (one per subscriber).
