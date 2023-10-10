import axios from "axios";

const apiURLs = {
  development: "http://localhost:3000/api",
  production: "https://predict-funds.vercel.app/api",
  test: "",
};

const ax = axios.create({ baseURL: apiURLs[process.env.NODE_ENV] });

// ax.interceptors.request.use((config) => {
//   const loggedInUserJSON = localStorage.getItem("loggedInUser");
//   const parseLoggedInUser = JSON.parse(loggedInUserJSON || '""');
//   if (parseLoggedInUser.token) {
//     config.headers = { Authorization: `Bearer ${parseLoggedInUser.token}` };
//   }
//   return config;
// });

export { ax };
