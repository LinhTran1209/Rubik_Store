import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import newService from '../../../services/newService';

import GenericTable from '../../../components/Admin_page/GenericTable';
import GenericForm from '../../../components/Admin_page/GenericForm';
import ConfirmDeleteDialog from '../../../components/Admin_page/ConfirmDeleteDialog';

import loginService from '../../../services/loginService';


const New = () => {
    const [new1s, setnews] = useState([]);
    const [new1, setnew] = useState({ id_new: null, title: '', desc: '', image_url: '', href: '', created_at: '', updated_at: '' });

    const [globalFilter, setGlobalFilter] = useState('');
    const [new1Dialog, setnewDialog] = useState(false);
    const [deletenew1Dialog, setDeletenew1Dialog] = useState(false);
    const [deletenew1sDialog, setDeletenew1sDialog] = useState(false);
    const [selectednew1s, setSelectednew1s] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);

    // Kiểm tra quyền admin
    const [userRole, setUserRole] = useState(null);

    const show = async () => {
        try {
            const data = await newService.getAllnews();
            setnews(data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu', life: 3000 });
        }
    };

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const user = await loginService.getCurrentUser();
                setUserRole(user.role);
            } catch (error) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Bạn cần đăng nhập để vào trang này!', life: 3000 });
                setUserRole(null);
            } 
        };
        fetchUserRole();
    }, []); // Chỉ chạy một lần khi component được mount
    
    useEffect(() => {
        if (userRole === 'admin') {
            show(); // Gọi show() khi userRole là 'admin'
        }
    }, [userRole]);

    const openNew = () => {
        setnew({ id_new: null, title: '', desc: '', image_url: '', href: ''});
        setSubmitted(false);
        setnewDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setnewDialog(false);
    };

    const savenew1 = () => {
        setSubmitted(true);

        // Kiểm tra các trường bắt buộc
        if (!new1.title || !new1.image_url || !new1.href ) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc', life: 3000 });
            return;
        }
        
        const new1Data = { ...new1 };
        console.log(new1)
        if (new1.id_new) { // Cập nhật tin tức
            // Kiểm tra xem có cập nhật thông tin nào không
            if (new1s.some(new1 => JSON.stringify(new1) === JSON.stringify(new1Data))) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không có thay đổi nào được thực hiện' });
                return;
            }


            // Cập nhật tin tức

            new1Data.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
            new1Data.created_at = new Date(new Date(new1Data.created_at).setDate(new Date(new1Data.created_at).getDate() + 1)).toISOString().split('T')[0];

            newService.updatenew(new1.id_new, new1Data)
                .then(() => {
                    show();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại', life: 3000 });
                });

        } else {// Thêm tin tức mới
            newService.addnew(new1Data)
                .then(() => {
                    show();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm thành công', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thêm thất bại', life: 3000 });
                });
        }

        setnewDialog(false);
        setnew({ id_new: null, title: '', desc: '', image_url: '', href: '', created_at: '', updated_at: '' });
    };

    const editnew1 = (epl) => {
        setnew({ ...epl });
        setnewDialog(true);
    };

    const confirmDeletenew1 = (epl) => {
        setnew(epl);
        setDeletenew1Dialog(true);
    };

    const deletenew1 = () => {
        newService.deletenew(new1.id_new)
            .then(() => {
                show();
                setDeletenew1Dialog(false);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
    };

    const confirmDeleteSelected = () => {
        setDeletenew1sDialog(true);
    };

    const deleteSelectednew1s = () => {
        Promise.all(selectednew1s.map(item => newService.deletenew(item.id_new)))
            .then(() => {
                show();
                setDeletenew1sDialog(false);
                setSelectednew1s(null);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa nhiều thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
    };

    const onInputChange = (e, itemname) => {
        const val = (e.target && e.target.value) || '';
        setnew(prev => ({ ...prev, [itemname]: val }));
    };

    const columns = [
        { field: 'id_new', header: 'ID' },
        { field: 'title', header: 'Tiêu đề' },
        { field: 'desc', header: 'Mô tả' },
        { field: 'image_url', header: 'Link ảnh' },
        { field: 'href', header: 'Link bài viết' },
        { field: 'created_at', header: 'Ngày tạo' },
        { field: 'updated_at', header: 'Ngày cập nhật' },
    ];

    return (
        <div>
            <Toast ref={toast} />
            <GenericTable
                visible={true ? userRole === 'admin' : false}
                data={new1s}
                selectedItems={selectednew1s}
                setSelectedItems={setSelectednew1s}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                columns={columns}
                onEdit={editnew1}
                onDelete={confirmDeletenew1}
                onDeleteSelected={confirmDeleteSelected}
                openNew={openNew}
                dataKey="id_new1"
                title="Quản lý danh sách tin tức"
            />
            <GenericForm
                visible={new1Dialog}
                item={new1}
                fields={[
                    { name: 'id_new', label: 'ID', disabled: true, hidden: !new1.id_new }, // Ẩn khi thêm, readonly khi sửa
                    { name: 'title', label: 'Tiêu đề', required: true },
                    { name: 'desc', label: 'Mô tả', required: true },
                    { name: 'image_url', label: 'Link ảnh', required: true },
                    { name: 'href', label: 'Link bài viết', required: true },
                    { name: 'created_at', label: 'Ngày tạo', required: true, disabled: true, hidden: !new1.id_new1 },
                    { name: 'updated_at', label: 'Ngày cập nhật', required: true, disabled: true, hidden: !new1.id_new1 },
                ]}
                onChange={onInputChange}
                onSave={savenew1}
                onHide={hideDialog}
                submitted={submitted}
                title={new1.id_new1 ? 'Sửa tin tức' : 'Thêm tin tức'}
            />
            <ConfirmDeleteDialog
                visible={deletenew1Dialog}
                onHide={() => setDeletenew1Dialog(false)}
                onConfirm={deletenew1}
                item={new1}
                idField="id_new"
            />
            <ConfirmDeleteDialog
                visible={deletenew1sDialog}
                onHide={() => setDeletenew1sDialog(false)}
                onConfirm={deleteSelectednew1s}
                multiple={true}
                title="Xác nhận xóa nhiều"
            />
        </div>
    );
};

export default New;