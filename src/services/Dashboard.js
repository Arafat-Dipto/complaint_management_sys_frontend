import { makeAxiosRequest } from "../utils/AxiosRequest";

export const dashboardCounts = async (data) => {
  return await makeAxiosRequest("get", "/dashboard", data);
};
