import product_variantsService from "../../services/product_variantService";
import styles from '../../styles/generic.module.css';
import { InputNumber } from "primereact/inputnumber";
import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { formatDate } from "../../utils/formatDate"

const AddInvoiceDetailForm = ({
    visible,
    onHide,
    onSave,
    onChange,
    detail,
    isAdd,
    products,
    variantsData,
    invoiceId,
    title = 'Mục tin',
}) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState({id_variant: null, id_product: null, color: '', quantity: 0, price: 0, created_at: null, updated_at: null });
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [availableQuantity, setAvailableQuantity] = useState(0);

    useEffect(() => {
        if (detail && isAdd === false) {
            const variant = variantsData.find((v) => v.id_variant === detail.id_variant) //tra ra variant
            const product = products.find((p) => p.id_product === variant.id_product);
            setSelectedProduct(product);
            fetchVariants(product.id_product, detail.id_variant);
            setQuantity(detail.quantity);
            setPrice(detail.price);
        } else {
            setSelectedProduct(null);
            setVariants([]);
            setSelectedVariant({id_variant: null, id_product: null, color: '', quantity: 0, price: 0, created_at: null, updated_at: null });
            setQuantity(0);
            setPrice(0);
            setAvailableQuantity(0);
        }
    }, [detail, isAdd, products]);

    const fetchVariants = async (productId, selectedVariantId = null) => {
        try {
            const res = await product_variantsService.getData("id_product", productId);
            setVariants(res);
            if (res.length > 0) {
                let variantToSelect;
                if (selectedVariantId) {
                    variantToSelect = res.find((v) => v.id_variant === selectedVariantId);
                } else {
                    variantToSelect = res[0];
                }
                setSelectedVariant(variantToSelect);
                setPrice(variantToSelect.price);
                setAvailableQuantity(variantToSelect.quantity);
            }
        } catch (error) {
            console.error("Error fetching variants:", error);
        }
    };

    const handleProductChange = (e) => {
        const product = e.value;
        setSelectedProduct(product);
        fetchVariants(product.id_product);
    };

    const handleVariantChange = (e) => {
        const variant = e.value;
        setSelectedVariant(variant);
        setPrice(variant.price);
        setAvailableQuantity(variant.quantity);
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.value);
    };

    const handleSave = () => {
        const detailData = {
            id_sale_invoice: invoiceId.id_sale_invoice,
            id_variant: selectedVariant.id_variant,
            quantity,
            price,
            created_at: isAdd ? null : detail.created_at,
            updated_at: isAdd ? null : detail.updated_at
        };
        onSave(detailData, isAdd);
    };


    const formatPrice = (value) => {
        if (!value && value !== 0) return '';
        return new Intl.NumberFormat('vi-VN', {
            style: 'decimal',
            minimumFractionDigits: 0,
        }).format(value);
    };

    console.log(detail)


    const dialogFooter = (
        <React.Fragment>
            <Button label="Hủy" icon="pi pi-times" outlined onClick={onHide} />
            { detail.id_variant !== '' ? 
                null :
                <Button label="Lưu" icon="pi pi-check" onClick={handleSave} />
                
            }
        </React.Fragment>
    );




    return (
        <Dialog
            visible={visible}
            style={{ width: '32rem' }}
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            header={title}
            modal
            footer={dialogFooter}
            onHide={onHide}
        >
            <div>

                <div>
                    <label htmlFor=""  className={styles.fontBold} style={{ width: '100%', display: 'block' }}>Sản phẩm</label>
                    <Dropdown
                        value={selectedProduct}
                        options={products.map(p => ({ label: "#" + p.id_product + " " + p.name, value: p }))}
                        onChange={handleProductChange}
                        placeholder="Chọn sản phẩm"
                        appendTo="self"
                        style={{ width: '100%'}}
                        disabled={detail.id_variant ? true : false}
                    />
                </div>

                <div>
                    <label htmlFor=""  className={styles.fontBold} style={{ width: '100%', display: 'block', marginTop: '15px'}}>Biến thể</label>
                    <Dropdown
                        value={selectedVariant}
                        options={variants.map(v => ({ label: v.color, value: v }))}
                        onChange={handleVariantChange}
                        placeholder="Chọn biến thể"
                        appendTo="self"
                        style={{ width: '100%'}}
                        disabled={detail.id_variant ? true : false}
                    />

                </div>


                <div>
                    <label htmlFor="" className={styles.fontBold} style={{ width: '100%', display: 'block', marginTop: '15px'}}>Số lượng</label>
                    <InputNumber
                        value={quantity}
                        onChange={handleQuantityChange}
                        min={0}
                        // max={availableQuantity}
                        style={{ width: '100%'}}
                        disabled={detail.id_variant ? true : false}
                    >
                    
                    </InputNumber>
                </div>

                <div>
                    <label htmlFor="" className={styles.fontBold} style={{ width: '100%', display: 'block', marginTop: '15px'}}>Giá bán</label>
                        <InputText
                            value={formatPrice(price)}
                            style={{ width: '100%', display: 'block' }}
                            disabled={true}
                        />
                </div>

                {(isAdd === false) ?
                    (
                        <div>
                            <label htmlFor=""className={styles.fontBold} style={{ width: '100%', display: 'block', marginTop: '15px'}}>Ngày tạo</label>
                            <InputText
                                value={formatDate(detail.created_at)}
                                style={{ width: '100%'}}
                                disabled={true}
                            />
                        </div>

                    ) : null
                }

                {(isAdd === false) ?
                    (
                        <div>
                            <label htmlFor=""className={styles.fontBold} style={{ width: '100%', display: 'block', marginTop: '15px'}}>Ngày cập nhật</label>
                            <InputText
                                value={formatDate(detail.updated_at)}
                                style={{ width: '100%'}}
                                disabled={true}
                            />
                        </div>

                    ) : null
                }


            </div>
        </Dialog>


    );
};

export default AddInvoiceDetailForm;
