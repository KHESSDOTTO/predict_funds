import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import Tippy from '@tippyjs/react';
import { useState, useEffect } from 'react';
import type { DualRangeSliderWithTippyPropsType } from './dualRangesWithTippyTypes';
import { consoleLog } from '@/utils/functions/genericFunctions';

export default function DualRangeSliderWithTippy ({
  minValSlider,
  maxValSlider,
  step,
  controlForm,
  controlFormKey,
  setControlForm,
}: DualRangeSliderWithTippyPropsType) {
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [selRange, setSelRange] = useState<number | number[]>(controlForm[controlFormKey]);

  consoleLog({ controlFormKey });
  consoleLog({ controlForm });
  consoleLog({ selRange });

  useEffect(() => {
    setSelRange(controlForm[controlFormKey]);
  }, [controlForm])

  if (typeof selRange === "number") {
    return (<></>);
  }

  return (
    <>
      <div className="w-72 overflow-hidden lg:px-2 lg:w-[440px] flex gap-4">
        <div
            className='relative p-4 w-full flex items-center overflow-hidden'
            onMouseEnter={() => setTooltipVisible(true)}
            onTouchStart={() => setTooltipVisible(true)}
            onTouchMove={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
            onTouchEnd={() => setTooltipVisible(false)}
        >
          <Tippy
              className='lg:hidden'
              content={`Lower: ${selRange[0].toFixed(2)}`}
              placement="bottom"
              visible={tooltipVisible}
          >
              <div
                  style={{
                    position: 'absolute',
                    left: `${(selRange[0] / maxValSlider) * 100}%`,
                    bottom: 4,
                    transform: 'translateX(-50%)',
                  }}
              />
          </Tippy>
          <Tippy
              className='lg:hidden'
              content={`Higher: ${selRange[1].toFixed(2)}`}
              placement="bottom"
              visible={tooltipVisible}
          >
              <div
                  style={{
                    position: 'absolute',
                    left: `${(selRange[1] / maxValSlider) * 100}%`,
                    bottom: 4,
                    transform: 'translateX(-50%)',
                  }}
              />
          </Tippy>
          <Slider
            range
            min={minValSlider}
            max={maxValSlider}
            step={step}
            value={selRange}
            onChange={(newSelRange) => {setControlForm({...controlForm, [controlFormKey]: newSelRange})}}
            styles={{
            track: {
                backgroundColor: '#3b82f6',
                height: 8
            },
            rail: {
                height: 8
            },
            handle: {
                opacity: 0.95,
                backgroundColor: 'white',
                borderColor: '#3b82f6',
                top: 4,
                height: 20,
                width: 20,
            },
            }}
          />
        </div>
        <div className="hidden lg:flex px-4 gap-1 flex-col">
            <p className='flex'>
                <span className='mr-1'>Lower:</span> {selRange[0]}
            </p>
            <p className='flex'>
                <span className='mr-1'>Higher:</span> {selRange[1]}
            </p>
        </div>
      </div>
    </>
  );
};
