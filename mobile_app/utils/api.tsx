import axios from "axios";
export const api = axios.create({
 baseURL:
"http://192.168.254.126:5000/api",
 timeout: 10000,
});