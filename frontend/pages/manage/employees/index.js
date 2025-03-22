// import React, { useState, useEffect, useRef } from 'react';
// import { Toast } from 'primereact/toast';
// import employeeService from '../../../services/employeeService';
// import roleService from '../../../services/roleService'
// import GenericTable from '../../../components/Admin_page/GenericTable';
// import GenericForm from '../../../components/Admin_page/GenericForm';
// import ConfirmDeleteDialog from '../../../components/Admin_page/ConfirmDeleteDialog';
// import axios from 'axios';

// // const API_URL = 'http://localhost:5000/roles'; // API để lấy danh sách roles

// const Employee = () => {
//     const [employees, setEmployees] = useState([]);
//     const [employee, setEmployee] = useState({ id_employee: null, id_role: '', name: '', email: '', phone: '', address: '' });
//     const [roles, setRoles] = useState([]); // Danh sách roles để kiểm tra id_role
//     const [globalFilter, setGlobalFilter] = useState('');
//     const [employeeDialog, setEmployeeDialog] = useState(false);
//     const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState(false);
//     const [deleteEmployeesDialog, setDeleteEmployeesDialog] = useState(false);
//     const [selectedEmployees, setSelectedEmployees] = useState(null);
//     const [submitted, setSubmitted] = useState(false);
//     const toast = useRef(null);

//     // Lấy danh sách roles
//     const fetchRoles = async () => {
//         try {
//             const data = await roleService.getAllroles();       
//             setRoles(data);
//         } catch (error) {
//             console.error('Error fetching roles:', error);
//             toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách quyền', life: 3000 });
//         }
//     };

//     const show = async () => {
//         try {
//             const data = await employeeService.getAllemployees();
//             setEmployees(data);
//         } catch (error) {
//             console.error('Lỗi khi lấy dữ liệu:', error);
//             toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu', life: 3000 });
//         }
//     };

//     useEffect(() => {
//         show();
//         fetchRoles();
//     }, []);

//     const openNew = () => {
//         setEmployee({ id_employee: null, id_role: '', name: '', email: '', phone: '', address: '', status: 'hiện' });
//         setSubmitted(false);
//         setEmployeeDialog(true);
//     };

//     const hideDialog = () => {
//         setSubmitted(false);
//         setEmployeeDialog(false);
//     };

//     const saveEmployee = () => {
//         setSubmitted(true);

//         // Kiểm tra các trường bắt buộc
//         if (!employee.id_role || !employee.name || !employee.email || !employee.phone || !employee.address) {
//             toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc', life: 3000 });
//             return;
//         }

//         // Kiểm tra id_role có tồn tại trong bảng Roles không
//         if (!roles.some(role => role.id_role === parseInt(employee.id_role))) {
//             toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Quyền không tại', life: 3000 });
//             return;
//         }


//         const employeeData = { ...employee };
//         console.log(employeeData)
//         if (employee.id_employee) { // Cập nhật nhân viên
//             // Kiểm tra xem có cập nhật thông tin nào không
//             if (employees.some(employee => JSON.stringify(employee) === JSON.stringify(employeeData))) {
//                 toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không có thay đổi nào được thực hiện' });
//                 return;
//             }
//             // Kiểm tra có trùng email trong bảng không trừ chính nó
//             if (employees.some(employee => employee.email === employeeData.email && employee.id_employee !== employeeData.id_employee)) {
//                 toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Email đã có trong danh sách'})
//                 return;
//             }
//             // Kiểm tra có trùng phone trong bảng không trừ chính nó
//             if (employees.some(employee => employee.phone === employeeData.phone && employee.id_employee !== employeeData.id_employee)) {
//                 toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số điện thoại đã có trong danh sách'})
//                 return;
//             }
//             // Cập nhật nhân viên
//             employeeData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
//             employeeData.created_at = new Date(new Date(employeeData.created_at).setDate(new Date(employeeData.created_at).getDate() + 1)).toISOString().split('T')[0];

//             employeeService.updateemployee(employeeData.id_employee, employeeData)
//                 .then(() => {
//                     show();
//                     toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
//                 })
//                 .catch(error => {
//                     toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại', life: 3000 });
//                 });

//         } else {// Thêm nhân viên mới
//             // Kiểm tra có trùng email trong bảng không
//             if (employees.some(employee => employee.email === employeeData.email)) {
//                 toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Email đã có trong danh sách'})
//                 return;
//             }
//             // Kiểm tra có trùng phone trong bảng không
//             if (employees.some(employee => employee.phone === employeeData.phone)) {
//                 toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số điện thoại đã có trong danh sách'})
//                 return;
//             }

//             console.log(employeeData)
//             // Thêm nhân viên mới
//             employeeService.addemployee(employeeData)
//                 .then(() => {
//                     show();
//                     toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm thành công', life: 3000 });
//                 })
//                 .catch(error => {
//                     // toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thêm thất bại', life: 3000 });
//                 });
//         }

//         setEmployeeDialog(false);
//         setEmployee({ id_employee: null, id_role: '', name: '', email: '', phone: '', address: '', status: 'hiện' });
//     };

//     const editEmployee = (epl) => {
//         setEmployee({ ...epl });
//         setEmployeeDialog(true);
//     };

//     const confirmDeleteEmployee = (epl) => {
//         setEmployee(epl);
//         setDeleteEmployeeDialog(true);
//     };

//     const deleteEmployee = () => {
//         employeeService.deleteemployee(employee.id_employee)
//             .then(() => {
//                 show();
//                 setDeleteEmployeeDialog(false);
//                 toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công', life: 3000 });
//             })
//             .catch(error => {
//                 toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
//             });
//     };

//     const confirmDeleteSelected = () => {
//         setDeleteEmployeesDialog(true);
//     };

//     const deleteSelectedEmployees = () => {
//         Promise.all(selectedEmployees.map(item => employeeService.deleteemployee(item.id_employee)))
//             .then(() => {
//                 show();
//                 setDeleteEmployeesDialog(false);
//                 setSelectedEmployees(null);
//                 toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa nhiều thành công', life: 3000 });
//             })
//             .catch(error => {
//                 toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
//             });
//     };

//     const onInputChange = (e, itemname) => {
//         const val = (e.target && e.target.value) || '';
//         setEmployee(prev => ({ ...prev, [itemname]: val }));
//     };

//     const columns = [
//         { field: 'id_employee', header: 'ID' },
//         { field: 'id_role', header: 'ID Quyền' },
//         { field: 'name', header: 'Họ tên' },
//         { field: 'email', header: 'Email' },
//         { field: 'phone', header: 'Số điện thoại' },
//         { field: 'address', header: 'Địa chỉ' },
//         { field: 'created_at', header: 'Ngày tạo' },
//         { field: 'updated_at', header: 'Ngày cập nhật' },
//     ];

//     return (
//         <div>
//             <Toast ref={toast} />
//             <GenericTable
//                 data={employees}
//                 selectedItems={selectedEmployees}
//                 setSelectedItems={setSelectedEmployees}
//                 globalFilter={globalFilter}
//                 setGlobalFilter={setGlobalFilter}
//                 columns={columns}
//                 onEdit={editEmployee}
//                 onDelete={confirmDeleteEmployee}
//                 onDeleteSelected={confirmDeleteSelected}
//                 openNew={openNew}
//                 dataKey="id_employee"
//                 title="Quản lý danh sách nhân viên"
//             />
//             <GenericForm
//                 visible={employeeDialog}
//                 item={employee}
//                 fields={[
//                     { name: 'id_employee', label: 'ID', disabled: true, hidden: !employee.id_employee }, // Ẩn khi thêm, readonly khi sửa
//                     { name: 'id_role', label: 'ID Quyền', required: true },
//                     { name: 'name', label: 'Họ tên', required: true },
//                     { name: 'email', label: 'Email', required: true },
//                     { name: 'phone', label: 'Số điện thoại', required: true },
//                     { name: 'address', label: 'Địa chỉ', required: true },
//                     { name: 'created_at', label: 'Ngày tạo', required: true, disabled: true, hidden: !employee.id_employee },
//                     { name: 'updated_at', label: 'Ngày cập nhật', required: true, disabled: true, hidden: !employee.id_employee },
//                 ]}
//                 onChange={onInputChange}
//                 onSave={saveEmployee}
//                 onHide={hideDialog}
//                 submitted={submitted}
//                 title={employee.id_employee ? 'Sửa Nhân viên' : 'Thêm Nhân viên'}
//             />
//             <ConfirmDeleteDialog
//                 visible={deleteEmployeeDialog}
//                 onHide={() => setDeleteEmployeeDialog(false)}
//                 onConfirm={deleteEmployee}
//                 item={employee}
//                 idField="id_employee"
//             />
//             <ConfirmDeleteDialog
//                 visible={deleteEmployeesDialog}
//                 onHide={() => setDeleteEmployeesDialog(false)}
//                 onConfirm={deleteSelectedEmployees}
//                 multiple={true}
//                 title="Xác nhận xóa nhiều"
//             />
//         </div>
//     );
// };

// export default Employee;









// import React, { useState, useEffect, useRef } from 'react';
// import { Toast } from 'primereact/toast';
// import employeeService from '../../../services/employeeService';
// import roleService from '../../../services/roleService';
// import GenericTable from '../../../components/Admin_page/GenericTable';
// import GenericForm from '../../../components/Admin_page/GenericForm';
// import ConfirmDeleteDialog from '../../../components/Admin_page/ConfirmDeleteDialog';
// import loginService from '../../../services/loginService';

// const Employee = () => {
//     const [employees, setEmployees] = useState([]);
//     const [employee, setEmployee] = useState({ id_employee: null, id_role: '', name: '', email: '', phone: '', address: '' });
//     const [roles, setRoles] = useState([]);
//     const [globalFilter, setGlobalFilter] = useState('');
//     const [employeeDialog, setEmployeeDialog] = useState(false);
//     const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState(false);
//     const [deleteEmployeesDialog, setDeleteEmployeesDialog] = useState(false);
//     const [selectedEmployees, setSelectedEmployees] = useState(null);
//     const [submitted, setSubmitted] = useState(false);
//     const toast = useRef(null);

//     useEffect(() => {
//         const checkAuth = async () => {
//             try {
//                 const user = await loginService.getCurrentUser();
//                 if (user.role !== 1) {
//                     window.location.href = '/auth/access';
//                 }
//             } catch (error) {
//                 window.location.href = '/auth/login';
//             }
//         };
//         checkAuth();
//         show();
//         fetchRoles();
//     }, []);

//     const fetchRoles = async () => {
//         try {
//             const data = await roleService.getAllroles();
//             setRoles(data);
//         } catch (error) {
//             toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách quyền', life: 3000 });
//         }
//     };

//     const show = async () => {
//         try {
//             const data = await employeeService.getAllemployees();
//             setEmployees(data);
//         } catch (error) {
//             toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu', life: 3000 });
//         }
//     };

//     const openNew = () => {
//         setEmployee({ id_employee: null, id_role: '', name: '', email: '', phone: '', address: '', status: 'hiện' });
//         setSubmitted(false);
//         setEmployeeDialog(true);
//     };

//     const hideDialog = () => {
//         setSubmitted(false);
//         setEmployeeDialog(false);
//     };

//     const saveEmployee = async () => {
//         setSubmitted(true);

//         if (!employee.id_role || !employee.name || !employee.email || !employee.phone || !employee.address) {
//             toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc', life: 3000 });
//             return;
//         }

//         if (!roles.some(role => role.id_role === parseInt(employee.id_role))) {
//             toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Quyền không tồn tại', life: 3000 });
//             return;
//         }

//         const employeeData = { ...employee };
//         try {
//             if (employee.id_employee) {
//                 if (employees.some(e => JSON.stringify(e) === JSON.stringify(employeeData))) {
//                     toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không có thay đổi nào được thực hiện' });
//                     return;
//                 }
//                 if (employees.some(e => e.email === employeeData.email && e.id_employee !== employeeData.id_employee)) {
//                     toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Email đã có trong danh sách' });
//                     return;
//                 }
//                 if (employees.some(e => e.phone === employeeData.phone && e.id_employee !== employeeData.id_employee)) {
//                     toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số điện thoại đã có trong danh sách' });
//                     return;
//                 }
//                 employeeData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
//                 employeeData.created_at = new Date(new Date(employeeData.created_at).setDate(new Date(employeeData.created_at).getDate() + 1)).toISOString().split('T')[0];

//                 await employeeService.updateemployee(employeeData.id_employee, employeeData);
//                 toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
//             } else {
//                 if (employees.some(e => e.email === employeeData.email)) {
//                     toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Email đã có trong danh sách' });
//                     return;
//                 }
//                 if (employees.some(e => e.phone === employeeData.phone)) {
//                     toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số điện thoại đã có trong danh sách' });
//                     return;
//                 }
//                 await employeeService.addemployee(employeeData);
//                 toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm thành công', life: 3000 });
//             }
//             show();
//             setEmployeeDialog(false);
//             setEmployee({ id_employee: null, id_role: '', name: '', email: '', phone: '', address: '', status: 'hiện' });
//         } catch (error) {
//             toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thao tác thất bại', life: 3000 });
//         }
//     };

//     const editEmployee = (epl) => {
//         setEmployee({ ...epl });
//         setEmployeeDialog(true);
//     };

//     const confirmDeleteEmployee = (epl) => {
//         setEmployee(epl);
//         setDeleteEmployeeDialog(true);
//     };

//     const deleteEmployee = async () => {
//         try {
//             await employeeService.deleteemployee(employee.id_employee);
//             show();
//             setDeleteEmployeeDialog(false);
//             toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công', life: 3000 });
//         } catch (error) {
//             toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
//         }
//     };

//     const confirmDeleteSelected = () => {
//         setDeleteEmployeesDialog(true);
//     };

//     const deleteSelectedEmployees = async () => {
//         try {
//             await Promise.all(selectedEmployees.map(item => employeeService.deleteemployee(item.id_employee)));
//             show();
//             setDeleteEmployeesDialog(false);
//             setSelectedEmployees(null);
//             toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa nhiều thành công', life: 3000 });
//         } catch (error) {
//             toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
//         }
//     };

//     const onInputChange = (e, itemname) => {
//         const val = (e.target && e.target.value) || '';
//         setEmployee(prev => ({ ...prev, [itemname]: val }));
//     };

//     const columns = [
//         { field: 'id_employee', header: 'ID' },
//         { field: 'id_role', header: 'ID Quyền' },
//         { field: 'name', header: 'Họ tên' },
//         { field: 'email', header: 'Email' },
//         { field: 'phone', header: 'Số điện thoại' },
//         { field: 'address', header: 'Địa chỉ' },
//         { field: 'created_at', header: 'Ngày tạo' },
//         { field: 'updated_at', header: 'Ngày cập nhật' },
//     ];

//     return (
//         <div>
//             <Toast ref={toast} />
//             <GenericTable
//                 data={employees}
//                 selectedItems={selectedEmployees}
//                 setSelectedItems={setSelectedEmployees}
//                 globalFilter={globalFilter}
//                 setGlobalFilter={setGlobalFilter}
//                 columns={columns}
//                 onEdit={editEmployee}
//                 onDelete={confirmDeleteEmployee}
//                 onDeleteSelected={confirmDeleteSelected}
//                 openNew={openNew}
//                 dataKey="id_employee"
//                 title="Quản lý danh sách nhân viên"
//             />
//             <GenericForm
//                 visible={employeeDialog}
//                 item={employee}
//                 fields={[
//                     { name: 'id_employee', label: 'ID', disabled: true, hidden: !employee.id_employee },
//                     { name: 'id_role', label: 'ID Quyền', required: true },
//                     { name: 'name', label: 'Họ tên', required: true },
//                     { name: 'email', label: 'Email', required: true },
//                     { name: 'phone', label: 'Số điện thoại', required: true },
//                     { name: 'address', label: 'Địa chỉ', required: true },
//                     { name: 'created_at', label: 'Ngày tạo', required: true, disabled: true, hidden: !employee.id_employee },
//                     { name: 'updated_at', label: 'Ngày cập nhật', required: true, disabled: true, hidden: !employee.id_employee },
//                 ]}
//                 onChange={onInputChange}
//                 onSave={saveEmployee}
//                 onHide={hideDialog}
//                 submitted={submitted}
//                 title={employee.id_employee ? 'Sửa Nhân viên' : 'Thêm Nhân viên'}
//             />
//             <ConfirmDeleteDialog
//                 visible={deleteEmployeeDialog}
//                 onHide={() => setDeleteEmployeeDialog(false)}
//                 onConfirm={deleteEmployee}
//                 item={employee}
//                 idField="id_employee"
//             />
//             <ConfirmDeleteDialog
//                 visible={deleteEmployeesDialog}
//                 onHide={() => setDeleteEmployeesDialog(false)}
//                 onConfirm={deleteSelectedEmployees}
//                 multiple={true}
//                 title="Xác nhận xóa nhiều"
//             />
//         </div>
//     );
// };

// export default Employee;