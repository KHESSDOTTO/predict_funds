import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { format } from "date-fns";
import { PredictionsType, RawDataType } from "@/utils/types";
import PredList from "./predList";
import { useEffect, useState } from "react";
import {
  generateYaxisDomainBasedOnMaxAbs,
  generateYaxisTicksBasedOnMaxAbs,
} from "@/utils/functions";

interface CustomTootipProps extends TooltipProps<ValueType, NameType> {
  data?: (RawDataType | PredictionsType)[];
}

interface ChartSectionProps {
  data: RawDataType[];
  smallV: boolean;
  predictions: PredictionsType[];
}

export default function ChartSection({
  data,
  smallV,
  predictions,
}: ChartSectionProps) {
  const [domainYaxisVQ, setDomainYaxisVQ] = useState<number[]>([0, 100]),
    [ticksYaxisVQ, setTicksYaxisVQ] = useState<number[]>([]),
    [domainYaxisNF, setDomainYaxisNF] = useState<number[]>([-100, 100]),
    [ticksYaxisNF, setTicksYaxisNF] = useState<number[]>([]),
    [unifiedData, setUnifiedData] = useState<(RawDataType | PredictionsType)[]>(
      [...data]
    ),
    [gradientOffset, setGradientOffset] = useState(1);

  // Margin to aply to find the domain of the Yaxis on the charts
  const margin = 0.05;

  function adjustValueQuotaChartAxis() {
    // Defining domain values for axis of Value Quota Chart
    const minValueVQ = data.reduce((minObj, currObj) => {
      return currObj["VL_QUOTA"] < minObj["VL_QUOTA"] ? currObj : minObj;
    }, data[0])["VL_QUOTA"];
    const maxValueVQ = data.reduce((maxObj, currObj) => {
      return currObj["VL_QUOTA"] > maxObj["VL_QUOTA"] ? currObj : maxObj;
    }, data[0])["VL_QUOTA"];

    // Domain of the Yaxis
    const minValYaxisVQ = minValueVQ * (1 - margin),
      maxValYaxisVQ = maxValueVQ * (1 + margin);
    setDomainYaxisVQ([minValYaxisVQ, maxValYaxisVQ]);

    // Ticks for Value Quota chart
    const ticksQntYaxisVQ = 7;
    const ticksIntervalYaxisVQ =
      (maxValYaxisVQ - minValYaxisVQ) / (ticksQntYaxisVQ - 1);
    const newTicksYaxisVQ = Array.from(
      { length: ticksQntYaxisVQ },
      (_, index) => minValYaxisVQ + ticksIntervalYaxisVQ * index
    );
    console.log("before setTicksYaxisVQ");
    setTicksYaxisVQ(newTicksYaxisVQ);
  }

  function adjustNetFundingChartAxis() {
    // Defining values for domain/axis in Net Funding Chart
    // Max absolute value in historic data
    let maxAbsValueNF = data.reduce((maxAbsObj, currObj) => {
      return Math.abs(currObj["CAPTC_LIQ"] ?? 0) >
        (maxAbsObj["CAPTC_LIQ"] ? Math.abs(maxAbsObj["CAPTC_LIQ"]) : 0)
        ? currObj
        : maxAbsObj;
    }, data[0])["CAPTC_LIQ"];

    // Value of prediction to compare with highest absolute value of historic data.
    const absValuePred = predictions[0].CAPTC_LIQ
      ? Math.abs(Number(predictions[0].CAPTC_LIQ))
      : 0;
    if (maxAbsValueNF) {
      // Defyning domain.
      maxAbsValueNF =
        absValuePred > Math.abs(maxAbsValueNF)
          ? Number(Math.abs(absValuePred).toFixed(2))
          : Number(Math.abs(maxAbsValueNF).toFixed(2));

      const newDomain = generateYaxisDomainBasedOnMaxAbs(maxAbsValueNF);
      if (newDomain) {
        setDomainYaxisNF(newDomain);
      }
      const newYaxisNFTicks = generateYaxisTicksBasedOnMaxAbs(maxAbsValueNF);
      console.log("newYaxisNFTicks");
      console.log(newYaxisNFTicks);
      if (newYaxisNFTicks) {
        setTicksYaxisNF(newYaxisNFTicks);
      }
      return true;
    }
    return false;
  }

  function unifyData() {
    // Unifying data
    const newUnifiedData = [...data, ...predictions.slice(1)]; // Slice to exclude last data present in historic
    const newGradientOffset =
      (newUnifiedData.length - predictions.slice(1).length) /
      newUnifiedData.length;
    setUnifiedData(newUnifiedData);
    setGradientOffset(newGradientOffset);
  }

  useEffect(() => {
    if (data.length === 0 || predictions.length === 0) {
      return;
    }
    adjustValueQuotaChartAxis();
    if (adjustNetFundingChartAxis()) {
      unifyData();
    }
  }, [data, predictions]);

  return (
    <div
      className={`${
        smallV
          ? "w-full flex gap-0 flex-wrap flex-col lg:gap-2 lg:flex-row"
          : "w-screen"
      } text-white`}
    >
      <div
        id="ValueQuotaDiv"
        className={` ${smallV ? "px-2 lg:w-[48.5%]" : "pb-4 lg:py-4"}`}
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
        <div className="flex flex-col gap-8 lg:gap-4 lg:flex-row">
          <div
            className={`bg-gray-900 pt-4 mx-2 shadow-md shadow-indigo-900/80 rounded-sm ${
              smallV ? "lg:w-full lg:h-[210px]" : "lg:w-[60%] lg:h-[412px]"
            } lg:rounded-xl`}
          >
            <ResponsiveContainer height={smallV ? 200 : 400}>
              <AreaChart data={data}>
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
                  interval={smallV ? 8 : 6}
                  fontSize={12}
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
                  dataKey="VL_QUOTA"
                  stroke="rgb(150, 150, 75)"
                  strokeWidth={1}
                  fill="url(#customYellow)"
                ></Area>
                <Tooltip content={<CustomTooltipYellow />} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {!smallV && (
            <div className="mx-2 mt-1 lg:w-[40%] lg:mr-4">
              <PredList
                title="Value Quota (history)"
                onlyBack={true}
                data={data}
                predictions={predictions}
                varName={"VL_QUOTA"}
              />
            </div>
          )}
        </div>
      </div>
      <div
        id="NetFundingDiv"
        className={` ${smallV ? "px-2 lg:w-[48.5%]" : "py-4"}`}
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
        <div className="flex flex-col gap-8 lg:gap-4 lg:flex-row">
          <div
            className={`bg-gray-900 pt-4 mx-2 shadow-md shadow-indigo-900/80 rounded-sm ${
              smallV ? "lg:w-full lg:h-[210px]" : "lg:w-[60%] lg:h-[412px]"
            } lg:rounded-xl`}
          >
            <ResponsiveContainer height={smallV ? 200 : 400} minWidth={250}>
              <AreaChart data={unifiedData}>
                <defs>
                  <linearGradient id="customIndigo" x1="0" y1="0" x2="1" y2="0">
                    <stop
                      offset={gradientOffset * 0.95}
                      stopColor="rgb(150, 130, 200)"
                      stopOpacity={0.85}
                    />
                    <stop
                      offset={gradientOffset * 1.1}
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
                      offset={gradientOffset * 0.98}
                      stopColor="rgb(120, 50, 150)"
                      stopOpacity={1}
                    />
                    <stop
                      offset={gradientOffset * 1.02}
                      stopColor="white"
                      stopOpacity={1}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="DT_COMPTC"
                  tick={{ fill: "rgb(230, 230, 230)" }}
                  height={30}
                  interval={smallV ? 12 : 6}
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(DT_COMPTC) => {
                    return format(DT_COMPTC, `dd/MM`);
                  }}
                />
                <YAxis
                  ticks={ticksYaxisNF}
                  tick={{ fill: "rgb(230, 230, 230)" }}
                  tickFormatter={(num) =>
                    `R$${String((num / 1000).toFixed(0))} k`
                  }
                  tickCount={11}
                  domain={domainYaxisNF}
                  width={65}
                  fontSize={12}
                />
                <CartesianGrid
                  // vertical={false}
                  stroke="rgb(170, 150, 255)"
                  strokeWidth={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="CAPTC_LIQ"
                  stroke="url(#customIndigoDark)"
                  fill="url(#customIndigo)"
                ></Area>
                <Tooltip content={<CustomTooltipIndigo data={unifiedData} />} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {!smallV && (
            <div className="mx-2 mt-1 lg:w-[40%] lg:mr-4">
              <PredList
                title="Net Funding"
                onlyBack={false}
                data={data}
                predictions={predictions}
                varName={"CAPTC_LIQ"}
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
}: CustomTootipProps) {
  // console.log(JSON.stringify(payload));
  // Identify preictions to differentiate on the chart
  // <IdentificandoPredsLabels>
  const numPreds = 4;
  const predsElements = data?.slice(data.length - numPreds * 5, data.length);
  const predsDates = predsElements?.map((cE) => cE.DT_COMPTC);
  // </IdentificandoPredsLabels>
  let tooltipClass =
    "bg-black/80 text-white p-2 rounded-sm shadow-indigo-700 shadow-sm";
  const isPrediction = predsDates?.includes(label);
  if (isPrediction) {
    tooltipClass =
      "bg-black/50 text-white p-2 rounded-sm shadow-white shadow-sm";
  }
  if (active && label && payload) {
    return (
      <div className={tooltipClass}>
        {isPrediction && <h3 className="font-semibold mb-1">Prediction</h3>}
        {!isPrediction && <h3 className="font-semibold ">Historic</h3>}
        <h4 className="">{format(label, "d, MMM, yy")}</h4>
        <p>
          Net Funding: R$
          {payload[0].payload.CAPTC_LIQ.toFixed(2).toLocaleString("en-US")}
        </p>
      </div>
    );
  }
  return <></>;
}

function CustomTooltipYellow({ active, payload, label }: CustomTootipProps) {
  // console.log(JSON.stringify(payload));
  if (active && label && payload) {
    return (
      <div className="bg-black/80 text-white p-2 rounded-md shadow-yellow-700 shadow-sm">
        <h4 className="font-semibold">{format(label, "d, MMM, yy")}</h4>
        <p>
          Quota: R$
          {payload[0].payload.VL_QUOTA.toFixed(2).toLocaleString("en-US")}
        </p>
      </div>
    );
  }
  return <></>;
}
