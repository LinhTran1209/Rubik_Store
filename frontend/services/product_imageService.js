import axios from 'axios';

const API_URL = 'http://localhost:5000/product_images';



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

const product_imagesService = {
    getByIdProduct: async (id_product) => {
        try {
            const response = await axios.get(`${API_URL}/${id_product}`);
            const data = response.data || [];
            return formatDateFields(data);
        } catch (error) {
            console.error(`Error fetching details for invoice ${id_product}:`, error.response?.data || error.message);
            throw new Error('Error fetching details');
        }
    },
    add: async (Data) => {
        try {
            const response = await axios.post(API_URL, Data);
            return response.data;
        } catch (error) {
            console.error('Error adding detail:', error.response?.data || error.message);
            throw new Error('Error adding detail');
        }
    },
    update: async (id_image, Data) => {
        try {
            const response = await axios.put(`${API_URL}/${id_image}`, Data);
            return response.data;
        } catch (error) {
            console.error(`Error updating detail for ${id_image}:`, error.response?.data || error.message);
            throw new Error('Error updating detail');
        }
    },
    delete: async (id_image) => {
        try {
            const response = await axios.delete(`${API_URL}/${id_image}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting detail for ${id_image}:`, error.response?.data || error.message);
            throw new Error('Error deleting detail');
        }
    },


    setMainImage: async (id_image, id_product, image_url, is_main) => {
        try {
            const response = await axios.post(`${API_URL}/set-main-image`, {
                id_image,
                id_product,
                image_url,
                is_main,
            });
            return response.data;
        } catch (error) {
            console.error(`Error setting main image for ${id_image}:`, error.response?.data || error.message);
            throw new Error('Error setting main image');
        }
    },

    deleteImage: async (id_image, id_product) => {
        try {
            const response = await axios.post(`${API_URL}/delete-image`, {
                id_image,
                id_product,
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting product image for ${id_image}:`, error.response?.data || error.message);
            throw new Error('Error deleting product image');
        }
    },
};

export default product_imagesService;