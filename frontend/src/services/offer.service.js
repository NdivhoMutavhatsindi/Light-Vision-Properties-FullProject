import api from './api';

export const createOffer = async (formData) => {
  const { data } = await api.post('/offers', formData);
  return data.data;
};

export const getOffers = async () => {
  const {
    data: { data },
  } = await api.get('/offers');

  return data;
};

export const getOfferById = async (id) => {
  const {
    data: { data },
  } = await api.get(`/offers/${id}`);

  return data;
};

export const updateOfferStatus = async (id, status) => {
  const {
    data: { data },
  } = await api.patch(`/offers/${id}/status`, { status });

  return data;
};
