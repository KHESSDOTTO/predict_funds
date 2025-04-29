import { useEffect, useState } from "react";
import { UnifiedDataPredsType } from "./netFundingPredChartTypes";
import {
  AbsOrPctNFFieldsType,
  AbsOrPctType,
} from "@/utils/types/generalTypes/types";
import { NFTooltip } from "./netFundingPredChartTooltip";
import { handleAbsOrPctChange } from "./forms/absOrPctPredsViewFormFunctions";
import { format } from "date-fns";
import {
  adjustNetFundingChartAxis,
  exportNetFundingPred,
  prepareChartNFData,
  yAxisTickFormats,
} from "./netFundingPredChartFunctions";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  ResponsiveContainer,
  Line,
  ReferenceLine,
  ComposedChart,
} from "recharts";
import PredList from "../predList";
import AbsOrPctPredsViewForm from "./forms/absOrPctPredsViewForm";
import type { NetFundingPredChartPropsType } from "./netFundingPredChartTypes";
import { consoleLog } from "@/utils/functions/genericFunctions";
import ButtonGreen from "@/components/UI/buttonGreen";
import { track } from "@vercel/analytics";
import { useUser } from "@/contexts/userContext";
import { formatterBrNumber, formatterPct } from "@/utils/numberFormatters";

export default function NetFundingPredChart({
  title = "Net Funding",
  historic,
  predictions,
  smallV,
  isMobile,
  predList = true,
  exportPosition = "bottom",
}: NetFundingPredChartPropsType) {
  const { user } = useUser();
  const [domainYaxisNF, setDomainYaxisNF] = useState<number[]>([-100, 100]);
  const [ticksYaxisNF, setTicksYaxisNF] = useState<number[]>([]);
  const [unifiedNFData, setUnifiedNFData] = useState<UnifiedDataPredsType[]>([
    ...historic,
  ]);
  const [gradientOffset, setGradientOffset] = useState<number>(1);
  const [absOrPct, setAbsOrPct] =
    useState<AbsOrPctNFFieldsType>("CAPTC_LIQ_ABS_ms");
  const [absOrPctShort, setAbsOrPctShort] = useState<AbsOrPctType>("abs");
  const formArgs = {
    absOrPct,
    setAbsOrPct,
    setAbsOrPctShort,
    handleAbsOrPctChange,
  };

  useEffect(() => {
    if (historic.length === 0 || predictions.length === 0) {
      return;
    }

    const adjustNetFundingChartAxisArgs = {
      historic,
      absOrPct,
      predictions,
      setDomainYaxisNF,
      setTicksYaxisNF,
    };
    const axisAdjustmentSuccessfull = adjustNetFundingChartAxis(
      adjustNetFundingChartAxisArgs
    );

    if (axisAdjustmentSuccessfull) {
      const prepareChartNFDataArgs = {
        historic,
        predictions,
        setUnifiedNFData,
        setGradientOffset,
      };

      prepareChartNFData(prepareChartNFDataArgs);
    }
  }, [historic, predictions, absOrPct]);

  return (
    <div
      id="NetFundingDiv"
      className={`
        relative
        ${smallV ? "pt-4 lg:w-[45%]" : "w-full"}
        ${exportPosition === "bottom" ? "lg:pb-14" : ""}  
      `}
    >
      <div className="flex justify-center lg:block">
        <h2
          className={`mb-4 ${
            smallV
              ? "text-md w-9/12 mx-auto text-black border-black"
              : "text-lg w-full p-2 border-b-2 text-white/90 border-white/90"
          } font-semibold text-center border-b lg:pb-2 lg:max-w-full lg:px-4 lg:mx-0 lg:text-left`}
        >
          {typeof title === "string" && title}
          {typeof title === "object" &&
            title.map((cE, cI) => {
              return (
                <>
                  {cI > 0 && <br />}
                  <span>{cE}</span>
                </>
              );
            })}
        </h2>
      </div>

      {!smallV && (
        <div className="text-sm text-gray-200 mb-6 mt-2 lg:mt-6 flex relative justify-center lg:text-base">
          <AbsOrPctPredsViewForm {...formArgs} />
          {exportPosition === "right" && (
            <div
              className="scale-90 lg:block absolute right-8 bottom-[50%] translate-y-[50%]"
              onClick={() => {
                track("export_nf_pred_chart", {
                  username: user?.username || null,
                });
                exportNetFundingPred({ historic, predictions });
              }}
            >
              <ButtonGreen shadowColor="white/30" shadowSize="md">
                Export
              </ButtonGreen>
            </div>
          )}
        </div>
      )}

      <div className={`flex flex-col gap-4 lg:flex-row`}>
        <div
          className={`bg-gray-800 px-1 pt-4 rounded-xl overflow-hidden relative ${
            (smallV ? "lg:w-full lg:h-[250px]" : "lg:h-[412px]") +
            (predList ? " lg:w-[60%]" : " w-full")
          }`}
        >
          <ResponsiveContainer
            height={smallV ? 240 : isMobile ? 300 : 400}
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
                  return absOrPct === "CAPTC_LIQ_ABS_ms"
                    ? yAxisTickFormats(num, "abs")
                    : yAxisTickFormats(num, "pct");
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
                `CI95_${absOrPctShort.toUpperCase()}_limits`,
                `CI99_${absOrPctShort.toUpperCase()}_limits`,
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

              <ReferenceLine y={0} stroke="white" strokeWidth={2} />
              <ReferenceLine
                x={
                  unifiedNFData[historic.length - 1]
                    ? Number(unifiedNFData[historic.length - 1]["DT_COMPTC"])
                    : 1000
                }
                stroke="orange"
                strokeWidth={2}
              />

              <Tooltip
                content={
                  <NFTooltip
                    data={unifiedNFData}
                    absOrPct={absOrPct}
                    numWeeksPreds={predictions.length}
                  />
                }
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {!smallV &&
          predictions.length &&
          predictions[0]["mean"] &&
          historic.length &&
          historic[historic.length - 1]["VL_PATRIM_LIQ_ms"] && (
            <>
              <div className="my-2 lg:hidden text-center">
                * Average daily prediction error on this fund:&nbsp;
                <span className="font-bold ml-2">
                  {`R$ ${formatterBrNumber.format(
                    predictions[0]["mean"]
                  )} (~${formatterPct.format(
                    (predictions[0]["mean"] /
                      historic[historic.length - 1]["VL_PATRIM_LIQ_ms"]) *
                      100
                  )}% of Net Asset)`}
                </span>
              </div>
            </>
          )}
        {!smallV && exportPosition === "bottom" && (
          <div
            className="text-center lg:absolute lg:left-0 lg:bottom-0"
            onClick={() => {
              track("export_nf_pred_chart", {
                username: user?.username || null,
              });
              exportNetFundingPred({ historic, predictions });
            }}
          >
            <ButtonGreen shadowColor="white/30" shadowSize="md">
              Export
            </ButtonGreen>
          </div>
        )}

        {!smallV && predList && (
          <div className="hidden lg:block mt-1 lg:w-[40%] lg:ml-2">
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
      {!smallV &&
        predictions.length &&
        predictions[0]["mean"] &&
        historic.length &&
        historic[historic.length - 1]["VL_PATRIM_LIQ_ms"] && (
          <div className="mt-6 hidden lg:block">
            * Average daily prediction error on this fund:&nbsp;
            <span className="font-bold ml-2">
              {`R$ ${formatterBrNumber.format(
                predictions[0]["mean"]
              )} (~${formatterPct.format(
                (predictions[0]["mean"] /
                  historic[historic.length - 1]["VL_PATRIM_LIQ_ms"]) *
                  100
              )}% of Net Asset)`}
            </span>
          </div>
        )}
    </div>
  );
}
