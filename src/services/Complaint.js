import { makeAxiosRequest } from "../utils/AxiosRequest";

export const complaintList = async (data, params) => {
  return await makeAxiosRequest(
    "get",
    "/complaints",
    data,
    params
  );
};
// export const complaintList = async (data) => {
//   return await makeAxiosRequest("get", "/complaints", data);
// };
export const complaintCreate = async (data) => {
  return await makeAxiosRequest("post", "/complaints", data);
};
export const complaintShowById = async (data, id) => {
  return await makeAxiosRequest("get", `/complaints/${id}`, data);
};
export const complaintStatusUpdate = async (data, id) => {
  return await makeAxiosRequest("post", `/complaints/${id}/status`, data);
};
