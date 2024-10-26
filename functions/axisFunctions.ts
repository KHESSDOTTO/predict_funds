function generateYaxisTicksBasedOnMaxMod(
  maxMod: number,
  isPct: boolean,
  maxValueTick = 100000,
  numTicks = 9,
  times = 1
) {
  const ticks: number[] = [];

  const adjustMaxValueTick = isPct && times === 1 ? 0.05 : maxValueTick;

  if (maxMod <= adjustMaxValueTick || times > 50) {
    // Prevent infinite recursion by limiting times
    const minTick = -adjustMaxValueTick;
    const maxTick = adjustMaxValueTick;
    const step = (maxTick - minTick) / (numTicks - 1);

    for (let i = 0; i < numTicks; i++) {
      ticks.push(minTick + step * i);
    }

    return ticks;
  }

  let newMaxValueTick = adjustMaxValueTick;
  const newMaxFirstTime = isPct ? 0.1 : 200000;
  const newMaxSecondTime = isPct ? 0.15 : 500000;
  const defaultStep = isPct ? 0.05 : 500000;

  if (times == 1) {
    newMaxValueTick = newMaxFirstTime;
  } else if (times == 2) {
    newMaxValueTick = newMaxSecondTime;
  } else {
    newMaxValueTick += defaultStep; // Simplify the logic for increasing maxValueTick
  }

  return generateYaxisTicksBasedOnMaxMod(
    maxMod,
    isPct,
    newMaxValueTick,
    numTicks,
    times + 1
  );
}

function generateYaxisDomainBasedOnMaxMod(
  maxMod: number,
  isPct: boolean,
  maxValueTick = 100000,
  times = 1
) {
  const adjustMaxValueTick = isPct && times === 1 ? 0.05 : maxValueTick;

  if (maxMod <= adjustMaxValueTick || times > 50) {
    // Prevent infinite recursion
    const minTick = -adjustMaxValueTick;
    const maxTick = adjustMaxValueTick;

    const domain = [minTick, maxTick];
    return domain;
  }

  // Adjust newMaxValueTick based on the current attempt (times)
  let newMaxValueTick = adjustMaxValueTick;
  const newMaxFirstTime = isPct ? 0.1 : 200000;
  const newMaxSecondTime = isPct ? 0.15 : 500000;
  const defaultStep = isPct ? 0.05 : 500000;

  if (times == 1) {
    newMaxValueTick = newMaxFirstTime;
  } else if (times == 2) {
    newMaxValueTick = newMaxSecondTime;
  } else {
    newMaxValueTick += defaultStep; // Simplify the logic for increasing maxValueTick
  }

  return generateYaxisDomainBasedOnMaxMod(
    maxMod,
    isPct,
    newMaxValueTick,
    times + 1
  );
}

export { generateYaxisTicksBasedOnMaxMod, generateYaxisDomainBasedOnMaxMod };
