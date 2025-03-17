import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import productService from '../../services/productService';
import categorieService from '../../services/categorieService'
import GenericTable from '../../components/Admin_page/GenericTable';
import GenericForm from '../../components/Admin_page/GenericForm';
import ConfirmDeleteDialog from '../../components/Admin_page/ConfirmDeleteDialog';


const product = () => {
    const [products, setproducts] = useState([]);
    const [product, setproduct] = useState({ id_product: null, id_categorie: '', name: '', image_url: '', quantity: '', price: '', desc: '', created_at: '', updated_at: '' });
    const [categories, setcategories] = useState([]); // Danh sách categories để kiểm tra id_categorie
    const [globalFilter, setGlobalFilter] = useState('');
    const [productDialog, setproductDialog] = useState(false);
    const [deleteproductDialog, setDeleteproductDialog] = useState(false);
    const [deleteproductsDialog, setDeleteproductsDialog] = useState(false);
    const [selectedproducts, setSelectedproducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);

    // Lấy danh sách categories
    const fetchcategories = async () => {
        try {
            const data = await categorieService.getAllcategories();
            setcategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách loại sản phẩm', life: 3000 });
        }
    };

    const show = async () => {
        try {
            const data = await productService.getAllproducts();
            setproducts(data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu', life: 3000 });
        }
    };

    useEffect(() => {
        show();
        fetchcategories();
    }, []);

    const openNew = () => {
        setproduct({ id_product: null, id_categorie: '', name: '', image_url: '', quantity: '', price: '', desc: '', status: 'hiện' });
        setSubmitted(false);
        setproductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setproductDialog(false);
    };

    const saveproduct = () => {
        setSubmitted(true);

        // Kiểm tra các trường bắt buộc
        if (!product.id_categorie || !product.name || !product.quantity || !product.price ) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc', life: 3000 });
            return;
        }

        // Kiểm tra id_categorie có tồn tại trong bảng categories không
        if (!categories.some(categorie => categorie.id_categorie === parseInt(product.id_categorie))) {
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Loại sản phẩm không tồn tại', life: 3000 });
            return;
        }

        
        // Kiểm tra số lượng có phải là số hay không
        if (isNaN(product.quantity) || Number(product.quantity) < 0) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số lượng phải là số dương' });
            return;
        }
        
        // Kiểm tra giá có phải là số hay không
        if (isNaN(product.price) || Number(product.price) <= 0) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Giá phải là số dương' });
            return;
        }
        
        const productData = { ...product };
        console.log(product)
        if (product.id_product) { // Cập nhật sản phẩm
            // Kiểm tra xem có cập nhật thông tin nào không
            if (products.some(product => JSON.stringify(product) === JSON.stringify(productData))) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không có thay đổi nào được thực hiện' });
                return;
            }
            // Kiểm tra có trùng name trong bảng không trừ chính nó
            // if (products.some(product => product.name === productData.name && product.id_product !== productData.id_product)) {
            //     toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Tên sản phẩm đã có trong danh sách'})
            //     return;
            // }

            // Cập nhật sản phẩm

            productData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
            productData.created_at = new Date(new Date(productData.created_at).setDate(new Date(productData.created_at).getDate() + 1)).toISOString().split('T')[0];

            console.log(productData)
            productService.updateproduct(product.id_product, productData)
                .then(() => {
                    show();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại', life: 3000 });
                });

        } else {// Thêm sản phẩm mới
            // Kiểm tra có trùng name trong bảng không
            if (products.some(product => product.name === productData.name)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Tên sản phẩm đã có trong danh sách'})
                return;
            }

            console.log(productData)
            // Thêm sản phẩm mới
            productService.addproduct(productData)
                .then(() => {
                    show();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm thành công', life: 3000 });
                })
                .catch(error => {
                    // toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thêm thất bại', life: 3000 });
                });
        }

        setproductDialog(false);
        setproduct({ id_product: null, id_categorie: '', name: '', image_url: '', quantity: '', price: '', desc: '', created_at: '', updated_at: '', status: 'hiện' });
    };

    const editproduct = (epl) => {
        setproduct({ ...epl });
        setproductDialog(true);
    };

    const confirmDeleteproduct = (epl) => {
        setproduct(epl);
        setDeleteproductDialog(true);
    };

    const deleteproduct = () => {
        productService.deleteproduct(product.id_product)
            .then(() => {
                show();
                setDeleteproductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
    };

    const confirmDeleteSelected = () => {
        setDeleteproductsDialog(true);
    };

    const deleteSelectedproducts = () => {
        Promise.all(selectedproducts.map(item => productService.deleteproduct(item.id_product)))
            .then(() => {
                show();
                setDeleteproductsDialog(false);
                setSelectedproducts(null);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa nhiều thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
    };

    const onInputChange = (e, itemname) => {
        const val = (e.target && e.target.value) || '';
        setproduct(prev => ({ ...prev, [itemname]: val }));
    };

    const columns = [
        { field: 'id_product', header: 'ID' },
        { field: 'id_categorie', header: 'ID Loại sản phẩm' },
        { field: 'name', header: 'Tên sản phẩm' },
        { field: 'image_url', header: 'Link ảnh' },
        { field: 'quantity', header: 'Số lượng' },
        { field: 'price', header: 'Giá' },
        { field: 'desc', header: 'Mô tả' },
        { field: 'created_at', header: 'Ngày tạo' },
        { field: 'updated_at', header: 'Ngày cập nhật' },
    ];

    return (
        <div>
            <Toast ref={toast} />
            <GenericTable
                data={products}
                selectedItems={selectedproducts}
                setSelectedItems={setSelectedproducts}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                columns={columns}
                onEdit={editproduct}
                onDelete={confirmDeleteproduct}
                onDeleteSelected={confirmDeleteSelected}
                openNew={openNew}
                dataKey="id_product"
                title="Quản lý danh sách sản phẩm"
            />
            <GenericForm
                visible={productDialog}
                item={product}
                fields={[
                    { name: 'id_product', label: 'ID', disabled: true, hidden: !product.id_product }, // Ẩn khi thêm, readonly khi sửa
                    { name: 'id_categorie', label: 'ID Loại sản phẩm', required: true },
                    { name: 'name', label: 'Tên sản phẩm', required: true },
                    { name: 'image_url', label: 'Link ảnh', required: true },
                    { name: 'quantity', label: 'Số lượng', required: true },
                    { name: 'price', label: 'Giá', required: true },
                    { name: 'desc', label: 'Mô tả', required: true },
                    { name: 'created_at', label: 'Ngày tạo', required: true, disabled: true, hidden: !product.id_product },
                    { name: 'updated_at', label: 'Ngày cập nhật', required: true, disabled: true, hidden: !product.id_product },
                ]}
                onChange={onInputChange}
                onSave={saveproduct}
                onHide={hideDialog}
                submitted={submitted}
                title={product.id_product ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
            />
            <ConfirmDeleteDialog
                visible={deleteproductDialog}
                onHide={() => setDeleteproductDialog(false)}
                onConfirm={deleteproduct}
                item={product}
                idField="id_product"
            />
            <ConfirmDeleteDialog
                visible={deleteproductsDialog}
                onHide={() => setDeleteproductsDialog(false)}
                onConfirm={deleteSelectedproducts}
                multiple={true}
                title="Xác nhận xóa nhiều"
            />
        </div>
    );
};

export default product;