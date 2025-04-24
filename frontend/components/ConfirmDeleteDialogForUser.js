import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React from 'react';

import styles from '../styles/generic.module.css';

const ConfirmDeleteDialog = ({
    visible,
    onHide,
    onConfirm,
    item,
    multiple = false,
    idField = 'id',
    title = 'Xác nhận xóa',
    message,
    renderMessage,
}) => {
    const footer = (
        <React.Fragment>
            <Button label="Không" icon="pi pi-times" outlined onClick={onHide} style={{ fontSize: "13px" }}/>
            <Button label="Có" icon="pi pi-check" severity="danger" onClick={onConfirm} style={{ fontSize: "13px" }} />
        </React.Fragment>
    );

    const defaultMessage = multiple ? (
        <span>Bạn có muốn xóa các bản tin đã chọn không?</span>
    ) : message !== "" ?
    (
        <span>{message}</span>
    ) : (
        item && <span>Bạn có chắc muốn xóa bản ghi này?</span>
    );
    // console.log(item.name)
    return (
        <Dialog
            visible={visible}
            style={{ width: '45rem', fontSize: "14px" }} 
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            header={<div style={{ fontSize: '17px' }}>{title}</div>} 
            modal
            footer={footer}
            onHide={onHide}
        >
            <div className={styles.confirmationContent} style={{fontSize: "14px"}}>
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2.5rem' }} />
                {renderMessage ? renderMessage(item) : defaultMessage}
                {/* <span>Bạn có chắc muốn xóa bản ghi này? </span> */}
            </div>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;