import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import roleService from '../../../services/roleService';
import GenericTable from '../../../components/Admin_page/GenericTable';
import GenericForm from '../../../components/Admin_page/GenericForm';
import ConfirmDeleteDialog from '../../../components/Admin_page/ConfirmDeleteDialog';


const Role = () => {
    const [roles, setroles] = useState([]);
    const [role, setrole] = useState({ id_role: null, name: '', desc: '' });
    const [globalFilter, setGlobalFilter] = useState('');
    const [roleDialog, setroleDialog] = useState(false);
    const [deleteroleDialog, setDeleteroleDialog] = useState(false);
    const [deleterolesDialog, setDeleterolesDialog] = useState(false);
    const [selectedroles, setSelectedroles] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);


    const show = async () => {
        try {
            const data = await roleService.getAllroles();
            setroles(data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu', life: 3000 });
        }
    };

    useEffect(() => {
        show();
    }, []);

    const openNew = () => {
        setrole({ id_role: null, name: '', desc: '' });
        setSubmitted(false);
        setroleDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setroleDialog(false);
    };

    const saverole = () => {
        setSubmitted(true);

        // Kiểm tra các trường bắt buộc
        if ( !role.name ) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền tên quyền', life: 3000 });
            return;
        }

        const roleData = { ...role };
        if (role.id_role) {
            // Kiểm tra xem có cập nhật thông tin nào không
            if (roles.some(role => JSON.stringify(role) === JSON.stringify(roleData))) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không có thay đổi nào được thực hiện' });
                return;
            }
            // Kiểm tra có trùng tên quyền trong bảng không
            if (roles.some(role => role.name === roleData.name)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Tên quyền đã có trong danh sách'})
                return;
            }
            // Cập nhật quyền
            roleService.updaterole(role.id_role, roleData)
                .then(() => {
                    show();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại', life: 3000 });
                });
        } else {
            // Kiểm tra có trùng tên quyền trong bảng không
            if (roles.some(role => role.name === roleData.name)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Tên quyền đã có trong danh sách'})
                return;
            }
            // Thêm quyền mới
            roleService.addrole(roleData)
                .then(() => {
                    show();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm thành công', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thêm thất bại', life: 3000 });
                });
        }

        setroleDialog(false);
        setrole({ id_role: null, name: '', desc: '' });
    };

    const editrole = (epl) => {
        setrole({ ...epl });
        setroleDialog(true);
    };

    const confirmDeleterole = (epl) => {
        setrole(epl);
        setDeleteroleDialog(true);
    };

    const deleterole = () => {
        roleService.deleterole(role.id_role)
            .then(() => {
                show();
                setDeleteroleDialog(false);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
    };

    const confirmDeleteSelected = () => {
        setDeleterolesDialog(true);
    };

    const deleteSelectedroles = () => {
        Promise.all(selectedroles.map(item => roleService.deleterole(item.id_role)))
            .then(() => {
                show();
                setDeleterolesDialog(false);
                setSelectedroles(null);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa nhiều thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
    };

    const onInputChange = (e, itemname) => {
        const val = (e.target && e.target.value) || '';
        setrole(prev => ({ ...prev, [itemname]: val }));
    };

    const columns = [
        { field: 'id_role', header: 'ID' },
        { field: 'name', header: 'Tên quyền' },
        { field: 'desc', header: 'Mô tả' },
    ];

    return (
        <div>
            <Toast ref={toast} />
            <GenericTable
                data={roles}
                selectedItems={selectedroles}
                setSelectedItems={setSelectedroles}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                columns={columns}
                onEdit={editrole}
                onDelete={confirmDeleterole}
                onDeleteSelected={confirmDeleteSelected}
                openNew={openNew}
                dataKey="id_role"
                title="Quản lý danh sách quyền"
            />
            <GenericForm
                visible={roleDialog}
                item={role}
                fields={[
                    { name: 'id_role', label: 'ID', disabled: true, hidden: !role.id_role }, // Ẩn khi thêm, readonly khi sửa
                    { name: 'name', label: 'Tên quyền', required: true },
                    { name: 'desc', label: 'Mô tả', required: true },
                ]}
                onChange={onInputChange}
                onSave={saverole}
                onHide={hideDialog}
                submitted={submitted}
                title={role.id_role ? 'Sửa quyền' : 'Thêm quyền'}
            />
            <ConfirmDeleteDialog
                visible={deleteroleDialog}
                onHide={() => setDeleteroleDialog(false)}
                onConfirm={deleterole}
                item={role}
                idField="id_role"
            />
            <ConfirmDeleteDialog
                visible={deleterolesDialog}
                onHide={() => setDeleterolesDialog(false)}
                onConfirm={deleteSelectedroles}
                multiple={true}
                title="Xác nhận xóa nhiều"
            />
        </div>
    );
};

export default Role;