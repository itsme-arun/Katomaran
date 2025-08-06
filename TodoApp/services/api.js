import axios from "axios";

const API_BASE = "http://10.10.15.13:8080/api";

export const getTasks = async (token) =>
  axios.get(`${API_BASE}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addTask = async (task, token) =>
  axios.post(`${API_BASE}/tasks`, task, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateTask = async (id, task, token) =>
  axios.put(`${API_BASE}/tasks/${id}`, task, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteTask = async (id, token) =>
  axios.delete(`${API_BASE}/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
