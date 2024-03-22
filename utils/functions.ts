function generateYaxisTicksBasedOnMaxAbs(
  maxAbs: number,
  maxValueTick = 100000,
  numTicks = 9,
  times = 1
) {
  const ticks: number[] = [];

  console.log("maxAbs");
  console.log(maxAbs);

  if (maxAbs <= maxValueTick || times > 50) {
    // Prevent infinite recursion by limiting times
    const minTick = -maxValueTick;
    const maxTick = maxValueTick;
    const step = (maxTick - minTick) / (numTicks - 1);

    for (let i = 0; i < numTicks; i++) {
      ticks.push(minTick + step * i);
    }

    console.log("ticks");
    console.log(ticks);
    return ticks;
  }

  let newMaxValueTick = maxValueTick;
  if (times == 1) newMaxValueTick = 200000;
  else if (times == 2) newMaxValueTick = 500000;
  else newMaxValueTick += 500000;

  return generateYaxisTicksBasedOnMaxAbs(
    maxAbs,
    newMaxValueTick,
    numTicks,
    times + 1
  );
}

function generateYaxisDomainBasedOnMaxAbs(
  maxAbs: number,
  maxValueTick = 100000,
  times = 1
) {
  if (maxAbs <= maxValueTick || times > 50) {
    // Prevent infinite recursion
    const minTick = -maxValueTick;
    const maxTick = maxValueTick;

    const domain = [minTick, maxTick];
    return domain;
  }

  // Adjust newMaxValueTick based on the current attempt (times)
  let newMaxValueTick = maxValueTick;
  if (times == 1) newMaxValueTick = 200000;
  else if (times == 2) newMaxValueTick = 500000;
  else newMaxValueTick += 500000; // Simplify the logic for increasing maxValueTick

  return generateYaxisDomainBasedOnMaxAbs(maxAbs, newMaxValueTick, times + 1);
}

export { generateYaxisTicksBasedOnMaxAbs, generateYaxisDomainBasedOnMaxAbs };
