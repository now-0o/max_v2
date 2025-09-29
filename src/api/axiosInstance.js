import axios from "axios";

const api = axios.create({
  baseURL: "http://1.234.53.169:4000",
  withCredentials: true,
});

export default api;
