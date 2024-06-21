import { HorizontalGrid } from "./HorizontalGrid";
import { GridProps } from "./types";
import { VerticalGrid } from "./VerticalGrid";

export const Grid = ({ horizontal }: GridProps) => {
  return horizontal ? <HorizontalGrid /> : <VerticalGrid />;
};
