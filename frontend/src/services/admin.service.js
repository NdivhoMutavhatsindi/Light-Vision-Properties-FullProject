import api from "./api.js";

export const getDashboard = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data?.data ?? response.data;
};
