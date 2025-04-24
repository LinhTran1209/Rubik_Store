import axios from 'axios';

const API_URL = process.env.API_URL_BACK_END +"/products";


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

const productService = {
    // Bên back có làm hàm gọi theo cột và tìm trường dữ liệu
    getDataproducts: async (col, querydata) => {
        try {
            const response = await axios.get(`${API_URL}/getData/${col}/${querydata}`);
            const data = response.data || [];
            return formatDateFields(data);
        } catch (error) {
            // console.error('Không thể tải dữ liệu Product:', error.response?.data || error.message);
            throw new Error('Không thể tải dữ liệu Product');
        }
    },

    getAllproducts: async () => {
        try {
            const response = await axios.get(API_URL);
            const data = response.data || [];
            return formatDateFields(data);
        } catch (error) {
            // console.error('Không thể tải dữ liệu Product:', error.response?.data || error.message);
            throw new Error('Không thể tải dữ liệu Product');
        }
    },
    getproductById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return formatDateFields(response.data);
        } catch (error) {
            // console.error(`Không thể tải dữ liệu Product với ID: ${id}:`, error.response?.data || error.message);
            throw new Error('Không thể tải dữ liệu Product với ID');
        }
    },
    addproduct: async (productData) => {
        try {
            const response = await axios.post(API_URL, productData);
            return response.data;
        } catch (error) {
            // console.error('Không thể thêm dữ liệu Product:', error.response?.data || error.message);
            throw new Error('Không thể thêm dữ liệu Product');
        }
    },
    updateproduct: async (id, productData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, productData);
            return response.data;
        } catch (error) {
            // console.error(`Không thể sửa dữ liệu Product với ID ${id}:`, error.response?.data || error.message);
            throw new Error('Không thể sửa dữ liệu Product');
        }
    },
    deleteproduct: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Không thể xóa dữ liệu Product với ID ${id}:`, error.response?.data || error.message);
            throw new Error('Không thể xóa dữ liệu Product');
        }
    },
};
export default productService;