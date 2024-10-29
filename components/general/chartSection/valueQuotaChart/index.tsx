import { useState } from "react";
import { ValueQuotaChartPropsType } from "./valueQuotaChartTypes";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

export default function ValueQuotaChart({
  smallV,
  isMobile,
  historic,
}: ValueQuotaChartPropsType) {
  const [domainYaxisVQ, setDomainYaxisVQ] = useState<number[]>([0, 100]);
  const [ticksYaxisVQ, setTicksYaxisVQ] = useState<number[]>([]);

  return (
    <div
      id="ValueQuotaDiv"
      className={` ${smallV ? "pb-2 lg:w-[48.5%]" : "pb-4 w-full"}`}
    >
      {!smallV}
      <div className={`flex justify-center lg:block`}>
        <h2
          className={`mb-4 p-2 ${
            smallV
              ? "text-md w-9/12 mx-auto text-black border-black"
              : "text-lg mx-[16vw] text-white/90 border-white/90"
          } font-semibold text-center border-b lg:pb-2 lg:px-2 lg:mx-4 lg:text-left`}
        >
          Value - Quota
          <span className={`italic ${smallV ? "text-xs" : "text-sm"}`}>
            {" "}
            (historic)
          </span>
        </h2>
      </div>
      <div
        className={`flex flex-col gap-4 lg:flex-row ${
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
              <Tooltip content={<ValueQuotaTooltip />} />
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
  );
}
