import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import styles from '../../styles/generic.module.css';

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
    const dialogFooter = (
        <React.Fragment>
            <Button label='Hủy' icon='pi pi-times' outlined onClick={onHide} />
            <Button label='Lưu' icon='pi pi-check' onClick={onSave} />
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
                if (field.hidden) return null; // Ẩn field nếu có prop hidden
                return (
                    <div key={index} className={styles.field}>
                        <label htmlFor={field.name} className={styles.fontBold} style={{ width: '100%', display: 'inline-block' }}>
                            {field.label}
                        </label>
                        <InputText
                            id={field.name}
                            value={(item && item[field.name]) || ''}
                            onChange={(e) => onChange(e, field.name)}
                            required={field.required}
                            disabled={field.disabled} // Khóa field nếu có prop disabled
                            autoFocus={field.autoFocus}
                            className={classNames({ 'p-invalid': submitted && field.required && !(item && item[field.name]) })}
                            style={{ width: '100%', display: 'block' }}
                        />
                        {submitted && field.required && !(item && item[field.name]) && (
                            <small className={styles.pError}>{`Required ${field.label}`}</small>
                        )}
                    </div>
                );
            })}
        </Dialog>
    );
};

export default GenericForm;