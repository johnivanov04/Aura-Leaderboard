// src/axiosSetup.js
import axios from 'axios';

// 1) Point axios at your API root
axios.defaults.baseURL = 'http://localhost:5050/api';

// 2) Before every request, grab the latest token from localStorage
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, err => Promise.reject(err));
