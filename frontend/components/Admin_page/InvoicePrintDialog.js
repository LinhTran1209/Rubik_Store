import React, { useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import styles from '../../styles/invoicePrint.module.css';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { useReactToPrint } from 'react-to-print';

const InvoiceContent = ({ invoice, details, users, userAddress, products, variants, innerRef }) => {
    const user = users.find((u) => u.id_user === invoice.id_user);
    const address = userAddress.find((addr) => addr.id_address === invoice.id_address);

    const invoiceDetails = details[invoice.id_sale_invoice] || [];

    return (
        <div ref={innerRef} className={styles.invoiceContainer}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>HÓA ĐƠN BÁN HÀNG</h2>
            <p style={{ textAlign: 'right' }}>Ngày tạo: {formatDate(invoice.created_at)}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <h4 style={{fontWeight: "bold", marginBottom: "10px"}}>ĐỊA CHỈ GIAO HÀNG</h4>
                    <p><strong>Người nhận:</strong> {address?.name || 'Không xác định'}</p>
                    <p><strong>Số điện thoại:</strong> {address?.phone || 'Không xác định'}</p>
                    <p><strong>Địa chỉ:</strong> {address?.address || 'Không xác định'}</p>
                </div>
                <div>
                    <h4 style={{fontWeight: "bold", marginBottom: "10px"}}>TRẠNG THÁI ĐƠN HÀNG</h4>
                    <p><strong>Thanh toán:</strong> {invoice.pay}</p>
                </div>
            </div>

            {invoiceDetails.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Ảnh sản phẩm</th>
                            <th>Sản phẩm</th>
                            <th>Màu sắc</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                            <th>Tổng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoiceDetails.map((detail, index) => {
                            const variant = variants.find((v) => v.id_variant === detail.id_variant);
                            const product = products.find((p) => p.id_product === variant?.id_product);
                            return (
                                <tr key={index}>
                                    <td>
                                        <img
                                            src={product?.image_url || 'placeholder-image.jpg'}
                                            alt={product?.name}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td>{product?.name || 'Không xác định'}</td>
                                    <td>{variant?.color || 'Không có'}</td>
                                    <td>{detail.quantity}</td>
                                    <td>{formatPrice(detail.price)}đ</td>
                                    <td>{formatPrice(detail.price * detail.quantity)}đ</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p>Không có sản phẩm trong hóa đơn này.</p>
            )}

            <div className="order_summary" style={{ marginTop: "20px", textAlign: "right" }}>
                <table>
                    <tbody>
                        <tr>
                            <td style={{borderTop: "1px solid #ddd" }}>
                                Phí vận chuyển:
                            </td>
                            <td style={{ textAlign: "right", marginRight: "20px", borderTop: "1px solid #ddd" }}>
                                {(invoice.total > 200000) ? "Miễn phí giao hàng" : "30.000đ"}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Tổng tiền:
                            </td>
                            <td style={{ textAlign: "right", marginRight: "20px", borderTop: "1px solid #ddd", fontWeight: "bold", color: "#e91e63" }}>
                                {(invoice.total > 200000) ? formatPrice(invoice.total)+"đ" : formatPrice(invoice.total + 30000)+"đ" }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const InvoicePrintDialog = ({
    visible,
    onHide,
    invoice,
    details,
    users,
    userAddress,
    products,
    variants,
}) => {
    const componentRef = useRef(null);

    // Log để kiểm tra componentRef
    useEffect(() => {
        if (visible) {
            console.log('componentRef.current:', componentRef.current);
        }
    }, [visible]);

    // Hàm xử lý in
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    // Kiểm tra nếu không có invoice thì không render nội dung
    if (!invoice) {
        return (
            <Dialog
                visible={visible}
                style={{ width: '50rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Hóa đơn bán"
                modal
                onHide={onHide}
            >
                <p>Không có dữ liệu để hiển thị.</p>
            </Dialog>
        );
    }

    // Lấy chi tiết hóa đơn
    const invoiceDetails = details[invoice.id_sale_invoice] || [];

    const dialogFooter = (
        <React.Fragment>
            <Button label="Đóng" icon="pi pi-times" outlined onClick={onHide} />
            <Button
                label="In hóa đơn"
                icon="pi pi-print"
                onClick={() => {
                    if (componentRef.current) {
                        handlePrint();
                    } else {
                        console.error('Không có nội dung để in: componentRef.current là null');
                    }
                }}
                disabled={!invoiceDetails.length}
            />
        </React.Fragment>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '60rem' }}
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            header={`Hóa đơn bán #${invoice.id_sale_invoice}`}
            modal
            footer={dialogFooter}
            onHide={onHide}
        >
            <InvoiceContent
                invoice={invoice}
                details={details}
                users={users}
                userAddress={userAddress}
                products={products}
                variants={variants}
                innerRef={componentRef}
            />
        </Dialog>
    );
};

export default InvoicePrintDialog;