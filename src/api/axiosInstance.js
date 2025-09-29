import axios from "axios";

const api = axios.create({
  baseURL: "http://maxsportsdj.cafe24.com:4000",
  withCredentials: true,
});

export default api;
