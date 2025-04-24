import axios from 'axios';

const API_URL = process.env.API_URL_BACK_END +"/product_variants";

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

const product_variantsService = {
    getAllVariants: async () => {
        try {
            const response = await axios.get(API_URL);
            const data = response.data || [];
            return formatDateFields(data);
        } catch (error) {
            throw new Error('Không thể tải dữ liệu Product variants');
        }
    },

    getData: async (col, querydata) => {
        try {
            const response = await axios.get(`${API_URL}/getData/${col}/${querydata}`);
            const data = response.data || [];
            return formatDateFields(data);
        } catch (error) {
            throw new Error('Không thể tải dữ liệu Product Variants');
        }
    },

    getByIdVariant: async (id_variant) => {
        try {
            const response = await axios.get(`${API_URL}/${id_variant}`);
            const data = response.data || [];
            return formatDateFields(data);
        } catch (error) {
            throw new Error('Không thể tải dữ liệu biến thể sản phẩm');
        }
    },
    add: async (data) => {
        try {
            const response = await axios.post(API_URL, data);
            return response.data;
        } catch (error) {
            throw new Error('Không thể thêm biến thể sản phẩm');
        }
    },
    update: async (id_variant, data) => {
        try {
            const response = await axios.put(`${API_URL}/${id_variant}`, data);
            return response.data;
        } catch (error) {
            throw new Error('Không thể sửa biến thể sản phẩm');
        }
    },
    delete: async (id_variant) => {
        try {
            const response = await axios.delete(`${API_URL}/${id_variant}`);
            return response.data;
        } catch (error) {
            throw new Error('Không thể xóa biến thể sản phẩm');
        }
    },
};

export default product_variantsService;