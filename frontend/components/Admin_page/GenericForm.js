import styles from '../../styles/generic.module.css';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import React, { useState, useEffect } from 'react';
import { formatDate } from '../../utils/formatDate';


const GenericForm = ({
    visible,
    item,
    fields,
    onChange,
    onSave,
    onHide,
    submitted,
    title = 'Mục tin',
}) => {
    const [formattedValues, setFormattedValues] = useState({});

    useEffect(() => {
        const initialFormattedValues = {};
        fields.forEach((field) => {
            if (field.type === 'price' && item[field.name]) {
                initialFormattedValues[field.name] = formatPrice(item[field.name]);
            }
        });
        setFormattedValues(initialFormattedValues);
    }, [item]);

    const formatPrice = (value) => {
        if (!value && value !== 0) return '';
        return new Intl.NumberFormat('vi-VN', {
            style: 'decimal',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const parseprice = (value) => {
        return value.replace(/\D/g, '');
    };

    const handlepriceChange = (e, name) => {
        const rawValue = parseprice(e.target.value);
        onChange({ target: { value: rawValue } }, name);
        setFormattedValues((prev) => ({
            ...prev,
            [name]: formatPrice(rawValue),
        }));
    };

    const dialogFooter = (
        <React.Fragment>
            <Button label="Hủy" icon="pi pi-times" outlined onClick={onHide} />
            <Button label="Lưu" icon="pi pi-check" onClick={onSave} />
        </React.Fragment>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '32rem' }}
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            header={title}
            modal
            className={styles.pFluid}
            footer={dialogFooter}
            onHide={onHide}
        >
            {fields.map((field, index) => {
                if (field.hidden) return null;

                const value = field.type === 'price'
                    ? formattedValues[field.name] || formatPrice(item[field.name] || '')
                    : item[field.name] || '';

                return (
                    <div key={index} className={styles.field}>
                        <label htmlFor={field.name} className={styles.fontBold} style={{ width: '100%', display: 'block' }}>
                            {field.label}
                        </label>
                        {field.type === 'dropdown' ? (
                        <Dropdown
                            id={field.name}
                            value={item[field.name]}
                            options={field.options}
                            onChange={(e) => onChange({ target: { value: e.value } }, field.name)}
                            placeholder={`Chọn ${field.label}`}
                            optionLabel="label"
                            optionValue="value"
                            style={{ width: '100%'}}
                            className={classNames({ 'p-invalid': submitted && field.required && !item[field.name] })}
                            appendTo="self"

                        />
                        ) : field.type === 'price' ? (
                            <InputText
                                id={field.name}
                                value={value}
                                onChange={(e) => handlepriceChange(e, field.name)}
                                required={field.required}
                                disabled={field.disabled}
                                autoFocus={field.autoFocus}
                                className={classNames({ 'p-invalid': submitted && field.required && !item[field.name] })}
                                style={{ width: '100%', display: 'block' }}
                            />
                        ) : field.type === 'date' ? (
                            <InputText
                                id={field.name}
                                value={formatDate(value)}
                                // onChange={(e) => onChange(e, field.name)}
                                required={field.required}
                                disabled={field.disabled}
                                autoFocus={field.autoFocus}
                                className={classNames({ 'p-invalid': submitted && field.required && !item[field.name] })}
                                style={{ width: '100%', display: 'block' }}
                            />
                        ) : (
                            <InputText
                                id={field.name}
                                value={value}
                                onChange={(e) => onChange(e, field.name)}
                                required={field.required}
                                disabled={field.disabled}
                                autoFocus={field.autoFocus}
                                className={classNames({ 'p-invalid': submitted && field.required && !item[field.name] })}
                                style={{ width: '100%', display: 'block' }}
                            />
                        )}
                        {submitted && field.required && !item[field.name] && (
                            <small className={styles.pError}>{`Required ${field.label}`}</small>
                        )}
                    </div>
                );
            })}
        </Dialog>
    );
};

export default GenericForm;