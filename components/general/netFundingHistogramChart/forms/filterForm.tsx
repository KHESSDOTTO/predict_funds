import { useMemo } from 'react';
import DualRangeSliderWithTippy from '@/components/UI/dualRangeSliderWithTippy';
import type {
  FilterFormPropsType,
  HandleSubmitStaticParamsType,
} from '../netFundingHistogramChartTypes';
import { prepareDualRangeSlidersData } from '../netFundingHistogramFunctions';
import ButtonIndigo from '@/components/UI/buttonIndigo';
import { handleSubmit } from './filterFormHandlers';
import { track } from '@vercel/analytics';
import { useUser } from '@/contexts/userContext';

export default function FilterForm ({
  currCnpj,
  isMobile,
  sliderInfos,
  sliderInitialInfos,
  dataForHistogram,
  histogramControlForm,
  setCurrAppliedFilters,
  setHistogramControlForm,
  setHistogram,
}: FilterFormPropsType) {
  const { user } = useUser();
  const { titles, dualRangeSliderWithTippyProps } = useMemo(() =>
    prepareDualRangeSlidersData({ sliderInfos })
  , [sliderInfos, histogramControlForm]);
  const handleSubmitArgs: HandleSubmitStaticParamsType = {
    currCnpj,
    isMobile,
    dataForHistogram,
    histogramControlForm,
    sliderInitialInfos,
    setCurrAppliedFilters,
    setHistogram,
  }

  return (
    <form className='w-full flex flex-col items-center lg:w-fit max-w-full'>
      <h3 className='mx-auto mb-2 lg:mb-4 lg:mr-0 lg:w-full text-lg'>
        Filters:
      </h3>
      <div className='relative flex flex-col items-start lg:items-stretch gap-4 w-full lg:w-fit lg:px-2'>
        <div className='w-full flex flex-col items-center gap-4 lg:gap-2 lg:w-fit lg:items-center justify-center'>
          <div className='mt-4 mb-2 lg:my-0 flex items-center gap-4 lg:w-full'>
            <h4>
              CVM Class:
            </h4>
            <select
              className='cursor-pointer text-black rounded-full px-4 py-1'
                name='CLASSE'
                value={histogramControlForm['CLASSE']}
                onChange={(e) => setHistogramControlForm({
                  ...histogramControlForm,
                  [e.target.name]: e.target.value
                })}
            >
              <option value=''>All</option>
              <option value='Ações'>Ações</option>
              <option value='Multimercado'>Multimercado</option>
              <option value='Renda Fixa'>Renda Fixa</option>
            </select>
          </div>
          
          {
            titles.map((title, currIndex) => {
              const propsToDualRangeSlider = dualRangeSliderWithTippyProps[currIndex];

              return (
                <div key={title} className='flex flex-col w-fit'>
                  <h4 className='mb-0 text-base text-center lg:text-left lg:text-sm px-1 lg:m-0 lg:relative top-1'>
                    {title}
                  </h4>
                  <DualRangeSliderWithTippy
                    {
                      ...{
                        ...propsToDualRangeSlider,
                        controlForm: histogramControlForm
                      }
                    }
                  />
                </div>
              )
            })
          }
        </div>
        <div
          className='flex w-full justify-center items-center lg:mt-2'
          onClick={(e) => {
            track('updated_histogram_filter', { username: user?.username || null });
            handleSubmit({ e, ...handleSubmitArgs });
          }} 
        >
          <ButtonIndigo shadowColor='white/30' shadowSize='md'>
            Apply
          </ButtonIndigo>
        </div>
      </div>
    </form>
  );
};
