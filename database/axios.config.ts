import axios from "axios";

const envBaseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

const ax = axios.create({ baseURL: envBaseUrl });

export { ax };
