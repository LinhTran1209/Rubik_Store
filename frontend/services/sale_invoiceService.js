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
    getData: async (col, querydata) => {
        try {
            const response = await axios.get(`${API_URL}/getData/${col}/${querydata}`);
            const data = response.data || [];
            return formatDateFields(data);
        } catch (error) {
            // console.error('Không thể tải dữ liệu Product:', error.response?.data || error.message);
            throw new Error('Không thể tải dữ liệu Product');
        }
    },
    getAllsale_invoices: async () => {
        try {
            const response = await axios.get(API_URL);
            const data = response.data || [];
            return formatDateFields(data);
        } catch (error) {
            // console.error('Không thể tải dữ liệu Invoice', error.response?.data || error.message);
            throw new Error('Không thể tải dữ liệu Invoice');
        }
    },
    getsale_invoiceById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return formatDateFields(response.data);
        } catch (error) {
            // console.error(`Không thể tải dữ liệu Invoice với ID ${id}:`, error.response?.data || error.message);
            throw new Error('Không thể tải dữ liệu Invoice với ID');
        }
    },
    addsale_invoice: async (sale_invoiceData) => {
        try {
            const response = await axios.post(API_URL, sale_invoiceData);
            return response.data;
        } catch (error) {
            // console.error('Không thể thêm dữ liệu Invoice:', error.response?.data || error.message);
            throw new Error('Không thể thêm dữ liệu Invoice');
        }
    },
    updatesale_invoice: async (id, sale_invoiceData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, sale_invoiceData);
            return response.data;
        } catch (error) {
            // console.error(`Không thể sửa dữ liệu Invoice với ID ${id}:`, error.response?.data || error.message);
            throw new Error('Không thể sửa dữ liệu Invoice');
        }
    },
    deletesale_invoice: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            // console.error(`Không thể xóa dữ liệu Invoice với ID ${id}:`, error.response?.data || error.message);
            throw new Error('Không thể xóa dữ liệu Invoice');
        }
    },
};

export default sale_invoiceService;