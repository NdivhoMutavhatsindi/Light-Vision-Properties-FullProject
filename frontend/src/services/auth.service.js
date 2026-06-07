// src/services/auth.service.js

import api from "./api";

export const login = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data.data;
};

export const logout = async () => {
  const { data } = await api.post("/auth/logout");
  return data.data;
};

export const getProfile = async () => {
  try {
    const { data } = await api.get("/auth/me");
    return data.data;
  } catch (err) {
    // 401 is expected when user is not logged in
    if (err.response?.status === 401) {
      return null;
    }
    throw err;
  }
};