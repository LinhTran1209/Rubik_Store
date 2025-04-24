import axios from 'axios';

const API_URL = process.env.API_URL_BACK_END +"/users";


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

const userService = {
    // Gửi mã xác thực
    sendVerificationEmail: async (email, code) => {
        try {
            const response = await axios.post(`${API_URL}/sendVerificationEmail`, { email, code});
            return response.data;
        } catch(err) {
            throw new Error('Không thể gửi mã xác thực người dùng');
        }
    },

    // Bên back có làm hàm gọi theo cột và tìm trường dữ liệu
    getData: async (col, querydata) => {
        try {
            const response = await axios.get(`${API_URL}/getData/${col}/${querydata}`);
            const data = response.data || [];
            return formatDateFields(data);
        } catch (error) {
            // console.error('Không thể tải dữ liệu Users:', error.response?.data || error.message);
            throw new Error('Không thể tải dữ liệu Users');
        }
    },

    getAllusers: async () => {
        try {
            const response = await axios.get(API_URL);
            const data = response.data || [];
            return formatDateFields(data);
        } catch (error) {
            // console.error('Không thể tải dữ liệu Users:', error.response?.data || error.message);
            throw new Error('Không thể tải dữ liệu Users');
        }
    },
    getuserById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return formatDateFields(response.data);
        } catch (error) {
            // console.error(`Không thể tải dữ liệu Users với ID ${id}:`, error.response?.data || error.message);
            throw new Error('Không thể tải dữ liệu Users với ID');
        }
    },
    adduser: async (userData) => {
        try {
            const response = await axios.post(API_URL, userData);
            return response.data;
        } catch (error) {
            // console.error('Không thể thêm dữ liệu Users:', error.response?.data || error.message);
            throw new Error('Không thể thêm dữ liệu Users');
        }
    },
    updateuser: async (id, userData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, userData);
            return response.data;
        } catch (error) {
            // console.error(`Không thể sửa dữ liệu Users với ID ${id}:`, error.response?.data || error.message);
            throw new Error('Không thể sửa dữ liệu Users');
        }
    },
    deleteuser: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            // console.error(`Không thể xóa dữ liệu Users với ID: ${id}:`, error.response?.data || error.message);
            throw new Error('Không thể xóa dữ liệu Users');
        }
    },
};

export default userService;