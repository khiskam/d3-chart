import { axisBottom } from "d3";
import { useId } from "react";

import { useLineChart } from "@/store";

import styles from "./Axis.module.css";

export const HorizontalAxis = () => {
  const axisId = useId();
  const height = useLineChart(({ dimensions }) => dimensions.height);

  const { svg, xScale } = useLineChart(({ svg, scales: { x } }) => ({
    svg,
    xScale: x,
  }));

  svg
    ?.select<SVGGElement>(`[id='${axisId}']`)
    .call(axisBottom(xScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

  return (
    <g
      id={axisId}
      className={styles.axis}
      transform={`translate(0, ${height})`}
    ></g>
  );
};
