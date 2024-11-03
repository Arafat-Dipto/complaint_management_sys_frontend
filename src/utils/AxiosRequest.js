import axios from "axios";
import { deleteTokenFromCookies, getTokenFromCookies } from "./common";

export async function makeAxiosRequest(method, urlPath, data, params) {
  try {
    const serviceToken = getTokenFromCookies();
    const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;

    const headers =
      data instanceof FormData
        ? {
            Accept: "application/json",
            Authorization: `Bearer ${serviceToken}`,
          }
        : {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${serviceToken}`,
          };

    const response = await axios({
      method,
      url: `${baseUrl}/api/v1${urlPath}`,
      data,
      params,
      headers,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          deleteTokenFromCookies();
        }
        throw error.response;
      } else if (error.request) {
        throw error.request;
      } else {
        throw new Error(`Error: ${error.message}`);
      }
    } else {
      throw error;
    }
  }
}
