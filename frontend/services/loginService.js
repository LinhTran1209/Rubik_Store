import axios from 'axios';

const API_URL = 'http://localhost:5000/auth';

const loginService = {
    login: async (phone, password) => {
        try {
            const response = await axios.post(
                `${API_URL}/login`,
                { phone, password },
                { withCredentials: true } 
            );
            console.log('Login response:', response.data);
            return response.data; // Trả về { message, user: { phone, role } }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                throw new Error(error.response.data.message || 'Đăng nhập thất bại');
            } else if (error.request) {
                throw new Error('Không nhận được phản hồi từ server');
            } else {
                throw new Error('Lỗi khi gửi yêu cầu đăng nhập');
            }
        }
    },

    logout: async () => {
        try {
            const response = await axios.post(
                `${API_URL}/logout`,
                {},
                { withCredentials: true }
            );
            console.log('Logout response:', response.data);
            return response.data; // Trả về { message: 'Đăng xuất thành công' }
        } catch (error) {
            console.error('Logout error:', error);
            if (error.response) {
                throw new Error(error.response.data.message || 'Đăng xuất thất bại');
            }
            throw new Error('Lỗi kết nối server');
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await axios.get(`${API_URL}/me`, {
                withCredentials: true, 
            });
            console.log('Get current user response:', response.data);
            return response.data; // Trả về { phone, role }
        } catch (error) {
            console.error('Error fetching current user:', error);
            if (error.response) {
                throw new Error(error.response.data.message || 'Không thể lấy thông tin user');
            }
            throw new Error('Lỗi kết nối server');
        }
    },


};

export default loginService;