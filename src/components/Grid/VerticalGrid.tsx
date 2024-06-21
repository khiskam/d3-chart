import { useId } from "react";

import { useLineChart } from "@/store";

import styles from "./Grid.module.css";

export const VerticalGrid = () => {
  const id = useId();
  const { width, height, xScale, svg } = useLineChart(
    ({ dimensions: { width, height }, scales: { x }, svg }) => ({
      width,
      height,
      xScale: x,
      svg,
    })
  );

  svg
    ?.select<SVGGElement>(`[id='${id}']`)
    .attr("height", height)
    .attr("width", width)
    .selectAll(`.${styles.grid}`)
    .data(xScale.ticks())
    .join(
      (enter) => enter.append("line").attr("class", styles.grid),
      (update) => update,
      (exit) => exit.remove()
    )
    .attr("x1", (d) => xScale(d))
    .attr("x2", (d) => xScale(d))
    .attr("y2", height);

  return <g id={id} width={width} height={height}></g>;
};
