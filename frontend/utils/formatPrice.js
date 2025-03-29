export const formatPrice = (value) => {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        minimumFractionDigits: 0,
    }).format(value);
};