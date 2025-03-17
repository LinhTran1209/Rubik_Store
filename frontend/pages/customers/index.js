import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import customerService from '../../services/customerService';
import roleService from '../../services/roleService'
import GenericTable from '../../components/Admin_page/GenericTable';
import GenericForm from '../../components/Admin_page/GenericForm';
import ConfirmDeleteDialog from '../../components/Admin_page/ConfirmDeleteDialog';


function customer() {
    const [customers, setcustomers] = useState([]);
    const [customer, setcustomer] = useState({ id_customer: null, name: '', email: '', phone: '', address: '', created_at: '', updated_at: '' });
    const [roles, setRoles] = useState([]); // Danh sách roles để kiểm tra id_role
    const [globalFilter, setGlobalFilter] = useState('');
    const [customerDialog, setcustomerDialog] = useState(false);
    const [deletecustomerDialog, setDeletecustomerDialog] = useState(false);
    const [deletecustomersDialog, setDeletecustomersDialog] = useState(false);
    const [selectedcustomers, setSelectedcustomers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);

    // Lấy danh sách roles
    const fetchRoles = async () => {
        try {
            const data = await roleService.getAllroles();
            setRoles(data);
        } catch (error) {
            console.error('Error fetching roles:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách quyền', life: 3000 });
        }
    };

    const show = async () => {
        try {
            const data = await customerService.getAllcustomers();
            setcustomers(data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu', life: 3000 });
        }
    };

    useEffect(() => {
        show();
        fetchRoles();
    }, []);

    const openNew = () => {
        setcustomer({ id_customer: null, name: '', email: '', phone: '', address: '', status: 'hiện' });
        setSubmitted(false);
        setcustomerDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setcustomerDialog(false);
    };

    const savecustomer = () => {
        setSubmitted(true);

        // Kiểm tra các trường bắt buộc
        if (!customer.name || !customer.email || !customer.phone || !customer.address) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc', life: 3000 });
            return;
        }

        const customerData = { ...customer };
        if (customer.id_customer) { // Cập nhật khách hàng
            // Kiểm tra xem có cập nhật thông tin nào không
            if (customers.some(customer => JSON.stringify(customer) === JSON.stringify(customerData))) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không có thay đổi nào được thực hiện' });
                return;
            }
            // Kiểm tra có trùng email trong bảng không trừ chính nó
            if (customers.some(customer => customer.email === customerData.email && customer.id_customer !== customerData.id_customer)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Email đã có trong danh sách'})
                return;
            }
            // Kiểm tra có trùng phone trong bảng không trừ chính nó
            if (customers.some(customer => customer.phone === customerData.phone && customer.id_customer !== customerData.id_customer)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số điện thoại đã có trong danh sách'})
                return;
            }

            // Cập nhật khách hàng

            customerData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
            customerData.created_at = new Date(new Date(customerData.created_at).setDate(new Date(customerData.created_at).getDate() + 1)).toISOString().split('T')[0];

            console.log(customerData)
            customerService.updatecustomer(customer.id_customer, customerData)
                .then(() => {
                    show();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại', life: 3000 });
                });

        } else {// Thêm khách hàng mới
            // Kiểm tra có trùng email trong bảng không
            if (customers.some(customer => customer.email === customerData.email)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Email đã có trong danh sách'})
                return;
            }
            // Kiểm tra có trùng phone trong bảng không
            if (customers.some(customer => customer.phone === customerData.phone)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số điện thoại đã có trong danh sách'})
                return;
            }
            // Thêm khách hàng mới
            customerService.addcustomer(customerData)
                .then(() => {
                    show();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm thành công', life: 3000 });
                })
                .catch(error => {
                    // toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thêm thất bại', life: 3000 });
                });
        }

        setcustomerDialog(false);
        setcustomer({ id_customer: null, id_role: '', name: '', email: '', phone: '', address: '', status: 'hiện' });
    };

    const editcustomer = (epl) => {
        setcustomer({ ...epl });
        setcustomerDialog(true);
    };

    const confirmDeletecustomer = (epl) => {
        setcustomer(epl);
        setDeletecustomerDialog(true);
    };

    const deletecustomer = () => {
        customerService.deletecustomer(customer.id_customer)
            .then(() => {
                show();
                setDeletecustomerDialog(false);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
    };

    const confirmDeleteSelected = () => {
        setDeletecustomersDialog(true);
    };

    const deleteSelectedcustomers = () => {
        Promise.all(selectedcustomers.map(item => customerService.deletecustomer(item.id_customer)))
            .then(() => {
                show();
                setDeletecustomersDialog(false);
                setSelectedcustomers(null);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa nhiều thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
    };

    const onInputChange = (e, itemname) => {
        const val = (e.target && e.target.value) || '';
        setcustomer(prev => ({ ...prev, [itemname]: val }));
    };

    const columns = [
        { field: 'id_customer', header: 'ID' },
        { field: 'name', header: 'Họ tên' },
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
                data={customers}
                selectedItems={selectedcustomers}
                setSelectedItems={setSelectedcustomers}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                columns={columns}
                onEdit={editcustomer}
                onDelete={confirmDeletecustomer}
                onDeleteSelected={confirmDeleteSelected}
                openNew={openNew}
                dataKey="id_customer"
                title="Quản lý danh sách khách hàng"
            />
            <GenericForm
                visible={customerDialog}
                item={customer}
                fields={[
                    { name: 'id_customer', label: 'ID', disabled: true, hidden: !customer.id_customer }, // Ẩn khi thêm, readonly khi sửa
                    { name: 'name', label: 'Họ tên', required: true },
                    { name: 'email', label: 'Email', required: true },
                    { name: 'phone', label: 'Số điện thoại', required: true },
                    { name: 'address', label: 'Địa chỉ', required: true },
                    { name: 'created_at', label: 'Ngày tạo', required: true, disabled: true, hidden: !customer.id_customer },
                    { name: 'updated_at', label: 'Ngày cập nhật', required: true, disabled: true, hidden: !customer.id_customer },
                ]}
                onChange={onInputChange}
                onSave={savecustomer}
                onHide={hideDialog}
                submitted={submitted}
                title={customer.id_customer ? 'Sửa khách hàng' : 'Thêm khách hàng'}
            />
            <ConfirmDeleteDialog
                visible={deletecustomerDialog}
                onHide={() => setDeletecustomerDialog(false)}
                onConfirm={deletecustomer}
                item={customer}
                idField="id_customer"
            />
            <ConfirmDeleteDialog
                visible={deletecustomersDialog}
                onHide={() => setDeletecustomersDialog(false)}
                onConfirm={deleteSelectedcustomers}
                multiple={true}
                title="Xác nhận xóa nhiều"
            />
        </div>
    );
};

export default customer;