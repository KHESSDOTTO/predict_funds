import { FilterFormPropsType, HistogramControlFormType, HistogramSliderInfosType, NetFundingHistogramChartPropsType } from "./netFundingHistogramChartTypes";
import { ClipLoader } from "react-spinners";
import VisualizationForm from "./forms/visualizationForm";
import HistogramTooltip from "./netFundingHistogramChartTooltip";
import HistogramTooltipCursor from "./netFundingHistogramChartCursorTooltip";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import FilterForm from "./forms/filterForm";
import { consoleLog } from "@/utils/functions/genericFunctions";
import { prepareHistogram, initializeSliders, getNumBinsForHistogram } from "./netFundingHistogramFunctions";
import { lowerLimitOutliersHistogram, upperLimitOutliersHistogram } from "./histogramSettings";
import type { AbsOrPctType, FinalHistogramDataType } from "@/utils/types/generalTypes/types";

export default function NetFundingHistogramChart({
  currCnpj,
  smallV,
  isMobile,
  loadingHistogram,
  setLoadingHistogram,
  dataForHistogram = [],
}: NetFundingHistogramChartPropsType) {
  const numBins = getNumBinsForHistogram(isMobile);
  const [absOrPct, setAbsOrPct] = useState<AbsOrPctType>("abs");
  const [histogram, setHistogram] = useState<FinalHistogramDataType>({
    abs: [],
    pct: [],
  });
  const [sliderInfos, setSliderInfos] = useState<HistogramSliderInfosType[]>([]);
  const [histogramControlForm, setHistogramControlForm] = useState<HistogramControlFormType>(
    {
      vol_252: [0, 100],
      QT_DIA_CONVERSAO_COTA: [0, 100],
      QT_DIA_PAGTO_RESGATE: [0, 720],
      NR_COTST: [0, 1000000],
      VL_PATRIM_LIQ: [0, 9000000000],
      // CLASSE_ANBIMA: "",
    }
  );
  const sliderTitles = {
    vol_252: "Volatility",
    QT_DIA_CONVERSAO_COTA: "Quota conversion period",
    QT_DIA_PAGTO_RESGATE: "Redemption period",
    NR_COTST: "Shareholders quantity",
    VL_PATRIM_LIQ: "Net Asset",
    // CLASSE_ANBIMA: "ANBIMA class",
  };
  const filterFormProps: FilterFormPropsType = {
    currCnpj,
    isMobile,
    sliderInfos,
    histogramControlForm,
    dataForHistogram,
    setHistogram,
  }

  consoleLog({ histogramControlForm });

  useEffect(() => {
    if (dataForHistogram.length === 0) {
      return;
    }

    consoleLog({ dataForHistogram });

    const newHistogram = prepareHistogram(
      dataForHistogram,
      numBins,
      currCnpj,
      lowerLimitOutliersHistogram,
      upperLimitOutliersHistogram,
    );

    initializeSliders({
      dataForHistogram,
      histogramControlForm,
      sliderTitles,
      setHistogramControlForm,
      setSliderInfos
    });

    consoleLog({ newHistogram });

    setHistogram(
      newHistogram ?
        newHistogram :
        {
          abs: [],
          pct: []
        }
    );

    setLoadingHistogram(false);

    return;
  }, [dataForHistogram])

  return (
    <div
      id="HistogramDiv"
      className={` ${smallV ? "px-2 lg:w-[48.5%] hidden" : "py-8 w-full"}`}
    >
      <div className="flex justify-center lg:block">
        <h2
          className={`mb-4 p-2 max-w-[75%] ${
            smallV
              ? "text-md w-9/12 mx-auto text-black border-black"
              : "text-lg mx-[16vw] text-white/90 border-white/90"
          } font-semibold text-center border-b lg:pb-2 lg:px-2 lg:mx-4 lg:text-left lg:max-w-full lg:w-full`}
        >
          Preds. Histogram <br /> (Market comparison)
        </h2>
      </div>
      <div className="w-full">
        <FilterForm {...filterFormProps} />
      </div>
      <div className="text-sm text-gray-200 py-6 flex relative justify-center lg:mb-6 lg:pt-4 lg:text-base">
        <VisualizationForm {...{ absOrPct, setAbsOrPct }} />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
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
                data={
                  histogram
                    ? histogram[absOrPct]
                    : []
                }
              >
                <CartesianGrid strokeLinecap="round" strokeWidth={0.5} />
                <XAxis
                  dataKey="xTick"
                  fontSize={isMobile ? 10 : 11}
                  className="text-white"
                  interval={isMobile ? 1 : 0}
                />
                <YAxis
                  width={24}
                />
                <Tooltip
                  content={<HistogramTooltip />}
                  cursor={<HistogramTooltipCursor />}
                />
                <Bar dataKey="value" color="black">
                  {histogram &&
                    histogram[absOrPct]?.map((entry, index) => (
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
  );
}
