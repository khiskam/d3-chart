import { HorizontalAxis } from "./HorizontalAxis";
import { AxisProps } from "./types";
import { VerticalAxis } from "./VerticalAxis";

export const Axis = ({ horizontal }: AxisProps) => {
  return horizontal ? <HorizontalAxis /> : <VerticalAxis />;
};
