// src/services/agent.service.js

import api from "./api";

export const getAgents = async () => {
  const {
    data: { data },
  } = await api.get("/admin/agents");

  const agents = Array.isArray(data) ? data : [];

  return agents.map((agent) => ({
    id: agent.agent_id,
    first_name: agent.first_name,
    last_name: agent.last_name,
    name: `${agent.first_name} ${agent.last_name}`,
    image: agent.profile_image,
    bio: agent.bio,
    email: agent.email,
    phone: agent.phone,
    facebook_url: agent.facebook_url,
    instagram_url: agent.instagram_url,
    whatsapp_url: agent.whatsapp_url,
    twitter_url: agent.twitter_url,
    linkedin_url: agent.linkedin_url,
    created_at: agent.created_at,
    // fallback values for UI fields that don't exist in DB
    listings: agent.listings || 0,
    sold: agent.sold || 0,
    rating: agent.rating || 0,
    reviews: agent.reviews || 0,
  }));
};

export const createAgent = async (formData) => {
  const { data } = await api.post("/admin/agents", formData);
  return data;
};

export const updateAgent = async (id, formData) => {
  const { data } = await api.patch(`/admin/agents/${id}`, formData);
  return data;
};

export const getAgent = async (id) => {
  const {
    data: { data },
  } = await api.get(`/admin/agents/${id}`);
  return data;
};

