// src/services/commandeService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/commandes'; // Update with your backend URL

// Service to fetch all commandes
export const fetchCommandes = async (token) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.Commande;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Service to fetch a specific commande by ID
export const fetchCommandeById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.commande;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
export const DeleteCommandeById = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.commande;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
export const AcceptCommandeById = async (id, token) => {
  try {
    const response = await axios.post(`${API_URL}/acceptcommande/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.commande;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Service to add a new commande
export const addCommande = async (commandeData, token) => {
  try {
    const response = await axios.post(`${API_URL}/add`, commandeData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.message;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
