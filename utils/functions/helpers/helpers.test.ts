import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Helpers from "./helpers";

describe("Helpers function capitalize()", () => {
  it('Should return "I am fine, thanks." for "i am fine, thanks."', () => {
    expect(Helpers.capitalize("i am fine, thanks")).toBe("I am fine, thanks");
  });

  it('Should return "John is the goat" for "john is the goat"', () => {
    expect(Helpers.capitalize("john is the goat")).toBe("John is the goat");
  });

  it('Should return "" for ""', () => {
    expect(Helpers.capitalize("")).toBe("");
  });

  it('Should return "A" for "a"', () => {
    expect(Helpers.capitalize("a")).toBe("A");
  });
});

describe("getToneColor()", () => {
  const dummyMapColors = {
    "-1.0": "rgba(185, 28, 28, 1)", // dark red
    "-0.9": "rgba(200, 60, 60, 1)", // medium dark red
    "-0.8": "rgba(220, 90, 90, 1)", // red
    "-0.7": "rgba(235, 120, 120, 1)", // medium red
    "-0.6": "rgba(250, 150, 150, 1)", // light red
    "-0.5": "rgba(255, 180, 180, 1)", // lighter red
    "-0.4": "rgba(255, 210, 210, 1)", // very light red
    "-0.3": "rgba(255, 235, 235, 1)", // very light pink
    "-0.2": "rgba(255, 245, 245, 1)", // almost white with a hint of pink
    "-0.1": "rgba(255, 250, 250, 1)", // very very light pink
    "-0.0": "rgba(255, 255, 255, 1)", // white
    "0.0": "rgba(255, 255, 255, 1)", // white
    "0.1": "rgba(235, 245, 235, 1)", // very very light green
    "0.2": "rgba(210, 230, 210, 1)", // very light green
    "0.3": "rgba(185, 215, 185, 1)", // light green
    "0.4": "rgba(160, 200, 160, 1)", // lighter green
    "0.5": "rgba(135, 185, 135, 1)", // medium light green
    "0.6": "rgba(110, 170, 110, 1)", // green
    "0.7": "rgba(85, 155, 85, 1)", // medium green
    "0.8": "rgba(60, 140, 60, 1)", // darker green
    "0.9": "rgba(40, 125, 40, 1)", // dark green
    "1.0": "rgba(20, 110, 20, 1)", // very dark green
  };

  it("Return 'rgba(85, 155, 85, 1)' for value 0.7 and opacity 1", () => {
    expect(Helpers.getToneColor(0.7, dummyMapColors, 1));
  });

  it("Return 'rgba(200, 60, 60, 0.6)' for value -0.9 and opacity 0.6", () => {
    expect(Helpers.getToneColor(-0.9, dummyMapColors, 0.6));
  });

  it("Return 'rgba(255, 255, 255, 0)' for value 0.0 and opacity 0", () => {
    expect(Helpers.getToneColor(0.0, dummyMapColors, 0));
  });
});

describe("consoleLog()", () => {
  const varTest = 55;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Should log the variable name and value when passed an object", () => {
    Helpers.consoleLog({ varTest });

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenNthCalledWith(1, "varTest");
    expect(console.log).toHaveBeenNthCalledWith(2, 55);
  });

  it("Should handle objects with string values", () => {
    const testString = "hello";

    Helpers.consoleLog({ testString });

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenNthCalledWith(1, "testString");
    expect(console.log).toHaveBeenNthCalledWith(2, "hello");
  });

  it("Should handle objects with complex values", () => {
    const testObj = { nested: "value" };

    Helpers.consoleLog({ testObj });

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenNthCalledWith(1, "testObj");
    expect(console.log).toHaveBeenNthCalledWith(2, { nested: "value" });
  });

  it("Should handle empty objects without throwing", () => {
    expect(() => Helpers.consoleLog({})).not.toThrow();
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenNthCalledWith(1, 'undefined');
    expect(console.log).toHaveBeenNthCalledWith(2, undefined);
  });
});
