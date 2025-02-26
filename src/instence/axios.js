import axios from "axios";
import { baseUrl } from "../constants/constants";
import toaster from "./toaster";
import { createHashHistory } from "history";

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 100000,
});

instance.interceptors.request.use(
  async (config) => {
    const { auth_token, store_id } =
      ((await localStorage) && JSON.parse(localStorage.getItem("loginData"))) ||
      {};

    config.headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Max-Age": 7200,
      Accept: "application/json",
      Authorization: "Bearer " + auth_token,
      Store: store_id,
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      //toaster.error(error.response.status);
      // console.log(error.response.data);
      // console.log("headers");
      // console.log(error.response.headers);
      if (error.response.status) {
        if (error.response.status === 401) {
          toaster.warning("Login Error");
          localStorage.removeItem("loginData");
          history.replace("/login"); // <-- navigate
        } else if (error.response.status === 501) {
          toaster.warning("Login Error 501");
        }
      }
    } else if (error.request) {
      toaster.error("Network Connection Error");
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    if (error.message === "Network Error") {
      toaster.error("Network Connection Error");
    }

    throw error;
  }
);

export default instance;

export const history = createHashHistory();
