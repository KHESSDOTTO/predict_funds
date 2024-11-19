import { Dispatch, SetStateAction } from "react";

interface DualRangeSliderWithTippyPropsType {
    minValSlider: number;
    maxValSlider: number;
    step: number;
    controlForm: any;
    controlFormKey: number | string;
    setControlForm: Dispatch<SetStateAction<any>>;
    formatterFunction: (number: number) => string | number;
}

export type {
  DualRangeSliderWithTippyPropsType,
}
