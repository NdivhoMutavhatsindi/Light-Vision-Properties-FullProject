import api from "./api";

export const cloudinaryIMG = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await api.post("/admin/agents/upload", formData);

  return data.data;
};
