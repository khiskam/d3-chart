import { useId, useLayoutEffect } from "react";

import { useLineChart } from "@/store";

import { useAnimation, usePath } from "./hooks";
import styles from "./Line.module.css";

export const Line = () => {
  const playAnimation = useAnimation();
  const clipPathId = useId();
  const lineId = useId();

  const { width, height } = useLineChart(
    ({ dimensions: { width, height } }) => ({ width, height })
  );

  const getPath = usePath(lineId);

  useLayoutEffect(() => {
    const path = getPath();
    playAnimation(path);
  }, [getPath, playAnimation]);

  return (
    <>
      <defs>
        <clipPath id={clipPathId}>
          <rect width={width} height={height}></rect>
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipPathId})`}>
        <path id={lineId} className={styles.line}></path>
      </g>
    </>
  );
};
