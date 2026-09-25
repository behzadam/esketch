import { describe, expect, it } from "vitest"
import { Effect } from "effect"
import { parsePositiveInt, ParseError } from "./08-testing.js"

describe("parsePositiveInt", () => {
  it("succeeds for positive ints", async () => {
    const result = await Effect.runPromise(parsePositiveInt("42"))
    expect(result).toBe(42)
  })

  it("fails with ParseError for invalid input", async () => {
    // TODO: assert failure is ParseError (use Effect.flip or Exit)
    const exit = await Effect.runPromiseExit(parsePositiveInt("nope"))
    expect(exit._tag).toBe("Failure")
  })
})
