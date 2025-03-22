import axios from 'axios';

const API_URL = 'http://localhost:5000';

const loginService = {
    login: async (phone, password, id_role) => {
        console.log('Request URL:', `${API_URL}/login`);
        try {
            const response = await axios.post(`${API_URL}/login`, {
                phone,
                password,
                id_role
            }, {
                withCredentials: true // Cho phép gửi cookie
            });
            // console.log('Login response:', response.data);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error('Response status:', error.response.status);;
            } else if (error.request) {
                console.error('No response received. Request details:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
            throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
        }
    },

    getCurrentUser: async () => {
        console.log('Preparing to send getCurrentUser request...');
        console.log('Request URL:', `${API_URL}/auth/me`);
        try {
            const response = await axios.get(`${API_URL}/auth/me`);
            console.log('Get current user response:', response.data);
            console.log('Response status:', response.status);
            return response.data; 
        } catch (error) {
            console.error('Error fetching current user:', error.message);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }
            throw new Error('Không thể lấy thông tin user');
        }
    }
};

export default loginService;