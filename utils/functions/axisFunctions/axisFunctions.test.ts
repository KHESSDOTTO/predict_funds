import { it, expect } from "vitest";
import { generateYaxisTicksBasedOnDomain, generateYaxisDomainBasedOnMaxMod } from "./axisFunctions";
import { describe } from "node:test";

describe("generateYaxisTicksBasedOnDomain", () => {
  it("Should return empty array when numTicks is less than negative", () => {
    expect(generateYaxisTicksBasedOnDomain([1, 10], -15)).toEqual([]);
  });

  it("Should return empty array when numTicks is zero", () => {
    expect(generateYaxisTicksBasedOnDomain([1, 10], 0)).toEqual([]);
  });

  it("Should return empty array when numTicks is one", () => {
    expect(generateYaxisTicksBasedOnDomain([1, 10], 1)).toEqual([]);
  });

  it("Should return empty array when numTicks is not integer", () => {
    expect(generateYaxisTicksBasedOnDomain([1, 10], 5.3)).toEqual([]);
  });

  it("Should return empty array when min tick is higher than max tick", () => {
    expect(generateYaxisTicksBasedOnDomain([10, 1], 5)).toEqual([]);
  });

  it("Should return empty array when max tick is equal to min tick", () => {
    expect(generateYaxisTicksBasedOnDomain([10, 10], 5)).toEqual([]);
  });

  it("Should return domain when numTicks is two", () => {
    expect(generateYaxisTicksBasedOnDomain([1, 10], 2)).toEqual([1, 10]);
  });

  it("Should return 1,2,3,4,5 when numTicks is 5 and domain is [1,5]", () => {
    expect(generateYaxisTicksBasedOnDomain([1, 5], 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("Should return 0,2,4,6,8,10 when numTicks is 6 and domain is [0,10]", () => {
    expect(generateYaxisTicksBasedOnDomain([0, 10], 6)).toEqual([
      0, 2, 4, 6, 8, 10,
    ]);
  });

  it("Should return 1,4,7,10 when numTicks is 4 and domain is [1,10]", () => {
    expect(generateYaxisTicksBasedOnDomain([1, 10], 4)).toEqual([1, 4, 7, 10]);
  });
});

describe("generateYaxisDomainBasedOnMaxMod", () => {});
