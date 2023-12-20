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
    <div className="col-start-6 col-span-12">
      <div className="flex justify-around items-end">
        <div className="w-1/3 md:pl-2" onClick={togglePessimistic}>
          <OptionButtonRed>Forecast - 1 std</OptionButtonRed>
        </div>
        <div className="w-1/3" onClick={toggleNetFunding}>
          <OptionButtonIndigo>Forecast</OptionButtonIndigo>
        </div>
        <div className="w-1/3 md:pr-2" onClick={toggleOptimistic}>
          <OptionButtonGreen>Forecast + 1 std</OptionButtonGreen>
        </div>
      </div>
      <div className="bg-gray-900 pt-4 lg:rounded-xl lg:pl-8 box-shadow shadow-md shadow-indigo-900 lg:shadow-sm">
        <ResponsiveContainer height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="customIndigo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#8884d8" stopOpacity={0.9} />
                <stop offset="90%" stopColor="#8884d8" stopOpacity={0.2} />
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
                return format(DT_COMPTC, `d, MMM/yy`);
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
                stroke="rgb(70, 0, 100)"
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
                <CustomTooltip
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

function CustomTooltip({
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
      <div className="bg-black/30 text-white p-2 rounded-md shadow-indigo-700 shadow-md">
        <h4 className="font-semibold">{format(label, "d, MMM")}</h4>
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
