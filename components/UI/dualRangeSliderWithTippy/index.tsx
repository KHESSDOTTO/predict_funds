import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import Tippy from '@tippyjs/react';
import { useState, useRef } from 'react';

export default function DualRangeSliderWithTippy () {
  const [range, setRange] = useState<number | number[]>([10, 90]);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);

  return (
    <>
    { typeof range !== "number" &&

      <div className="w-72 lg:w-[440px] flex gap-4">
        <div
            className='relative w-full flex items-center'
            onMouseEnter={() => setTooltipVisible(true)}
            onTouchStart={() => setTooltipVisible(true)}
            onTouchMove={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
            onTouchEnd={() => setTooltipVisible(false)}
        >
          <Tippy
              className='lg:hidden'
              content={`Lower: ${range[0]}`}
              placement="bottom"
              visible={tooltipVisible}
          >
              <div
                  style={{
                    position: 'absolute',
                    left: `${range[0]}%`,
                    bottom: 4,
                    transform: 'translateX(-50%)',
                  }}
              />
          </Tippy>
          <Tippy
              className='lg:hidden'
              content={`Higher: ${range[1]}`}
              placement="bottom"
              visible={tooltipVisible}
          >
              <div
                  style={{
                    position: 'absolute',
                    left: `${range[1]}%`,
                    bottom: 4,
                    transform: 'translateX(-50%)',
                  }}
              />
          </Tippy>
          <Slider
            range
            min={0}
            max={100}
            step={1}
            value={range}
            onChange={(newRange) => setRange(newRange as number[])}
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
                <span className='mr-1'>Lower:</span> {range[0]}
            </p>
            <p className='flex'>
                <span className='mr-1'>Higher:</span> {range[1]}
            </p>
        </div>
      </div>
    }
    </>
  );
};
