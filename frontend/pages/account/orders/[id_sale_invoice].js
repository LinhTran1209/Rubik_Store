import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import saleInvoiceDetailsService from "../../../services/sale_invoice_detailsService";
import product_variantsService from "../../../services/product_variantService";
import sale_invoiceService from "../../../services/sale_invoiceService";
import userAddressService from "../../../services/userAddressService";
import productService from "../../../services/productService";
import { useUser } from "../../../components/UserContext";

import ConfirmDeleteDialogForUser from "../../../components/ConfirmDeleteDialogForUser";
import CustomToast from "../../../components/CustomToast";
import { formatDate } from "../../../utils/formatDate";
import { formatPrice } from "../../../utils/formatPrice";

const Order = () => {
    const router = useRouter();
    const { id_sale_invoice } = router.query;

    const [ showDeleteDialog, setShowDeleteDialog ] = useState(false);
    const [ invoiceToDelete, setInvoiceToDelete ] = useState(null);

    const { user, loading } = useUser();
    const toast = useRef(null);
   
    const [ saleInvoiceDetails, setSaleInvoiceDetails ] = useState([{ id_sale_invoice: "", id_variant: "", quantity: "", price: "" }]);
    const [ userAddress, setUserAddress ] = useState({ id_address: "", id_user: "", name: "", address: "", phone: "", is_default: false });
    const [ products, setProducts ] = useState([{ id_product: "", id_categorie: "", name: "", image_url: "", desc: "", status: "", slug: "" }]);
    const [ productVariants, setProductVariants ] = useState([{ id_variant: "", id_product: "", name: "", price: "", stock: "" }]);
    const [ saleInvoice, setSaleInvoice ] = useState({ id_sale_invoice: "", id_user: "", id_address: "", desc: "", total: 0, pay: "COD", status: "", request: null, created_at: "", updated_at: "" });

    const fetch_SaleInvoice = async () => {
        try {
            const data = await sale_invoiceService.getsale_invoiceById(id_sale_invoice);
            setSaleInvoice(data[0] || { id_sale_invoice: "" });
        } catch (err) {
            console.log(err.message, "ở order khách hàng");
            setSaleInvoice({ id_sale_invoice: "" });
        }
    };

    const fetch_SaleInvoiceDetails = async () => {
        try {
            const data = await saleInvoiceDetailsService.getAllByInvoiceId(id_sale_invoice);
            setSaleInvoiceDetails(data || []);
        } catch (err) {
            console.log(err.message, "ở order khách hàng");
            setSaleInvoiceDetails([]);
        }
    };

    const fetchProducts = async () => {
        try {
            const data = await productService.getAllproducts();
            setProducts(data || []);
        } catch (err) {
            console.log(err.message, "ở order khách hàng");
            setProducts([]);
        }
    };

    const fetchProduct_Variants = async () => {
        try {
            const id_variants = saleInvoiceDetails.map((detail) => detail.id_variant).filter(Boolean);
            if (id_variants.length > 0) {
                const variantPromises = id_variants.map((id) => product_variantsService.getByIdVariant(id));
                const variants = await Promise.all(variantPromises);
                setProductVariants(variants.filter(Boolean)); // Lọc bỏ các giá trị undefined/null
            }
        } catch (err) {
            console.log(err.message, "ở order khách hàng");
            setProductVariants([]);
        }
    };

    const fetchUser_Address = async () => {
        try {
            const user_addresses = await userAddressService.getData("id_address", saleInvoice.id_address);
            if (user_addresses.length > 0) {
                setUserAddress(user_addresses[0]);
            } else {
                console.log("Không tìm thấy địa chỉ");
            }
        } catch (err) {
            console.log(err.message, "ở order khách hàng");
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            await Promise.all([ fetch_SaleInvoice(), fetch_SaleInvoiceDetails() ]);
        };
        if (id_sale_invoice) {
            loadInitialData();
        }
    }, [id_sale_invoice]);

    useEffect(() => {
        if (user.id_user !== "") {
            fetchUser_Address();
        }
    }, [saleInvoice]);

    useEffect(() => {
        if (saleInvoiceDetails.length > 0) {
            fetchProduct_Variants();
            fetchProducts();
        }
    }, [saleInvoiceDetails]);

    const handleRowClick = (slug_product) => {
        router.push(`/detail_product/${slug_product}`);
    };

    const handleDeleteClick = async (invoice) => {
        setInvoiceToDelete(invoice);
        setShowDeleteDialog(true);
    };

    const handleRequestOrder = async () => {
        if (saleInvoice.id_sale_invoice !== "") {
            try {
                let data = {...saleInvoice};
                data.request = "Hủy đơn";
                await sale_invoiceService.updatesale_invoice(data.id_sale_invoice, data);
                if (toast.current) {
                    toast.current.show({ severity: "success", summary: "Thành công", detail: "Đã gửi yêu cầu hủy đơn thành công!", life: 900});
                }
                fetch_SaleInvoice();
            } catch (err) {
                console.log(err.message, "ỏe order")
            }
        }
    } 

    const getStatusColor = (status) => {
        switch(status) {
            case 'Đang xác nhận':
                return '#FFC107'; // Màu vàng
            case 'Đang lấy hàng':
                return '#00BCD4'; // Màu xanh dương
            case 'Đang giao hàng':
                return '#FF9800'; // Màu cam
            case 'Hoàn thành':
                return 'green'; // Màu xanh lá
            case 'Đã hủy đơn':
                return 'red'; // Màu đỏ
            default:
                return 'black'; // Mặc định là màu đen nếu không có trạng thái phù hợp
        }
    };

    if (loading) {
        return  <div className="header__top">Đang tải...</div>; 
    }

    // if (!saleInvoice || !saleInvoice.id_sale_invoice) {
    //     return (
    //         <div style={{ display: "flex", justifyContent: "center", marginTop: "100px", color: "#8a6d3b" }}>
    //             Hóa đơn không tồn tại
    //         </div>
    //     );
    // }
    
    

    return (
        <div className="middle__order">
            <CustomToast ref={toast} />
            <div className="all__section-header" style={{ marginLeft: "30px" }}>
                <span className="all__section-header-text">
                    <Link href="/home">Trang chủ</Link>
                </span>
                <span className="all__section-header-text">
                    <Link href="/account">Tài khoản</Link>
                </span>
                <span>
                    <Link href={`/account/orders/${id_sale_invoice}`}>
                        Đơn hàng {id_sale_invoice}
                    </Link>
                </span>
            </div>

            { !saleInvoice.id_sale_invoice ?
                (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "100px", color: "#8a6d3b" }}>
                        Hóa đơn không tồn tại
                    </div>
                ) :
                (
                    user.id_user !== "" ? (
                        <div className="middle__order_main">
                            <div className="middle__address_title">
                                <h2 style={{ display: "flex", margin: "auto 0" }}>CHI TIẾT ĐƠN HÀNG</h2>
                                <Link href="/account" style={{ fontWeight: "500", fontSize: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <svg viewBox="0 0 512.076 512.076" style={{ width: "15px" }}>
                                        <path style={{ fill: "rgb(55, 130, 23)" }} d="M178.5,140.25v-102L0,216.75l178.5,178.5V290.7c127.5,0,216.75,40.8,280.5,130.05C433.5,293.25,357,165.75,178.5,140.25z"></path>
                                    </svg>
                                    Quay lại trang tài khoản
                                </Link>
                            </div>
        
                            <div className="order__create_at">
                                <span>Ngày tạo — {formatDate(saleInvoice.created_at)}</span>
                                { saleInvoice.status === "Đang xác nhận" && saleInvoice.request === "Đặt hàng" &&
                                    <button className="request_order" onClick={() => handleDeleteClick(saleInvoice)}>Yêu cầu hủy đơn</button>
                                }
                            </div>
        
                            <div className="row__info_sale_invoice">
                                <div className="info_address">
                                    <h4 style={{ marginBottom: "15px", fontWeight: "bold" }}>ĐỊA CHỈ GIAO HÀNG</h4>
                                    <p className="info_address_p">
                                        <img style={{ width: "16px", marginRight: "10px" }} src="//bizweb.dktcdn.net/100/316/286/themes/757383/assets/user.svg?1738317141988" alt="icon" />
                                        <strong style={{ textAlign: "center", marginRight: "5px" }}>Người nhận: </strong>
                                        {userAddress.name}
                                    </p>
                                    <p className="info_address_p">
                                        <img style={{ width: "16px", marginRight: "10px" }} src="https://bizweb.dktcdn.net/100/316/286/themes/757383/assets/telephone.svg?1738317141988" alt="icon" />
                                        <strong style={{ textAlign: "center", marginRight: "5px" }}>Số điện thoại: </strong>
                                        {userAddress.phone}
                                    </p>
                                    <p className="info_address_p">
                                        <img style={{ width: "16px", marginRight: "10px" }} src="https://bizweb.dktcdn.net/100/316/286/themes/757383/assets/map-marker.svg?1738317141988" alt="icon" />
                                        <strong style={{ textAlign: "center", marginRight: "5px" }}>Địa chỉ: </strong>
                                        {userAddress.address}
                                    </p>
                                </div>
        
                                <div className="info_status_sale_voice">
                                    <h4 style={{ marginBottom: "15px", fontWeight: "bold" }}>TRẠNG THÁI ĐƠN HÀNG</h4>
                                    <p style={{ display: "flex", alignItems: "center" }}>
                                        <img style={{ width: "30px", marginLeft: "-5px", marginRight: "8px" }} src="https://res.cloudinary.com/dzweargsr/image/upload/v1743567262/car_ship_ggmu24.jpg" alt="icon ship" />
                                        <strong style={{ textAlign: "center", marginRight: "5px" }}>Trạng thái:</strong>
                                        <span style={{ color: getStatusColor(saleInvoice.status) }}>{saleInvoice.status}</span>
                                    </p>
                                    <p style={{ display: "flex", alignItems: "center" }}>
                                        <img style={{ width: "25px", marginRight: "8px" }} src="https://res.cloudinary.com/dzweargsr/image/upload/v1743567639/pay_vyjlry.png" alt="icon thanh toán" />
                                        <strong style={{ marginRight: "5px" }}>Phương thức thanh toán:</strong>
                                        {saleInvoice.pay === "QR" ? "Chuyển khoản" : "Thanh toán khi nhận hàng"}
                                    </p>
                                </div>
                            </div>
        
                            <div className="content_order">
                                <table className="order_details">
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
                                        {saleInvoiceDetails.map((detail, index) => {
                                            const variant = productVariants.find((v) => v.id_variant === detail.id_variant) || {};
                                            const product = products.find((p) => p.id_product === variant.id_product) || {};
                                            const total = detail.quantity * detail.price;
        
                                            return (
                                                <tr className="td_account_order" key={index} onClick={() => handleRowClick(product.slug)}>
                                                    <td><img style={{width: "70px"}} src={product.image_url} alt={product.name} /></td>
                                                    <td>{product.name || "N/A"}</td>
                                                    <td>{variant.color || "N/A"}</td>
                                                    <td>{detail.quantity}</td>
                                                    <td>{formatPrice(detail.price)}đ</td>
                                                    <td>{formatPrice(total)}đ</td>
                                                </tr>
                                            );
                                        })}
        
        
                                    </tbody>
                                </table>
        
        
                                <div className="order_summary" style={{ marginTop: "20px", textAlign: "right", paddingBottom: "50px" }}>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td style={{borderTop: "1px solid #ddd" }}>
                                                    Phí vận chuyển:
                                                </td>
                                                <td style={{ textAlign: "right", marginRight: "20px", borderTop: "1px solid #ddd" }}>
                                                    {(saleInvoice.total > 200000) ? "Miễn phí giao hàng" : "30.000đ"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    Tổng tiền:
                                                </td>
                                                <td style={{ textAlign: "right", marginRight: "20px", borderTop: "1px solid #ddd", fontWeight: "bold", color: "#e91e63" }}>
                                                    {(saleInvoice.total > 200000) ? formatPrice(saleInvoice.total)+"đ" : formatPrice(saleInvoice.total + 30000)+"đ" }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: "flex", margin: "auto", color: "#8a6d3b", justifyContent: "center" }}>
                            Bạn cần <Link href="/login" style={{ color: "red", margin: "0 4px" }}>đăng nhập</Link> để xem hóa đơn. Vui lòng quay lại sau!
                        </div>
                    )
                )
            }
            <ConfirmDeleteDialogForUser
                visible={showDeleteDialog}
                onHide={() => setShowDeleteDialog(false)}
                onConfirm={handleRequestOrder}
                item={invoiceToDelete}
                idField="id_sale_invoice"
                message="Bạn có chắc chắn muốn yêu hủy hóa đơn này không?"
            />

        </div>
    );
};

Order.getLayoutWeb = function getLayoutWeb(page) {
    return <>{page}</>;
};

export default Order;