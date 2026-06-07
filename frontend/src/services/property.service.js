// src/services/property.service.js

import api from "./api";

export const getProperties = async () => {
  const {
    data: { data },
  } = await api.get("/properties");
  return data;
};

export const getProperty = async (id) => {
  const {
    data: { data },
  } = await api.get(`/properties/${id}`);
  return data;
};

export const getSimilarProperties = async (id) => {
  const {
    data: { data },
  } = await api.get(`/properties/${id}/similar`);
  return data;
};

export const createProperty = async (payload) => {
  const {
    data: { data },
  } = await api.post("/admin/properties", payload);
  return data;
};

export const updateProperty = async (id, payload) => {
  const {
    data: { data },
  } = await api.patch(`/admin/properties/${id}`, payload);
  return data;
};

export const deleteProperty = async (id) => {
  const {
    data: { data },
  } = await api.delete(`/admin/properties/${id}`);
  return data;
};

export const uploadPropertyImages = async (propertyId, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const {
    data: { data },
  } = await api.post(`/admin/properties/${propertyId}/images`, formData);
  return data;
};