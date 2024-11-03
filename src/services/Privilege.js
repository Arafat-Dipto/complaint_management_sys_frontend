import { makeAxiosRequest } from "../utils/AxiosRequest";

export const privilegeList = async (data) => {
  return await makeAxiosRequest("get", "/privileges", data);
};
