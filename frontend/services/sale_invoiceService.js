import axios from 'axios';

const API_URL = 'http://localhost:5000/sale_invoices';

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

const sale_invoiceService = {
    getAllsale_invoices: async () => {
        try {
            const response = await axios.get(API_URL);
            const data = response.data || [];
            return formatDateFields(data);
        } catch (error) {
            console.error('Error fetching data:', error.response?.data || error.message);
            throw new Error('Error fetching data');
        }
    },
    getsale_invoiceById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return formatDateFields(response.data);
        } catch (error) {
            console.error(`Error fetching record by ID ${id}:`, error.response?.data || error.message);
            throw new Error('Error fetching record by ID');
        }
    },
    addsale_invoice: async (sale_invoiceData) => {
        try {
            const response = await axios.post(API_URL, sale_invoiceData);
            return response.data;
        } catch (error) {
            console.error('Error adding record:', error.response?.data || error.message);
            throw new Error('Error adding record');
        }
    },
    updatesale_invoice: async (id, sale_invoiceData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, sale_invoiceData);
            return response.data;
        } catch (error) {
            console.error(`Error updating record with ID ${id}:`, error.response?.data || error.message);
            throw new Error('Error updating record');
        }
    },
    deletesale_invoice: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting record with ID ${id}:`, error.response?.data || error.message);
            throw new Error('Error deleting record');
        }
    },
};

export default sale_invoiceService;