import axios from "axios";

export const API_URL ='http://localhost:8000'
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "application/json",
    'Authorization': `Token ` + localStorage.getItem("token")
  }
});
