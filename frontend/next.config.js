/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    trailingSlash: true,
    env: {
        API_URL_BACK_END: process.env.API_URL_BACK_END,
      },
};

module.exports = nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     trailingSlash: true, // Thêm trailing slash để tương thích với GitHub Pages
//     basePath: '/Rubik_Store', // Thay 'Rubik_Store' bằng tên repository của bạn
//     images: {
//         unoptimized: true, // Vô hiệu hóa tối ưu hóa hình ảnh vì GitHub Pages không hỗ trợ Image Optimization API của Next.js
//     },
// };

// module.exports = nextConfig;
