import axios from 'axios';

const API_URL = 'http://localhost:5000/customers';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || '';
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const formatDateFields = (data) => {
    if (Array.isArray(data)) {
        data.forEach((item) => {
            item.created_at = new Date(item.created_at).toISOString().split('T')[0];
            item.updated_at = new Date(item.updated_at).toISOString().split('T')[0];
        });
    } else if (data) {
        data.created_at = new Date(data.created_at).toISOString().split('T')[0];
        data.updated_at = new Date(data.updated_at).toISOString().split('T')[0];
    }
    return data;
};

const customerService = {
    getAllcustomers: async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: getAuthHeaders(),
                timeout: 10000,
            });
            const data = response.data || [];
            return formatDateFields(data);
        } catch (error) {
            console.error('Error fetching data:', error.response?.data || error.message);
            throw new Error('Error fetching data');
        }
    },
    getcustomerById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`, {
                headers: getAuthHeaders(),
                timeout: 10000,
            });
            return formatDateFields(response.data);
        } catch (error) {
            console.error(`Error fetching record by ID ${id}:`, error.response?.data || error.message);
            throw new Error('Error fetching record by ID');
        }
    },
    addcustomer: async (customerData) => {
        try {
            const response = await axios.post(API_URL, customerData, {
                headers: getAuthHeaders(),
                timeout: 10000,
            });
            return response.data;
        } catch (error) {
            console.error('Error adding record:', error.response?.data || error.message);
            throw new Error('Error adding record');
        }
    },
    updatecustomer: async (id, customerData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, customerData, {
                headers: getAuthHeaders(),
                timeout: 10000,
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating record with ID ${id}:`, error.response?.data || error.message);
            throw new Error('Error updating record');
        }
    },
    deletecustomer: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`, {
                headers: getAuthHeaders(),
                timeout: 10000,
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting record with ID ${id}:`, error.response?.data || error.message);
            throw new Error('Error deleting record');
        }
    },
};

export default customerService;