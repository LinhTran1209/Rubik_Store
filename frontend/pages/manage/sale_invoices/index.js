import AddInvoiceDetailForm from '../../../components/Admin_page/AddInvoiceDetailForm';
import saleInvoiceDetailsService from '../../../services/sale_invoice_detailsService';
import ConfirmDeleteDialog from '../../../components/Admin_page/ConfirmDeleteDialog';
import InvoicePrintDialog from '../../../components/Admin_page/InvoicePrintDialog';
import product_variantsService from '../../../services/product_variantService'
import sale_invoiceService from '../../../services/sale_invoiceService';
import GenericTable from '../../../components/Admin_page/GenericTable';
import userAddressService from '../../../services/userAddressService';
import GenericForm from '../../../components/Admin_page/GenericForm';
import productService from '../../../services/productService';
import React, { useState, useEffect, useRef } from 'react';
import userService from '../../../services/userService';
import authService from '../../../services/authService';
import { Toast } from 'primereact/toast';

const SaleInvoice = () => {
    // các hook để sử lý phần hóa đơn
    const [sale_invoices, setSaleInvoices] = useState([]);
    const [sale_invoice, setSaleInvoice] = useState({id_sale_invoice: null, id_user: '', id_address: '', desc: '', total: '', pay: '', status: '', request: null, created_at: '', updated_at: ''});
    const [sale_invoiceDialog, setSaleInvoiceDialog] = useState(false);
    const [selectedSaleInvoices, setSelectedSaleInvoices] = useState([]);
    const [deleteSaleInvoiceDialog, setDeleteSaleInvoiceDialog] = useState(false);
    const [submittedSaleInvoice, setSubmittedSaleInvoice] = useState(false);
    const [globalFilterInvoice, setGlobalFilterInvoice] = useState('');

    
    // các hook để sử lý phần chi tiết hóa đơn
    const [details, setDetails] = useState({});
    const [detail, setDetail] = useState({ id_sale_invoice: null, id_variant: '', quantity: '', price: '', created_at: '', updated_at: '' });
    const [DetailDialog, setDetailDialog] = useState(false);
    const [deleteSaleDetailDialog, setDeleteSaleDetailDialog] = useState(false);
    const [selectedSaleDetails, setSelectedSaleDetails] = useState([]);
    const [submittedSaleDetail, setSubmittedSaleDetail] = useState(false);
    const [globalFilterDetail, setGlobalFilterDetail] = useState('');


    const [approveRequestDialog, setApproveRequestDialog] = useState(false);
    const [saleInvoiceToApprove, setSaleInvoiceToApprove] = useState(null);

    const [invoicePrintDialog, setInvoicePrintDialog] = useState(false);
    const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState(null);

    // trạng thái để xác nhận thêm và tải dữ liệu product lên so sánh
    const [isAdd, setIsAdd] = useState(true);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const toast = useRef(null);

    const [userRole, setUserRole] = useState(null);



    const [variants, setVariants] = useState([]);
    const [userAddress, setUserAddress] = useState([])
    const [addressOptions, setAddressOptions] = useState([]);

    // Thêm state mới để lưu trạng thái ban đầu
    const [initialInvoiceStatus, setInitialInvoiceStatus] = useState(null);


    const fetchUsers = async () => {
        try {
            const data = await userService.getAllusers();
            setUsers(data || []);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách Khách hàng', life: 3000,});
        }
    };

    const fetchUser_Addresses = async () => {
        try {
            const data = await userAddressService.getAllusersAddress();
            setUserAddress(data)
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách địa chỉ', life: 3000,});
        }
    }

    const fetchProducts = async () => {
        try {
            const data = await productService.getAllproducts();
            setProducts(data || []);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách sản phẩm', life: 3000});
        }
    };

    const fetchVariants = async () => {
        try {
            const data = await product_variantsService.getAllVariants(); 
            setVariants(data || []);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách biến thể sản phẩm', life: 3000 });
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
            fetchUser_Addresses();
            fetchProducts();
            fetchVariants();
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
        return false;
    };

    const isDisableInvoice = (data) => {
        if (initialInvoiceStatus === 'Hoàn thành' || initialInvoiceStatus === 'Đã hủy đơn') {
            return true;
        }
        return false;
    };

    const openNewInvoice = () => {
        setSaleInvoice({ id_sale_invoice: null, id_user: '', id_address: '', desc: '', total: 0, pay: 'COD', status: 'Đang xác nhận'});
        setAddressOptions([]);
        setSubmittedSaleInvoice(false);
        setSaleInvoiceDialog(true);
    };

    const openNewDetail = (id_sale_invoice) => {
        setIsAdd(true);
        setDetail({ id_sale_invoice: id_sale_invoice, id_variant: '', quantity: '', price: '', color: '' });
        setSubmittedSaleDetail(false);
        setDetailDialog(true);
    };

    const hideDialogInvoice = () => {
        setSubmittedSaleInvoice(false);
        setSaleInvoiceDialog(false);
    };

    const hideDialogDetail = () => {
        setDetailDialog(false);
        setDetail({ id_sale_invoice: null, id_variant: '', quantity: '', price: '' });
    };

    const savesaleInvoice = () => { //Lưu hóa đơn này
        // Kiểm tra các đầu vào bắt buộc
        setSubmittedSaleInvoice(true);
        if (!sale_invoice.id_user || !sale_invoice.pay || !sale_invoice.status || !sale_invoice.id_address) {
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

    const savesaleDetail = async (detail, isAdd) => { //Lưu chi tiết hóa đơn
        // Kiểm tra các đầu vào bắt buộc
        setSubmittedSaleDetail(true);
        if (!detail.id_variant  || !detail.quantity || !detail.price) {
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


        // hideDialogDetail();
        
        const detailData = { ...detail };
        const invoiceId = detailData.id_sale_invoice;
        const requestedQuantity = parseInt(detailData.quantity);
        const variantID = parseInt(detailData.id_variant);

        detailData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
        detailData.created_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];


        if (!isAdd) { //Nếu không phải thêm mới thì cập nhật
            // không làm update nhé
        } else { //Phần thêm mới
            // Kiểm tra xem sản phẩm đã có trong chi tiết hóa đơn chưa
            if ( Array.isArray(details[invoiceId]) && details[invoiceId].some((dt) => dt.id_variant == detailData.id_variant)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Sản phẩm đã có trong chi tiết hóa đơn', life: 3000});
                return;
            }

            if ( variants.some( (product) => product.id_variant === variantID && product.quantity < requestedQuantity)) {
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
        const userAddresses = userAddress.filter((addr) => addr.id_user === sale_invoice.id_user);
        setAddressOptions(userAddresses.map((addr) => ({
            label: `#${addr.name} | ${addr.phone} | ${addr.address}`, // Giả sử trường address chứa tên địa chỉ
            value: addr.id_address // Giả sử id_address là khóa chính của địa chỉ
        })));
        setSaleInvoiceDialog(true);
        setInitialInvoiceStatus(sale_invoice.status);
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
        saleInvoiceDetailsService.deleteDetail(detail.id_sale_invoice, detail.id_variant)
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
        if (itemId === 'id_user') {
            // Khi thay đổi id_user, cập nhật danh sách địa chỉ tương ứng
            const userAddresses = userAddress.filter((addr) => addr.id_user === val);
            setAddressOptions(userAddresses.map((addr) => ({
                label: `#${addr.name} | ${addr.phone} | ${addr.address}`,
                value: addr.id_address
            })));
            setSaleInvoice((prev) => ({ ...prev, id_user: val, id_address: '' })); // Reset id_address khi đổi user
        } else {
            setSaleInvoice((prev) => ({ ...prev, [itemId]: val }));
        }
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

    // const addresOptions = 

    const statusOptions = [
        { label: 'Đang xác nhận', value: 'Đang xác nhận' },
        { label: 'Đang lấy hàng', value: 'Đang lấy hàng' },
        { label: 'Đang giao hàng', value: 'Đang giao hàng' },
        { label: 'Hoàn thành', value: 'Hoàn thành' },
        { label: 'Đã hủy đơn', value: 'Đã hủy đơn'}
    ];

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
                return user ? user.name : rowData.id_user; 
            },
        },
        { field: 'id_address', header: 'Địa chỉ',
            render: (rowData) => {
                const address = userAddress.find((addr) => addr.id_address === rowData.id_address);
                return address ? address.address : rowData.id_address;
            }
        },
        { field: 'total', header: 'Tổng tiền', format: 'price' },
        { field: 'status', header: 'Trạng thái',
            render: (rowData) => {
                const statusColor = {
                    'Đang xác nhận': '#FFC107', 
                    'Đang lấy hàng': '#00BCD4', 
                    'Đang giao hàng': '#FF9800', 
                    'Hoàn thành': 'green', 
                    'Đã hủy đơn': 'red', 
                };
        
                return (
                    <span style={{ color: statusColor[rowData.status] || 'black' }}>
                        {rowData.status}
                    </span>
                );
            },
         },
        { field: 'request', header: 'Yêu cầu', 
            render: (rowData) => (
                <span style={{color: rowData.request === 'Đặt hàng' ? 'green' : 'red' }}>
                    {rowData.request}
                </span>
            ),
        },
        { field: 'pay', header: 'Thanh toán' },
        { field: 'desc', header: 'Ghi chú' },
        { field: 'created_at', header: 'Ngày tạo', format: 'date' },
        { field: 'updated_at', header: 'Ngày cập nhật', format: 'date' },
    ];

    const detailColumns = [
        { field: 'id_variant', header: 'Sản phẩm',
            render: (rowData) => {
                const variant = variants.find((p) => p.id_variant === rowData.id_variant);
                const product = products.find((p) => p.id_product === variant.id_product)
                return product ? product.name : rowData.id_variant;
            },
        },
        { feild: 'color', header: 'Biến thể',
            render: (rowData) => {
                const variant = variants.find((p) => p.id_variant === rowData.id_variant)
                return variant ? variant.color : 'không có'
            }
        },
        { field: 'quantity', header: 'Số lượng' },
        { field: 'price', header: 'Đơn giá', format: 'price' },
        { field: 'created_at', header: 'Ngày tạo' , format: 'date'},
        { field: 'updated_at', header: 'Ngày cập nhật', format: 'date' },
    ];

    // Xử lý phần yêu cầu từ khách hàng
    const confirmApproveRequest = (sale_invoice) => {
        setSaleInvoiceToApprove(sale_invoice);
        setApproveRequestDialog(true);
    };

    const approveRequest = () => {
        const updatedInvoice = { ...saleInvoiceToApprove, request: null };
        sale_invoiceService.updatesale_invoice(saleInvoiceToApprove.id_sale_invoice, updatedInvoice)
            .then(() => {
                show_invoices(); // Cập nhật lại danh sách hóa đơn
                setApproveRequestDialog(false);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Duyệt yêu cầu thành công', life: 3000 });
            })
            .catch((error) => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Duyệt yêu cầu thất bại', life: 3000 });
            });
    };

    // Xử lý phần IN hóa đơn
    const showInvoicePrintDialog = (invoice) => {
        setSelectedInvoiceForPrint(invoice);
        setInvoicePrintDialog(true);
    };

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
                // onDelete={confirmDeletesaleInvoice}
                onApproveRequest={confirmApproveRequest}
                onView={showInvoicePrintDialog}
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
                                dataKey="id_varient"
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
                    { name: 'id_user', label: 'Khách hàng', required: true, type: 'dropdown', options: userOptions, disabled: sale_invoice.id_sale_invoice !== null},
                    { name: 'id_address', label: 'Địa chỉ', required: true, type: 'dropdown', options: addressOptions, disabled: isDisableInvoice(sale_invoice)},
                    { name: 'total', label: 'Tổng tiền', disabled: true, hidden: !sale_invoice.id_sale_invoice, type: 'price'},
                    { name: 'status', label: 'Trạng thái', required: true, type: 'dropdown', options: statusOptions, disabled: isDisableInvoice(sale_invoice)},
                    { name: 'pay', label: 'Thanh toán', required: true, type: 'dropdown', options: paymentOptions, disabled: sale_invoice.id_sale_invoice !== null},
                    { name: 'desc', label: 'Ghi chú', required: true, disabled: isDisableInvoice(sale_invoice)},
                    { name: 'created_at', label: 'Ngày tạo', disabled: true, hidden: !sale_invoice.id_sale_invoice, type: 'date'},
                    { name: 'updated_at', label: 'Ngày chỉnh sửa', disabled: true, hidden: !sale_invoice.id_sale_invoice, type: 'date'},
                ]}
                onChange={onInputChangeInvoice}
                onSave={savesaleInvoice}
                onHide={hideDialogInvoice}
                submitted={submittedSaleInvoice}
                title={sale_invoice.id_sale_invoice ? 'Sửa hóa đơn bán' : 'Thêm hóa đơn bán'}
            />

            <InvoicePrintDialog
                visible={invoicePrintDialog}
                onHide={() => setInvoicePrintDialog(false)}
                invoice={selectedInvoiceForPrint}
                details={details}
                users={users}
                userAddress={userAddress}
                products={products}
                variants={variants}
            />


            <AddInvoiceDetailForm
                visible={DetailDialog} 
                onHide={() => setDetailDialog(false)}
                onSave={savesaleDetail}
                detail={detail}
                isAdd={isAdd}
                products={products}
                variantsData={variants}
                invoiceId={selectedSaleInvoices ?  selectedSaleInvoices[0] : null}
                title={isAdd ? 'Thêm chi tiết hóa đơn' : 'Chi tiết hóa đơn'}
            />
            <ConfirmDeleteDialog
                visible={approveRequestDialog}
                onHide={() => setApproveRequestDialog(false)}
                onConfirm={approveRequest}
                item={saleInvoiceToApprove}
                idField="id_sale_invoice"
                title="Xác nhận duyệt yêu cầu"
                renderMessage={(item) => {
                    if (!item) {
                        return <span>Đang tải dữ liệu...</span>; 
                    }
                    const user = users.find((u) => u.id_user === item.id_user);
                    return (
                        <span>
                            Bạn có chắc muốn duyệt yêu cầu{' '}
                            <b>{item.request}</b>{' '}cho khách hàng{' '}
                            <b>{user ? user.name : item.id_user}</b> không?
                        </span>
                    );
                }}
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