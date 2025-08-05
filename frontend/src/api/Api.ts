import axios from "axios";

export const api = axios.create({
  baseURL: 'https://f2hooq2417.execute-api.ap-southeast-1.amazonaws.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})
