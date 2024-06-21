import { LineChart } from "../LineChart";
import { getDataset } from "./helper";

export const App = () => {
  return <LineChart dataset={getDataset()} />;
};
