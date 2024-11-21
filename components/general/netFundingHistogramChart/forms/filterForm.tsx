import { useMemo } from 'react';
import DualRangeSliderWithTippy from '@/components/UI/dualRangeSliderWithTippy';
import type {
  FilterFormPropsType,
  HandleSubmitStaticParamsType,
  HandleSubmitParamsType
} from '../netFundingHistogramChartTypes';
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
  setHistogramControlForm,
  setHistogram,
}: FilterFormPropsType) {
  const { titles, dualRangeSliderWithTippyProps } = useMemo(() =>
    prepareDualRangeSlidersData({ sliderInfos })
  , [sliderInfos, histogramControlForm]);
  const handleSubmitArgs: HandleSubmitStaticParamsType = {
    currCnpj,
    isMobile,
    dataForHistogram,
    histogramControlForm,
    setHistogram,
  }

  return (
    <form className='w-fit max-w-full'>
      <h3 className='mx-auto lg:mb-4 lg:mr-0 text-lg'>
        Filters:
      </h3> 
      <div className='relative flex flex-col items-start lg:items-stretch gap-4 lg:px-2'>
        <div className='w-full flex flex-col items-center gap-4 lg:gap-2 lg:w-fit lg:items-center justify-center'>
          <div className='mt-4 lg:mt-0 flex items-center gap-4 lg:w-full'>
            <h4>
              CVM Class:
            </h4>
            <select
              className='text-black rounded-full px-4 py-1'
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
                <div className='flex flex-col w-fit'>
                  <h4 className='mb-2 px-1 lg:m-0 lg:relative top-1'>
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
        {/* <div className='hidden lg:flex ml-24'>
          <div
            className='flex px-4 items-center border-l-2 hover:border-yellow-600 hover:text-yellow-600 transition-all duration-300 hover:cursor-pointer'
            onClick={(e) => {
              handleSubmit({ e, ...handleSubmitArgs })
            }}
          >
            <span>Apply</span>
          </div>
        </div> */}
        <div
          className='flex w-full justify-center items-center lg:relative lg:right-[120px]'
          onClick={(e) => {
            handleSubmit({ e, ...handleSubmitArgs })
          }} 
        >
          <ButtonIndigo shadowColor='white/30' shadowSize='sm'>
            Apply
          </ButtonIndigo>
        </div>
      </div>
    </form>
  );
};
