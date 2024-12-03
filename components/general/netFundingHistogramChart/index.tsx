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
import { prepareHistogram, initializeSliders, getNumBinsForHistogram, exportHistogram } from "./netFundingHistogramFunctions";
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
import ButtonGreen from "@/components/UI/buttonGreen";
import OptionButtonGreen from "@/components/UI/optionButtonGreen";

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
      NR_COTST: [0, 100000],
      VL_PATRIM_LIQ: [0, 9999999999],
      CLASSE: "",
    }
  );
  const filterFormProps: FilterFormPropsType = {
    currCnpj,
    isMobile,
    sliderInitialInfos,
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
      className={` ${smallV ? "px-2 lg:w-[48.5%] hidden" : "w-full"}`}
    >
      <div className="flex justify-center lg:block">
        <TitleComponent>
          Preds. Histogram <br /> (Market comparison)
        </TitleComponent>
      </div>

      {
        loadingHistogram ?
          (
            <div className="flex flex-col h-full relative items-center justify-center">
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
          )

          :

          (
            <>
              <div className="py-4 px-4 lg:px-8 flex flex-col lg:flex-row gap-6 lg:gap-12">
                <div className="flex flex-col gap-6">
                  <div className="relative">
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
                  <div className="w-full lg:w-fit">
                    <FilterForm { ...filterFormProps } />
                  </div>
                </div>
                <div className="flex flex-grow flex-col lg:flex-row">
                  <div className="flex mt-2 flex-col w-full lg:mt-0 lg:relative">
                    <div className="text-sm lg:px-1 py-4 lg:pt-0 lg:text-gray-200 flex relative justify-center lg:text-base lg:justify-start">
                      <VisualizationForm { ...{ absOrPct, setAbsOrPct } } />
                    </div>
                    <div className="hidden lg:block text-center text-gray-400 text-sm lg:text-base lg:text-left lg:absolute lg:top-2 lg:right-1">
                      <p>
                        Funds count:
                        &nbsp;
                        {
                          <>
                            { histogram[absOrPct].reduce((acc, cE) => (acc += cE.value), 0) }
                          </>
                        }
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 lg:pb-6 relative">
                      <div
                        className="bg-gray-900 pt-4 rounded-sm lg:w-full lg:rounded-xl relative"
                      >
                        <ResponsiveContainer
                          height={smallV ? 200 : isMobile ? 350 : 700}
                          minWidth={250}
                        >
                          <BarChart
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
                              width={isMobile ? 36 : 48}
                              tickCount={8}
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
                        <div className="block lg:hidden text-gray-400 text-base absolute bottom-[-8px] right-[50%] translate-x-[50%]">
                          <p>
                            Funds count:
                            &nbsp;
                            {
                              <>
                                { histogram[absOrPct].reduce((acc, cE) => (acc += cE.value), 0) }
                              </>
                            }
                          </p>
                        </div>
                      </div>
                      <div
                        onClick={() => exportHistogram({ histogram })}
                        className="
                          lg:absolute lg:right-[50%] 0lg:translate-x-[50%] lg:block lg:w-fit
                          mt-4 bottom-0 w-full flex justify-center
                        "
                      >
                        <ButtonGreen shadowColor="white/30" shadowSize="md">
                          Export
                        </ButtonGreen>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
      }

    </div>
  );
}
