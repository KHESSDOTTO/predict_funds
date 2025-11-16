import { it, expect } from "vitest";
import { AxisFunctions } from "./axisFunctions";
import { describe } from "node:test";

describe("generateYaxisTicksBasedOnDomain", () => {
  it("Should return empty array when numTicks is less than negative", () => {
    expect(AxisFunctions.generateYaxisTicksBasedOnDomain([1, 10], -15)).toEqual(
      []
    );
  });

  it("Should return empty array when numTicks is zero", () => {
    expect(AxisFunctions.generateYaxisTicksBasedOnDomain([1, 10], 0)).toEqual(
      []
    );
  });

  it("Should return empty array when numTicks is one", () => {
    expect(AxisFunctions.generateYaxisTicksBasedOnDomain([1, 10], 1)).toEqual(
      []
    );
  });

  it("Should return empty array when numTicks is not integer", () => {
    expect(AxisFunctions.generateYaxisTicksBasedOnDomain([1, 10], 5.3)).toEqual(
      []
    );
  });

  it("Should return empty array when min tick is higher than max tick", () => {
    expect(AxisFunctions.generateYaxisTicksBasedOnDomain([10, 1], 5)).toEqual(
      []
    );
  });

  it("Should return empty array when max tick is equal to min tick", () => {
    expect(AxisFunctions.generateYaxisTicksBasedOnDomain([10, 10], 5)).toEqual(
      []
    );
  });

  it("Should return domain when numTicks is two", () => {
    expect(AxisFunctions.generateYaxisTicksBasedOnDomain([1, 10], 2)).toEqual([
      1, 10,
    ]);
  });

  it("Should return 1,2,3,4,5 when numTicks is 5 and domain is [1,5]", () => {
    expect(AxisFunctions.generateYaxisTicksBasedOnDomain([1, 5], 5)).toEqual([
      1, 2, 3, 4, 5,
    ]);
  });

  it("Should return 0,2,4,6,8,10 when numTicks is 6 and domain is [0,10]", () => {
    expect(AxisFunctions.generateYaxisTicksBasedOnDomain([0, 10], 6)).toEqual([
      0, 2, 4, 6, 8, 10,
    ]);
  });

  it("Should return 1,4,7,10 when numTicks is 4 and domain is [1,10]", () => {
    expect(AxisFunctions.generateYaxisTicksBasedOnDomain([1, 10], 4)).toEqual([
      1, 4, 7, 10,
    ]);
  });
});

describe("generateYaxisDomainBasedOnMaxMod", () => {
  it("Should return [-100k, 100k] when maxMod = 40k and isPct is 0", () => {
    expect(
      AxisFunctions.generateYaxisDomainBasedOnMaxMod(40000, false)
    ).toEqual([-100000, 100000]);
  });
  it("Should return [-500k, 500k] when maxMod = 200k and isPct is 0", () => {
    expect(
      AxisFunctions.generateYaxisDomainBasedOnMaxMod(200000, false)
    ).toEqual([-500000, 500000]);
  });
  it("Should return [-1mln, 1mln] when maxMod = 600k and isPct is 0", () => {
    expect(
      AxisFunctions.generateYaxisDomainBasedOnMaxMod(600000, false)
    ).toEqual([-1000000, 1000000]);
  });
  it("Should return [-1.5mln, 1.5mln] when maxMod = 1.1mln and isPct is 0", () => {
    expect(
      AxisFunctions.generateYaxisDomainBasedOnMaxMod(1100000, false)
    ).toEqual([-1500000, 1500000]);
  });
  it("Should return [-20mln, 20mln] when maxMod = 18mln and isPct is 0", () => {
    expect(
      AxisFunctions.generateYaxisDomainBasedOnMaxMod(18000000, false)
    ).toEqual([-20000000, 20000000]);
  });
  it("Should return [-60mln, 60mln] when maxMod = 52mln and isPct is 0", () => {
    expect(
      AxisFunctions.generateYaxisDomainBasedOnMaxMod(52000000, false)
    ).toEqual([-60000000, 60000000]);
  });
  it("Should return [-1, 1] when maxMod = 0.08 and isPct is 1", () => {
    expect(AxisFunctions.generateYaxisDomainBasedOnMaxMod(0.08, true)).toEqual([
      -0.1, 0.1,
    ]);
  });
  it("Should return [-0.5, 0.5] when maxMod = 0.2 and isPct is 1", () => {
    expect(AxisFunctions.generateYaxisDomainBasedOnMaxMod(0.02, true)).toEqual([
      -0.05, 0.05,
    ]);
  });
});
