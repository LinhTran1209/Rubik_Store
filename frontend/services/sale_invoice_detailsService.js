import axios from 'axios';

const API_URL = 'http://localhost:5000/sale_invoice_details';

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

const saleInvoiceDetailsService = {
    getAllByInvoiceId: async (invoiceId) => {
        try {
            console.log(invoiceId)
            const response = await axios.get(`${API_URL}/${invoiceId}`, {
                headers: getAuthHeaders(),
                timeout: 10000,
            });
            const data = response.data || [];
            return formatDateFields(data);
        } catch (error) {
            console.error(`Error fetching details for invoice ${invoiceId}:`, error.response?.data || error.message);
            throw new Error('Error fetching details');
        }
    },
    addDetail: async (detailData) => {
        try {
            const response = await axios.post(API_URL, detailData, {
                headers: getAuthHeaders(),
                timeout: 10000,
            });
            return response.data;
        } catch (error) {
            console.error('Error adding detail:', error.response?.data || error.message);
            throw new Error('Error adding detail');
        }
    },
    updateDetail: async (invoiceId, productId, detailData) => {
        try {
            const response = await axios.put(`${API_URL}/${invoiceId}/${productId}`, detailData, {
                headers: getAuthHeaders(),
                timeout: 10000,
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating detail for ${invoiceId}/${productId}:`, error.response?.data || error.message);
            throw new Error('Error updating detail');
        }
    },
    deleteDetail: async (invoiceId, productId) => {
        try {
            const response = await axios.delete(`${API_URL}/${invoiceId}/${productId}`, {
                headers: getAuthHeaders(),
                timeout: 10000,
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting detail for ${invoiceId}/${productId}:`, error.response?.data || error.message);
            throw new Error('Error deleting detail');
        }
    },
};

export default saleInvoiceDetailsService;