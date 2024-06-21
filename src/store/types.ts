import { Dimensions } from "@/types";
import { Coordinate } from "@/types/Coordinate";

export type Scales = {
  x: d3.ScaleLinear<number, number>;
  y: d3.ScaleLinear<number, number>;
};

export type LineChartState = {
  dimensions: Dimensions;
  scales: Scales;
  svg?: d3.Selection<SVGSVGElement | null, unknown, null, undefined>;
  dataset: Coordinate[];
  isLineDrawed: boolean;
};
