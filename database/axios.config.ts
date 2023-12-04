import axios from "axios";

const apiURLs = {
  development: "http://localhost:3000/api",
  production: "https://predict-funds.vercel.app/api",
  test: "",
};

const ax = axios.create({ baseURL: apiURLs[process.env.NODE_ENV] });

export { ax };
