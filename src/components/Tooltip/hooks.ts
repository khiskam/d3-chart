import { bisector, pointer, select } from "d3";
import { useCallback, useId } from "react";

import { useLineChart } from "@/store";
import { Coordinate } from "@/types";

export const useMouseEvents = (tooltipId: string) => {
  const { isLineDrawed } = useLineChart(({ isLineDrawed }) => ({
    isLineDrawed,
  }));

  const { setTooltip, resetTooltip } = useTooltip(tooltipId);
  const {
    showTooltipCircle,
    hideTooltipCircle,
    id: pointerId,
  } = useTooltipPointer();
  const { showTooltipLineX, hideTooltipLineX, id: lineXId } = useTooltipLineX();
  const { showTooltipLineY, hideTooltipLineY, id: lineYId } = useTooltipLineY();
  const getPosition = usePosition();

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isLineDrawed) return;
      const { inViewport, position, data } = getPosition(e);

      if (inViewport) {
        showTooltipLineX(position.x);
        showTooltipLineY(position.y);
        showTooltipCircle(position);
        setTooltip(data);
      }
    },
    [
      isLineDrawed,
      setTooltip,
      showTooltipCircle,
      showTooltipLineX,
      showTooltipLineY,
      getPosition,
    ]
  );

  const onMouseLeave = useCallback(() => {
    hideTooltipCircle();
    resetTooltip();
    hideTooltipLineX();
    hideTooltipLineY();
  }, [resetTooltip, hideTooltipCircle, hideTooltipLineX, hideTooltipLineY]);

  return { onMouseLeave, onMouseMove, pointerId, lineXId, lineYId };
};

export const usePosition = () => {
  const {
    dimensions: { width, height },
    scales: { x: xScale, y: yScale },
    dataset,
  } = useLineChart(({ dimensions, scales, dataset }) => ({
    dimensions,
    scales,
    dataset,
  }));

  const getPosition = useCallback(
    (e: MouseEvent) => {
      const x0 = xScale.invert(pointer(e)[0]);
      const i = bisector((d: Coordinate) => d.x).left(dataset, x0, 1);
      const points = [dataset[i - 1], dataset[i]];

      const data =
        x0 - points[0]?.x > points[1]?.x - x0 ? points[1] : points[0];

      const xPos = xScale(data.x);
      const yPos = yScale(data.y);

      return {
        position: { x: xPos, y: yPos },
        data,
        inViewport: xPos >= 0 && xPos <= width && yPos >= 0 && yPos <= height,
      };
    },
    [dataset, height, width, xScale, yScale]
  );

  return getPosition;
};

export const useTooltip = (id: string) => {
  const setTooltip = useCallback(
    (data: Coordinate) => {
      select(`[id='${id}']`).html(`x: ${data.x}; y: ${data.y}`);
    },
    [id]
  );

  const resetTooltip = useCallback(() => {
    select(`[id='${id}']`).html("x: 0; y: 0");
  }, [id]);

  return { setTooltip, resetTooltip };
};

export const useTooltipLineX = () => {
  const id = useId();
  const { svg, height } = useLineChart(({ dimensions: { height }, svg }) => ({
    height,
    svg,
  }));

  const showTooltipLineX = useCallback(
    (xPos: number) => {
      svg
        ?.select(`[id="${id}"]`)
        .style("display", "block")
        .attr("x1", xPos)
        .attr("x2", xPos)
        .attr("y1", 0)
        .attr("y2", height);
    },
    [svg, height, id]
  );

  const hideTooltipLineX = useCallback(() => {
    svg
      ?.select(`[id="${id}"]`)
      .attr("x1", 0)
      .attr("x2", 0)
      .style("display", "none");
  }, [svg, id]);

  return { showTooltipLineX, hideTooltipLineX, id };
};

export const useTooltipLineY = () => {
  const id = useId();
  const { svg, width } = useLineChart(({ dimensions: { width }, svg }) => ({
    width,
    svg,
  }));

  const showTooltipLineY = useCallback(
    (yPos: number) => {
      svg
        ?.select(`[id="${id}"]`)
        .style("display", "block")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", yPos)
        .attr("y2", yPos);
    },
    [svg, width, id]
  );

  const hideTooltipLineY = useCallback(() => {
    svg
      ?.select(`[id="${id}"]`)
      .attr("y1", 0)
      .attr("y2", 0)
      .style("display", "none");
  }, [svg, id]);

  return { showTooltipLineY, hideTooltipLineY, id };
};

export const useTooltipPointer = () => {
  const id = useId();
  const { svg } = useLineChart(({ svg }) => ({ svg }));

  const showTooltipCircle = useCallback(
    ({ x, y }: { x: number; y: number }) => {
      svg?.select(`[id="${id}"]`).attr("cx", x).attr("cy", y).attr("r", 4);
    },
    [svg, id]
  );

  const hideTooltipCircle = useCallback(() => {
    svg?.select(`[id="${id}"]`).attr("r", 0);
  }, [svg, id]);

  return { showTooltipCircle, hideTooltipCircle, id };
};
