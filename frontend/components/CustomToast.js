import React, { forwardRef } from 'react';
import { Toast } from 'primereact/toast';

// Ghi đè chỉ dùng cho bên người dùng, do bên toast primereact bị ăn cùng layoutWeb lên lỗi kích  thước cần css lại

const CustomToast = forwardRef((props, ref) => {
    return (
        <Toast
            {...props}
            ref={ref}
            className="custom-toast p-custom-component p-custom-toast-top-right"
            style={{
                width: '350px',
                maxWidth: '350px',
            }}
        />
    );
});

export default CustomToast;