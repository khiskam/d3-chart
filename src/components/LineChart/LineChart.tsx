import { useId, useRef } from "react";

import { useLineChart } from "@/store";

import { Axis } from "../Axis";
import { Grid } from "../Grid";
import { Line } from "../Line";
import { Tooltip } from "../Tooltip";
import { Margin } from "./constants";
import {
  useDimensions,
  useInit,
  useIntersectionObserver,
  useScales,
} from "./hooks";
import styles from "./LineChart.module.css";
import { LineChartProps } from "./types";

export const LineChart = ({ dataset }: LineChartProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useInit(dataset);
  const rectId = useId();
  const tooltipId = useId();
  const {
    dimensions: { width, height },
  } = useLineChart(({ dimensions }) => ({ dimensions }));

  const isIntersecting = useIntersectionObserver(wrapperRef);
  useScales(rectId);
  useDimensions(wrapperRef);

  console.log(isIntersecting);
  return (
    <div>
      <p id={tooltipId} className={styles.tooltip}>
        x: 0; y: 0
      </p>

      <div className={styles.container} ref={wrapperRef}>
        <svg width="100%" height="100%" ref={svgRef}>
          <g transform={`translate(${Margin.LEFT}, ${Margin.TOP})`}>
            <Grid />
            <Grid horizontal />
            <Axis horizontal />
            <Axis />
            {isIntersecting ? <Line /> : null}
            <Tooltip rectId={rectId} tooltipId={tooltipId} />
            <rect
              id={rectId}
              width={width}
              height={height}
              className={styles.rect}
            ></rect>
          </g>
        </svg>
      </div>
    </div>
  );
};
