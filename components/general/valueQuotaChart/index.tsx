import { useState, useEffect } from "react";
import { ValueQuotaChartPropsType } from "./valueQuotaChartTypes";
import { format } from "date-fns";
import { adjustValueQuotaChartAxis, exportValueQuota } from "./valueQuotaChartFunctions";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import PredList from "@/components/general/predList";
import ValueQuotaTooltip from "./valueQuotaChartTooltip";
import ButtonGreen from "@/components/UI/buttonGreen";
import { track } from "@vercel/analytics";
import { useUser } from "@/contexts/userContext";

export default function ValueQuotaChart({
  smallV,
  isMobile,
  historic,
}: ValueQuotaChartPropsType) {
  const { user } = useUser();
  const [domainYaxisVQ, setDomainYaxisVQ] = useState<number[]>([0, 100]);
  const [ticksYaxisVQ, setTicksYaxisVQ] = useState<number[]>([]);
  const adjustVQAxisArgs = {
    historic,
    setDomainYaxisVQ,
    setTicksYaxisVQ,
  };

  useEffect(() => {
    if (historic.length === 0) {
      return;
    }

    adjustValueQuotaChartAxis(adjustVQAxisArgs);
  }, [historic]);

  return (
    <div
      id="ValueQuotaDiv"
      className={` ${smallV ? "pt-4 lg:w-[45%]" : "pb-4 w-full"}`}
    >
      {!smallV}
      <div className={`flex justify-center lg:block`}>
        <h2
          className={`mb-4 p-2 ${
            smallV
              ? "pt-0 text-md w-9/12 mx-auto text-black border-b border-black"
              : "text-lg mx-2 w-full border-b-2 text-white/90 border-white/90"
          } font-semibold text-center lg:border-b lg:pb-2 lg:px-4 lg:mx-0 lg:text-left`}
        >
          Value - Quota
          <span className={`italic ${smallV ? "text-xs" : "text-sm"}`}>
            {" "}
            (historic)
          </span>
        </h2>
      </div>
      <div
        className={`flex flex-col lg:relative lg:pb-12 gap-4 lg:flex-row ${
          smallV ? "" : "lg:mx-6 lg:mt-6"
        }`}
      >
        <div
          className={`bg-gray-800 pt-4 pr-2 rounded-xl ${
            smallV ? "lg:w-full lg:h-[250px]" : "lg:w-[60%] lg:h-[412px]"
          }`}
        >
          <ResponsiveContainer height={smallV ? 240 : isMobile ? 300 : 400}>
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
              <CartesianGrid stroke="rgb(170, 150, 255)" strokeWidth={0.3} />
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
        {
          ! smallV &&
          (
            <div
              className="text-end mt-2 ml-1 hidden lg:block absolute bottom-0 left-0"
              onClick={
                () => {
                  track('export_value_quota', { username: user?.username || null });
                  exportValueQuota({ historic })
                }
              }
            >
              <ButtonGreen shadowColor="white/30" shadowSize="md">
                Export
              </ButtonGreen>
            </div>
          )
        }

        </div>

        {
          ! smallV &&
          (
            <>
              <div
                className="text-center lg:hidden" 
                onClick={
                  () => {
                    track('export_value_quota', { username: user?.username || null });
                    exportValueQuota({ historic })
                  }
                }
            >
                <ButtonGreen shadowColor="white/30" shadowSize="md">
                  Export
                </ButtonGreen>
              </div>
              <div className="lg:px-4 mt-1 lg:w-[40%] lg:mr-4">
                <PredList
                  title="Value Quota (history)"
                  onlyBack={true}
                  historic={historic}
                  varName={"VL_QUOTA_ms"}
                />
              </div>
            </>
          )
        }

      </div>
    </div>
  );
}
