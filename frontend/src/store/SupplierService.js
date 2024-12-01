import axios from 'axios';

const API_URL = 'http://localhost:5000/supplier'; 

// Create Supplier with JWT Token as parameter
const createSupplier = async (supplierData, token) => {
    try {
        const response = await axios.post(API_URL, supplierData, {
            headers: { Authorization: `Bearer ${token}` }  // Attach token to request
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Get all Suppliers with JWT Token as parameter
const getAllSuppliers = async (token) => {
    try {
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` }  // Attach token to request
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Get Supplier by ID with JWT Token as parameter
const getSupplierById = async (id, token) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }  // Attach token to request
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Update Supplier with JWT Token as parameter
const updateSupplier = async (id, supplierData, token) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, supplierData, {
            headers: { Authorization: `Bearer ${token}` }  // Attach token to request
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Delete Supplier with JWT Token as parameter
const deleteSupplier = async (id, token) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }  // Attach token to request
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
};
