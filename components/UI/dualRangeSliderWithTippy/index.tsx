import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import Tippy from "@tippyjs/react";
import { useState, useEffect } from "react";
import type { DualRangeSliderWithTippyPropsType } from "./dualRangesWithTippyTypes";

export default function DualRangeSliderWithTippy({
  minValSlider,
  maxValSlider,
  step,
  controlForm,
  controlFormKey,
  setControlForm,
  formatterFunction,
}: DualRangeSliderWithTippyPropsType) {
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [selRange, setSelRange] = useState<number | number[]>(
    controlForm[controlFormKey]
  );

  useEffect(() => {
    setSelRange(controlForm[controlFormKey]);
  }, [controlForm]);

  if (typeof selRange === "number") {
    return <></>;
  }

  return (
    <>
      <div className="w-72 px-4 overflow-hidden flex flex-col lg:px-[10px] lg:w-[360px] lg:relative">
        <div
          className="relative py-4 w-full flex items-center"
          onMouseEnter={() => setTooltipVisible(true)}
          onTouchStart={() => setTooltipVisible(true)}
          onTouchMove={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
          onTouchEnd={() => setTooltipVisible(false)}
        >
          <Tippy
            className="lg:hidden"
            content={`Lower: ${formatterFunction(selRange[0])}`}
            placement="top"
            visible={tooltipVisible}
          >
            <div
              style={{
                position: "absolute",
                left: `${(selRange[0] / maxValSlider) * 100}%`,
                top: 4,
              }}
            />
          </Tippy>
          <Tippy
            className="lg:hidden"
            content={`Higher: ${
              formatterFunction(selRange[1]) +
              (selRange[1] == maxValSlider ? " +" : "")
            }`}
            placement="top"
            visible={tooltipVisible}
          >
            <div
              style={{
                position: "absolute",
                left: `${(selRange[1] / maxValSlider) * 100}%`,
                top: 4,
              }}
            />
          </Tippy>
          <Slider
            range
            min={minValSlider}
            max={maxValSlider}
            step={step}
            value={selRange}
            onChange={(newSelRange) => {
              setControlForm({ ...controlForm, [controlFormKey]: newSelRange });
            }}
            styles={{
              track: {
                backgroundColor: "#3b82f6",
                height: 8,
              },
              rail: {
                height: 8,
              },
              handle: {
                opacity: 0.95,
                backgroundColor: "white",
                borderColor: "#3b82f6",
                top: 4,
                height: 20,
                width: 20,
              },
            }}
          />
        </div>
        <div className="hidden lg:block h-4 w-full relative justify-center text-xs px-4 overflow-hidden">
          <div className="absolute flex w-fit bottom-0 right-[50%] translate-x-[50%]">
            <p className="flex whitespace-nowrap overflow-visible mr-2">
              <span className="mr-1">Lower:</span>
              <span>{formatterFunction(selRange[0])}</span>
            </p>
            <p className="flex whitespace-nowrap overflow-visible relative">
              <span className="mr-1">Higher:</span>
              <span>{formatterFunction(selRange[1])}</span>
              {selRange[1] == maxValSlider && (
                <span className="absolute bottom-[50%] translate-y-[50%] left-[102%]">
                  +
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
