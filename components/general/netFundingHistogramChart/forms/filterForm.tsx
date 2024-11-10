import { useMemo } from 'react';
import DualRangeSliderWithTippy from '@/components/UI/dualRangeSliderWithTippy';
import type { FilterFormPropsType, HandleSubmitParamsType } from '../netFundingHistogramChartTypes';
import { prepareDualRangeSlidersData } from '../netFundingHistogramFunctions';
import ButtonIndigo from '@/components/UI/buttonIndigo';
import { handleSubmit } from './filterFormHandlers';
import { consoleLog } from '@/utils/functions/genericFunctions';

export default function FilterForm ({
  currCnpj,
  isMobile,
  sliderInfos,
  dataForHistogram,
  histogramControlForm,
  setHistogram,
}: FilterFormPropsType) {
  const { titles, dualRangeSliderWithTippyProps } = useMemo(() =>
    prepareDualRangeSlidersData({ sliderInfos })
  , [sliderInfos, histogramControlForm]);
  const handleSubmitArgs: HandleSubmitParamsType = {
    currCnpj,
    isMobile,
    dataForHistogram,
    histogramControlForm,
    setHistogram,
  }

  return (
    <form className='relative p-4 flex flex-col lg:flex-row items-start lg:items-stretch gap-4 lg:gap-12'>
      <h3 className='ml-6 mb-2 lg:ml-0 text-lg px-2'>Filters:</h3>
      <div className='w-full flex flex-col items-center gap-4 lg:gap-8 lg:w-fit lg:items-center justify-center'>
      {
        titles.map((title, currIndex) => {
          const propdToDualRangeSlider = dualRangeSliderWithTippyProps[currIndex];
          consoleLog({ propdToDualRangeSlider });

          return (
            <div className='flex flex-col w-fit'>
              <h4 className='mb-2 px-1 lg:m-0 lg:relative top-1'>
                {title}
              </h4>
              <DualRangeSliderWithTippy {...{ ...dualRangeSliderWithTippyProps[currIndex], controlForm: histogramControlForm }} />
            </div>
          )
        })
      }
      </div>
      <div className='hidden lg:flex ml-8'>
        <div
          className='flex px-4 items-center border-l-2 hover:border-yellow-600 hover:text-yellow-600 transition-all duration-300 hover:cursor-pointer'
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(handleSubmitArgs)}}
        >
          <span>Apply</span>
        </div>
      </div>
      <div
        className='flex w-full justify-center items-center lg:hidden'
        onClick={(e) => {
          e.preventDefault();
          handleSubmit(handleSubmitArgs)
        }} 
      >
        <ButtonIndigo shadowColor='white/30' shadowSize='sm'>
          Apply
        </ButtonIndigo>
      </div>
    </form>
  );
};
