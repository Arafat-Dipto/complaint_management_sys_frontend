import { makeAxiosRequest } from "../utils/AxiosRequest";

export const handleLogin = async (data) => {
  return await makeAxiosRequest("post", "/login", data);
};

export const handleRegister = async (data) => {
  return await makeAxiosRequest("post", "/register", data);
};
