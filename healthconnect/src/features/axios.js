import axios, { AxiosError } from "axios";
import { useSelector, useDispatch } from "react-redux";
import { resetStateToDefault } from "../features/SharedData";
import { store } from "../app/store";
import toast from "react-hot-toast";

function createAxiosInstance() {
  const info = localStorage.getItem("persist:healthconnect");
  let token = "";
  if (info) {
    const userInfo = JSON.parse(JSON.parse(info).usersLogin);
    token = userInfo.access;
  }
  else {
    token = sessionStorage.getItem("access");
  }
  const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const errorObj = error;
      if (
        errorObj.response?.status == 401 &&
        store.getState().sharedData.usersLogin != []
      ) {
        // store.dispatch(resetStateToDefault());
        window.location.href = "/login";
        /*  store.dispatch(resetStateToDefault());
        window.location.href = "/auth"; */
      } else {
        const errorData = errorObj.response?.data;
        let errorMessage = errorData
          ? errorData.error || errorObj.message
          : "Unexpected error. Please try again later.";
        if (
          errorMessage !== undefined &&
          errorMessage.indexOf("Request failed with status code") < 0
        ) {
          toast.error(errorMessage);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export const api = () => createAxiosInstance();

export default createAxiosInstance;
