import ConfirmDeleteDialog from '../../../components/Admin_page/ConfirmDeleteDialog';
import GenericTable from '../../../components/Admin_page/GenericTable';
import GenericForm from '../../../components/Admin_page/GenericForm';
import React, { useState, useEffect, useRef } from 'react';
import userService from '../../../services/userService';
import authService from '../../../services/authService';
import { Toast } from 'primereact/toast';


function User() {
    const [users, setusers] = useState([]);
    const [user, setuser] = useState({ id_user: null, role: '', name: '', email: '', phone: '', address: '', created_at: '', updated_at: '' });
    const [globalFilter, setGlobalFilter] = useState('');
    const [userDialog, setuserDialog] = useState(false);
    const [deleteuserDialog, setDeleteuserDialog] = useState(false);
    const [deleteusersDialog, setDeleteusersDialog] = useState(false);
    const [selectedusers, setSelectedusers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);

    // Kiểm tra quyền admin
    const [userRole, setUserRole] = useState(null); 

    const show = async () => {
        try {
            const data = await userService.getAllusers();
            setusers(data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu', life: 3000 });
        }
    };
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const user = await authService.getCurrentUser();
                setUserRole(user.role);
            } catch (error) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Bạn cần đăng nhập để vào trang này!', life: 3000 });
                setUserRole(null);
            } 
        };
        fetchUserRole();
    }, []); 
    
    useEffect(() => {
        if (userRole === 'admin') {
            show(); 
        }
    }, [userRole]);

    const openNew = () => {
        setuser({ id_user: null, role: 'customer', name: '', email: '', phone: '', address: '', status: 'hiện' });
        setSubmitted(false);
        setuserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setuserDialog(false);
    };

    const saveuser = () => {
        setSubmitted(true);

        // Kiểm tra các trường bắt buộc
        if (!user.name || !user.role || !user.email || !user.phone || !user.address) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc', life: 3000 });
            return;
        }
        // Kiểm tra quyền chỉ được là "admin" hoặc "customer"
        if (user.role !== 'admin' && user.role !== 'customer') {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Quyền chỉ được là "admin" hoặc "customer"'})
            return;
        }

        const userData = { ...user };
        if (user.id_user) { // Cập nhật người dùng
            // Kiểm tra xem có cập nhật thông tin nào không
            if (users.some(user => JSON.stringify(user) === JSON.stringify(userData))) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không có thay đổi nào được thực hiện' });
                return;
            }
            // Kiểm tra có trùng email trong bảng không trừ chính nó
            if (users.some(user => user.email === userData.email && user.id_user !== userData.id_user)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Email đã có trong danh sách'})
                return;
            }
            // Kiểm tra có trùng phone trong bảng không trừ chính nó
            if (users.some(user => user.phone === userData.phone && user.id_user !== userData.id_user)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số điện thoại đã có trong danh sách'})
                return;
            }

            // Cập nhật người dùng

            userData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
            userData.created_at = new Date(new Date(userData.created_at).setDate(new Date(userData.created_at).getDate() + 1)).toISOString().split('T')[0];

            userService.updateuser(user.id_user, userData)
                .then(() => {
                    show();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại', life: 3000 });
                });

        } else {// Thêm người dùng mới
            // Kiểm tra có trùng email trong bảng không
            if (users.some(user => user.email === userData.email)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Email đã có trong danh sách'})
                return;
            }
            // Kiểm tra có trùng phone trong bảng không
            if (users.some(user => user.phone === userData.phone)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số điện thoại đã có trong danh sách'})
                return;
            }
            // Thêm người dùng mới
            userService.adduser(userData)
                .then(() => {
                    show();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm thành công', life: 3000 });
                })
                .catch(error => {
                    // toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thêm thất bại', life: 3000 });
                });
        }

        setuserDialog(false);
        setuser({ id_user: null, id_role: '', name: '', email: '', phone: '', address: '', status: 'hiện' });
    };

    const edituser = (epl) => {
        setuser({ ...epl });
        setuserDialog(true);
    };

    const confirmDeleteuser = (epl) => {
        setuser(epl);
        setDeleteuserDialog(true);
    };

    const deleteuser = () => {
        userService.deleteuser(user.id_user)
            .then(() => {
                show();
                setDeleteuserDialog(false);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
    };

    const confirmDeleteSelected = () => {
        setDeleteusersDialog(true);
    };

    const deleteSelectedusers = () => {
        Promise.all(selectedusers.map(item => userService.deleteuser(item.id_user)))
            .then(() => {
                show();
                setDeleteusersDialog(false);
                setSelectedusers(null);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa nhiều thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
    };

    const onInputChange = (e, itemname) => {
        const val = (e.target && e.target.value) || '';
        setuser(prev => ({ ...prev, [itemname]: val }));
    };


    // các option cho role
    const roleOptions = [
        { label: 'customer', value: 'customer' },
        { label: 'admin', value: 'admin' },
    ]

    const columns = [
        { field: 'id_user', header: 'ID' },
        { field: 'role', header: 'Quyền hạn' },
        { field: 'name', header: 'Họ tên' },
        { field: 'email', header: 'Email' },
        { field: 'phone', header: 'Số điện thoại' },
        { field: 'address', header: 'Địa chỉ' },
        { field: 'created_at', header: 'Ngày tạo', format: 'date' },
        { field: 'updated_at', header: 'Ngày cập nhật', format: 'date' },
    ];

    return (
        <div>
            <Toast ref={toast} />
            <GenericTable
                visible={true ? userRole === 'admin' : false}
                data={users}
                selectedItems={selectedusers}
                setSelectedItems={setSelectedusers}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                columns={columns}
                onEdit={edituser}
                onDelete={confirmDeleteuser}
                onDeleteSelected={confirmDeleteSelected}
                openNew={openNew}
                dataKey="id_user"
                title="Quản lý danh sách người dùng"
            />
            <GenericForm
                visible={userDialog}
                item={user}
                fields={[
                    { name: 'id_user', label: 'ID', disabled: true, hidden: !user.id_user }, // Ẩn khi thêm, hiện khi sửa
                    { name: 'role', label: 'Quyền', required: true, type: 'dropdown', options: roleOptions },
                    { name: 'name', label: 'Họ tên', required: true },
                    { name: 'email', label: 'Email', required: true },
                    { name: 'phone', label: 'Số điện thoại', required: true },
                    { name: 'address', label: 'Địa chỉ', required: true },
                    { name: 'created_at', label: 'Ngày tạo', required: true, disabled: true, hidden: !user.id_user, type: 'date' },
                    { name: 'updated_at', label: 'Ngày cập nhật', required: true, disabled: true, hidden: !user.id_user, type: 'date' },
                ]}
                onChange={onInputChange}
                onSave={saveuser}
                onHide={hideDialog}
                submitted={submitted}
                title={user.id_user ? 'Sửa người dùng' : 'Thêm người dùng'}
            />
            <ConfirmDeleteDialog
                visible={deleteuserDialog}
                onHide={() => setDeleteuserDialog(false)}
                onConfirm={deleteuser}
                item={user}
                idField="id_user"
            />
            <ConfirmDeleteDialog
                visible={deleteusersDialog}
                onHide={() => setDeleteusersDialog(false)}
                onConfirm={deleteSelectedusers}
                multiple={true}
                title="Xác nhận xóa nhiều"
            />
        </div>
    );
};

export default User;