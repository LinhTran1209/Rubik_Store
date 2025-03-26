import ConfirmDeleteDialog from '../../../components/Admin_page/ConfirmDeleteDialog';
import product_imagesService from '../../../services/product_imageService';
import GenericTable from '../../../components/Admin_page/GenericTable';
import GenericForm from '../../../components/Admin_page/GenericForm';
import categorieService from '../../../services/categorieService'
import productService from '../../../services/productService';
import React, { useState, useEffect, useRef } from 'react';
import authService from '../../../services/authService';
import { Toast } from 'primereact/toast';




const Product = () => {
    const [products, setproducts] = useState([]);
    const [product, setproduct] = useState({ id_product: null, id_categorie: '', name: '', image_url: '', quantity: '', price: '', desc: '', slug: '', created_at: '', updated_at: '' });
    const [categories, setcategories] = useState([]); // Danh sách categories để kiểm tra id_categorie
    const [productDialog, setproductDialog] = useState(false);
    const [deleteproductDialog, setDeleteproductDialog] = useState(false);
    const [deleteproductsDialog, setDeleteproductsDialog] = useState(false);
    const [selectedproducts, setSelectedproducts] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    
    const [globalFilter, setGlobalFilter] = useState('');

    const [ product_images, setProduct_images ] = useState({});
    const [ product_image, setProduct_image ] = useState({id_image: null, id_product: null, image_url: '', is_main: false,  created_at: '', updated_at: ''});
    const [ product_imageDialog, setProduct_imageDialog ] = useState(false);
    const [ deleteProduct_imageDialog, setDeleteProduct_imageDialog ] = useState(false);
    const [ deleteProduct_imagesDialog, setDeleteProduct_imagesDialog ] = useState(false);
    const [ selectedProduct_images, setSelectedProduct_images ] = useState([]);
    const [ submittedProduct_image, setSubmittedProduct_image ] = useState(false);

    const [isAdd, setIsAdd] = useState(true);



    // Kiểm tra quyền admin
    const [userRole, setUserRole] = useState(null);

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

    const fetchProductImages = async (id_product) => {
        try {
            const data = await product_imagesService.getByIdProduct(id_product);
            setProduct_images(prev => ({ ...prev, [id_product]: Array.isArray(data) ? data : [] }));
            console.log('image___',data)
        } catch (error) {
            setProduct_images(prev => ({ ...prev, [id_product]: [] }));
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể danh sách hình ảnh', life: 3000 });
        }
    };

    const show_product = async () => {
        try {
            const data = await productService.getAllproducts();
            setproducts(data);
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
            show_product();         
            fetchcategories(); 
        }
    }, [userRole]); 



    useEffect(() => {
        selectedproducts.forEach(product_image => {
            console.log(product_image.id_product)
            // console.log(product_images)
            if (!product_images[product_image.id_product]) {
                fetchProductImages(product_image.id_product);
            }
        });
    }, [selectedproducts]);

    const openNewProduct = () => {
        setproduct({ id_product: null, id_categorie: '', name: '', image_url: '', quantity: '', price: '', desc: '', slug: '', status: 'hiện' });
        setSubmitted(false);
        setproductDialog(true);
    };

    const openNewProduct_Images = (id_product) => {
        setIsAdd(true);
        setProduct_image({ id_image: null, id_product: id_product, image_url: '', is_main: '' });
        setSubmittedProduct_image(false);
        setProduct_imageDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setproductDialog(false);
    };

    const hideDialogProduct_Images = () => {
        setProduct_imageDialog(true);
        setProduct_image({ id_image: null, id_product: id_product, image_url: '', is_main: '' });
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
            if (products.some(product => product.name === productData.name && product.id_product !== productData.id_product)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Tên sản phẩm đã có trong danh sách'})
                return;
            }

            // Cập nhật sản phẩm

            productData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
            productData.created_at = new Date(new Date(productData.created_at).setDate(new Date(productData.created_at).getDate() + 1)).toISOString().split('T')[0];

            console.log(productData)
            productService.updateproduct(product.id_product, productData)
                .then(() => {
                    show_product();
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
                    show_product();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm sản phẩm thành công', life: 3000 });
                })
                .catch(error => {
                    // toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thêm thất bại', life: 3000 });
                });
        }

        setproductDialog(false);
        setproduct({ id_product: null, id_categorie: '', name: '', image_url: '', quantity: '', price: '', desc: '', created_at: '', updated_at: '', slug: '', status: 'hiện' });
    };

    const saveproduct_Image = () => {
        setproductDialog(true);
        if (!product_image.image_url || !product_image.is_main ) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', product_image: 'Vui lòng điền đầy đủ thông tin', life: 3000 });
            return;
        }

        if (product_image.is_main !== true || product_image.is_main !== false) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', product_image: 'Ảnh chính phải là true hoặc false', life: 3000 });
            return; 

        }

        const product_imageData = { ...product_image };
        const ID_Product = product_imageData.id_product;

        if(!isAdd) { // Này là cập nhật ảnh theo id_product
            if (product_images[ID_Product].some(product_image => JSON.stringify(product_image) === JSON.stringify(product_imageData))) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', product_image: 'Không có thay đổi nào được thực hiện' });
                return;
            }

            // Kiểm tra xem đã có ảnh nào là ảnh chính chưa
            if (product_image.is_main === true && product_images.some(product_image => product_image.is_main === true)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Đã có ảnh chính trong sản phẩm này!', life: 3000 });
                return;
            }

            product_imageData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
            product_imageData.created_at = new Date(new Date(product_imageData.created_at).setDate(new Date(product_imageData.created_at).getDate() + 1)).toISOString().split('T')[0];

            product_imagesService.update(product_imageData.id_image, product_imageData)
                .then(() => {
                    fetchProductImages(product_imageData.id_product); // Cập nhật lại chi tiết theo id_product
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật ảnh thành công', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật ảnh thất bại', life: 3000 });
                });

        } else { // Thêm mới bản ghi ảnh cho product
            // Kiểm tra có trùng trong cơ sở dữ liệu không
            if (Array.isArray(product_images[ID_Product]) && product_images[ID_Product].some(dt => dt.id_product == product_imageData.id_product)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Ảnh này đã tồn tại' });
                return;
            }


            product_imagesService.add(product_imageData)
                .then(() => {
                    fetchProductImages(product_imageData.id_product); // Cập nhật lại chi tiết ảnh theo id_product
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm ảnh thành công', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thêm ảnh thất bại', life: 3000 });
                });
        }


    }


    const editproduct = (epl) => {
        setproduct({ ...epl });
        setproductDialog(true);
    };

    // Nút sửa ảnh sản phẩm
    const editProduct_Image = (product_image) => {
        console.log(product_image)
        setIsAdd(false);
        setProduct_image({ ...product_image });
        setProduct_imageDialog(true);
    };


    const confirmDeleteproduct = (epl) => {
        setproduct(epl);
        setDeleteproductDialog(true);
    };

    // Xác nhận xóa ảnh của sản phẩm theo id_image
    const confirmDeleteProduct_Image = (product_image) => {
        setProduct_image(product_image);
        setDeleteProduct_imageDialog(true);
    };

    const deleteproduct = () => {
        productService.deleteproduct(product.id_product)
            .then(() => {
                show();
                setDeleteproductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa sản phẩm thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa sản phẩm thất bại', life: 3000 });
            });
    };

    // Hàm xóa ảnh sản phẩm trong csdl
    const deleteProduct_Image = () => {
        product_imagesService.delete(product_image.id_image)
            .then(() => {
                fetchProductImages(product_image.id_product);
                setDeleteProduct_imageDialog(false);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa ảnh thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa ảnh thất bại', life: 3000 });
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

    // Lát sửa xóa nhiều
    // const deleteSelectedproducts = () => {
    //     Promise.all(selectedproducts.map(item => productService.deleteproduct(item.id_product)))
    //         .then(() => {
    //             show();
    //             setDeleteproductsDialog(false);
    //             setSelectedproducts(null);
    //             toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa nhiều thành công', life: 3000 });
    //         })
    //         .catch(error => {
    //             toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
    //         });
    // };

    const onInputChangeProduct = (e, itemname) => {
        const val = (e.target && e.target.value) || '';
        setproduct(prev => ({ ...prev, [itemname]: val }));
    };



    // Thay đổi đầu vào các ảnh
    const onInputChangeProduct_Image = (e, itemId) => {
        const val = (e.target && e.target.value) || '';
        setProduct_image(prev => ({ ...prev, [itemId]: val }));
    };

    const columns_Product = [
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


    const columns_Product_Image = [
        { field: 'id_image', header: 'ID' },
        { field: 'image_url', header: 'Link ảnh' },
        { field: 'is_main', header: 'Ảnh chính' },
        { field: 'created_at', header: 'Ngày tạo' },
        { field: 'updated_at', header: 'Ngày cập nhật' },
    ];
    
    return (
        <div>
            <Toast ref={toast} />
            <GenericTable
                visible={true ? userRole === 'admin' : false}
                data={products}
                selectedItems={selectedproducts}
                setSelectedItems={setSelectedproducts}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                columns={columns_Product}
                onEdit={editproduct}
                onDelete={confirmDeleteproduct}
                onDeleteSelected={confirmDeleteSelected}
                openNew={openNewProduct}
                dataKey="id_product"
                title="Quản lý danh sách sản phẩm"
            />


            {selectedproducts.length == 1 && (
                <div>
                    {selectedproducts.map((product) => (
                        <div key={product.id_product} style={{ marginTop: '1rem' }}>
                            <GenericTable
                                data={product_images[product.id_product] || []}
                                selectedItems={selectedProduct_images}
                                setSelectedItems={setSelectedProduct_images}
                                globalFilter={globalFilter}
                                setGlobalFilter={setGlobalFilter}
                                columns={columns_Product_Image}
                                onEdit={editProduct_Image}
                                onDelete={confirmDeleteProduct_Image}
                                openNew={() => openNewProduct_Images(product.id_product)}
                                dataKey="id_image"
                                title={`Ảnh của sản phẩm ${product.id_product}`}
                                // disabled={notification(invoice, '') ? true : false}
                            />
                        </div>
                    ))}
                </div>
            )}
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
                onChange={onInputChangeProduct}
                onSave={saveproduct}
                onHide={hideDialog}
                submitted={submitted}
                title={product.id_product ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
            />


            {/* <GenericForm
                visible={product_imageDialog}
                item={product_image}
                fields={[
                    { name: 'id_image', label: 'ID', required: true, disabled: isAdd ? false:true },
                    { name: 'id_product', label: 'ID Produc', required: true, disabled: isAdd ? false:true },
                    { name: 'quantity', label: 'Số lượng', required: true },
                    { name: 'price', label: 'Đơn giá', required: true },
                    { name: 'created_at', label: 'Ngày tạo', disabled: true, hidden: isAdd },
                    { name: 'updated_at', label: 'Ngày chỉnh sửa', disabled: true, hidden: isAdd }
                ]}
                onChange={onInputChangeDetail}
                onSave={savesaleDetail}
                onHide={hideDialogDetail}
                submittedSaleInvoice={submittedSaleDetail}
                title={isAdd ? 'Thêm ảnh sản phẩm' : 'Sửa ảnh sản phẩm'}
            /> */}


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

export default Product;