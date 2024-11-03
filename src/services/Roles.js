import { makeAxiosRequest } from "../utils/AxiosRequest";

export const roleList = async (data) => {
  return await makeAxiosRequest("get", "/roles", data);
};
export const roleCreate = async (data) => {
  return await makeAxiosRequest("post", "/roles", data);
};
export const roleEdit = async (data) => {
  return await makeAxiosRequest("post", "/roles", data);
};
export const assignPrivilege = async (data, roleId) => {
  return await makeAxiosRequest("post", `/roles/${roleId}/privileges`, data);
};
export const roleDelete = async (data, roleId) => {
  return await makeAxiosRequest("delete", `/roles/${roleId}`, data);
};
