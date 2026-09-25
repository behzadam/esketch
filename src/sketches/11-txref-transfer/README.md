# 11 — TxRef Transfer

Move value between two balances inside one transaction so the total never drifts.

## Learn

- `TxRef.make` / `TxRef.get` / `TxRef.set`
- `Effect.tx` (commit both writes together)

## TODO

On click, wrap the debit + credit in `Effect.tx`, then `syncView` and flash.

- Click left half → transfer toward the right bar
- Click right half → transfer toward the left bar

When done: bars move, but `total` stays **100**.
