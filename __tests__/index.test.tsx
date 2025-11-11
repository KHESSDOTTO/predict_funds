import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/pages";

test("Home", () => {
  render(<Home />);
  const element = screen.getByText("Sign up");
  expect(element).toBeTruthy();
});
