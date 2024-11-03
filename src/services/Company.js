import { makeAxiosRequest } from "../utils/AxiosRequest";

export const companyList = async (data) => {
  return await makeAxiosRequest("get", "/companies", data);
};
export const companyCreate = async (data) => {
  return await makeAxiosRequest("post", "/companies", data);
};
export const companyEdit = async (data) => {
  return await makeAxiosRequest("post", "/companies", data);
};
export const companyDelete = async (data, id) => {
  return await makeAxiosRequest("delete", `/companies/${id}`, data);
};
