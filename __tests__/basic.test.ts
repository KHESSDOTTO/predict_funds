import { expect, it } from "vitest";

it("Tests if 1 + 1 is equal to 2", () => {
  expect(1 + 1).toBe(2);
});

it("Tests if true is truthy", () => {
  expect(true).toBeTruthy();
});

it("Tests if false is falsy", () => {
  expect(false).toBeFalsy();
});
