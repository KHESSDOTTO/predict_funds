/**
 * Class to encapsulate logic of axis helper functions.
 * @class
 */
class AxisFunctions {
  /**
   * Generate array of values to serve as ticks for a Y axis of a chart based on a domain.
   * @param domain Is the domain to be considered [lowerLimit, higherLimit]
   * @param numTicks Is the number of ticks desired for the Y axis of the chart
   * @returns Array of numbers to be used as ticks for an Y axis of a chart
   */
  static getYaxisTicks(
    domain: [number, number],
    numTicks: number = 9
  ): number[] {
    const minTick = domain[0];
    const maxTick = domain[1];

    if (maxTick <= minTick) {
      return [];
    }

    if (!Number.isInteger(numTicks) || numTicks < 2) {
      return [];
    }

    const ticks: number[] = [];
    const step = (maxTick - minTick) / Math.max(numTicks - 1, 1);

    for (let i = 0; i < numTicks; i++) {
      ticks.push(minTick + step * i);
    }

    return ticks;
  }

  /**
   * Generates domain based on maximum absolute (module) value present on the chart.
   * Domain is generated using "whole" numbers, like multiples of 100k or 1mln.
   * Domain always must have central point on "zero".
   * @param maxMod maximum absolute (module, can be a %) value present on the chart
   * @param isPct if the domain is percentage based or absolute number based
   * @param maxValueTry initial value to be tried, default is 100000
   * @param currRecursionDepth current recursion depth
   * @returns array of two numbers representing the domain, minVal and maxVal [minVal, maxVal]
   */
  static getDomain(
    maxMod: number,
    isPct: boolean,
    maxValueTry = 100000,
    currRecursionDepth = 1
  ): [number, number] {
    const adjustMaxValueTick =
      isPct && currRecursionDepth === 1 ? 0.05 : maxValueTry;
    let step = isPct ? 0.05 : 500000;

    if (!isPct) {
      if (maxMod > 50000000) {
        step = 10000000;
      } else if (maxMod > 10000000) {
        step = 5000000;
      }
    }

    if (maxMod <= adjustMaxValueTick || currRecursionDepth > 1000) {
      // Prevent infinite recursion
      const minTick = -adjustMaxValueTick;
      const maxTick = adjustMaxValueTick;
      const domain: [number, number] = [minTick, maxTick];

      return domain;
    }

    // Adjust newMaxValueTick based on the current attempt (currRecursionDepth)
    const isFirstItAndAbsolute = currRecursionDepth === 1 && !isPct;
    const newMaxValueTry = isFirstItAndAbsolute
      ? step
      : adjustMaxValueTick + step;

    return this.getDomain(
      maxMod,
      isPct,
      newMaxValueTry,
      currRecursionDepth + 1
    );
  }
}

export default AxisFunctions;
