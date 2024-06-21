import { useId } from "react";

import { useLineChart } from "@/store";

import styles from "./Grid.module.css";

export const HorizontalGrid = () => {
  const id = useId();
  const { width, height, yScale, svg } = useLineChart(
    ({ dimensions: { width, height }, scales: { y }, svg }) => ({
      width,
      height,
      yScale: y,
      svg,
    })
  );

  svg
    ?.select<SVGGElement>(`[id='${id}']`)
    .attr("height", height)
    .attr("width", width)
    .selectAll(`.${styles.grid}`)
    .data(yScale.ticks())
    .join(
      (enter) => enter.append("line").attr("class", styles.grid),
      (update) => update,
      (exit) => exit.remove()
    )
    .attr("y1", (d) => yScale(d))
    .attr("y2", (d) => yScale(d))
    .attr("x2", width);

  return <g id={id} width={width} height={height}></g>;
};
