export const renderImageTable = ({ src, field }) => {
    return src[field] ? (
        <img src={src[field]} alt="Preview" style={{ width: '50%', height: '100%', objectFit: 'contain', display: 'flex' }} />
    ) : (
        'No Image'
    );
};