import { makeAxiosRequest } from "../utils/AxiosRequest";

export const userList = async (data) => {
  return await makeAxiosRequest("get", "/users", data);
};
export const userCreate = async (data) => {
  return await makeAxiosRequest("post", "/users", data);
};
export const userEdit = async (data, userId) => {
  return await makeAxiosRequest("post", `/users/${userId}`, data);
};
export const userDelete = async (data, userId) => {
  return await makeAxiosRequest("delete", `/users/${userId}`, data);
};
