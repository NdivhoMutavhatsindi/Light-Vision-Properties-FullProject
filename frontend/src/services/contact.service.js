import api from './api';

export const submitContactInquiry = async (data) => {
  const response = await api.post('/contact-inquiries', data);
  return response.data;
};
