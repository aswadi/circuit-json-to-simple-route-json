import { expect, test } from "bun:test"

test("package entrypoint can be imported", async () => {
  await expect(import("lib/index")).resolves.toBeDefined()
})
