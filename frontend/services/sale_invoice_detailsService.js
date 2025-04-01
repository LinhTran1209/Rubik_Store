import axios from 'axios';

const API_URL = 'http://localhost:5000/sale_invoice_details';

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
            const response = await axios.get(`${API_URL}/${invoiceId}`);
            const data = response.data || [];
            return formatDateFields(data);
        } catch (error) {
            // console.error(`Không thể tải dữ liệu Invoice Detail ${invoiceId}:`, error.response?.data || error.message);
            throw new Error('Không thể tải dữ liệu Invoice Detail');
        }
    },
    addDetail: async (detailData) => {
        try {
            const response = await axios.post(API_URL, detailData);
            return response.data;
        } catch (error) {
            // console.error('Không thể thêm dữ liệu Invoice Detail:', error.response?.data || error.message);
            throw new Error('Không thể tải dữ liệu Invoice Detail');
        }
    },
    updateDetail: async (invoiceId, productId, detailData) => {
        try {
            const response = await axios.put(`${API_URL}/${invoiceId}/${productId}`, detailData);
            return response.data;
        } catch (error) {
            // console.error(`Không thể sửa dữ liệu Invoice Detail với ID: ${invoiceId}/${productId}:`, error.response?.data || error.message);
            throw new Error('Không thể sửa dữ liệu Invoice Detail');
        }
    },
    deleteDetail: async (invoiceId, productId) => {
        try {
            const response = await axios.delete(`${API_URL}/${invoiceId}/${productId}`);
            return response.data;
        } catch (error) {
            // console.error(`Không thể xóa dữ liệu Invoice Detail với ID: ${invoiceId}/${productId}:`, error.response?.data || error.message);
            throw new Error('Không thể xóa dữ liệu Invoice Detail');
        }
    },
};

export default saleInvoiceDetailsService;