import { D3ZoomEvent, zoom, zoomIdentity } from "d3";
import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { Actions, useLineChart } from "@/store";
import { Coordinate } from "@/types/Coordinate";

import { Margin } from "./constants";

export const useInit = (dataset: Coordinate[]) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    Actions.init(svgRef, dataset);
  }, [dataset]);

  return svgRef;
};

export const useIntersectionObserver = <T extends HTMLElement | SVGElement>(
  ref: React.RefObject<T>
) => {
  const [isIntersected, setIsIntersected] = useState(false);

  useLayoutEffect(() => {
    const onIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsIntersected(true);
        io.disconnect();
      }
    };

    const io = new IntersectionObserver(onIntersection, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);

    return () => {
      io.disconnect();
    };
  }, [ref]);

  return isIntersected;
};

export const useResizeObserver = <T extends HTMLElement>(
  dependency: React.RefObject<T>,
  callback: (entries: ResizeObserverEntry[]) => void
) => {
  useEffect(() => {
    const observer = new ResizeObserver(callback);

    if (dependency.current) {
      observer.observe(dependency.current);
    }

    return () => observer.disconnect();
  }, [dependency, callback]);
};

export const useDimensions = (dependency: RefObject<HTMLDivElement>) => {
  const onResize = useCallback((entries: ResizeObserverEntry[]) => {
    if (entries.length === 1) {
      const width = entries[0].contentRect.width - Margin.LEFT - Margin.RIGHT;
      const height = entries[0].contentRect.height - Margin.TOP - Margin.BOTTOM;

      Actions.setDimensions(width < 0 ? 0 : width, height < 0 ? 0 : height);
    }
  }, []);

  useResizeObserver(dependency, onResize);
};

export const useScales = (rectId: string) => {
  const zoomRef = useRef(zoomIdentity);
  const { svg, dimensions, isLineDrawed } = useLineChart(
    ({ svg, dimensions, isLineDrawed }) => ({
      svg,
      dimensions,
      isLineDrawed,
    })
  );

  useLayoutEffect(() => {
    const zoomGlobal = zoom<SVGRectElement, unknown>().scaleExtent([0.4, 12]);

    if (isLineDrawed) {
      zoomGlobal.on(
        "zoom",
        (event: D3ZoomEvent<SVGPathElement, Coordinate[]>) => {
          zoomRef.current = event.transform;
          Actions.setScales(zoomRef.current);
        }
      );
      svg?.select<SVGRectElement>(`[id='${rectId}']`).call(zoomGlobal);
    }

    return () => {
      zoomGlobal.on("zoom", null);
    };
  }, [svg, dimensions, isLineDrawed, rectId]);

  useLayoutEffect(() => Actions.setScales(zoomRef.current), [dimensions]);
};
