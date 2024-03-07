function generateYaxisTicksBasedOnMaxAbs(
  maxAbs: number,
  maxValueTick = 100000,
  numTicks = 9,
  times = 1
) {
  const ticks: number[] = [];

  console.log("maxAbs");
  console.log(maxAbs);

  if (maxAbs > maxValueTick) {
    while (times > 10) {
      times = times - 10;
    }
    let newMaxValueTick = times == 2 ? 500000 : maxValueTick + 500000;
    if (times == 1) newMaxValueTick = 200000;
    return generateYaxisTicksBasedOnMaxAbs(
      maxAbs,
      newMaxValueTick,
      numTicks,
      times + 1
    );
  }

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

function generateYaxisDomainBasedOnMaxAbs(
  maxAbs: number,
  maxValueTick = 100000,
  times = 1
) {
  console.log("maxAbs");
  console.log(maxAbs);

  if (maxAbs > maxValueTick) {
    while (times > 10) {
      times = times - 10;
    }
    let newMaxValueTick = times == 2 ? 500000 : maxValueTick + 500000;
    if (times == 1) newMaxValueTick = 200000;
    return generateYaxisDomainBasedOnMaxAbs(maxAbs, newMaxValueTick, times + 1);
  }

  const minTick = -maxValueTick;
  const maxTick = maxValueTick;

  const domain = [minTick, maxTick];

  return domain;
}

export { generateYaxisTicksBasedOnMaxAbs, generateYaxisDomainBasedOnMaxAbs };
