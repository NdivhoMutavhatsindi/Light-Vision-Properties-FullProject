import api from './api';

export const submitPropertyInquiry = async (payload) => {
  const { data } = await api.post('/inquiries', payload);
  return data.data;
};

export const getContactInquiries = async () => {
  const {
    data: { data },
  } = await api.get('/admin/inquiries');

  return data;
};

export const getContactInquiryById = async (id) => {
  const {
    data: { data },
  } = await api.get(`/admin/inquiries/${id}`);

  return data;
};

export const updateContactInquiryStatus = async (id, status) => {
  const {
    data: { data },
  } = await api.patch(`/admin/inquiries/${id}`, {
    status,
  });

  return data;
};
