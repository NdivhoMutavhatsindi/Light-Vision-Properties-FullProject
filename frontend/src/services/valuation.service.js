import api from './api';

export const submitValuationRequest = async (data) => {
  const response = await api.post('/valuations', data);
  return response.data;
};

export const getValuationRequests = async () => {
  const {
    data: { data },
  } = await api.get('/valuations');

  return data;
};

export const getValuationRequest = async (id) => {
  const {
    data: { data },
  } = await api.get(`/valuations/${id}`);

  return data;
};

export const updateValuationStatus = async (id, status) => {
  const {
    data: { data },
  } = await api.patch(`/valuations/${id}/status`, {
    status,
  });

  return data;
};
