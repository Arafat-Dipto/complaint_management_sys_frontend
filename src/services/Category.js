import { makeAxiosRequest } from "../utils/AxiosRequest";

export const categoryList = async (data) => {
  return await makeAxiosRequest("get", "/categories", data);
};
export const categoryCreate = async (data) => {
  return await makeAxiosRequest("post", "/categories", data);
};
export const categoryView = async (data, categoryId) => {
  return await makeAxiosRequest("post", `/category/show/${categoryId}`, data);
};
export const categoryEdit = async (data, categoryId) => {
  return await makeAxiosRequest("post", `/categories/${categoryId}`, data);
};
export const categoryDelete = async (data, categoryId) => {
  return await makeAxiosRequest("delete", `/categories/${categoryId}`, data);
};
