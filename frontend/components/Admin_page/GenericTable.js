import React, { useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { renderImageTable } from '../../utils/renderImageTable';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';

import styles from '../../styles/generic.module.css';

const GenericTable = ({
    data,
    selectedItems,
    setSelectedItems,
    globalFilter,
    setGlobalFilter,
    columns,
    openNew,
    onEdit,
    onDelete,
    onDeleteSelected,
    onApproveRequest,
    onView,
    dataKey,
    title = 'Quản lý danh sách',
    disabled = false,
    visible = true,
}) => {

    const dt = useRef(null);
    const actionBodyTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'end' }}>

                {(rowData.request === 'Đặt hàng' || rowData.request === 'Hủy đơn') && (
                    <Button
                        icon="pi pi-check"
                        rounded
                        outlined
                        severity="success"
                        className="mr-2"
                        onClick={() => onApproveRequest(rowData)} 
                        title="Duyệt yêu cầu"
                        style={{color: rowData.request === "Đặt hàng" ? "green" : "red"}}
                    />
                )}
                { onView &&
                    <Button
                        icon="pi pi-eye" // Biểu tượng mắt để xem
                        rounded
                        outlined
                        className="mr-2"
                        onClick={() => onView(rowData)} // Gọi hàm onView
                        title="Xem hóa đơn"
                        disabled={!onView}
                    />

                }
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => onEdit(rowData)}
                    title="Sửa"
                    disabled={!onEdit}
                />
                { (onDelete) &&(
                    <Button
                        icon="pi pi-trash"
                        rounded
                        outlined
                        severity="danger"
                        onClick={() => onDelete(rowData)}
                        title="Xóa"
                        disabled={!onDelete}
                    />
                )}
                
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">{title}</h4>
            <div style={{ float: 'right' }}>
                {openNew && (
                    <Button
                        style={{ marginRight: '5px' }}
                        label=""
                        icon="pi pi-plus"
                        severity="success"
                        tooltip="Thêm mới"
                        onClick={openNew}
                        disabled={!openNew}
                    />
                )}
                <Button
                    style={{ marginRight: '5px' }}
                    label=""
                    icon="pi pi-trash"
                    tooltip="Xóa đã chọn"
                    severity="danger"
                    onClick={onDeleteSelected}
                    disabled={disabled || !selectedItems || !selectedItems.length}
                />
                <Button
                    style={{ marginRight: '5px' }}
                    label=""
                    icon="pi pi-upload"
                    tooltip="Xuất Excel"
                    className="p-button-help"
                    onClick={() => dt.current.exportCSV()}
                />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        type="search"
                        value={globalFilter}
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Tìm kiếm..."
                    />
                </span>
            </div>
        </div>
    );

    if (!visible) {
        return null;
    }

    return (
        <div className={styles.card}>
            <DataTable
                ref={dt}
                value={data}
                selection={selectedItems}
                onSelectionChange={(e) => setSelectedItems(e.value)}
                dataKey={dataKey}
                paginator
                rows={5}
                rowsPerPageOptions={[2, 5, 10, 25, 100]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} Bản ghi"
                globalFilter={globalFilter}
                header={header}
            >
                <Column selectionMode="multiple" exportable={false}></Column>
                {columns.map((col, index) => {
                    const bodyTemplate = (rowData) => {
                        if (col.render) {
                            return col.render(rowData);
                        }
                        if (col.format === 'price') {
                            return formatPrice(rowData[col.field]);
                        }
                        if (col.format === 'image') {
                            return renderImageTable({ src: rowData, field: col.field });
                        }
                        if (col.format === 'date') {
                            return formatDate(rowData[col.field]);
                        }
                        return rowData[col.field];
                    };

                    return (
                        <Column
                            key={index}
                            field={col.field}
                            header={col.header}
                            sortable
                            body={bodyTemplate}
                            style={{
                                minWidth: index === 0 ? '11rem' : '12rem',
                                maxWidth: '12rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        />
                    );
                })}
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '13rem' }} />
            </DataTable>
        </div>
    );
};

export default GenericTable;