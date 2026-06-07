import api from './api';

export const submitJobApplication = async (formData) => {
  const { data } = await api.post('/job-applications', formData);
  return data.data;
};

export const getJobApplications = async () => {
  const { data } = await api.get('/admin/job-applications');
  return data.data || [];
};

export const getJobApplicationById = async (id) => {
  const { data } = await api.get(`/admin/job-applications/${id}`);
  return data.data;
};

export const updateJobApplicationStatus = async (id, status) => {
  const { data } = await api.patch(`/admin/job-applications/${id}/status`, { status });
  return data.data;
};
