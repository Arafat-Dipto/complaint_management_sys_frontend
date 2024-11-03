import { makeAxiosRequest } from "../utils/AxiosRequest";

export const commentCreate = async (data, id) => {
  return await makeAxiosRequest("post", `/complaints/${id}/comment`, data);
};
