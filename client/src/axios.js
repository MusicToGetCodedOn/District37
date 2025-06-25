import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api", // <- Port deines Express-Backends
  withCredentials: true, // falls du Cookies/Sessions nutzt
});

export default instance;