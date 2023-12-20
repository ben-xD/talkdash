import { expect, test } from "vitest";

type Cat = { name: string };

test("adds 1 + 2 to equal 3", () => {
  const bob: Cat = { name: "key" };
  expect(bob).toMatchObject({ name: "key" });
});
