import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';

import sale_invoiceService from '../../services/sale_invoiceService';
import saleInvoiceDetailsService from '../../services/sale_invoice_detailsService';
import productService from '../../services/productService';
import customerService from '../../services/customerService';

import GenericTable from '../../components/Admin_page/GenericTable';
import GenericForm from '../../components/Admin_page/GenericForm';
import ConfirmDeleteDialog from '../../components/Admin_page/ConfirmDeleteDialog';


const SaleInvoice = () => {
    const [sale_invoices, setSaleInvoices] = useState([]);
    const [sale_invoice, setSaleInvoice] = useState({ id_sale_invoice: null, id_customer: '', desc: '', total: '', pay: '', status: '', created_at: '', updated_at: '' });
    const [sale_invoiceDialog, setSaleInvoiceDialog] = useState(false);
    const [selectedSaleInvoices, setSelectedSaleInvoices] = useState([]);
    const [deleteSaleInvoiceDialog, setDeleteSaleInvoiceDialog] = useState(false);
    const [submittedSaleInvoice, setSubmittedSaleInvoice] = useState(false);
    
    const [globalFilter, setGlobalFilter] = useState('');
    
    const [details, setDetails] = useState({});
    const [detail, setDetail] = useState({ id_sale_invoice: null, id_product: '', quantity: '', price: '', created_at: '', updated_at: '' });
    const [DetailDialog, setDetailDialog] = useState(false);
    const [selectedSaleDetails, setSelectedSaleDetails] = useState([]);
    const [deleteSaleDetailDialog, setDeleteSaleDetailDialog] = useState(false);
    const [submittedSaleDetail, setSubmittedSaleDetail] = useState(false);


    const [isAdd, setIsAdd] = useState(true);
    const [products, setProducts] = useState([]);   
    const [customers, setcustomers] = useState([]);
    const toast = useRef(null);

    const fetchcustomers = async () => {
        try {
            const data = await customerService.getAllcustomers();
            setcustomers(data || []);
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách Khách hàng', life: 3000 });
        }
    };

    const fetchProducts = async () => {
        try {
            const data = await productService.getAllproducts();
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách sản phẩm', life: 3000 });
        }
    };

    const fetchDetails = async (invoiceId) => {
        try {
            const data = await saleInvoiceDetailsService.getAllByInvoiceId(invoiceId);
            setDetails(prev => ({ ...prev, [invoiceId]: Array.isArray(data) ? data : [] }));
        } catch (error) {
            console.error('Error fetching details:', error);
            setDetails(prev => ({ ...prev, [invoiceId]: [] }));
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
        show_invoices();
        fetchcustomers();
        fetchProducts();
    }, []);

    useEffect(() => {
        selectedSaleInvoices.forEach(invoice => {
            if (!details[invoice.id_sale_invoice]) {
                fetchDetails(invoice.id_sale_invoice);
            }
        });
    }, [selectedSaleInvoices]);

    // 1 hàm xác nhận không thể sửa thêm hay xóa
    const notification = (data, string) => {
        if (data.status !== 'Đang xác nhận') {
            if (string !== '') {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không thể ' + string + ' bản ghi tại thời điểm này ' });
            }
            return true;
        }
    }

    const openNewInvoice = () => {
        setSaleInvoice({ id_sale_invoice: null, id_customer: '', desc: '', total: 0, pay: '', status: 'Đang xác nhận' });
        setSubmittedSaleInvoice(false);
        setSaleInvoiceDialog(true);
    };

    const openNewDetail = (id_sale_invoice) => {
        setIsAdd(true);
        setDetail({ id_sale_invoice: id_sale_invoice, id_product: '', quantity: '', price: '' });
        setSubmittedSaleDetail(false)
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

    const savesaleInvoice = () => {
        setSubmittedSaleInvoice(true);
        if (!sale_invoice.id_customer || !sale_invoice.pay || !sale_invoice.status ) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc', life: 3000 });
            return;
        }
    
        if (!customers.some(customer => customer.id_customer === parseInt(sale_invoice.id_customer))) {
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Khách hàng không tồn tại', life: 3000 });
            return;
        }
    
        if (typeof sale_invoice.desc !== 'string' || sale_invoice.desc.length >= 200) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Mô tả không được quá 200 ký tự' });
            return;
        }

        const validPay = ['COD', 'QR'];
        if (!validPay.includes(sale_invoice.pay)) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Thanh toán không hợp lệ (COD or QR)!' });
            return;
        }
    
        const validStatuses = ['Đang xác nhận', 'Đang lấy hàng', 'Đang giao hàng', 'Hoàn thành'];
        if (!validStatuses.includes(sale_invoice.status)) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Trạng thái không hợp lệ' });
            return;
        }



        const saleInvoiceData = { ...sale_invoice };
        if (sale_invoice.id_sale_invoice) { // Cập nhật
            if (sale_invoices.some(sale_invoice => JSON.stringify(sale_invoice) === JSON.stringify(saleInvoiceData))) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không có thay đổi nào được thực hiện' });
                return;
            }

            saleInvoiceData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
            saleInvoiceData.created_at = new Date(new Date(saleInvoiceData.created_at).setDate(new Date(saleInvoiceData.created_at).getDate() + 1)).toISOString().split('T')[0];
            
            sale_invoiceService.updatesale_invoice(sale_invoice.id_sale_invoice, saleInvoiceData)
                .then(() => {
                    show_invoices();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại', life: 3000 });
                });
        } else { // Thêm mới
            sale_invoiceService.addsale_invoice(saleInvoiceData)
                .then(() => {
                    show_invoices();
                    fetchProducts();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm thành công', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thêm thất bại', life: 3000 });
                });
        }

        hideDialogInvoice();
    };

    const savesaleDetail = () => {
        setSubmittedSaleInvoice(true);
        if (!detail.id_product || !detail.quantity || !detail.price) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin', life: 3000 });
            return;
        }

        if (!products.some(product => product.id_product === parseInt(detail.id_product))) {
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Sản phẩm không tồn tại', life: 3000 });
            return;
        }

        // Kiểm tra số lượng có phải là số hay không
        if (isNaN(detail.quantity) || Number(detail.quantity) <= 0) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số lượng phải là số dương' });
            return;
        }
        
        // Kiểm tra giá có phải là số hay không
        if (isNaN(detail.price) || Number(detail.price) <= 0) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Giá phải là số dương' });
            return;
        }

        const detailData = { ...detail };
        const invoiceId = detailData.id_sale_invoice;

        const requestedQuantity = parseInt(detailData.quantity);
        const productId = parseInt(detailData.id_product); // Chuyển đổi sang số
        if (!isAdd) { // Cập nhật lại chi tiết     
            // Kiểm tra xem có cập nhật thông tin nào không
            console.log(details)
            console.log(invoiceId)
            if (Array.isArray(details[invoiceId]) && details[invoiceId].some(dt => JSON.stringify(dt) === JSON.stringify(detailData))) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không có thay đổi nào được thực hiện' });
                return;
            }
            
            if (products.some(product => (product.id_product === productId) && 
                                        (product.quantity < requestedQuantity))) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Số lượng sản phẩm không đủ', life: 3000 });
                return;
            }

            detailData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
            detailData.created_at = new Date(new Date(detailData.created_at).setDate(new Date(detailData.created_at).getDate() + 1)).toISOString().split('T')[0];

            saleInvoiceDetailsService.updateDetail(detail.id_sale_invoice, detail.id_product, detailData)
                .then(() => {
                    fetchDetails(detail.id_sale_invoice); // Cập nhật lại chi tiết
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại', life: 3000 });
                });
        } else { // Thêm chi tiết hóa đơn
            if (Array.isArray(details[invoiceId]) && details[invoiceId].some(dt => dt.id_product == detailData.id_product)) {
                toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Sản phẩm đã có trong chi tiết hóa đơn' });
                return;
            }
            
            if (products.some(product => product.id_product === productId && product.quantity < requestedQuantity)) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Số lượng sản phẩm không đủ', life: 3000 });
                return;
            }

            saleInvoiceDetailsService.addDetail(detailData)
                .then(() => {
                    fetchDetails(invoiceId); // Cập nhật lại chi tiết
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm thành công', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thêm thất bại', life: 3000 });
                });
        }

        hideDialogDetail();
    };
// ------------------------------------------------------------- Nhớ sửa lại
    const editsaleInvoice = (sale_invoice) => {
        // if (notification(sale_invoice, 'sửa')) return;
        console.log(sale_invoice)
        setSaleInvoice({ ...sale_invoice });
        setSaleInvoiceDialog(true);


    };

    const editsaleDetail = (detail) => {
        console.log(detail)
        setIsAdd(false);
        setDetail({ ...detail });
        setDetailDialog(true);
    };

    const confirmDeletesaleInvoice = (sale_invoice) => {
        setSaleInvoice(sale_invoice);
        setDeleteSaleInvoiceDialog(true);
    };

    const confirmDeletesaleDetail = (detail) => {
        // kiểm tra xem có được xóa hay không
        console.log(sale_invoice)
        setDetail(detail);
        setDeleteSaleDetailDialog(true);
    };

    const deletesaleInvoice = () => {
        sale_invoiceService.deletesale_invoice(sale_invoice.id_sale_invoice)
            .then(() => {
                show_invoices();
                setDeleteSaleInvoiceDialog(false);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
        
    };

    const deletesaleDetail = () => {
        saleInvoiceDetailsService.deleteDetail(detail.id_sale_invoice, detail.id_product)
            .then(() => {
                fetchDetails(detail.id_sale_invoice);
                setDeleteSaleDetailDialog(false); // Thêm dòng này
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa chi tiết thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa chi tiết thất bại', life: 3000 });
            });
    };

    const onInputChangeInvoice = (e, itemId) => {
        const val = (e.target && e.target.value) || '';
        setSaleInvoice(prev => ({ ...prev, [itemId]: val }));
    };

    const onInputChangeDetail = (e, itemId) => {
        const val = (e.target && e.target.value) || '';
        setDetail(prev => ({ ...prev, [itemId]: val }));
    };

    const invoiceColumns = [
        { field: 'id_sale_invoice', header: 'ID' },
        { field: 'id_customer', header: 'ID Khách hàng' },
        { field: 'desc', header: 'Mô tả' },
        { field: 'total', header: 'Tổng tiền' },
        { field: 'pay', header: 'Thanh toán' },
        { field: 'status', header: 'Trạng thái' },
        { field: 'created_at', header: 'Ngày tạo' },
        { field: 'updated_at', header: 'Ngày cập nhật' },
    ];

    const detailColumns = [
        { field: 'id_product', header: 'ID Sản phẩm' },
        { field: 'quantity', header: 'Số lượng' },
        { field: 'price', header: 'Đơn giá' },
        { field: 'created_at', header: 'Ngày tạo' },
        { field: 'updated_at', header: 'Ngày cập nhật' },
    ];
    return (
        <div>
            <Toast ref={toast} />
            <GenericTable
                data={sale_invoices}
                selectedItems={selectedSaleInvoices}
                setSelectedItems={setSelectedSaleInvoices}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                columns={invoiceColumns}
                onEdit={editsaleInvoice}
                onDelete={confirmDeletesaleInvoice}
                openNew={openNewInvoice}
                dataKey="id_sale_invoice"
                title="Quản lý danh sách hóa đơn bán"
            />

            {selectedSaleInvoices.length == 1 && (
                <div>
                    {selectedSaleInvoices.map((invoice) => (
                        <div key={invoice.id_sale_invoice} style={{ marginTop: '1rem' }}>
                            <GenericTable
                                data={details[invoice.id_sale_invoice] || []}
                                selectedItems={selectedSaleDetails}
                                setSelectedItems={setSelectedSaleDetails}
                                globalFilter={globalFilter}
                                setGlobalFilter={setGlobalFilter}
                                columns={detailColumns}
                                onEdit={!notification(invoice, '') ? editsaleDetail: null}
                                onDelete={!notification(invoice, '') ? confirmDeletesaleDetail : null}
                                openNew={!notification(invoice, '') ? () => openNewDetail(invoice.id_sale_invoice): null}
                                dataKey="id_product"
                                title={`Chi tiết hóa đơn ${invoice.id_sale_invoice}`}
                                disabled={notification(invoice, '') ? true : false}
                            />
                        </div>
                    ))}
                </div>
            )}
            <GenericForm
                visible={sale_invoiceDialog}
                item={sale_invoice}
                fields={[
                    { name: 'id_sale_invoice', label: 'ID', disabled: true, hidden: !sale_invoice.id_sale_invoice },
                    { name: 'id_customer', label: 'ID Khách hàng', required: true },
                    { name: 'desc', label: 'Mô tả', required: true },
                    { name: 'total', label: 'Tổng tiền', disabled: true, hidden: !sale_invoice.id_sale_invoice },
                    { name: 'pay', label: 'Thanh toán', required: true },
                    { name: 'status', label: 'Trạng thái', required: true },
                    { name: 'created_at', label: 'Ngày tạo', disabled: true, hidden: !sale_invoice.id_sale_invoice },
                    { name: 'updated_at', label: 'Ngày chỉnh sửa', disabled: true, hidden: !sale_invoice.id_sale_invoice }
                ]}
                onChange={onInputChangeInvoice}
                onSave={savesaleInvoice}
                onHide={hideDialogInvoice}
                submittedSaleInvoice={submittedSaleInvoice}
                title={sale_invoice.id_sale_invoice ? 'Sửa hóa đơn bán' : 'Thêm hóa đơn bán'}
            />
            <GenericForm
                visible={DetailDialog}
                item={detail}
                fields={[
                    { name: 'id_product', label: 'ID Sản phẩm', required: true, disabled: isAdd ? false:true },
                    { name: 'quantity', label: 'Số lượng', required: true },
                    { name: 'price', label: 'Đơn giá', required: true },
                    { name: 'created_at', label: 'Ngày tạo', disabled: true, hidden: isAdd },
                    { name: 'updated_at', label: 'Ngày chỉnh sửa', disabled: true, hidden: isAdd }
                ]}
                onChange={onInputChangeDetail}
                onSave={savesaleDetail}
                onHide={hideDialogDetail}
                submittedSaleInvoice={submittedSaleDetail}
                title={isAdd ? 'Thêm chi tiết hóa đơn' : 'Sửa chi tiết hóa đơn'}
            />
            <ConfirmDeleteDialog
                visible={deleteSaleInvoiceDialog}
                onHide={() => setDeleteSaleInvoiceDialog(false)}
                onConfirm={deletesaleInvoice}
                item={sale_invoice}
                idField="id_sale_invoice"
            />

            <ConfirmDeleteDialog
                visible={deleteSaleDetailDialog}
                onHide={() => setDeleteSaleDetailDialog(false)}
                onConfirm={deletesaleDetail}
                item={detail}
                idField="id_product"
            />
        </div>
    );
};

export default SaleInvoice;