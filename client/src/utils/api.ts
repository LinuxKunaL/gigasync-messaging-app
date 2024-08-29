import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_HOST,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (Response) => {
    if (Response.data?.isInvalid) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    if (Response.data?.isExpired) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Response;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

export default api;
