export const getDataset = () => {
  const data = [];

  for (let i = 0; i < 1000; i += 2) {
    data.push({ x: i, y: Math.round(Math.random() * 10) });
  }
  return data;
};
