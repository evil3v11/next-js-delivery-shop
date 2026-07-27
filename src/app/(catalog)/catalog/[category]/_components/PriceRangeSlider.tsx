"use client";

import { PriceRangeSliderProps } from "@/types/priceRangeSliderProps";

import "rc-slider/assets/index.css";
import Slider from "rc-slider";

const PriceRangeSlider = ({
  priceRange,
  values,
  onChangeSliderAction,
}: PriceRangeSliderProps) => {
  return (
    <div className="w-[320px] xl:w-[272px] px-2 mx-auto">
      <Slider
        range
        min={priceRange.min}
        max={priceRange.max}
        value={values}
        onChange={(vals) =>
          Array.isArray(vals) && onChangeSliderAction(vals as [number, number])
        }
        styles={{
          track: {
            backgroundColor: "#70c05b",
            height: 4,
          },
          handle: {
            width: 20,
            height: 20,
            backgroundColor: "#70c05b",
            border: "1px solid #fff",
            borderRadius: "50%",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            marginTop: -8,
            cursor: "pointer",
            opacity: 1,
          },
          rail: {
            backgroundColor: "#f0f0f0",
            height: 4,
          },
        }}
      />
    </div>
  );
};

export default PriceRangeSlider;
