import axios from "axios";

const API = axios.create({
  baseURL: "https://expense-tracker-backend-6g88.onrender.com/api",
});

export default API;