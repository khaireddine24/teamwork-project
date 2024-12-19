import axios from 'axios';

const API_URL = 'http://localhost:5000/articles'; 

// Function to get all articles
export const getAllArticles = async (token) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Add the token to the request headers
      },
    });
    return response.data.Articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

// Function to get an article by ID
export const getArticleById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Add the token to the request headers
      },
    });
    return response.data.article;
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    throw error;
  }
};

// Function to add a new article
export const addArticle = async (articleData, token) => {
  try {
    const response = await axios.post(`${API_URL}/add`, articleData, {
      headers: {
        'Authorization': `Bearer ${token}`, // Add the token to the request headers
      },
    });
    return response.data.message;
  } catch (error) {
    console.error('Error adding article:', error);
    throw error;
  }
};

// Function to edit an article
export const editArticle = async (id, articleData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, articleData, {
      headers: {
        'Authorization': `Bearer ${token}`, // Add the token to the request headers
      },
    });
    return response.data.message;
  } catch (error) {
    console.error('Error editing article:', error);
    throw error;
  }
};

// Function to delete an article
export const deleteArticle = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Add the token to the request headers
      },
    });
    return response.data.message;
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};
