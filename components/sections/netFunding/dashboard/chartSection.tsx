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
import { useState } from "react";
import { format } from "date-fns";
import OptionButtonGreen from "../../../UI/optionButtonGreen";
import OptionButtonIndigo from "../../../UI/optionButtonIndigo";
import OptionButtonRed from "../../../UI/optionButtonRed";
import { RawDataType } from "@/utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CustomTootipProps extends TooltipProps<ValueType, NameType> {
  showNetFunding: boolean;
}

interface ChartSectionProps {
  data: RawDataType[];
}

export default function ChartSection({ data }: ChartSectionProps) {
  const [showPessimistic, setShowPessimistic] = useState(false),
    [showOptimistic, setShowOptimistic] = useState(false),
    [showNetFunding, setShowNetFunding] = useState(true);

  function togglePessimistic() {
    setShowPessimistic(!showPessimistic);
  }

  function toggleOptimistic() {
    setShowOptimistic(!showOptimistic);
  }

  function toggleNetFunding() {
    setShowNetFunding(!showNetFunding);
  }

  return (
    <div className="w-screen">
      {/* <div className="flex justify-around items-end">
        <div className="w-1/3 md:pl-2" onClick={togglePessimistic}>
          <OptionButtonRed>Forecast - 1 std</OptionButtonRed>
        </div>
        <div className="w-1/3" onClick={toggleNetFunding}>
          <OptionButtonIndigo>Forecast</OptionButtonIndigo>
        </div>
        <div className="w-1/3 md:pr-2" onClick={toggleOptimistic}>
          <OptionButtonGreen>Forecast + 1 std</OptionButtonGreen>
        </div>
      </div> */}
      <h1 className="my-4 font-semibold text-lg text-center border-b border-black mx-[32vw] lg:indent-2 lg:mx-4 lg:text-left">
        Net Funding
      </h1>
      <div className="bg-gray-900 pt-4 lg:rounded-xl box-shadow shadow-md shadow-indigo-900 lg:shadow-sm lg:pl-8">
        <ResponsiveContainer height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="customIndigo" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="40%"
                  stopColor="rgb(180, 180, 255)"
                  stopOpacity={0.85}
                />
                <stop
                  offset="60%"
                  stopColor="rgb(180, 180, 255)"
                  stopOpacity={0.75}
                />
              </linearGradient>
              <linearGradient id="customRed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="10%"
                  stopColor="rgb(255, 200, 200)"
                  stopOpacity={0.9}
                />
                <stop
                  offset="90%"
                  stopColor="rgb(255, 200, 200)"
                  stopOpacity={0.3}
                />
              </linearGradient>
              <linearGradient id="customGreen" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="10%"
                  stopColor="rgb(240, 255, 240)"
                  stopOpacity={0.9}
                />
                <stop
                  offset="90%"
                  stopColor="rgb(240, 255, 240)"
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="DT_COMPTC"
              tick={{ fill: "rgb(230, 230, 230)" }}
              height={30}
              fontSize={12}
              tickLine={false}
              tickFormatter={(DT_COMPTC) => {
                return format(DT_COMPTC, `dd/MM/yy`);
              }}
            />
            <YAxis
              tick={{ fill: "rgb(230, 230, 230)" }}
              tickFormatter={(num) => `R$${String(num.toFixed(2) / 1000)} k`}
              width={70}
              fontSize={12}
            />
            <CartesianGrid vertical={false} stroke="rgb(170, 150, 255)" />
            {showNetFunding && (
              <Area
                type="monotone"
                dataKey="CAPTC_LIQ"
                stroke="rgb(100, 0, 120)"
                fill="url(#customIndigo)"
              ></Area>
            )}
            {/* {showPessimistic && (
                <Area
                  type="monotone"
                  dataKey="std1Less"
                  stroke="red"
                  fill="url(#customRed)"
                ></Area>
              )} */}
            {/* {showOptimistic && (
                <Area
                  type="monotone"
                  dataKey="std1More"
                  stroke="green"
                  fill="url(#customGreen)"
                ></Area>
              )} */}
            <Tooltip
              content={
                <CustomTooltipIndigo
                  showNetFunding={showNetFunding}
                  // showOptimistic={showOptimistic}
                  // showPessimistic={showPessimistic}
                />
              }
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <h1 className="my-4 font-semibold text-lg text-center border-b border-black mx-[32vw] lg:indent-2 lg:mx-4 lg:text-left">
        Value - Quota
      </h1>
      <div className="bg-gray-900 pt-4 lg:rounded-xl box-shadow shadow-md shadow-indigo-900 lg:shadow-sm lg:pl-8">
        <ResponsiveContainer height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="customYellow" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="10%"
                  stopColor="rgb(200, 200, 100)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="90%"
                  stopColor="rgb(200, 200, 100)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="DT_COMPTC"
              tick={{ fill: "rgb(230, 230, 230)" }}
              height={30}
              fontSize={12}
              tickLine={false}
              tickFormatter={(DT_COMPTC) => {
                return format(DT_COMPTC, `dd/MM/yy`);
              }}
            />
            <YAxis
              tick={{ fill: "rgb(230, 230, 230)" }}
              tickFormatter={(num) => `R$${String(num.toFixed(2))}`}
              width={70}
              fontSize={12}
              domain={["dataMin - 10", "dataMax + 10"]}
            />
            <CartesianGrid vertical={false} stroke="rgb(170, 150, 255)" />
            {showNetFunding && (
              <Area
                type="monotone"
                dataKey="VL_QUOTA"
                stroke="rgb(150, 150, 75)"
                strokeWidth={2}
                fill="url(#customYellow)"
              ></Area>
            )}
            {/* {showPessimistic && (
                <Area
                  type="monotone"
                  dataKey="std1Less"
                  stroke="red"
                  fill="url(#customRed)"
                ></Area>
              )} */}
            {/* {showOptimistic && (
                <Area
                  type="monotone"
                  dataKey="std1More"
                  stroke="green"
                  fill="url(#customGreen)"
                ></Area>
              )} */}
            <Tooltip
              content={
                <CustomTooltipYellow
                  showNetFunding={showNetFunding}
                  // showOptimistic={showOptimistic}
                  // showPessimistic={showPessimistic}
                />
              }
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CustomTooltipIndigo({
  active,
  payload,
  label,
  showNetFunding,
}: // showOptimistic,
// showPessimistic,
CustomTootipProps) {
  console.log(JSON.stringify(payload));
  if (active && label && payload) {
    return (
      <div className="bg-black/80 text-white p-2 rounded-md shadow-indigo-700 shadow-sm">
        <h4 className="font-semibold">{format(label, "d, MMM, yy")}</h4>
        {/* {showPessimistic && (
          <p>Less 1std: R${payload[0].payload.std1Less.toFixed(2)}mln</p>
        )} */}
        {showNetFunding && (
          <p>
            Net Funding: R$
            {payload[0].payload.CAPTC_LIQ.toFixed(2).toLocaleString("en-US")}
          </p>
        )}
        {/* {showOptimistic && (
          <p>More 1std: R${payload[0].payload.std1More.toFixed(2)}mln</p>
        )} */}
      </div>
    );
  }
  return <></>;
}

function CustomTooltipYellow({
  active,
  payload,
  label,
  showNetFunding,
}: // showOptimistic,
// showPessimistic,
CustomTootipProps) {
  console.log(JSON.stringify(payload));
  if (active && label && payload) {
    return (
      <div className="bg-black/80 text-white p-2 rounded-md shadow-yellow-700 shadow-sm">
        <h4 className="font-semibold">{format(label, "d, MMM, yy")}</h4>
        {/* {showPessimistic && (
          <p>Less 1std: R${payload[0].payload.std1Less.toFixed(2)}mln</p>
        )} */}
        {showNetFunding && (
          <p>
            Net Funding: R$
            {payload[0].payload.VL_QUOTA.toFixed(2).toLocaleString("en-US")}
          </p>
        )}
        {/* {showOptimistic && (
          <p>More 1std: R${payload[0].payload.std1More.toFixed(2)}mln</p>
        )} */}
      </div>
    );
  }
  return <></>;
}
