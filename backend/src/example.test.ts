import { expect, test } from "vitest";

type ExampleTest = {
  name: string;
};

test("adds 1 + 2 to equal 3", () => {
  expect({ name: "winston" } satisfies ExampleTest).toMatchObject({
    name: "winston",
  });
});
