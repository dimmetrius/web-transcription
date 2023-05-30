import { FC } from "react";
import styles from "./PlayerRange.module.css";

interface Props {
  minValue: number;
  maxValue: number;
  step: number;
  value: number;
  onChange: (newVal: number) => void;
}

export const PlayerRange: FC<Props> = ({
  minValue,
  maxValue,
  step,
  value,
  onChange,
}) => {
  const _onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = parseFloat(event.target.value || "0");
    if (onChange) {
      onChange(newValue);
    }
  };
  const gradValue = Math.round((value / maxValue) * 100);
  const style = {
    borderRadius: "6px",
    background:
      "linear-gradient(90deg,#214459 " +
      gradValue +
      "%,#306785 " +
      (gradValue + 1) +
      "%)",
  };

  return (
    <input
      className={styles.slider}
      type="range"
      min={minValue}
      max={maxValue}
      step={step}
      value={value}
      onChange={_onChange}
      style={style}
    ></input>
  );
};
