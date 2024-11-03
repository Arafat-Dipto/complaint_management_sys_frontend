export const createOptionsReactSelect = (
  data,
  valueKey = "id",
  labelKey = "name"
) => {
  return data.map((item) => {
    const label = labelKey
      .split(".")
      .reduce((obj, key) => (obj && obj[key]) || "", item);

    const value = valueKey
      .split(".")
      .reduce((obj, key) => (obj && obj[key]) || "", item);

    return { value, label };
  });
};

export const createOptionsReactSelectSpecial = (
  data,
  valueKey = "id",
  labelFormatter = (item) => item.name
) => {
  return data.map((item) => ({
    value: item[valueKey],
    label:
      typeof labelFormatter === "function" ? labelFormatter(item) : item.name,
  }));
};
