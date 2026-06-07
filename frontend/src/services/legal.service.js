import api from './api';

export const submitLegalRequest = async (data) => {
  const response = await api.post('/legal', data);
  return response.data;
};

export const getLegalRequests = async () => {
  const {
    data: { data },
  } = await api.get('/legal');

  return data;
};

export const getLegalRequest = async (id) => {
  const {
    data: { data },
  } = await api.get(`/legal/${id}`);

  return data;
};

export const updateLegalRequestStatus = async (id, status) => {
  const {
    data: { data },
  } = await api.patch(`/legal/${id}/status`, { status });

  return data;
};
