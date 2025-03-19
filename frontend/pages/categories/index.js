import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import categorieService from '../../services/categorieService';
import GenericTable from '../../components/Admin_page/GenericTable';
import GenericForm from '../../components/Admin_page/GenericForm';
import ConfirmDeleteDialog from '../../components/Admin_page/ConfirmDeleteDialog';


function Categorie() {
    const [categories, setcategories] = useState([]);
    const [categorie, setcategorie] = useState({ id_categorie: null, name: '', desc: '', created_at: '', updated_at: '' });
    const [globalFilter, setGlobalFilter] = useState('');
    const [categorieDialog, setcategorieDialog] = useState(false);
    const [deletecategorieDialog, setDeletecategorieDialog] = useState(false);
    const [deletecategoriesDialog, setDeletecategoriesDialog] = useState(false);
    const [selectedcategories, setSelectedcategories] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);


    const show = async () => {
        try {
            const data = await categorieService.getAllcategories();
            setcategories(data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu', life: 3000 });
        }
    };

    useEffect(() => {
        show();
    }, []);

    const openNew = () => {
        setcategorie({ id_categorie: null, name: '', desc: '', status: 'hiện' });
        setSubmitted(false);
        setcategorieDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setcategorieDialog(false);
    };

    const savecategorie = () => {
        setSubmitted(true);

        // Kiểm tra các trường bắt buộc
        if (!categorie.name) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc', life: 3000 });
            return;
        }

        const categorieData = { ...categorie };
        if (categorie.id_categorie) { // Cập nhật loại sản phẩm
            // Kiểm tra xem có cập nhật thông tin nào không
            if (categories.some(categorie => JSON.stringify(categorie) === JSON.stringify(categorieData))) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không có thay đổi nào được thực hiện' });
                return;
            }
            // Kiểm tra có trùng tên loại sản phẩm trong bảng không trừ chính nó
            if (categories.some(categorie => categorie.name === categorieData.name && categorie.id_categorie !== categorieData.id_categorie)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Loại sản phẩm đã có trong danh sách'})
                return;
            }

            // Cập nhật loại sản phẩm

            categorieData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
            categorieData.created_at = new Date(new Date(categorieData.created_at).setDate(new Date(categorieData.created_at).getDate() + 1)).toISOString().split('T')[0];

            console.log(categorieData)
            categorieService.updatecategorie(categorie.id_categorie, categorieData)
                .then(() => {
                    show();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại', life: 3000 });
                });

        } else {// Thêm loại sản phẩm mới
            // Kiểm tra có trùng tên trong bảng không
            if (categories.some(categorie => categorie.name === categorieData.name)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Loại sản phẩm đã có trong danh sách'})
                return;
            }

            // Thêm loại sản phẩm mới
            categorieService.addcategorie(categorieData)
                .then(() => {
                    show();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm thành công', life: 3000 });
                })
                .catch(error => {
                    // toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thêm thất bại', life: 3000 });
                });
        }

        setcategorieDialog(false);
        setcategorie({ id_categorie: null, id_role: '', name: '', desc: '', status: 'hiện' });
    };

    const editcategorie = (epl) => {
        setcategorie({ ...epl });
        setcategorieDialog(true);
    };

    const confirmDeletecategorie = (epl) => {
        setcategorie(epl);
        setDeletecategorieDialog(true);
    };

    const deletecategorie = () => {
        categorieService.deletecategorie(categorie.id_categorie)
            .then(() => {
                show();
                setDeletecategorieDialog(false);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
    };

    const confirmDeleteSelected = () => {
        setDeletecategoriesDialog(true);
    };

    const deleteSelectedcategories = () => {
        Promise.all(selectedcategories.map(item => categorieService.deletecategorie(item.id_categorie)))
            .then(() => {
                show();
                setDeletecategoriesDialog(false);
                setSelectedcategories(null);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa nhiều thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
    };

    const onInputChange = (e, itemname) => {
        const val = (e.target && e.target.value) || '';
        setcategorie(prev => ({ ...prev, [itemname]: val }));
    };

    const columns = [
        { field: 'id_categorie', header: 'ID' },
        { field: 'name', header: 'Loại sản phẩm' },
        { field: 'desc', header: 'Mô tả ' },
        { field: 'created_at', header: 'Ngày tạo' },
        { field: 'updated_at', header: 'Ngày cập nhật' },
    ];

    return (
        <div>
            <Toast ref={toast} />
            <GenericTable
                data={categories}
                selectedItems={selectedcategories}
                setSelectedItems={setSelectedcategories}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                columns={columns}
                onEdit={editcategorie}
                onDelete={confirmDeletecategorie}
                onDeleteSelected={confirmDeleteSelected}
                openNew={openNew}
                dataKey="id_categorie"
                title="Quản lý danh sách loại sản phẩm"
            />
            <GenericForm
                visible={categorieDialog}
                item={categorie}
                fields={[
                    { name: 'id_categorie', label: 'ID Loại sản phẩm', disabled: true, hidden: !categorie.id_categorie }, // Ẩn khi thêm, readonly khi sửa
                    { name: 'name', label: 'Loại sản phẩm', required: true },
                    { name: 'desc', label: 'Mô tả', required: true },
                    { name: 'created_at', label: 'Ngày tạo', required: true, disabled: true, hidden: !categorie.id_categorie },
                    { name: 'updated_at', label: 'Ngày cập nhật', required: true, disabled: true, hidden: !categorie.id_categorie },
                ]}
                onChange={onInputChange}
                onSave={savecategorie}
                onHide={hideDialog}
                submitted={submitted}
                title={categorie.id_categorie ? 'Sửa loại sản phẩm' : 'Thêm loại sản phẩm'}
            />
            <ConfirmDeleteDialog
                visible={deletecategorieDialog}
                onHide={() => setDeletecategorieDialog(false)}
                onConfirm={deletecategorie}
                item={categorie}
                idField="id_categorie"
            />
            <ConfirmDeleteDialog
                visible={deletecategoriesDialog}
                onHide={() => setDeletecategoriesDialog(false)}
                onConfirm={deleteSelectedcategories}
                multiple={true}
                title="Xác nhận xóa nhiều"
            />
        </div>
    );
};

export default Categorie;