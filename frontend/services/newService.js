import axios from 'axios';

const API_URL = 'http://localhost:5000/news';

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

const newService = {
    getAllnews: async () => {
        try {
            const response = await axios.get(API_URL);
            const data = response.data || [];
            return formatDateFields(data);
        } catch (error) {
            // console.error('Không thể tải dữ liệu News:', error.response?.data || error.message);
            throw new Error('Không thể tải dữ liệu News');
        }
    },
    getnewById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return formatDateFields(response.data);
        } catch (error) {
            // console.error(`Không thể tải dữ liệu News với ID ${id}:`, error.response?.data || error.message);
            throw new Error('Không thể tải dữ liệu News bằng ID');
        }
    },
    addnew: async (newData) => {
        try {
            const response = await axios.post(API_URL, newData);
            return response.data;
        } catch (error) {
            // console.error('Không thể thêm dữ liệu News:', error.response?.data || error.message);
            throw new Error('Không thể thêm dữ liệu News');
        }
    },
    updatenew: async (id, newData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, newData);
            return response.data;
        } catch (error) {
            // console.error(`Không thể sửa dữ liệu News với ID ${id}:`, error.response?.data || error.message);
            throw new Error('Không thể thêm dữ liệu News');
        }
    },
    deletenew: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            // console.error(`Không thể xóa dữ liệu News với ID ${id}:`, error.response?.data || error.message);
            throw new Error('Không thể xóa dữ liệu News');
        }
    },
};

export default newService;