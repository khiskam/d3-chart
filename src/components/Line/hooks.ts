import { curveMonotoneX, easeLinear, line } from "d3";
import { useCallback, useRef } from "react";

import { Actions, useLineChart } from "@/store";
import { Coordinate } from "@/types/Coordinate";

export const useAnimation = () => {
  const played = useRef(false);

  const play = useCallback(
    (path?: d3.Selection<SVGPathElement, Coordinate[], null, undefined>) => {
      const length = path?.node()?.getTotalLength();

      if (!played.current && path && length) {
        path
          .attr("stroke-dasharray", length + " " + length)
          .attr("stroke-dashoffset", length)
          .transition()
          .ease(easeLinear)
          .attr("stroke-dashoffset", 0)
          .duration(1600)
          .on("end", () => {
            path
              ?.attr("stroke-dasharray", null)
              .attr("stroke-dashoffset", null);
            path?.on("end", null);
            Actions.setLineDrawed();
          });

        played.current = true;
      }
    },
    []
  );

  return play;
};
export const usePath = (lineId: string) => {
  const {
    svg,
    scales: { x: xScale, y: yScale },
    dataset,
  } = useLineChart();

  const getPath = useCallback(
    () =>
      svg
        ?.select<SVGPathElement>(`[id='${lineId}']`)
        .datum(dataset)
        .attr(
          "d",
          line<Coordinate>()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))
            .curve(curveMonotoneX)
        ),
    [dataset, svg, xScale, yScale, lineId]
  );

  return getPath;
};
