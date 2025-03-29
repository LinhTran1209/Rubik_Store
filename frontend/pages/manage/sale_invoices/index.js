import saleInvoiceDetailsService from '../../../services/sale_invoice_detailsService';
import ConfirmDeleteDialog from '../../../components/Admin_page/ConfirmDeleteDialog';
import sale_invoiceService from '../../../services/sale_invoiceService';
import GenericTable from '../../../components/Admin_page/GenericTable';
import GenericForm from '../../../components/Admin_page/GenericForm';
import productService from '../../../services/productService';
import React, { useState, useEffect, useRef } from 'react';
import userService from '../../../services/userService';
import authService from '../../../services/authService';
import { Toast } from 'primereact/toast';

const SaleInvoice = () => {
    // các hook để sử lý phần hóa đơn
    const [sale_invoices, setSaleInvoices] = useState([]);
    const [sale_invoice, setSaleInvoice] = useState({id_sale_invoice: null, id_user: '', desc: '', total: '', pay: '', status: '', created_at: '', updated_at: ''});
    const [sale_invoiceDialog, setSaleInvoiceDialog] = useState(false);
    const [selectedSaleInvoices, setSelectedSaleInvoices] = useState([]);
    const [deleteSaleInvoiceDialog, setDeleteSaleInvoiceDialog] = useState(false);
    const [submittedSaleInvoice, setSubmittedSaleInvoice] = useState(false);
    const [globalFilterInvoice, setGlobalFilterInvoice] = useState('');

    
    // các hook để sử lý phần chi tiết hóa đơn
    const [details, setDetails] = useState({});
    const [detail, setDetail] = useState({ id_sale_invoice: null, id_product: '', quantity: '', price: '', created_at: '', updated_at: '' });
    const [DetailDialog, setDetailDialog] = useState(false);
    const [deleteSaleDetailDialog, setDeleteSaleDetailDialog] = useState(false);
    const [selectedSaleDetails, setSelectedSaleDetails] = useState([]);
    const [submittedSaleDetail, setSubmittedSaleDetail] = useState(false);
    const [globalFilterDetail, setGlobalFilterDetail] = useState('');

    // trạng thái để xác nhận thêm và tải dữ liệu product lên so sánh
    const [isAdd, setIsAdd] = useState(true);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const toast = useRef(null);

    const [userRole, setUserRole] = useState(null);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllusers();
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách Khách hàng', life: 3000,});
        }
    };

    const fetchProducts = async () => {
        try {
            const data = await productService.getAllproducts();
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách sản phẩm', life: 3000});
        }
    };

    const fetchDetails = async (invoiceId) => {
        try {
            const data = await saleInvoiceDetailsService.getAllByInvoiceId(invoiceId);
            setDetails((prev) => ({ ...prev, [invoiceId]: Array.isArray(data) ? data : [] }));
        } catch (error) {
            console.error('Error fetching details:', error);
            setDetails((prev) => ({ ...prev, [invoiceId]: [] }));
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải chi tiết', life: 3000 });
        }
    };

    const show_invoices = async () => {
        try {
            const data = await sale_invoiceService.getAllsale_invoices();
            setSaleInvoices(data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            setSaleInvoices([]);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu', life: 3000 });
        }
    };

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const user = await authService.getCurrentUser();
                setUserRole(user.role);
            } catch (error) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Bạn cần đăng nhập để vào trang này!', life: 3000});
                setUserRole(null);
            }
        };
        fetchUserRole();
    }, []);

    useEffect(() => {
        if (userRole === 'admin') {
            show_invoices();
            fetchUsers();
            fetchProducts();
        }
    }, [userRole]);

    useEffect(() => {
        selectedSaleInvoices.forEach((invoice) => {
            if (!details[invoice.id_sale_invoice]) {
                fetchDetails(invoice.id_sale_invoice);
            }
        });
    }, [selectedSaleInvoices]);

    const notification = (data, string) => {
        if (data.status !== 'Đang xác nhận') {
            if (string !== '') {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không thể ' + string + ' bản ghi tại thời điểm này ', life: 3000 });
            }
            return true;
        }
    };

    const openNewInvoice = () => {
        setSaleInvoice({ id_sale_invoice: null, id_user: '', desc: '', total: 0, pay: 'COD', status: 'Đang xác nhận'});
        setSubmittedSaleInvoice(false);
        setSaleInvoiceDialog(true);
    };

    const openNewDetail = (id_sale_invoice) => {
        setIsAdd(true);
        setDetail({ id_sale_invoice: id_sale_invoice, id_product: '', quantity: '', price: '' });
        setSubmittedSaleDetail(false);
        setDetailDialog(true);
    };

    const hideDialogInvoice = () => {
        setSubmittedSaleInvoice(false);
        setSaleInvoiceDialog(false);
    };

    const hideDialogDetail = () => {
        setDetailDialog(false);
        setDetail({ id_sale_invoice: null, id_product: '', quantity: '', price: '' });
    };

    const savesaleInvoice = () => { //Lưu hóa đơn này
        // Kiểm tra các đầu vào bắt buộc
        setSubmittedSaleInvoice(true);
        if (!sale_invoice.id_user || !sale_invoice.pay || !sale_invoice.status) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc', life: 3000});
            return;
        }

        if (typeof sale_invoice.desc !== 'string' || sale_invoice.desc.length >= 200) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Mô tả không được quá 200 ký tự', life: 3000});
            return;
        }

        const saleInvoiceData = { ...sale_invoice };
        if (sale_invoice.id_sale_invoice) { //Nếu có id_sale_invoice thì cập nhật (Phần cập nhật)
            // Kiểm tra xem có thay đổi gì không
            if (sale_invoices.some((inv) => JSON.stringify(inv) === JSON.stringify(saleInvoiceData))) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không có thay đổi nào được thực hiện', life: 3000});
                return;
            }

            // format lại ngày vì tạo cộng thêm 1 ngày vì khi lưu lên server sẽ bị trừ 1 ngày (lệch múi giờ) và cắt chuỗi thời gian, giải pháp tạm thời
            saleInvoiceData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
            saleInvoiceData.created_at = new Date(new Date(saleInvoiceData.created_at).setDate(new Date(saleInvoiceData.created_at).getDate() + 1)).toISOString().split('T')[0];

            sale_invoiceService.updatesale_invoice(sale_invoice.id_sale_invoice, saleInvoiceData)
                .then(() => {
                    show_invoices();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000});
                })
                .catch((error) => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại',life: 3000 });
                });
        } else { // Phần thêm mới
            sale_invoiceService.addsale_invoice(saleInvoiceData)
                .then(() => {
                    show_invoices();
                    fetchProducts();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm thành công', life: 3000});
                })
                .catch((error) => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thêm thất bại', life: 3000 });
                });
        }

        hideDialogInvoice();
    };

    const savesaleDetail = () => { //Lưu chi tiết hóa đơn
        // Kiểm tra các đầu vào bắt buộc
        setSubmittedSaleDetail(true);
        if (!detail.id_product || !detail.quantity || !detail.price) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin', life: 3000 });
            return;
        }

        if (isNaN(detail.quantity) || Number(detail.quantity) <= 0) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số lượng phải là số dương', life: 3000 });
            return;
        }

        if (isNaN(detail.price) || Number(detail.price) <= 0) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Giá phải là số dương', life: 3000 });
            return;
        }

        const detailData = { ...detail };
        const invoiceId = detailData.id_sale_invoice;

        const requestedQuantity = parseInt(detailData.quantity);
        const productId = parseInt(detailData.id_product);

        if (!isAdd) { //Nếu không phải thêm mới thì cập nhật
            // Kiểm tra xem có thay đổi gì không
            if (Array.isArray(details[invoiceId]) && details[invoiceId].some((dt) => JSON.stringify(dt) === JSON.stringify(detailData))) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không có thay đổi nào được thực hiện', life: 3000 });
                return;
            }

            if (products.some((product) => product.id_product === productId && product.quantity < requestedQuantity )) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Số lượng sản phẩm không đủ', life: 3000});
                return;
            }

            detailData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
            detailData.created_at = new Date(new Date(detailData.created_at).setDate(new Date(detailData.created_at).getDate() + 1)).toISOString().split('T')[0];

            saleInvoiceDetailsService.updateDetail(detail.id_sale_invoice, detail.id_product, detailData)
                .then(() => {
                    fetchDetails(detail.id_sale_invoice);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000});
                })
                .catch((error) => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại', life: 3000});
                });
        } else { //Phần thêm mới
            // Kiểm tra xem sản phẩm đã có trong chi tiết hóa đơn chưa
            if ( Array.isArray(details[invoiceId]) && details[invoiceId].some((dt) => dt.id_product == detailData.id_product)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Sản phẩm đã có trong chi tiết hóa đơn', life: 3000});
                return;
            }

            if ( products.some( (product) => product.id_product === productId && product.quantity < requestedQuantity)) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Số lượng sản phẩm không đủ', life: 3000});
                return;
            }

            saleInvoiceDetailsService.addDetail(detailData)
                .then(() => {
                    fetchDetails(invoiceId);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm thành công', life: 3000});
                })
                .catch((error) => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thêm thất bại', life: 3000});
                });
        }

        hideDialogDetail();
    };


    // --------------------------------------------------------Nhớ sửa lại phần này-----------------------------
    const editsaleInvoice = (sale_invoice) => {
        // if (notification(sale_invoice, 'sửa')) return;
        setSaleInvoice({ ...sale_invoice });
        setSaleInvoiceDialog(true);
    };

    const editsaleDetail = (detail) => {
        setIsAdd(false);
        setDetail({ ...detail });
        setDetailDialog(true);
    };

    const confirmDeletesaleInvoice = (sale_invoice) => {
        // if (notification(sale_invoice, 'xóa')) return;
        setSaleInvoice(sale_invoice);
        setDeleteSaleInvoiceDialog(true);
    };

    const confirmDeletesaleDetail = (detail) => {
        setDetail(detail);
        setDeleteSaleDetailDialog(true);
    };

    const deletesaleInvoice = () => {
        sale_invoiceService.deletesale_invoice(sale_invoice.id_sale_invoice)
            .then(() => {
                show_invoices();
                setDeleteSaleInvoiceDialog(false);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công', life: 3000});
            })
            .catch((error) => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000,});
            });
    };

    const deletesaleDetail = () => {
        saleInvoiceDetailsService.deleteDetail(detail.id_sale_invoice, detail.id_product)
            .then(() => {
                fetchDetails(detail.id_sale_invoice);
                setDeleteSaleDetailDialog(false);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa chi tiết thành công', life: 3000});
            })
            .catch((error) => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa chi tiết thất bại', life: 3000});
            });
    };

    const onInputChangeInvoice = (e, itemId) => {
        const val = (e.target && e.target.value) || '';
        setSaleInvoice((prev) => ({ ...prev, [itemId]: val }));
    };

    const onInputChangeDetail = (e, itemId) => {
        const val = (e.target && e.target.value) || '';
        setDetail((prev) => ({ ...prev, [itemId]: val }));
    };


    // Các options cho xổ xuống trong form tra từ dữ liệu dropdown
    const userOptions = users.map((user) => ({
        label: `#${user.id_user} ${user.name}`,
        value: user.id_user,
    }));

    const statusOptions = [
        { label: 'Đang xác nhận', value: 'Đang xác nhận' },
        { label: 'Đang lấy hàng', value: 'Đang lấy hàng' },
        { label: 'Đang giao hàng', value: 'Đang giao hàng' },
        { label: 'Hoàn thành', value: 'Hoàn thành' },
    ];

    const productOptions = products.map((product) => ({
        label: `#${product.id_product} ${product.name}`,
        value: product.id_product,
    }));

    const paymentOptions = [
        { label: 'COD', value: 'COD' },
        { label: 'QR', value: 'QR' },
    ];

    // Các cột trong bảng
    const invoiceColumns = [
        { field: 'id_sale_invoice', header: 'ID' },
        { field: 'id_user', header: 'Khách hàng',
            render: (rowData) => {
                const user = users.find((u) => u.id_user === rowData.id_user);
                return user ? user.name : rowData.id_user; // Chỉ hiển thị tên trong bảng
            },
        },
        { field: 'desc', header: 'Mô tả' },
        { field: 'total', header: 'Tổng tiền', format: 'price' },
        { field: 'pay', header: 'Thanh toán' },
        { field: 'status', header: 'Trạng thái' },
        { field: 'created_at', header: 'Ngày tạo', format: 'date' },
        { field: 'updated_at', header: 'Ngày cập nhật', format: 'date' },
    ];

    const detailColumns = [
        { field: 'id_product', header: 'Sản phẩm',
            render: (rowData) => {
                const product = products.find((p) => p.id_product === rowData.id_product);
                return product ? product.name : rowData.id_product; // Chỉ hiển thị tên trong bảng
            },
        },
        { field: 'quantity', header: 'Số lượng' },
        { field: 'price', header: 'Đơn giá', format: 'price' },
        { field: 'created_at', header: 'Ngày tạo' , format: 'date'},
        { field: 'updated_at', header: 'Ngày cập nhật', format: 'date' },
    ];

    return (
        <div>
            <Toast ref={toast} />
            <GenericTable
                visible={userRole === 'admin'}
                data={sale_invoices}
                selectedItems={selectedSaleInvoices}
                setSelectedItems={setSelectedSaleInvoices}
                globalFilter={globalFilterInvoice}
                setGlobalFilter={setGlobalFilterInvoice}
                columns={invoiceColumns}
                onEdit={editsaleInvoice}
                onDelete={confirmDeletesaleInvoice}
                openNew={openNewInvoice}
                dataKey="id_sale_invoice"
                title="Quản lý danh sách hóa đơn bán"
            />

            {selectedSaleInvoices.length === 1 && (
                <div>
                    {selectedSaleInvoices.map((invoice) => (
                        <div key={invoice.id_sale_invoice} style={{ marginTop: '1rem' }}>
                            <GenericTable
                                data={details[invoice.id_sale_invoice] || []}
                                selectedItems={selectedSaleDetails}
                                setSelectedItems={setSelectedSaleDetails}
                                globalFilter={globalFilterDetail}
                                setGlobalFilter={setGlobalFilterDetail}
                                columns={detailColumns}
                                onEdit={!notification(invoice, '') ? editsaleDetail : null}
                                onDelete={!notification(invoice, '') ? confirmDeletesaleDetail : null}
                                openNew={!notification(invoice, '') ? () => openNewDetail(invoice.id_sale_invoice) : null}
                                dataKey="id_product"
                                title={`Chi tiết hóa đơn ${invoice.id_sale_invoice}`}
                                disabled={notification(invoice, '')}
                            />
                        </div>
                    ))}
                </div>
            )}

            <GenericForm
                visible={sale_invoiceDialog}
                item={sale_invoice}
                fields={[
                    { name: 'id_sale_invoice', label: 'ID', disabled: true, hidden: !sale_invoice.id_sale_invoice},
                    // Hiển thị #id Tên trong dropdown
                    { name: 'id_user', label: 'Khách hàng', required: true, type: 'dropdown', options: userOptions},
                    { name: 'desc', label: 'Mô tả', required: true },
                    { name: 'total', label: 'Tổng tiền', disabled: true, hidden: !sale_invoice.id_sale_invoice, type: 'price'},
                    { name: 'pay', label: 'Thanh toán', required: true, type: 'dropdown', options: paymentOptions,},
                    { name: 'status', label: 'Trạng thái', required: true, type: 'dropdown', options: statusOptions },
                    { name: 'created_at', label: 'Ngày tạo', disabled: true, hidden: !sale_invoice.id_sale_invoice, type: 'date'},
                    { name: 'updated_at', label: 'Ngày chỉnh sửa', disabled: true, hidden: !sale_invoice.id_sale_invoice, type: 'date'},
                ]}
                onChange={onInputChangeInvoice}
                onSave={savesaleInvoice}
                onHide={hideDialogInvoice}
                submitted={submittedSaleInvoice}
                title={sale_invoice.id_sale_invoice ? 'Sửa hóa đơn bán' : 'Thêm hóa đơn bán'}
            />

            <GenericForm
                visible={DetailDialog}
                item={detail}
                fields={[
                    // Hiển thị #id Tên trong dropdown
                    { name: 'id_product', label: 'Sản phẩm', required: true, disabled: !isAdd, type: 'dropdown', options: productOptions},
                    { name: 'quantity', label: 'Số lượng', required: true },
                    { name: 'price', label: 'Đơn giá', required: true, type: 'price' },
                    { name: 'created_at', label: 'Ngày tạo', disabled: true, hidden: isAdd },
                    { name: 'updated_at', label: 'Ngày chỉnh sửa', disabled: true, hidden: isAdd },
                ]}
                onChange={onInputChangeDetail}
                onSave={savesaleDetail}
                onHide={hideDialogDetail}
                submitted={submittedSaleDetail}
                title={isAdd ? 'Thêm chi tiết hóa đơn' : 'Sửa chi tiết hóa đơn'}
            />

            <ConfirmDeleteDialog
                visible={deleteSaleInvoiceDialog}
                onHide={() => setDeleteSaleInvoiceDialog(false)}
                onConfirm={deletesaleInvoice}
                item={sale_invoice}
                idField="id_sale_invoice"
                renderMessage={(item) => {
                    const user = users.find((u) => u.id_user === item.id_user);
                    return (
                        <span>
                            Bạn có chắc muốn xóa hóa đơn của khách hàng{' '}
                            <b>{user ? user.name : item.id_user}</b>?
                        </span>
                    );
                }}
            />

            <ConfirmDeleteDialog
                visible={deleteSaleDetailDialog}
                onHide={() => setDeleteSaleDetailDialog(false)}
                onConfirm={deletesaleDetail}
                item={detail}
                idField="id_product"
                renderMessage={(item) => {
                    const product = products.find((p) => p.id_product === item.id_product);
                    return (
                        <span>
                            Bạn có chắc muốn xóa sản phẩm{' '}
                            <b>{product ? product.name : item.id_product}</b>?
                        </span>
                    );
                }}
            />
        </div>
    );
};

export default SaleInvoice;