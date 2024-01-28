import {
  RegistrationData,
  UserCredentials,
} from "../../features/authentication";
import { UpdateDocument } from "../../redux/slices/documentSlice";
import axiosInstance from "./index";

const get = (url: string, params = {}) => {
  return axiosInstance.get(url, { params });
};

const post = (
  url: string,
  data: UserCredentials | RegistrationData | FormData | UpdateDocument,
  config?: {
    headers: {
      Authorization: string;
    };
  }
) => {
  return axiosInstance.post(url, data, config);
};
const put = (
  url: string,
  data: UserCredentials | RegistrationData | FormData | UpdateDocument
) => {
  return axiosInstance.put(url, data);
};

const del = (url: string) => {
  return axiosInstance.delete(url);
};

export const http = { get, post, put, delete: del };
