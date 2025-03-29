import axios from 'axios';

const API_URL = 'http://localhost:5000/carts';

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


const cartService = {
    getById: async (id_user) => {
        try {
            const response = await axios.get(`${API_URL}/${id_user}`);
            return formatDateFields(response.data);
        } catch (error) {
            console.error(`Error fetching record by ID ${id_user}:`, error.response?.data || error.message);
            throw new Error('Error fetching record by ID');
        }
    },

    add: async (data) => {
        try {
            const response = await axios.post(API_URL, data);
            return response.data;
        } catch (error) {
            console.error('Error adding record:', error.response?.data || error.message);
            throw new Error('Error adding record');
        }
    },

    update: async (id_user, id_product, data) => {
        try {
            const response = await axios.put(`${API_URL}/${id_user}/${id_product}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating record with ID ${id_user, id_product}:`, error.response?.data || error.message);
            throw new Error('Error updating record');
        }
    },
    delete: async (id_user, id_product) => {
        try {
            const response = await axios.delete(`${API_URL}/${id_user}/${id_product}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting record with ID ${id_user, id_product}:`, error.response?.data || error.message);
            throw new Error('Error deleting record');
        }
    },


};

export default cartService;