function generateYaxisTicksBasedOnDomain(
  domain: [number, number],
  numTicks: number = 9
): number[] {
  if (
    !domain ||
    domain.length < 2 ||
    typeof domain[0] !== "number" ||
    typeof domain[1] !== "number"
  ) {
    return [];
  }

  const ticks: number[] = [];
  const minTick = domain[0];
  const maxTick = domain[1];
  const step = (maxTick - minTick) / Math.max(numTicks - 1, 1);

  for (let i = 0; i < numTicks; i++) {
    ticks.push(minTick + step * i);
  }

  return ticks;
}

function generateYaxisDomainBasedOnMaxMod(
  maxMod: number,
  isPct: boolean,
  maxValueTickTry = 100000,
  times = 1
): [number, number] {
  const adjustMaxValueTick = isPct && times === 1 ? 0.05 : maxValueTickTry;
  let step = isPct ? 0.05 : 500000;

  if (!isPct) {
    if (maxMod > 50000000) {
      step = 10000000;
    } else if (maxMod > 10000000) {
      step = 5000000;
    }
  }

  if (maxMod <= adjustMaxValueTick || times > 1000) {
    // Prevent infinite recursion
    const minTick = -adjustMaxValueTick;
    const maxTick = adjustMaxValueTick;
    const domain: [number, number] = [minTick, maxTick];

    return domain;
  }

  // Adjust newMaxValueTick based on the current attempt (times)
  let newMaxValueTickTry = adjustMaxValueTick;
  newMaxValueTickTry += step; // Simplify the logic for increasing maxValueTick

  return generateYaxisDomainBasedOnMaxMod(
    maxMod,
    isPct,
    newMaxValueTickTry,
    times + 1
  );
}

export { generateYaxisTicksBasedOnDomain, generateYaxisDomainBasedOnMaxMod };
