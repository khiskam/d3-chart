import { extent, scaleLinear, select } from "d3";

import { Coordinate } from "@/types/Coordinate";

import { useLineChart } from "./store";

export const init = (
  svgRef: React.RefObject<SVGSVGElement>,
  dataset: Coordinate[]
) => {
  useLineChart.setState(() => ({ svg: select(svgRef.current), dataset }));
};

export const setDimensions = (width: number, height: number) => {
  useLineChart.setState(() => ({ dimensions: { width, height } }));
};

export const setScales = (zoom: d3.ZoomTransform) => {
  useLineChart.setState(({ dimensions: { width, height }, dataset }) => {
    const [xMin = 0, xMax = width] = extent(dataset, (d) => d.x);
    const [yMin = 0, yMax = height] = extent(dataset, (d) => d.y);

    const xScale = scaleLinear().range([0, width]).domain([xMin, xMax]);
    const yScale = scaleLinear().range([height, 0]).domain([yMin, yMax]);

    return {
      scales: {
        x: xScale.domain(zoom.rescaleX(xScale).domain()),
        y: yScale.domain(zoom.rescaleY(yScale).domain()),
      },
    };
  });
};

export const setLineDrawed = () => {
  useLineChart.setState(() => ({ isLineDrawed: true }));
};
