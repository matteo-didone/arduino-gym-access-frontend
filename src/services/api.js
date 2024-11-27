// services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5074/api/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default API;