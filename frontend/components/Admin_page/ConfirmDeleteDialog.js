import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import styles from '../../styles/generic.module.css';

const ConfirmDeleteDialog = ({ visible, onHide, onConfirm, item, multiple = false, idField = 'id_employee', title = 'Xác nhận xóa' }) => {
    const footer = (
        <React.Fragment>
            <Button label='Không' icon='pi pi-times' outlined onClick={onHide} />
            <Button label='Có' icon='pi pi-check' severity='danger' onClick={onConfirm} />
        </React.Fragment>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '32rem' }}
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            header={title}
            modal
            footer={footer}
            onHide={onHide}
        >
            <div className={styles.confirmationContent}>
                <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
                {multiple ? (
                    <span>Bạn có muốn xóa các bản tin đã chọn không?</span>
                ) : (
                    item && <span>Bạn có chắc muốn xóa bản ghi có id: <b>{item[idField]}</b>?</span>
                )}
            </div>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;