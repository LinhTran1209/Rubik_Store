import React, { useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
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
    onAddDetail,
    dataKey,
    title = 'Quản lý danh sách',
    disabled = false,
    visible = true, // Thêm prop visible
}) => {
    const dt = useRef(null);

    const actionBodyTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button 
                    icon='pi pi-pencil' 
                    rounded 
                    outlined 
                    className='mr-2' 
                    onClick={() => onEdit(rowData)} 
                    title="Sửa"  
                    disabled={!onEdit} 
                />
                <Button 
                    icon='pi pi-trash' 
                    rounded 
                    outlined 
                    severity='danger' 
                    onClick={() => onDelete(rowData)} 
                    title="Xóa" 
                    disabled={!onDelete} 
                />
            </div>
        );
    };

    const header = (
        <div className='flex flex-wrap gap-2 align-items-center justify-content-between'>
            <h4 className='m-0'>{title}</h4>
            <div style={{ float: 'right' }}>
                {openNew && (
                    <Button style={{ marginRight: '5px' }} label='' icon='pi pi-plus' severity='success' tooltip='Thêm mới' onClick={openNew} disabled={!openNew} />
                )}
                <Button style={{ marginRight: '5px' }} label='' icon='pi pi-trash' tooltip='Xóa đã chọn' severity='danger' onClick={onDeleteSelected} disabled={disabled || !selectedItems || !selectedItems.length} />
                <Button style={{ marginRight: '5px' }} label='' icon='pi pi-upload' tooltip='Xuất Excel' className='p-button-help' onClick={() => dt.current.exportCSV()} />
                <span className='p-input-icon-left'>
                    <i className='pi pi-search' />
                    <InputText type='search' value={globalFilter} onInput={(e) => setGlobalFilter(e.target.value)} placeholder='Tìm kiếm...' />
                </span>
            </div>
        </div>
    );

    if (!visible) {
        return null; // Nếu không visible, trả về null (không hiển thị gì)
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
                rows={10}
                rowsPerPageOptions={[2, 5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} Bản ghi"
                globalFilter={globalFilter}
                header={header}
            >
                <Column selectionMode="multiple" exportable={false}></Column>
                {columns.map((col, index) => (
                    <Column 
                        key={index} 
                        field={col.field} 
                        header={col.header} 
                        sortable 
                        style={{ 
                            minWidth: index === 0 ? '11rem' : '12rem', 
                            maxWidth: '12rem', // Giới hạn chiều rộng tối đa
                            overflow: 'hidden', // Ẩn phần văn bản vượt quá
                            textOverflow: 'ellipsis', // Hiển thị dấu "..."
                            whiteSpace: 'nowrap' // Không cho phép xuống dòng
                        }} 
                    />
                ))}
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '5rem' }} />
            </DataTable>
        </div>
    );
};

export default GenericTable;