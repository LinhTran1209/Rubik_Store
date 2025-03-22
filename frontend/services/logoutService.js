import axios from 'axios';

const API_URL = 'http://localhost:5000/auth';

const logoutService = {
    logout: async (phone, password, id_role) => {
        console.log('Request URL:', `${API_URL}/logout`);
        try {
            const response = await axios.post(`${API_URL}/logout`, {
                phone,
                password,
                id_role
            }, {
                withCredentials: true // Cho phép gửi cookie
            });
            // console.log('logout response:', response.data);
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

};

export default logoutService;