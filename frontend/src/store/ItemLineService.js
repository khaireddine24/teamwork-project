import axios from 'axios';

const API_BASE_URL = 'https://teamwork-project.onrender.com/itemlines'; 
export const addItemLinee = async (itemLine, token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/add`,  // Ensure the URL is correct for your API endpoint
            itemLine,
            {
                headers: {
                    Authorization: `Bearer ${token}`,  // Include token for authorization
                },
            }
        );
      
        return response.data.itemLine; 
    } catch (error) {
        // Provide a more specific error message
        throw new Error(error.response?.data?.message || 'Error adding item line');
    }
};

export const getAllItemLines = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}`, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching item lines');
    }
};

export const getItemLineById = async (id, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching item line');
    }
};
export const getItemLineByArticle = async (id, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/article/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error fetching item line');
    }
};
export const updateItemLine = async (id, updatedData, token) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/${id}`,
            updatedData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error updating item line');
    }
};

export const deleteItemLine = async (id, token) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error deleting item line');
    }
};
