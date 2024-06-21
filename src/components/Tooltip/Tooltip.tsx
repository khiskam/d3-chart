import { useLayoutEffect } from "react";

import { useLineChart } from "@/store";

import { useMouseEvents } from "./hooks";
import styles from "./Tooltip.module.css";
import { TooltipProps } from "./types";

export const Tooltip = ({ rectId, tooltipId }: TooltipProps) => {
  const { svg } = useLineChart(({ svg }) => ({ svg }));

  const { onMouseMove, onMouseLeave, lineXId, lineYId, pointerId } =
    useMouseEvents(tooltipId);

  useLayoutEffect(() => {
    const container = svg?.select<SVGRectElement>(`[id='${rectId}']`);
    onMouseLeave();

    container?.on("mousemove", onMouseMove);
    container?.on("mouseleave", onMouseLeave);

    return () => {
      container?.on("mousemove", null);
      container?.on("mouseleave", null);
    };
  }, [onMouseLeave, onMouseMove, svg, rectId]);

  return (
    <>
      <line id={lineXId} className={styles.tooltipLine}></line>
      <line id={lineYId} className={styles.tooltipLine}></line>
      <circle id={pointerId} className={styles.tooltipPointer}></circle>
    </>
  );
};
