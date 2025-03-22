import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';

import buy_invoiceService from '../../../services/buy_invoiceService';
import buyInvoiceDetailsService from '../../../services/buy_invoice_detailsService';
import productService from '../../../services/productService';
import supplierService from '../../../services/supplierService';

import GenericTable from '../../../components/Admin_page/GenericTable';
import GenericForm from '../../../components/Admin_page/GenericForm';
import ConfirmDeleteDialog from '../../../components/Admin_page/ConfirmDeleteDialog';

const BuyInvoice = () => {
    const [buy_invoices, setBuyInvoices] = useState([]);
    const [buy_invoice, setBuyInvoice] = useState({ id_buy_invoice: null, id_supplier: '', desc: '', total: '', status: '', created_at: '', updated_at: '' });
    const [buy_invoiceDialog, setBuyInvoiceDialog] = useState(false);
    const [selectedBuyInvoices, setSelectedBuyInvoices] = useState([]);
    const [deleteBuyInvoiceDialog, setDeleteBuyInvoiceDialog] = useState(false);
    const [submittedBuyInvoice, setSubmittedBuyInvoice] = useState(false);
    
    const [globalFilter, setGlobalFilter] = useState('');
    
    const [details, setDetails] = useState({});
    const [detail, setDetail] = useState({ id_buy_invoice: null, id_product: '', quantity: '', price: '', created_at: '', updated_at: '' });
    const [DetailDialog, setDetailDialog] = useState(false);
    const [selectedBuyDetails, setSelectedBuyDetails] = useState([]);
    const [deleteBuyDetailDialog, setDeleteBuyDetailDialog] = useState(false);
    const [submittedBuyDetail, setSubmittedBuyDetail] = useState(false);


    const [isAdd, setIsAdd] = useState(true);
    const [products, setProducts] = useState([]);   
    const [suppliers, setSuppliers] = useState([]);
    const toast = useRef(null);

    const fetchSuppliers = async () => {
        try {
            const data = await supplierService.getAllsuppliers();
            setSuppliers(data || []);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách nhà cung cấp', life: 3000 });
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
            const data = await buyInvoiceDetailsService.getAllByInvoiceId(invoiceId);
            setDetails(prev => ({ ...prev, [invoiceId]: Array.isArray(data) ? data : [] }));
        } catch (error) {
            console.error('Error fetching details:', error);
            setDetails(prev => ({ ...prev, [invoiceId]: [] }));
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải chi tiết', life: 3000 });
        }
    };

    const show_invoices = async () => {
        try {
            const data = await buy_invoiceService.getAllbuy_invoices();
            setBuyInvoices(data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            setBuyInvoices([]);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải dữ liệu', life: 3000 });
        }
    };
  
    useEffect(() => {
        show_invoices();
        fetchSuppliers();
        fetchProducts();
    }, []);

    useEffect(() => {
        selectedBuyInvoices.forEach(invoice => {
            if (!details[invoice.id_buy_invoice]) {
                fetchDetails(invoice.id_buy_invoice);
            }
        });
    }, [selectedBuyInvoices]);

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
        setBuyInvoice({ id_buy_invoice: null, id_supplier: '', desc: '', total: 0, status: 'Đang xác nhận' });
        setSubmittedBuyInvoice(false);
        setBuyInvoiceDialog(true);
    };

    const openNewDetail = (id_buy_invoice) => {
        setIsAdd(true);
        setDetail({ id_buy_invoice: id_buy_invoice, id_product: '', quantity: '', price: '' });
        setSubmittedBuyDetail(false)
        setDetailDialog(true);
    };

    const hideDialogInvoice = () => {
        setSubmittedBuyInvoice(false);
        setBuyInvoiceDialog(false);
    };

    const hideDialogDetail = () => {
        setDetailDialog(false);
        setDetail({ id_buy_invoice: null, id_product: '', quantity: '', price: '' });
    };

    const saveBuyInvoice = () => {
        setSubmittedBuyInvoice(true);
        if (!buy_invoice.id_supplier || !buy_invoice.status) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc', life: 3000 });
            return;
        }
    
        if (!suppliers.some(supplier => supplier.id_supplier === parseInt(buy_invoice.id_supplier))) {
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Nhà cung cấp không tồn tại', life: 3000 });
            return;
        }
    
        if (typeof buy_invoice.desc !== 'string' || buy_invoice.desc.length >= 200) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Mô tả không được quá 200 ký tự' });
            return;
        }
    
        const validStatuses = ['Đang xác nhận', 'Đang lấy hàng', 'Đang giao hàng', 'Hoàn thành'];
        if (!validStatuses.includes(buy_invoice.status)) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Trạng thái không hợp lệ' });
            return;
        }

        const buyInvoiceData = { ...buy_invoice };
        if (buy_invoice.id_buy_invoice) { // Cập nhật
            if (buy_invoices.some(buy_invoice => JSON.stringify(buy_invoice) === JSON.stringify(buyInvoiceData))) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không có thay đổi nào được thực hiện' });
                return;
            }

            buyInvoiceData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
            buyInvoiceData.created_at = new Date(new Date(buyInvoiceData.created_at).setDate(new Date(buyInvoiceData.created_at).getDate() + 1)).toISOString().split('T')[0];
            
            buy_invoiceService.updatebuy_invoice(buy_invoice.id_buy_invoice, buyInvoiceData)
                .then(() => {
                    show_invoices();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại', life: 3000 });
                });
        } else { // Thêm mới
            buy_invoiceService.addbuy_invoice(buyInvoiceData)
                .then(() => {
                    show_invoices();
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm thành công', life: 3000 });
                })
                .catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Thêm thất bại', life: 3000 });
                });
        }

        hideDialogInvoice();
    };

    const saveBuyDetail = () => {
        setSubmittedBuyInvoice(true);
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
        const invoiceId = detailData.id_buy_invoice;
        if (!isAdd) { // Cập nhật lại chi tiết     
            // Kiểm tra xem có cập nhật thông tin nào không
            console.log(details)
            console.log(invoiceId)
            if (Array.isArray(details[invoiceId]) && details[invoiceId].some(dt => JSON.stringify(dt) === JSON.stringify(detailData))) {
                toast.current.show({ severity: 'info', summary: 'Thông báo', detail: 'Không có thay đổi nào được thực hiện' });
                return;
            }

            detailData.updated_at = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
            detailData.created_at = new Date(new Date(detailData.created_at).setDate(new Date(detailData.created_at).getDate() + 1)).toISOString().split('T')[0];

            buyInvoiceDetailsService.updateDetail(detail.id_buy_invoice, detail.id_product, detailData)
                .then(() => {
                    fetchDetails(detail.id_buy_invoice); // Cập nhật lại chi tiết
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

            buyInvoiceDetailsService.addDetail(detailData)
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
    const editBuyInvoice = (buy_invoice) => {
        if (notification(buy_invoice, 'sửa')) return;
        console.log(buy_invoice)
        setBuyInvoice({ ...buy_invoice });
        setBuyInvoiceDialog(true);


    };

    const editBuyDetail = (detail) => {
        console.log(detail)
        setIsAdd(false);
        setDetail({ ...detail });
        setDetailDialog(true);
    };

    const confirmDeleteBuyInvoice = (buy_invoice) => {
        setBuyInvoice(buy_invoice);
        setDeleteBuyInvoiceDialog(true);
    };

    const confirmDeleteBuyDetail = (detail) => {
        // kiểm tra xem có được xóa hay không
        console.log(buy_invoice)
        setDetail(detail);
        setDeleteBuyDetailDialog(true);
    };

    const deleteBuyInvoice = () => {
        buy_invoiceService.deletebuy_invoice(buy_invoice.id_buy_invoice)
            .then(() => {
                show_invoices();
                setDeleteBuyInvoiceDialog(false);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa thất bại', life: 3000 });
            });
        
    };

    const deleteBuyDetail = () => {
        buyInvoiceDetailsService.deleteDetail(detail.id_buy_invoice, detail.id_product)
            .then(() => {
                fetchDetails(detail.id_buy_invoice);
                setDeleteBuyDetailDialog(false); // Thêm dòng này
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa chi tiết thành công', life: 3000 });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Xóa chi tiết thất bại', life: 3000 });
            });
    };

    const onInputChangeInvoice = (e, itemId) => {
        const val = (e.target && e.target.value) || '';
        setBuyInvoice(prev => ({ ...prev, [itemId]: val }));
    };

    const onInputChangeDetail = (e, itemId) => {
        const val = (e.target && e.target.value) || '';
        setDetail(prev => ({ ...prev, [itemId]: val }));
    };

    const invoiceColumns = [
        { field: 'id_buy_invoice', header: 'ID' },
        { field: 'id_supplier', header: 'ID Nhà cung cấp' },
        { field: 'desc', header: 'Mô tả' },
        { field: 'total', header: 'Tổng tiền' },
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
                data={buy_invoices}
                selectedItems={selectedBuyInvoices}
                setSelectedItems={setSelectedBuyInvoices}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                columns={invoiceColumns}
                onEdit={editBuyInvoice}
                onDelete={confirmDeleteBuyInvoice}
                openNew={openNewInvoice}
                dataKey="id_buy_invoice"
                title="Quản lý danh sách hóa đơn nhập"
            />

            {selectedBuyInvoices.length == 1 && (
                <div>
                    {selectedBuyInvoices.map((invoice) => (
                        <div key={invoice.id_buy_invoice} style={{ marginTop: '1rem' }}>
                            <GenericTable
                                data={details[invoice.id_buy_invoice] || []}
                                selectedItems={selectedBuyDetails}
                                setSelectedItems={setSelectedBuyDetails}
                                globalFilter={globalFilter}
                                setGlobalFilter={setGlobalFilter}
                                columns={detailColumns}
                                onEdit={!notification(invoice, '') ? editBuyDetail: null}
                                onDelete={!notification(invoice, '') ? confirmDeleteBuyDetail : null}
                                openNew={!notification(invoice, '') ? () => openNewDetail(invoice.id_buy_invoice): null}
                                dataKey="id_product"
                                title={`Chi tiết hóa đơn ${invoice.id_buy_invoice}`}
                                disabled={notification(invoice, '') ? true : false}
                            />
                        </div>
                    ))}
                </div>
            )}
            <GenericForm
                visible={buy_invoiceDialog}
                item={buy_invoice}
                fields={[
                    { name: 'id_buy_invoice', label: 'ID', disabled: true, hidden: !buy_invoice.id_buy_invoice },
                    { name: 'id_supplier', label: 'ID Nhà cung cấp', required: true },
                    { name: 'desc', label: 'Mô tả', required: true },
                    { name: 'total', label: 'Tổng tiền', disabled: true, hidden: !buy_invoice.id_buy_invoice },
                    { name: 'status', label: 'Trạng thái', required: true },
                    { name: 'created_at', label: 'Ngày tạo', disabled: true, hidden: !buy_invoice.id_buy_invoice },
                    { name: 'updated_at', label: 'Ngày chỉnh sửa', disabled: true, hidden: !buy_invoice.id_buy_invoice }
                ]}
                onChange={onInputChangeInvoice}
                onSave={saveBuyInvoice}
                onHide={hideDialogInvoice}
                submittedBuyInvoice={submittedBuyInvoice}
                title={buy_invoice.id_buy_invoice ? 'Sửa hóa đơn nhập' : 'Thêm hóa đơn nhập'}
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
                onSave={saveBuyDetail}
                onHide={hideDialogDetail}
                submittedBuyInvoice={submittedBuyDetail}
                title={isAdd ? 'Thêm chi tiết hóa đơn' : 'Sửa chi tiết hóa đơn'}
            />
            <ConfirmDeleteDialog
                visible={deleteBuyInvoiceDialog}
                onHide={() => setDeleteBuyInvoiceDialog(false)}
                onConfirm={deleteBuyInvoice}
                item={buy_invoice}
                idField="id_buy_invoice"
            />

            <ConfirmDeleteDialog
                visible={deleteBuyDetailDialog}
                onHide={() => setDeleteBuyDetailDialog(false)}
                onConfirm={deleteBuyDetail}
                item={detail}
                idField="id_product"
            />
        </div>
    );
};

export default BuyInvoice;