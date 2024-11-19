import {
  FilterFormPropsType,
  HistogramControlFormType,
  HistogramSliderInfosType,
  NetFundingHistogramChartPropsType
} from "./netFundingHistogramChartTypes";
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
import {
  lowerLimitOutliersHistogram,
  upperLimitOutliersHistogram,
  sliderInitialInfos
} from "./histogramSettings";
import TitleComponent from "@/components/UI/titleComponent";
import SelFundInfos from "./selFundInfos";
import type {
  AbsOrPctType,
  FinalHistogramDataType
} from "@/utils/types/generalTypes/types";

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
      vol_252: [0, 1],
      QT_DIA_CONVERSAO_COTA: [0, 100],
      QT_DIA_PAGTO_RESGATE: [0, 720],
      NR_COTST: [0, 1000000],
      VL_PATRIM_LIQ: [0, 9000000000],
      CLASSE: "",
    }
  );
  const filterFormProps: FilterFormPropsType = {
    currCnpj,
    isMobile,
    sliderInfos,
    histogramControlForm,
    setHistogramControlForm,
    dataForHistogram,
    setHistogram,
  }

  useEffect(() => {
    if (dataForHistogram.length === 0) {
      return;
    }

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
      sliderInitialInfos,
      setHistogramControlForm,
      setSliderInfos
    });

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
        <TitleComponent>
          Preds. Histogram <br /> (Market comparison)
        </TitleComponent>
      </div>
      <div className="py-4 px-8 flex flex-col gap-8">
        <div>
          <SelFundInfos
            {
              ...{
                currCnpj,
                dataForHistogram,
                sliderInitialInfos
              }
            }
          />
        </div>
        <div className="w-full">
          <FilterForm {...filterFormProps} />
        </div>
        <div className="text-sm text-gray-200 flex relative justify-center lg:text-base lg:justify-start">
          <VisualizationForm {...{ absOrPct, setAbsOrPct }} />
        </div>
        <div className="text-center text-sm lg:text-base lg:text-left">
          <p>
            Funds quantity:
            &nbsp;
            {
              <>
                {
                  histogram[absOrPct].reduce((acc, cE) => {
                    return acc += cE.value;
                  }, 0)
                }
              </>
            }
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div
          className="bg-gray-900 pt-4 mx-2 rounded-sm lg:w-[95%] lg:rounded-xl lg:mx-8"
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
