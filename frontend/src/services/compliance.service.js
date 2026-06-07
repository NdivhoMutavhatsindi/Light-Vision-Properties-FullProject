import api from './api';

export const submitComplianceRequest = async (payload) => {
  const { data } = await api.post('/compliance', payload);
  return data.data;
};

export const getComplianceRequests = async () => {
  const {
    data: { data },
  } = await api.get('/compliance');

  return data;
};

export const getComplianceRequest = async (id) => {
  const {
    data: { data },
  } = await api.get(`/compliance/${id}`);

  return data;
};

export const updateComplianceRequestStatus = async (id, status) => {
  const {
    data: { data },
  } = await api.patch(`/compliance/${id}/status`, { status });

  return data;
};
