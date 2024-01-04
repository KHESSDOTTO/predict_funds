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
import { RawDataType } from "@/utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PredList from "./predList";

interface CustomTootipProps extends TooltipProps<ValueType, NameType> {}

interface ChartSectionProps {
  data: RawDataType[];
}

export default function ChartSection({ data }: ChartSectionProps) {
  return (
    <div className="w-screen">
      <h1 className="my-4 font-semibold text-lg text-center border-b border-black mx-[32vw] lg:indent-2 lg:mx-4 lg:text-left">
        Net Funding
      </h1>
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-4">
        <div className="bg-gray-900 pt-4 ml-4 shadow-md shadow-indigo-900/80 lg:w-[60%] lg:rounded-xl">
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
              <Area
                type="monotone"
                dataKey="CAPTC_LIQ"
                stroke="rgb(100, 0, 120)"
                fill="url(#customIndigo)"
              ></Area>
              <Tooltip content={<CustomTooltipIndigo />} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:w-[40%] lg:mr-4">
          <PredList title="Net Funding" />
        </div>
      </div>
      <h1 className="my-4 font-semibold text-lg text-center border-b border-black mx-[32vw] lg:indent-2 lg:mx-4 lg:text-left">
        Value - Quota
      </h1>
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-4">
        <div className="bg-gray-900 pt-4 ml-4 box-shadow shadow-md shadow-indigo-900/80 lg:w-[60%] lg:rounded-xl">
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
              <Area
                type="monotone"
                dataKey="VL_QUOTA"
                stroke="rgb(150, 150, 75)"
                strokeWidth={2}
                fill="url(#customYellow)"
              ></Area>
              <Tooltip content={<CustomTooltipYellow />} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:w-[40%] lg:mr-4">
          <PredList title="Value Quota (history)" />
        </div>
      </div>
    </div>
  );
}

function CustomTooltipIndigo({
  active,
  payload,
  label,
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
        <p>
          Net Funding: R$
          {payload[0].payload.CAPTC_LIQ.toFixed(2).toLocaleString("en-US")}
        </p>
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
        <p>
          Quota: R$
          {payload[0].payload.VL_QUOTA.toFixed(2).toLocaleString("en-US")}
        </p>
        {/* {showOptimistic && (
          <p>More 1std: R${payload[0].payload.std1More.toFixed(2)}mln</p>
        )} */}
      </div>
    );
  }
  return <></>;
}
