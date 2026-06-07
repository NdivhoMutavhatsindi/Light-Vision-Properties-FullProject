import api from './api';

export const getCareers = async () => {
  const { data } = await api.get('/careers');
  return data.data;
};

export const createCareer = async (payload) => {
  const { data } = await api.post('/careers', payload);
  return data.data;
};

export const updateCareer = async (id, payload) => {
  const { data } = await api.patch(`/careers/${id}`, payload);
  return data.data;
};

export const deleteCareer = async (id) => {
  const { data } = await api.delete(`/careers/${id}`);
  return data.data;
};
