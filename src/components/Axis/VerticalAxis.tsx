import { axisLeft } from "d3";
import { useId } from "react";

import { useLineChart } from "@/store";

import styles from "./Axis.module.css";

export const VerticalAxis = () => {
  const axisId = useId();

  const { svg, yScale } = useLineChart(({ svg, scales: { y } }) => ({
    svg,
    yScale: y,
  }));

  svg?.select<SVGGElement>(`[id='${axisId}']`).call(axisLeft(yScale));

  return <g id={axisId} className={styles.axis}></g>;
};
