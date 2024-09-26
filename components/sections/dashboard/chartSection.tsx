import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Line,
  ReferenceLine,
  ComposedChart,
} from "recharts";
import { format } from "date-fns";
import { PredictionsType, HistoricType } from "@/utils/types";
import PredList from "./predList";
import { useEffect, useState } from "react";
import {
  consoleLog,
  generateYaxisDomainBasedOnMaxMod,
  generateYaxisTicksBasedOnMaxMod,
} from "@/functions/functions";
import { ClipLoader } from "react-spinners";
import useWindowWidth from "@/hooks/useWindowWidth";
import type {
  ChartSectionProps,
  CustomTooltipProps,
  CustomCursorProps,
} from "@/utils/types";
import { formatterBrNumber } from "@/utils/numberFormatters";

export default function ChartSection({
  registration,
  historic,
  smallV,
  predictions,
  loadingHistogram,
  histogram = false,
}: ChartSectionProps) {
  const [domainYaxisVQ, setDomainYaxisVQ] = useState<number[]>([0, 100]),
    [ticksYaxisVQ, setTicksYaxisVQ] = useState<number[]>([]),
    [domainYaxisNF, setDomainYaxisNF] = useState<number[]>([-100, 100]),
    [ticksYaxisNF, setTicksYaxisNF] = useState<number[]>([]),
    [unifiedNFData, setUnifiedNFData] = useState<
      (HistoricType | PredictionsType)[]
    >([...historic]),
    [gradientOffset, setGradientOffset] = useState(1),
    [absOrPct, setAbsOrPct] = useState<"CAPTC_LIQ_ABS_ms" | "CAPTC_LIQ_PCT_ms">(
      "CAPTC_LIQ_ABS_ms"
    ),
    [absOrPctNFShort, setAbsOrPctNFShort] = useState<"abs" | "pct">("abs"),
    [absOrPctHist, setAbsOrPctHist] = useState<"abs" | "pct">("abs"),
    [isMobile, setIsMobile] = useState<boolean>(false),
    screenWidth = useWindowWidth();

  function adjustValueQuotaChartAxis(
    data: HistoricType[],
    absOrPct: "CAPTC_LIQ_ABS_ms" | "CAPTC_LIQ_PCT_ms"
  ) {
    // Margin to aply to find the domain of the Yaxis on the charts
    const marginAbs = 0.05;
    const marginPct = 0.01;
    const marginForDomain =
      absOrPct === "CAPTC_LIQ_ABS_ms" ? marginAbs : marginPct;
    const ticksQntYaxisVQ = 7;

    // Defining domain values for axis of Value Quota Chart
    const minValueVQ = data.reduce((minObj, currObj) => {
      return currObj["VL_QUOTA_ms"] < minObj["VL_QUOTA_ms"] ? currObj : minObj;
    }, data[0])["VL_QUOTA_ms"];
    const maxValueVQ = data.reduce((maxObj, currObj) => {
      return currObj["VL_QUOTA_ms"] > maxObj["VL_QUOTA_ms"] ? currObj : maxObj;
    }, data[0])["VL_QUOTA_ms"];

    // Domain of the Yaxis
    const minValYaxisVQ = minValueVQ * (1 - marginForDomain),
      maxValYaxisVQ = maxValueVQ * (1 + marginForDomain);
    setDomainYaxisVQ([minValYaxisVQ, maxValYaxisVQ]);

    const ticksIntervalYaxisVQ =
      (maxValYaxisVQ - minValYaxisVQ) / (ticksQntYaxisVQ - 1);
    const newTicksYaxisVQ = Array.from(
      { length: ticksQntYaxisVQ },
      (_, index) => minValYaxisVQ + ticksIntervalYaxisVQ * index
    );
    setTicksYaxisVQ(newTicksYaxisVQ);
  }

  function adjustNetFundingChartAxis(
    historic: HistoricType[],
    absOrPct: "CAPTC_LIQ_ABS_ms" | "CAPTC_LIQ_PCT_ms"
  ) {
    const isPct = absOrPct === "CAPTC_LIQ_PCT_ms";
    // Defining values for domain/axis in Net Funding Chart
    // Max absolute value in historic historic
    let maxModValueNF = historic.reduce((maxAbsObj, currObj) => {
      return Math.abs(currObj[absOrPct] ?? 0) >
        (maxAbsObj[absOrPct] ? Math.abs(maxAbsObj[absOrPct]) : 0)
        ? currObj
        : maxAbsObj;
    }, historic[0])[absOrPct];

    // Value of prediction to compare with highest absolute value of historic historic.
    const modValuePred = predictions[0][absOrPct]
      ? Math.abs(Number(predictions[0][absOrPct]))
      : 0;

    if (maxModValueNF) {
      // Defyning domain.
      maxModValueNF =
        modValuePred > Math.abs(maxModValueNF)
          ? Number(Math.abs(modValuePred).toFixed(2))
          : Number(Math.abs(maxModValueNF).toFixed(2));

      const newDomain = generateYaxisDomainBasedOnMaxMod(maxModValueNF, isPct);
      if (newDomain) {
        setDomainYaxisNF(newDomain);
      }

      const newYaxisNFTicks = generateYaxisTicksBasedOnMaxMod(
        maxModValueNF,
        isPct
      );

      if (newYaxisNFTicks) {
        setTicksYaxisNF(newYaxisNFTicks);
      }

      return true;
    }
    return false;
  }

  function prepareChartNFData(
    historic: HistoricType[],
    predictions: PredictionsType[]
  ) {
    // Unifying data
    const newUnifiedNFData = [...historic, ...predictions];
    const newGradientOffset =
      (newUnifiedNFData.length - predictions.length) /
      (newUnifiedNFData.length - 1);
    setUnifiedNFData(newUnifiedNFData);
    setGradientOffset(newGradientOffset);
  }

  function handleAbsOrPctChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAbsOrPct(e.target.value as "CAPTC_LIQ_ABS_ms" | "CAPTC_LIQ_PCT_ms");
    setAbsOrPctNFShort(e.target.value === "CAPTC_LIQ_ABS_ms" ? "abs" : "pct");
  }

  function handleAbsOrPctHistChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAbsOrPctHist(e.target.value as "abs" | "pct");
  }

  useEffect(() => {
    if (historic.length === 0 || predictions.length === 0) {
      return;
    }
    adjustValueQuotaChartAxis(historic, absOrPct);
    if (adjustNetFundingChartAxis(historic, absOrPct)) {
      prepareChartNFData(historic, predictions);
    }
  }, [historic, predictions, absOrPct]);

  useEffect(() => {
    if (screenWidth > 992) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  }, [screenWidth]);

  return (
    <div
      className={`${
        smallV
          ? "w-full flex gap-0 flex-wrap flex-col lg:gap-2 lg:flex-row"
          : "w-full flex flex-col justify-center items-center gap-8 lg:gap-10"
      } text-white`}
    >
      <div
        id="NetFundingDiv"
        className={` ${smallV ? "px-2 lg:w-[48.5%]" : "w-full"}`}
      >
        <h1
          className={`my-4 ${
            smallV
              ? "text-md w-9/12 mx-auto text-black border-black"
              : "text-lg mx-[32vw] text-white/90 border-white/90"
          } font-semibold text-center border-b lg:pb-2 lg:indent-2 lg:mx-4 lg:text-left`}
        >
          Net Funding
        </h1>
        {!smallV && (
          <div className="text-sm text-gray-200 py-6 flex relative justify-center lg:mb-6 lg:pt-4 lg:text-base">
            <form className="flex gap-2 left-24 md:gap-8 lg:absolute">
              <h4 className="mr-2 md:mr-6">Visualization: </h4>
              <div className="flex text-xs items-center gap-1 md:text-sm">
                <input
                  type="radio"
                  name="absOrPct"
                  id="inpAbsOrPctABS"
                  value={"CAPTC_LIQ_ABS_ms"}
                  onChange={handleAbsOrPctChange}
                  checked={absOrPct === "CAPTC_LIQ_ABS_ms"}
                />
                <label htmlFor="monthsCorrel6">Absolute values</label>
              </div>
              <div className="flex items-center gap-1 text-xs md:text-sm">
                <input
                  type="radio"
                  name="absOrPct"
                  id="inpAbsOrPctPCT"
                  value={"CAPTC_LIQ_PCT_ms"}
                  onChange={handleAbsOrPctChange}
                  checked={absOrPct === "CAPTC_LIQ_PCT_ms"}
                />
                <label>Percentage of Net Asset</label>
              </div>
            </form>
          </div>
        )}
        <div
          className={`flex flex-col gap-6 lg:gap-4 lg:flex-row ${
            smallV ? "" : "lg:mx-6 lg:mt-6"
          }`}
        >
          <div
            className={`bg-gray-900 pt-4 mx-2 rounded-sm overflow-hidden ${
              smallV ? "lg:w-full lg:h-[210px]" : "lg:w-[60%] lg:h-[412px]"
            } lg:rounded-xl`}
          >
            <ResponsiveContainer
              height={smallV ? 200 : isMobile ? 300 : 400}
              minWidth={250}
            >
              <ComposedChart data={unifiedNFData}>
                <defs>
                  <linearGradient id="customIndigo" x1="0" y1="0" x2="1" y2="0">
                    <stop
                      offset={gradientOffset}
                      stopColor="rgb(150, 130, 200)"
                      stopOpacity={0.85}
                    />
                    <stop
                      offset={gradientOffset}
                      stopColor="white"
                      stopOpacity={1}
                    />
                  </linearGradient>
                  <linearGradient
                    id="customIndigoDark"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop
                      offset={gradientOffset}
                      stopColor="rgb(120, 50, 150)"
                      stopOpacity={1}
                    />
                    <stop
                      offset={gradientOffset}
                      stopColor="white"
                      stopOpacity={1}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="DT_COMPTC"
                  tick={{ fill: "rgb(230, 230, 230)" }}
                  height={30}
                  fontSize={isMobile ? 10 : 12}
                  tickLine={false}
                  tickFormatter={(DT_COMPTC) => {
                    return format(DT_COMPTC, `dd/MM`);
                  }}
                />
                <YAxis
                  ticks={ticksYaxisNF}
                  tick={{ fill: "rgb(230, 230, 230)" }}
                  tickFormatter={(num) => {
                    const isPct = absOrPct === "CAPTC_LIQ_PCT_ms";
                    const numAbs = String((num / 1000).toFixed(0));
                    const numPct = num.toFixed(2);
                    return isPct ? `${numPct}%` : `R$${numAbs} k`;
                  }}
                  tickCount={11}
                  domain={domainYaxisNF}
                  width={65}
                  fontSize={12}
                />
                <CartesianGrid stroke="rgb(170, 150, 255)" strokeWidth={0.3} />
                <Area
                  dataKey={absOrPct}
                  type="linear"
                  fill="indigo"
                  fillOpacity={0.15}
                />
                {[
                  `CI95_${absOrPctNFShort.toUpperCase()}_limits`,
                  `CI99_${absOrPctNFShort.toUpperCase()}_limits`,
                ].map((cE) => {
                  return (
                    <Area
                      key={cE}
                      dataKey={cE}
                      type="linear"
                      fill="gray"
                      fillOpacity={0.2}
                      strokeWidth={0}
                    />
                  );
                })}
                <Line
                  type="linear"
                  dataKey={absOrPct}
                  stroke="url(#customIndigo)"
                  strokeWidth={2}
                  dot={{
                    stroke: "rgb(150, 130, 200)",
                    strokeWidth: 2,
                  }}
                ></Line>

                <ReferenceLine y={0} fill="white" strokeWidth={2} />

                <Tooltip
                  content={
                    <CustomTooltipIndigo
                      data={unifiedNFData}
                      absOrPct={absOrPct}
                    />
                  }
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          {!smallV && (
            <div className="mx-2 mt-1 lg:w-[40%] lg:mr-4">
              <PredList
                title="Net Funding"
                onlyBack={false}
                historic={historic}
                predictions={predictions}
                varName={absOrPct}
              />
            </div>
          )}
        </div>
      </div>

      <div
        id="HistogramDiv"
        className={` ${smallV ? "px-2 lg:w-[48.5%] hidden" : "py-4 w-full"}`}
      >
        <h1
          className={`my-4 ${
            smallV
              ? "text-md w-9/12 mx-auto text-black border-black"
              : "text-lg mx-[32vw] text-white/90 border-white/90"
          } font-semibold text-center border-b lg:pb-2 lg:indent-2 lg:mx-4 lg:text-left`}
        >
          Preds. Histogram (Market - same ANBIMA Class)
        </h1>
        {registration && (
          <div className="relative top-1 flex justify-center lg:block lg:mb-2 lg:top-0">
            <ul className="list-inside lg:list-disc">
              <li className="text-sm lg:ml-12">
                <span className="mr-2 font-semibold italic lg:not-italic lg:text-base">
                  Anbima class:
                </span>
                <span className="text-white/80 italic">
                  {registration["CLASSE_ANBIMA"]}
                </span>
              </li>
            </ul>
          </div>
        )}
        <div className="text-sm text-gray-200 py-6 flex relative justify-center lg:mb-6 lg:pt-4 lg:text-base">
          <form className="flex gap-2 left-24 md:gap-8 lg:absolute">
            <h4 className="mr-2 md:mr-6">Visualization: </h4>
            <div className="flex text-xs items-center gap-1 md:text-sm">
              <input
                type="radio"
                name="absOrPctHist"
                id="inpAbsOrPctHistABS"
                value={"abs"}
                onChange={handleAbsOrPctHistChange}
                checked={absOrPctHist === "abs"}
              />
              <label htmlFor="monthsCorrel6">Absolute values</label>
            </div>
            <div className="flex items-center gap-1 text-xs md:text-sm">
              <input
                type="radio"
                name="absOrPctHist"
                id="inpAbsOrPctHistPCT"
                value={"pct"}
                onChange={handleAbsOrPctHistChange}
                checked={absOrPctHist === "pct"}
              />
              <label>Percentage of Net Asset</label>
            </div>
          </form>
        </div>
        <div className="flex flex-col gap-6 lg:gap-4 lg:flex-row">
          <div
            className={`bg-gray-900 pt-4 mx-2 rounded-sm ${
              smallV ? "lg:w-full lg:h-[210px]" : "lg:w-[95%]"
            } lg:rounded-xl lg:mx-8`}
            style={{ height: isMobile ? 300 : 500 }}
          >
            {loadingHistogram && (
              <div className="flex flex-col h-full relative items-center justify-center">
                <div>
                  <ClipLoader
                    color={"white"}
                    loading={loadingHistogram}
                    size={50}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    className="my-4"
                    speedMultiplier={0.75}
                  />
                </div>
              </div>
            )}
            {!loadingHistogram && (
              <ResponsiveContainer
                height={smallV ? 200 : isMobile ? 300 : 500}
                minWidth={250}
              >
                <BarChart
                  width={900}
                  height={isMobile ? 300 : 500}
                  data={histogram ? histogram[absOrPctHist] : []}
                >
                  <CartesianGrid strokeLinecap="round" strokeWidth={0.5} />
                  <XAxis
                    dataKey="xTick"
                    fontSize={isMobile ? 10 : 12}
                    className="text-white"
                    interval={isMobile ? 1 : 0}
                  />
                  <YAxis />
                  <Tooltip
                    content={<HistogramTooltip />}
                    cursor={<CustomTooltipCursor />}
                  />
                  <Bar dataKey="value" color="black">
                    {histogram &&
                      histogram[absOrPctHist]?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.selCnpjBin ? "#82ca9d" : "#8884d8"}
                        />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div
        id="ValueQuotaDiv"
        className={` ${smallV ? "px-2 lg:w-[48.5%]" : "pb-4 w-full"}`}
      >
        <h1
          className={`my-4 ${
            smallV
              ? "text-md w-9/12 mx-auto text-black border-black"
              : "text-lg mx-[32vw] text-white/90 border-white/90"
          } font-semibold text-center border-b lg:pb-2 lg:indent-2 lg:mx-4 lg:text-left`}
        >
          Value - Quota
          <span className={`italic ${smallV ? "text-xs" : "text-sm"}`}>
            {" "}
            (historic)
          </span>
        </h1>
        <div
          className={`flex flex-col gap-6 lg:gap-4 lg:flex-row ${
            smallV ? "" : "lg:mx-6 lg:mt-6"
          }`}
        >
          <div
            className={`bg-gray-900 pt-4 mx-2 rounded-sm ${
              smallV ? "lg:w-full lg:h-[210px]" : "lg:w-[60%] lg:h-[412px]"
            } lg:rounded-xl`}
          >
            <ResponsiveContainer height={smallV ? 200 : isMobile ? 300 : 400}>
              <AreaChart data={historic}>
                <defs>
                  <linearGradient id="customYellow" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="30%"
                      stopColor="rgb(200, 200, 100)"
                      stopOpacity={1}
                    />
                    <stop
                      offset="70%"
                      stopColor="rgb(200, 200, 100)"
                      stopOpacity={0.75}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="DT_COMPTC"
                  tick={{ fill: "rgb(230, 230, 230)" }}
                  height={30}
                  fontSize={isMobile ? 10 : 12}
                  tickLine={false}
                  tickFormatter={(DT_COMPTC) => {
                    return format(DT_COMPTC, `dd/MM`);
                  }}
                />
                <YAxis
                  ticks={ticksYaxisVQ}
                  tick={{ fill: "rgb(230, 230, 230)" }}
                  tickFormatter={(num) => `R$${String(num.toFixed(2))}`}
                  width={65}
                  fontSize={12}
                  domain={domainYaxisVQ}
                />
                {/* <CartesianGrid vertical={false} stroke="rgb(170, 150, 255)" /> */}
                <CartesianGrid
                  // vertical={false}
                  stroke="rgb(170, 150, 255)"
                  strokeWidth={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="VL_QUOTA_ms"
                  stroke="rgb(150, 150, 75)"
                  strokeWidth={1}
                  fill="url(#customYellow)"
                ></Area>
                <Tooltip
                  content={<CustomTooltipYellow absOrPct={absOrPct} />}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {!smallV && (
            <div className="mx-2 mt-1 lg:w-[40%] lg:mr-4">
              <PredList
                title="Value Quota (history)"
                onlyBack={true}
                historic={historic}
                predictions={predictions}
                varName={"VL_QUOTA_ms"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CustomTooltipIndigo({
  active,
  payload,
  label,
  data,
  absOrPct,
}: CustomTooltipProps) {
  const numPreds = 4;
  const isPct = absOrPct === "CAPTC_LIQ_PCT_ms";
  const predsElements = data?.slice(data.length - numPreds, data.length);
  const predsDates = predsElements?.map((cE) => cE.DT_COMPTC);
  const adjustAbsOrPct = absOrPct || "CAPTC_LIQ_ABS_ms";
  const isPrediction = predsDates?.includes(label);
  let tooltipClass =
    "bg-black/80 text-white p-2 rounded-sm shadow-indigo-700 shadow-sm";
  let CI90_lower: string;
  let CI90_upper: string;
  let CI95_lower: string;
  let CI95_upper: string;
  let CI99_lower: string;
  let CI99_upper: string;
  let CI90_LABEL: string = "";
  let CI95_LABEL: string = "";
  let CI99_LABEL: string = "";
  if (isPrediction && payload && payload[0]) {
    const payloadFirstElement = payload[0];
    tooltipClass =
      "bg-black/50 text-white p-2 rounded-sm shadow-white shadow-sm";

    CI90_lower = isPct
      ? formatterBrNumber.format(
          payloadFirstElement.payload["CI90_PCT_limits"][0]
        )
      : formatterBrNumber.format(
          payloadFirstElement.payload["CI90_ABS_limits"][0]
        );
    CI90_upper = isPct
      ? formatterBrNumber.format(
          payloadFirstElement.payload["CI90_PCT_limits"][1]
        )
      : formatterBrNumber.format(
          payloadFirstElement.payload["CI90_ABS_limits"][1]
        );
    CI95_lower = isPct
      ? formatterBrNumber.format(
          payloadFirstElement.payload["CI95_PCT_limits"][0]
        )
      : formatterBrNumber.format(
          payloadFirstElement.payload["CI95_ABS_limits"][0]
        );
    CI95_upper = isPct
      ? formatterBrNumber.format(
          payloadFirstElement.payload["CI95_PCT_limits"][1]
        )
      : formatterBrNumber.format(
          payloadFirstElement.payload["CI95_ABS_limits"][1]
        );
    CI99_lower = isPct
      ? formatterBrNumber.format(
          payloadFirstElement.payload["CI99_PCT_limits"][0]
        )
      : formatterBrNumber.format(
          payloadFirstElement.payload["CI99_ABS_limits"][0]
        );
    CI99_upper = isPct
      ? formatterBrNumber.format(
          payloadFirstElement.payload["CI99_PCT_limits"][1]
        )
      : formatterBrNumber.format(
          payloadFirstElement.payload["CI99_ABS_limits"][1]
        );

    CI90_LABEL = `Confidence 90%:  ${
      isPct ? CI90_lower + "%" : "R$ " + CI90_lower
    } | ${isPct ? CI90_upper + "%" : "R$ " + CI90_upper}`;
    CI95_LABEL = `Confidence 95%:  ${
      isPct ? CI95_lower + "%" : "R$ " + CI95_lower
    } | ${isPct ? CI95_upper + "%" : "R$ " + CI95_upper}`;
    CI99_LABEL = `Confidence 99%:  ${
      isPct ? CI99_lower + "%" : "R$ " + CI99_lower
    } | ${isPct ? CI99_upper + "%" : "R$ " + CI99_upper}`;
  }
  if (active && label && payload) {
    const formattedValue = formatterBrNumber.format(
      payload[0].payload[adjustAbsOrPct]
    );
    return (
      <div className={tooltipClass}>
        {isPrediction && <h3 className="font-semibold mb-1">Prediction</h3>}
        {!isPrediction && <h3 className="font-semibold ">Historic</h3>}
        <h4 className="">{format(label, "d, MMM, yy")}</h4>
        <p>
          Net Funding:&nbsp;
          {isPct ? formattedValue + "%" : "R$ " + formattedValue}
        </p>
        {isPrediction && payload && (
          <div className="flex flex-col gap-1 py-2 text-xs text-gray-200">
            <p>{CI95_LABEL}</p>
            <p>{CI99_LABEL}</p>
          </div>
        )}
      </div>
    );
  }
  return <></>;
}

function CustomTooltipYellow({ active, payload, label }: CustomTooltipProps) {
  if (active && label && payload) {
    return (
      <div className="bg-black/80 text-white p-2 rounded-md shadow-yellow-700 shadow-sm">
        <h4 className="font-semibold">{format(label, "d, MMM, yy")}</h4>
        <p>
          Quota: R$&nbsp;
          {formatterBrNumber.format(
            payload[0].payload.VL_QUOTA_ms.toFixed(2).toLocaleString("en-US")
          )}
        </p>
      </div>
    );
  }
  return <></>;
}

function HistogramTooltip({
  active,
  payload,
  label,
  isMobile,
}: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const selCnpjBin = payload[0].payload.selCnpjBin;
    const msg1 = selCnpjBin ? `You are here.` : "";
    const msg2 = `Count: ${payload[0].value}`;
    const txtColor = selCnpjBin ? `rgb(160, 200, 160)` : `rgb(180, 160, 230)`;
    const shadowColor = selCnpjBin ? `rgb(50, 100, 50)` : `rgb(55, 50, 100)`;
    let adjustedLabel = label;
    if (isMobile) {
      adjustedLabel = label.replace("|", "<br>");
    }
    return (
      <div
        className="bg-black/80 p-2 rounded-md"
        style={{ color: txtColor, boxShadow: `0px 1px 2px ${shadowColor}` }}
      >
        <p className="leading-6">
          {msg1 && (
            <>
              {msg1}
              <br />
            </>
          )}
          {msg2}
        </p>
        <p>{"Interval: " + adjustedLabel}</p>
      </div>
    );
  }
  return <></>;
}

const CustomTooltipCursor = ({ width, height, x, y }: CustomCursorProps) => (
  <rect
    x={x}
    y={y}
    width={width}
    height={height}
    fill="#ccc"
    opacity={0.4}
    className="recharts-tooltip-cursor"
  />
);
