import saleInvoiceDetailsService from '../../../services/sale_invoice_detailsService';
import ConfirmDeleteDialog from '../../../components/Admin_page/ConfirmDeleteDialog';
import product_imagesService from '../../../services/product_imageService';
import product_variantsService from '../../../services/product_variantService';
import GenericTable from '../../../components/Admin_page/GenericTable';
import GenericForm from '../../../components/Admin_page/GenericForm';
import categorieService from '../../../services/categorieService';
import productService from '../../../services/productService';
import React, { useState, useEffect, useRef } from 'react';
import authService from '../../../services/authService';
import { Toast } from 'primereact/toast';

const Product = () => {
    // State cho sản phẩm
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({ id_product: null, id_categorie: '', name: '', image_url: '', desc: '', status: 'hiện', slug: '', created_at: '', updated_at: '' });
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilterProduct, setGlobalFilterProduct] = useState('');

    // State cho ảnh sản phẩm
    const [productImages, setProductImages] = useState({});
    const [productImage, setProductImage] = useState({ id_image: null, id_product: null, image_url: '', is_main: '', created_at: '', updated_at: '' });
    const [productImageDialog, setProductImageDialog] = useState(false);
    const [deleteProductImageDialog, setDeleteProductImageDialog] = useState(false);
    const [selectedProductImages, setSelectedProductImages] = useState([]);
    const [submittedProductImage, setSubmittedProductImage] = useState(false);
    const [globalFilterImage, setGlobalFilterImage] = useState('');

    // State cho biến thể sản phẩm 
    const [productVariants, setProductVariants] = useState({});
    const [productVariant, setProductVariant] = useState({ id_variant: null, id_product: null, color: '', quantity: '', price: '', created_at: '', updated_at: '' });
    const [productVariantDialog, setProductVariantDialog] = useState(false);
    const [deleteProductVariantDialog, setDeleteProductVariantDialog] = useState(false);
    const [selectedProductVariants, setSelectedProductVariants] = useState([]);
    const [submittedProductVariant, setSubmittedProductVariant] = useState(false);
    const [globalFilterVariant, setGlobalFilterVariant] = useState('');

    // Trạng thái chung
    const [categories, setCategories] = useState([]);
    const [isAdd, setIsAdd] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const toast = useRef(null);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const data = await categorieService.getAllcategories();
            setCategories(data || []);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách loại sản phẩm', life: 3000 });
        }
    };

    // Fetch product images
    const fetchProductImages = async (id_product) => {
        try {
            const data = await product_imagesService.getByIdProduct(id_product);
            setProductImages((prev) => ({ ...prev, [id_product]: Array.isArray(data) ? data : [] }));
        } catch (error) {
            setProductImages((prev) => ({ ...prev, [id_product]: [] }));
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách hình ảnh', life: 3000 });
        }
    };

    // Fetch product variants 
    const fetchProductVariants = async (id_product) => {
        try {
            const data = await product_variantsService.getData("id_product", id_product);
            setProductVariants((prev) => ({ ...prev, [id_product]: Array.isArray(data) ? data : [] }));
        } catch (error) {
            setProductVariants((prev) => ({ ...prev, [id_product]: [] }));
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách biến thể', life: 3000 });
        }
    };

    const showProducts = async () => {
        try {
            const data = await productService.getAllproducts();
            setProducts(data || []);
        } catch (error) {
            setProducts([]);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu', life: 3000 });
        }
    };

    // Check admin role
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

    // Mount lần đầu
    useEffect(() => {
        if (userRole === 'admin') {
            showProducts();
            fetchCategories();
        }
    }, [userRole]);

    // Fetch images và variants khi chọn sản phẩm
    useEffect(() => {
        selectedProducts.forEach((product) => {
            if (!productImages[product.id_product]) {
                fetchProductImages(product.id_product);
            }
            if (!productVariants[product.id_product]) {
                fetchProductVariants(product.id_product);
            }
        });
    }, [selectedProducts]);

    // Product handlers 
    const openNewProduct = () => {
        setProduct({ id_product: null, id_categorie: '', name: '', image_url: '', desc: 'ok', slug: '', status: 'hiện' });
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialogProduct = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);
        if (!product.id_categorie || !product.name) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc', life: 3000 });
            return;
        }
        const productData = { ...product };
        if (product.id_product) { // không có thì cập nhật
            if (products.some((p) => JSON.stringify(p) === JSON.stringify(productData))) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không có thay đổi nào được thực hiện', life: 3000 });
                return;
            }
            if (products.some((p) => p.name === productData.name && p.id_product !== productData.id_product)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Tên sản phẩm đã tồn tại', life: 3000 });
                return;
            }
            productData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
            productData.created_at = new Date(new Date(productData.created_at).setDate(new Date(productData.created_at).getDate() + 1)).toISOString().split('T')[0];
            productService.updateproduct(product.id_product, productData)
                .then(() => {
                    showProducts();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật sản phẩm thành công', life: 3000 });
                })
                .catch(() => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại', life: 3000 });
                });
        } else {
            if (products.some((p) => p.name === productData.name)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Tên sản phẩm đã tồn tại', life: 3000 });
                return;
            }
            productService.addproduct(productData)
                .then(() => {
                    showProducts();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm sản phẩm thành công', life: 3000 });
                })
                .catch(() => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thêm thất bại', life: 3000 });
                });
        }
        hideDialogProduct();
    };

    const editProduct = (prod) => {
        setProduct({ ...prod });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (prod) => {
        setProduct(prod);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        const checkData = product_variantsService.getData("id_product", product.id_product)
        if (checkData) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Bản ghi này không thể xóa do có dữ liệu phụ thuộc vào.', life: 3000 });
            return;
        }
        productService.deleteproduct(product.id_product)
            .then(() => {
                showProducts();
                setDeleteProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa sản phẩm thành công', life: 3000 });
            })
            .catch(() => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        Promise.all(selectedProducts.map((item) => productService.deleteproduct(item.id_product)))
            .then(() => {
                showProducts();
                setDeleteProductsDialog(false);
                setSelectedProducts([]);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa nhiều sản phẩm thành công', life: 3000 });
            })
            .catch(() => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa nhiều thất bại', life: 3000 });
            });
    };

    // Product Image handlers 
    const openNewProductImage = (id_product) => {
        setIsAdd(true);
        setProductImage({ id_image: null, id_product: id_product, image_url: '', is_main: '' });
        setSubmittedProductImage(false);
        setProductImageDialog(true);
    };

    const hideDialogProductImage = () => {
        setSubmittedProductImage(false);
        setProductImageDialog(false);
    };

    const saveProductImage = () => {
        setSubmittedProductImage(true);
        if (!productImage.image_url || productImage.is_main === '') {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin', life: 3000 });
            return;
        }
        const productImageData = { ...productImage, is_main: productImage.is_main === 'Yes' };
        const idProduct = productImageData.id_product;
        if (!isAdd) {
            if (Array.isArray(productImages[idProduct]) && productImages[idProduct].some((img) => JSON.stringify(img) === JSON.stringify(productImageData))) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không có thay đổi nào được thực hiện', life: 3000 });
                return;
            }
            productImageData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
            productImageData.created_at = new Date(new Date(productImageData.created_at).setDate(new Date(productImageData.created_at).getDate() + 1)).toISOString().split('T')[0];
            product_imagesService.setMainImage(productImageData.id_image, idProduct, productImageData.image_url, productImageData.is_main)
                .then(() => {
                    fetchProductImages(idProduct);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật ảnh thành công', life: 3000 });
                })
                .catch((error) => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại', life: 3000 });
                });
        } else {
            if (Array.isArray(productImages[idProduct]) && productImages[idProduct].some((img) => img.image_url === productImageData.image_url)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Ảnh này đã tồn tại', life: 3000 });
                return;
            }
            product_imagesService.add(productImageData)
                .then((response) => {
                    const newImageId = response.id || response.id_image;
                    if (productImageData.is_main) {
                        product_imagesService.setMainImage(newImageId, idProduct, productImageData.image_url, true)
                            .then(() => {
                                fetchProductImages(idProduct);
                                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm và đặt ảnh chính thành công', life: 3000 });
                            })
                            .catch((error) => {
                                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Đặt ảnh chính thất bại', life: 3000 });
                            });
                    } else {
                        fetchProductImages(idProduct);
                        toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm ảnh thành công', life: 3000 });
                    }
                })
                .catch((error) => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thêm thất bại', life: 3000 });
                });
        }
        hideDialogProductImage();
    };

    const editProductImage = (image) => {
        setIsAdd(false);
        setProductImage({ ...image, is_main: image.is_main ? 'Yes' : 'No' });
        setProductImageDialog(true);
    };

    const confirmDeleteProductImage = (image) => {
        setProductImage(image);
        setDeleteProductImageDialog(true);
    };

    const deleteProductImage = () => {
        product_imagesService.delete(productImage.id_image)
            .then(() => {
                fetchProductImages(productImage.id_product);
                setDeleteProductImageDialog(false);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa ảnh thành công', life: 3000 });
            })
            .catch(() => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
    };

    // Product Variant handlers 
    const openNewProductVariant = (id_product) => {
        setIsAdd(true);
        setProductVariant({ id_variant: null, id_product: id_product, color: '', quantity: '', price: ''});
        setSubmittedProductVariant(false);
        setProductVariantDialog(true);
    };

    const hideDialogProductVariant = () => {
        setSubmittedProductVariant(false);
        setProductVariantDialog(false);
    };

    const saveProductVariant = () => {
        setSubmittedProductVariant(true);
        if (!productVariant.color || !productVariant.quantity || !productVariant.price) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin', life: 3000 });
            return;
        }
        if (isNaN(productVariant.quantity) || Number(productVariant.quantity) < 0) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số lượng phải là số không âm', life: 3000 });
            return;
        }
        if (isNaN(productVariant.price) || Number(productVariant.price) <= 0) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Giá phải là số dương', life: 3000 });
            return;
        }
    
        const productVariantData = { ...productVariant };
        const idProduct = productVariantData.id_product;
        const existingVariants = productVariants[idProduct] || [];
    
        // Kiểm tra logic màu sắc
        const hasStickerlessOrBlack = existingVariants.some((variant) => 
            variant.color === 'stickerless' || variant.color === 'black'
        );
        const hasNoColor = existingVariants.some((variant) => variant.color === 'không có');
    
        if (isAdd) {
            // Thêm mới
            if (productVariantData.color === 'không có' && hasStickerlessOrBlack) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Không thể thêm màu khác nữa!', life: 3000 });
                return;
            }
            if ((productVariantData.color === 'stickerless' || productVariantData.color === 'black') && hasNoColor) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Không thể thêm màu khác nữa!', life: 3000 });
                return;
            }
            if (existingVariants.some((variant) => variant.color === productVariantData.color)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Màu này đã tồn tại cho sản phẩm', life: 3000 });
                return;
            }
        } else {
            // Cập nhật
            const originalVariant = existingVariants.find((v) => v.id_variant === productVariantData.id_variant);
            if (originalVariant.color !== productVariantData.color) { // Nếu thay đổi màu
                if (productVariantData.color === 'không có' && hasStickerlessOrBlack) {
                    toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Không thể sửa màu khác nữa!', life: 3000 });
                    return;
                }
                if ((productVariantData.color === 'stickerless' || productVariantData.color === 'black') && hasNoColor) {
                    toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Không thể sửa màu khác nữa!', life: 3000 });
                    return;
                }
                if (existingVariants.some((variant) => variant.color === productVariantData.color && variant.id_variant !== productVariantData.id_variant)) {
                    toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Màu này đã tồn tại cho sản phẩm', life: 3000 });
                    return;
                }
            }
            if (JSON.stringify(originalVariant) === JSON.stringify(productVariantData)) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không có thay đổi nào được thực hiện', life: 3000 });
                return;
            }
        }
    
        if (!isAdd) {
            productVariantData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
            productVariantData.created_at = new Date(new Date(productVariantData.created_at).setDate(new Date(productVariantData.created_at).getDate() + 1)).toISOString().split('T')[0];
            product_variantsService.update(productVariantData.id_variant, productVariantData)
                .then(() => {
                    fetchProductVariants(idProduct);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật biến thể thành công', life: 3000 });
                })
                .catch(() => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại', life: 3000 });
                });
        } else {
            product_variantsService.add(productVariantData)
                .then(() => {
                    fetchProductVariants(idProduct);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm biến thể thành công', life: 3000 });
                })
                .catch(() => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thêm thất bại', life: 3000 });
                });
        }
        hideDialogProductVariant();
    };

    const editProductVariant = (variant) => {
        setIsAdd(false);
        setProductVariant({ ...variant });
        setProductVariantDialog(true);
    };

    const confirmDeleteProductVariant = (variant) => {
        setProductVariant(variant);
        setDeleteProductVariantDialog(true);
    };

    const deleteProductVariant = async () => {
        const checkData = await saleInvoiceDetailsService.getData("id_variant", productVariant.id_variant)
        if (checkData.length > 0) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Bản ghi này không thể xóa do có dữ liệu phụ thuộc vào.', life: 3000 });
            return;
        }
        product_variantsService.delete(productVariant.id_variant)
            .then(() => {
                fetchProductVariants(productVariant.id_product);
                setDeleteProductVariantDialog(false);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa biến thể thành công', life: 3000 });
            })
            .catch(() => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
    };

    // Input handlers
    const onInputChangeProduct = (e, itemName) => {
        const val = (e.target && e.target.value) || '';
        setProduct((prev) => ({ ...prev, [itemName]: val }));
    };

    const onInputChangeProductImage = (e, itemName) => {
        const val = (e.target && e.target.value) || '';
        setProductImage((prev) => ({ ...prev, [itemName]: val }));
    };

    const onInputChangeProductVariant = (e, itemName) => {
        const val = (e.target && e.target.value) || '';
        setProductVariant((prev) => ({ ...prev, [itemName]: val }));
    };

    // Table and form config
    const productColumns = [
        { field: 'id_product', header: 'ID' },
        {
            field: 'id_categorie',
            header: 'Loại sản phẩm',
            render: (rowData) => {
                const category = categories.find((c) => c.id_categorie === rowData.id_categorie);
                return category ? category.name : rowData.id_categorie;
            },
        },
        { field: 'name', header: 'Tên sản phẩm' },
        { field: 'image_url', header: 'Ảnh chính', format: 'image' },
        { field: 'desc', header: 'Mô tả' },
        {
            field: 'status',
            header: 'Trạng thái',
            render: (rowData) => (
                <span style={{ color: rowData.status === 'hiện' ? 'green' : 'red' }}>
                    {rowData.status === 'hiện' ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
                </span>
            ),
        },
        { field: 'created_at', header: 'Ngày tạo', format: 'date' },
        { field: 'updated_at', header: 'Ngày cập nhật', format: 'date' },
    ];

    const productImageColumns = [
        { field: 'image_url', header: 'Link ảnh', format: 'image' },
        { field: 'is_main', header: 'Ảnh chính', render: (rowData) => (rowData.is_main ? 'Yes' : 'No') },
        { field: 'created_at', header: 'Ngày tạo', format: 'date' },
        { field: 'updated_at', header: 'Ngày cập nhật', format: 'date' },
    ];

    const productVariantColumns = [
        { field: 'color', header: 'Màu sắc' },
        { field: 'quantity', header: 'Số lượng' },
        { field: 'price', header: 'Giá', format: 'price' },
        { field: 'created_at', header: 'Ngày tạo', format: 'date' },
        { field: 'updated_at', header: 'Ngày cập nhật', format: 'date' },
    ];

    const categoryOptions = categories.map((category) => ({
        label: `#${category.id_categorie} ${category.name}`,
        value: category.id_categorie,
    }));

    const statusOptions = [
        { label: "Đang kinh doanh", value: "hiện"},
        { label: "Ngừng kinh doanh", value: "ẩn"}
    ]

    const isMainOptions = [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
    ];

    const colorOptions = [
        { label: 'Stickerless', value: 'stickerless' },
        { label: 'Black', value: 'black' },
        { label: 'Không có', value: 'không có' },
    ];

    return (
        <div>
            <Toast ref={toast} />
            <GenericTable
                visible={userRole === 'admin'}
                data={products}
                selectedItems={selectedProducts}
                setSelectedItems={setSelectedProducts}
                globalFilter={globalFilterProduct}
                setGlobalFilter={setGlobalFilterProduct}
                columns={productColumns}
                onEdit={editProduct}
                onDelete={confirmDeleteProduct}
                onDeleteSelected={confirmDeleteSelected}
                openNew={openNewProduct}
                dataKey="id_product"
                title="Quản lý danh sách sản phẩm"
            />

            {selectedProducts.length === 1 && (
                <div>
                    {selectedProducts.map((prod) => (
                        <div key={prod.id_product} style={{ marginTop: '1rem' }}>
                            <GenericTable
                                data={productVariants[prod.id_product] || []}
                                selectedItems={selectedProductVariants}
                                setSelectedItems={setSelectedProductVariants}
                                globalFilter={globalFilterVariant}
                                setGlobalFilter={setGlobalFilterVariant}
                                columns={productVariantColumns}
                                onEdit={editProductVariant}
                                onDelete={confirmDeleteProductVariant}
                                openNew={() => openNewProductVariant(prod.id_product)}
                                dataKey="id_variant"
                                title={`Biến thể của sản phẩm ${prod.id_product}`}
                            />

                            <GenericTable
                                data={productImages[prod.id_product] || []}
                                selectedItems={selectedProductImages}
                                setSelectedItems={setSelectedProductImages}
                                globalFilter={globalFilterImage}
                                setGlobalFilter={setGlobalFilterImage}
                                columns={productImageColumns}
                                onEdit={editProductImage}
                                onDelete={confirmDeleteProductImage}
                                openNew={() => openNewProductImage(prod.id_product)}
                                dataKey="id_image"
                                title={`Ảnh của sản phẩm ${prod.id_product}`}
                            />
                        </div>
                    ))}
                </div>
            )}

            <GenericForm
                visible={productDialog}
                item={product}
                fields={[
                    { name: 'id_product', label: 'ID', disabled: true, hidden: !product.id_product },
                    { name: 'id_categorie', label: 'Loại sản phẩm', required: true, type: 'dropdown', options: categoryOptions },
                    { name: 'name', label: 'Tên sản phẩm', required: true },
                    { name: 'image_url', label: 'Link ảnh', required: true, type: 'image' },
                    { name: 'desc', label: 'Mô tả', required: true },
                    { name: 'status', label: "Trạng thái", require: true, type: 'dropdown', options: statusOptions},
                    { name: 'created_at', label: 'Ngày tạo', disabled: true, hidden: !product.id_product, type: 'date' },
                    { name: 'updated_at', label: 'Ngày cập nhật', disabled: true, hidden: !product.id_product, type: 'date' },
                ]}
                onChange={onInputChangeProduct}
                onSave={saveProduct}
                onHide={hideDialogProduct}
                submitted={submitted}
                title={product.id_product ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
            />

            <GenericForm
                visible={productImageDialog}
                item={productImage}
                fields={[
                    { name: 'is_main', label: 'Ảnh chính', required: true, type: 'dropdown', options: isMainOptions },
                    { name: 'image_url', label: 'Link ảnh', required: true },
                    { name: 'created_at', label: 'Ngày tạo', disabled: true, hidden: isAdd, type: 'date' },
                    { name: 'updated_at', label: 'Ngày cập nhật', disabled: true, hidden: isAdd, type: 'date' },
                ]}
                onChange={onInputChangeProductImage}
                onSave={saveProductImage}
                onHide={hideDialogProductImage}
                submitted={submittedProductImage}
                title={isAdd ? 'Thêm ảnh sản phẩm' : 'Sửa ảnh sản phẩm'}
            />

            <GenericForm
                visible={productVariantDialog}
                item={productVariant}
                fields={[
                    { name: 'color', label: 'Màu sắc', required: true, type: 'dropdown', options: colorOptions },
                    { name: 'quantity', label: 'Số lượng', required: true, type: 'price' },
                    { name: 'price', label: 'Giá', required: true, type: 'price' },
                    { name: 'created_at', label: 'Ngày tạo', disabled: true, hidden: isAdd, type: 'date' },
                    { name: 'updated_at', label: 'Ngày cập nhật', disabled: true, hidden: isAdd, type: 'date' },
                ]}
                onChange={onInputChangeProductVariant}
                onSave={saveProductVariant}
                onHide={hideDialogProductVariant}
                submitted={submittedProductVariant}
                title={isAdd ? 'Thêm biến thể sản phẩm' : 'Sửa biến thể sản phẩm'}
            />

            <ConfirmDeleteDialog
                visible={deleteProductDialog}
                onHide={() => setDeleteProductDialog(false)}
                onConfirm={deleteProduct}
                item={product}
                idField="id_product"
                renderMessage={(item) => <span>Bạn có chắc muốn xóa sản phẩm <b>{item.name}</b>?</span>}
            />

            <ConfirmDeleteDialog
                visible={deleteProductsDialog}
                onHide={() => setDeleteProductsDialog(false)}
                onConfirm={deleteSelectedProducts}
                multiple={true}
                title="Xác nhận xóa nhiều sản phẩm"
                renderMessage={() => <span>Bạn có chắc muốn xóa <b>{selectedProducts.length}</b> sản phẩm đã chọn?</span>}
            />

            <ConfirmDeleteDialog
                visible={deleteProductImageDialog}
                onHide={() => setDeleteProductImageDialog(false)}
                onConfirm={deleteProductImage}
                item={productImage}
                idField="id_image"
                renderMessage={(item) => <span>Bạn có chắc muốn xóa ảnh <b>{item.image_url}</b>?</span>}
            />

            <ConfirmDeleteDialog
                visible={deleteProductVariantDialog}
                onHide={() => setDeleteProductVariantDialog(false)}
                onConfirm={deleteProductVariant}
                item={productVariant}
                idField="id_variant"
                renderMessage={(item) => <span>Bạn có chắc muốn xóa biến thể <b>{item.color}</b>?</span>}
            />
        </div>
    );
};

export default Product;