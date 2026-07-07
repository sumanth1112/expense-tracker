import axios from "axios";


const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://expense-tracker-backend-6g88.onrender.com/api"
      : "http://localhost:5000/api"),
});

export default API;