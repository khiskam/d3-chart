import { scaleLinear } from "d3";
import { create } from "zustand";

import { LineChartState } from "./types";

export const useLineChart = create<LineChartState>(() => ({
  dimensions: { width: 0, height: 0 },
  scales: { x: scaleLinear(), y: scaleLinear() },
  svg: undefined,
  dataset: [],
  isLineDrawed: false,
}));
