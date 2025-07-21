import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8001',
});

export const login = (username, password) =>
  API.post('/token', new URLSearchParams({ username, password }));

export const getLogs = (token) =>
  API.get('/logs', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
