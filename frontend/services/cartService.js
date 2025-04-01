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
            // console.error(`Không thể lấy dữ liệu cart từ ID ${id_user}:`, error.response?.data || error.message);
            throw new Error('Không thể lấy dữ liệu cart từ ID');
        }
    },

    add: async (data) => {
        try {
            const response = await axios.post(API_URL, data);
            return response.data;
        } catch (error) {
            // console.error('Không thể thêm bản ghi carts', error.response?.data || error.message);
            throw new Error('Không thể thêm bản ghi carts');
        }
    },

    update: async (id_user, id_variant, data) => {
        try {
            const response = await axios.put(`${API_URL}/${id_user}/${id_variant}`, data);
            return response.data;
        } catch (error) {
            // console.error(`Không thể update được bản ghi carts bằng id: ${id_user, id_variant}:`, error.response?.data || error.message);
            throw new Error('Không thể update được bản ghi carts');
        }
    },
    delete: async (id_user, id_variant) => {
        try {
            const response = await axios.delete(`${API_URL}/${id_user}/${id_variant}`);
            return response.data;
        } catch (error) {
            // console.error(`Không thể xóa bản ghi carts với ID ${id_user, id_variant}:`, error.response?.data || error.message);
            throw new Error('Không thể xóa bản ghi carts');
        }
    },
};

export default cartService;