import React, { useState, useEffect, useRef } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Link from "next/link";

import userAddressService from "../../../services/userAddressService";

import ConfirmDeleteDialogForUser from "../../../components/ConfirmDeleteDialogForUser";
import CustomToast from "../../../components/CustomToast";
import { useUser } from "../../../components/UserContext";


const Address = () => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false); // State để hiển thị dialog xác nhận xóa
    const [addressToDelete, setAddressToDelete] = useState(null); // lưu địa chỉ cần xóa
    const { user, loading } = useUser();
    const toast = useRef(null);

    const [newAddress, setNewAddress] = useState({ id_address: "", id_user: "", name: "", address: "", phone: "", is_default: false, status: "hiện", created_at: "", updated_at: "" });
    const [userAddress, setUserAddress] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false); // Thêm state cho chế độ thêm địa chỉ
    const [selectedAddress, setSelectedAddress] = useState(null);

    const fetchUser_Addresses = async () => {
        try {
            let user_addresses = await userAddressService.getData("id_user", user.id_user);
            if (Array.isArray(user_addresses)) {
                user_addresses = user_addresses.filter(addr => addr.status === "hiện");
            } else {
                user_addresses = [];
            }
            console.log(user_addresses)
            setUserAddress(user_addresses);
        } catch (err) {
            console.log(err.message, "ở account");
        }
    };

    useEffect(() => {
        if (user.id_user !== "") {
            fetchUser_Addresses();
        }
    }, [user]);

    const handleEditClick = (address) => {
        setIsEditMode(true);
        setIsAddMode(false); 
        setSelectedAddress(address);
        setNewAddress({
            id_address: address.id_address,
            id_user: address.id_user,
            name: address.name || "",
            address: address.address || "",
            phone: address.phone || "",
            is_default: address.is_default || false,
            status: "hiện",
        });
    };

    const handleAddClick = () => {
        setIsAddMode(true);
        setIsEditMode(false);
        setSelectedAddress(null);
        setNewAddress({
            id_address: null,
            id_user: user.id_user,
            name: "",
            address: "",
            phone: "",
            is_default: false,
            status: "hiện",
        });
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setIsAddMode(false);
        setSelectedAddress(null);
        setNewAddress({
            id_address: "",
            id_user: "",
            name: "",
            address: "",
            phone: "",
            is_default: false,
            status: "hiện",
        });
    };

    const checkInput = () => {
        if (!newAddress.name.trim()) {
            toast.current.show({ severity: "warn", summary: "Cảnh báo", detail: "Vui lòng nhập họ và tên", life: 1200 });
            return false;
        }
        if (!newAddress.phone.trim() || !/^\d{10}$/.test(newAddress.phone)) {
            toast.current.show({ severity: "warn", summary: "Cảnh báo", detail: "Số điện thoại phải là 10 chữ số", life: 1200 });
            return false;
        }
        if (!newAddress.address.trim()) {
            toast.current.show({ severity: "warn", summary: "Cảnh báo", detail: "Vui lòng nhập địa chỉ", life: 1200 });
            return false;
        }
        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress({ ...newAddress, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!checkInput()) return;

        try {
            if (isAddMode) {
                // Thêm địa chỉ mới
                await userAddressService.add(newAddress);
                toast.current.show({ severity: "success", summary: "Thành công", detail: "Thêm địa chỉ thành công!", life: 1200 });
            } else if (isEditMode) {
                // Cập nhật địa chỉ
                await userAddressService.update(newAddress.id_address, newAddress);
                toast.current.show({ severity: "success", summary: "Thành công", detail: "Cập nhật địa chỉ thành công!", life: 1200 });
            }
            setIsEditMode(false);
            setIsAddMode(false);
            setSelectedAddress(null);
            await fetchUser_Addresses(); // Refresh danh sách địa chỉ
        } catch (err) {
            toast.current.show({ severity: "error", summary: "Lỗi", detail: `${isAddMode ? "Thêm" : "Cập nhật"} địa chỉ thất bại.`, life: 3000 });
        }
    };

    const handleDeleteClick = async (address) => {
        setAddressToDelete(address);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        try {
            addressToDelete.status = "ẩn"
            await userAddressService.update(addressToDelete.id_address, addressToDelete);
            toast.current.show({ severity: "success", summary: "Thành công", detail: "Xóa địa chỉ thành công!", life: 1200 });
            await fetchUser_Addresses();
        } catch (err) {
            toast.current.show({ severity: "error", summary: "Lỗi", detail: "Xóa địa chỉ thất bại.", life: 1200 });
        } finally {
            setShowDeleteDialog(false);
            setAddressToDelete(null);
        }
    };
    
    const cancelDelete = () => {
        setShowDeleteDialog(false);
        setAddressToDelete(null);
    };

    if (loading) return <div className="header__top">Đang tải...</div>; 

    return (
        <div className="middle__address">
            <CustomToast ref={toast} />
            <div className="all__section-header" style={{ marginLeft: "30px" }}>
                <span className="all__section-header-text">
                    <Link href="/home">Trang chủ</Link>
                </span>
                <span className="all__section-header-text">
                    <Link href="/account">Tài khoản</Link>
                </span>
                <span>
                    <Link href="/account/addresses">Địa chỉ khách hàng</Link>
                </span>
            </div>

            <div className="middle__address_main">
                <div className="middle__address_title">
                    <h2 style={{display: "flex", margin: "auto 0"}}>ĐỊA CHỈ CỦA BẠN</h2>
                    <Link href="/account" style={{ fontWeight: "500", fontSize: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <svg viewBox="0 0 512.076 512.076"  style={{width:"15px"}}>
                            <path style={{fill: "rgb(55, 130, 23)"}} d="M178.5,140.25v-102L0,216.75l178.5,178.5V290.7c127.5,0,216.75,40.8,280.5,130.05C433.5,293.25,357,165.75,178.5,140.25z"></path>
                        </svg>  
                        Quay lại trang tài khoản
                    </Link>
                </div>

                { user.id_user === "" && !loading ?
                    (
                        <div style={{  margin: "auto", color: "#8a6d3b", textAlign: "center" }}>Bạn cần <Link style={{color:"red"}} href={`/login`}>đăng nhập</Link> để đổi vào trang này!</div>
                    ) :
                    (
                        <>
                            <div className="add__address">
                                <button className="btn-add_address" onClick={handleAddClick}>
                                    + THÊM ĐỊA CHỈ
                                </button>

                                {isAddMode && (
                                    <div className={`row__address__right slide-form ${isAddMode ? 'open' : ''}`}>
                                        <form onSubmit={handleSubmit} >
                                            <div className="form__edit__address">
                                                <label htmlFor="name">Họ và tên*</label>
                                                <input
                                                    className="input-edit__address"
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={newAddress.name}
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="form__edit__address">
                                                <label htmlFor="phone">Số điện thoại*</label>
                                                <input
                                                    className="input-edit__address"
                                                    type="text"
                                                    id="phone"
                                                    name="phone"
                                                    value={newAddress.phone}
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="form__edit__address">
                                                <label htmlFor="address">Địa chỉ*</label>
                                                <input
                                                    className="input-edit__address"
                                                    type="text"
                                                    id="address"
                                                    name="address"
                                                    value={newAddress.address}
                                                    onChange={handleInputChange}
                                                />
                                            </div>


                                            <div className="action__row__address__right">
                                                <button type="submit" className="btn-update__address">
                                                    THÊM ĐỊA CHỈ
                                                </button>
                                                <button type="button" className="btn-cancel__edit" onClick={handleCancelEdit}>
                                                    Hủy
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                            <ConfirmDeleteDialogForUser
                                visible={showDeleteDialog}
                                onHide={() => setShowDeleteDialog(false)}
                                onConfirm={confirmDelete}
                                item={addressToDelete}
                                idField="id_address"
                                message="Bạn có chắc chắn muốn xóa địa chỉ này không?"
                            />
                            <div className="row__address_main">
                                {userAddress.length > 0 ? (
                                    userAddress.map((address) => (
                                        <div className="row__address" key={address.id_address}>
                                            <div className="row__address__left">
                                                <p><strong>Họ và tên: </strong>{address.name}</p>
                                                <p><strong>Số điện thoại:</strong>{" " + address.phone}</p>
                                                <p><strong>Quốc tịch:</strong> Việt Nam</p>
                                                <p><strong>Địa chỉ:</strong>{" " + address.address}</p>
                                                {address.is_default === 1 ? (
                                                    <p style={{color: 'red'}}><strong>Địa chỉ mặc định</strong></p>
                                                ) : (null)
                                                }

                                                <div className="action__row__address__left">
                                                    <button className="btn-edit__address" onClick={() => handleEditClick(address)}>
                                                        CHỈNH SỬA ĐỊA CHỈ
                                                    </button>
                                                    { address.is_default === 1 ?
                                                        (null) :
                                                        <button
                                                            className="btn-delete__address"
                                                            onClick={() => handleDeleteClick(address)}
                                                        >
                                                            XÓA
                                                        </button>
                                                    }
                                                </div>
                                            </div>

                                            {isEditMode && selectedAddress?.id_address === address.id_address && (
                                                <div className={`row__address__right slide-form ${isEditMode ? 'open' : ''}`}>
                                                    <form onSubmit={handleSubmit} >
                                                        <div className="form__edit__address">
                                                            <label htmlFor="name">Họ và tên*</label>
                                                            <input
                                                                className="input-edit__address"
                                                                type="text"
                                                                id="name"
                                                                name="name"
                                                                value={newAddress.name}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>

                                                        <div className="form__edit__address">
                                                            <label htmlFor="phone">Số điện thoại*</label>
                                                            <input
                                                                className="input-edit__address"
                                                                type="text"
                                                                id="phone"
                                                                name="phone"
                                                                value={newAddress.phone}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>

                                                        <div className="form__edit__address">
                                                            <label htmlFor="address">Địa chỉ*</label>
                                                            <input
                                                                className="input-edit__address"
                                                                type="text"
                                                                id="address"
                                                                name="address"
                                                                value={newAddress.address}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>

                                                        <div className="form__edit__address check__edit__address">
                                                            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                                <input
                                                                    type="checkbox"
                                                                    id="default-address"
                                                                    name="is_default"
                                                                    checked={newAddress.is_default}
                                                                    onChange={(e) =>
                                                                        setNewAddress({ ...newAddress, is_default: e.target.checked })
                                                                    }
                                                                />
                                                                Đặt là địa chỉ mặc định
                                                            </label>
                                                        </div>

                                                        <div className="action__row__address__right">
                                                            <button type="submit" className="btn-update__address">
                                                                CẬP NHẬT ĐỊA CHỈ
                                                            </button>
                                                            
                                                            <button type="button" className="btn-cancel__edit" onClick={handleCancelEdit}>
                                                                Hủy
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p style={{  margin: "auto", color: "#8a6d3b", textAlign: "center" }}>Chưa có địa chỉ nào được thêm.</p>
                                )}
                            </div>
                        </>
                    )
                }

            </div>
        </div>
    );
};

Address.getLayoutWeb = function getLayoutWeb(page) {
    return page;
};

export default Address;