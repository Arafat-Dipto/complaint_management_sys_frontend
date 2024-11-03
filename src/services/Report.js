import { makeAxiosRequest } from "../utils/AxiosRequest";

export const ComplaintsByStatus = async (data) => {
  return await makeAxiosRequest("get", "/reports/complaints_by_status", data);
};

export const ComplaintsByPriority = async (data) => {
  return await makeAxiosRequest("get", "/reports/priority", data);
};

export const AverageResolutionTime = async (data) => {
  return await makeAxiosRequest("get", "/reports/average-resolution-time", data);
};

export const ComplaintsTrend = async (data, params) => {
  return await makeAxiosRequest(
    "get",
    "/reports/trend",
    data,
    params
  );
};
