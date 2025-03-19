import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import supplierService from '../../services/supplierService';
import GenericTable from '../../components/Admin_page/GenericTable';
import GenericForm from '../../components/Admin_page/GenericForm';
import ConfirmDeleteDialog from '../../components/Admin_page/ConfirmDeleteDialog';


function Supplier() {
    const [suppliers, setsuppliers] = useState([]);
    const [supplier, setsupplier] = useState({ id_supplier: null, name: '', email: '', phone: '', address: '', created_at: '', updated_at: '' });
    const [globalFilter, setGlobalFilter] = useState('');
    const [supplierDialog, setsupplierDialog] = useState(false);
    const [deletesupplierDialog, setDeletesupplierDialog] = useState(false);
    const [deletesuppliersDialog, setDeletesuppliersDialog] = useState(false);
    const [selectedsuppliers, setSelectedsuppliers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);


    const show = async () => {
        try {
            const data = await supplierService.getAllsuppliers();
            setsuppliers(data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu', life: 3000 });
        }
    };

    useEffect(() => {
        show();
    }, []);

    const openNew = () => {
        setsupplier({ id_supplier: null, name: '', email: '', phone: '', address: '', status: 'hiện' });
        setSubmitted(false);
        setsupplierDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setsupplierDialog(false);
    };

    const savesupplier = () => {
        setSubmitted(true);

        // Kiểm tra các trường bắt buộc
        if (!supplier.name || !supplier.email || !supplier.phone || !supplier.address) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc', life: 3000 });
            return;
        }

        const supplierData = { ...supplier };
        if (supplier.id_supplier) { // Cập nhật nhà cung cấp
            // Kiểm tra xem có cập nhật thông tin nào không
            if (suppliers.some(supplier => JSON.stringify(supplier) === JSON.stringify(supplierData))) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không có thay đổi nào được thực hiện' });
                return;
            }
            // Kiểm tra có trùng email trong bảng không trừ chính nó
            if (suppliers.some(supplier => supplier.email === supplierData.email && supplier.id_supplier !== supplierData.id_supplier)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Email đã có trong danh sách'})
                return;
            }
            // Kiểm tra có trùng phone trong bảng không trừ chính nó
            if (suppliers.some(supplier => supplier.phone === supplierData.phone && supplier.id_supplier !== supplierData.id_supplier)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số điện thoại đã có trong danh sách'})
                return;
            }

            // Cập nhật nhà cung cấp

            supplierData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
            supplierData.created_at = new Date(new Date(supplierData.created_at).setDate(new Date(supplierData.created_at).getDate() + 1)).toISOString().split('T')[0];

            console.log(supplierData)
            supplierService.updatesupplier(supplier.id_supplier, supplierData)
                .then(() => {
                    show();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại', life: 3000 });
                });

        } else {// Thêm nhà cung cấp mới
            // Kiểm tra có trùng email trong bảng không
            if (suppliers.some(supplier => supplier.email === supplierData.email)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Email đã có trong danh sách'})
                return;
            }
            // Kiểm tra có trùng phone trong bảng không
            if (suppliers.some(supplier => supplier.phone === supplierData.phone)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số điện thoại đã có trong danh sách'})
                return;
            }
            // Thêm nhà cung cấp mới
            supplierService.addsupplier(supplierData)
                .then(() => {
                    show();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm thành công', life: 3000 });
                })
                .catch(error => {
                    // toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thêm thất bại', life: 3000 });
                });
        }

        setsupplierDialog(false);
        setsupplier({ id_supplier: null, id_role: '', name: '', email: '', phone: '', address: '', status: 'hiện' });
    };

    const editsupplier = (epl) => {
        setsupplier({ ...epl });
        setsupplierDialog(true);
    };

    const confirmDeletesupplier = (epl) => {
        setsupplier(epl);
        setDeletesupplierDialog(true);
    };

    const deletesupplier = () => {
        supplierService.deletesupplier(supplier.id_supplier)
            .then(() => {
                show();
                setDeletesupplierDialog(false);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
    };

    const confirmDeleteSelected = () => {
        setDeletesuppliersDialog(true);
    };

    const deleteSelectedsuppliers = () => {
        Promise.all(selectedsuppliers.map(item => supplierService.deletesupplier(item.id_supplier)))
            .then(() => {
                show();
                setDeletesuppliersDialog(false);
                setSelectedsuppliers(null);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa nhiều thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
    };

    const onInputChange = (e, itemname) => {
        const val = (e.target && e.target.value) || '';
        setsupplier(prev => ({ ...prev, [itemname]: val }));
    };

    const columns = [
        { field: 'id_supplier', header: 'ID' },
        { field: 'name', header: 'Nhà cung cấp' },
        { field: 'email', header: 'Email' },
        { field: 'phone', header: 'Số điện thoại' },
        { field: 'address', header: 'Địa chỉ' },
        { field: 'created_at', header: 'Ngày tạo' },
        { field: 'updated_at', header: 'Ngày cập nhật' },
    ];

    return (
        <div>
            <Toast ref={toast} />
            <GenericTable
                data={suppliers}
                selectedItems={selectedsuppliers}
                setSelectedItems={setSelectedsuppliers}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                columns={columns}
                onEdit={editsupplier}
                onDelete={confirmDeletesupplier}
                onDeleteSelected={confirmDeleteSelected}
                openNew={openNew}
                dataKey="id_supplier"
                title="Quản lý danh sách nhà cung cấp"
            />
            <GenericForm
                visible={supplierDialog}
                item={supplier}
                fields={[
                    { name: 'id_supplier', label: 'ID', disabled: true, hidden: !supplier.id_supplier }, // Ẩn khi thêm, readonly khi sửa
                    { name: 'name', label: 'Nhà cung cấp', required: true },
                    { name: 'email', label: 'Email', required: true },
                    { name: 'phone', label: 'Số điện thoại', required: true },
                    { name: 'address', label: 'Địa chỉ', required: true },
                    { name: 'created_at', label: 'Ngày tạo', required: true, disabled: true, hidden: !supplier.id_supplier },
                    { name: 'updated_at', label: 'Ngày cập nhật', required: true, disabled: true, hidden: !supplier.id_supplier },
                ]}
                onChange={onInputChange}
                onSave={savesupplier}
                onHide={hideDialog}
                submitted={submitted}
                title={supplier.id_supplier ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'}
            />
            <ConfirmDeleteDialog
                visible={deletesupplierDialog}
                onHide={() => setDeletesupplierDialog(false)}
                onConfirm={deletesupplier}
                item={supplier}
                idField="id_supplier"
            />
            <ConfirmDeleteDialog
                visible={deletesuppliersDialog}
                onHide={() => setDeletesuppliersDialog(false)}
                onConfirm={deleteSelectedsuppliers}
                multiple={true}
                title="Xác nhận xóa nhiều"
            />
        </div>
    );
};

export default Supplier;