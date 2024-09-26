import React, { useContext, useRef, useState } from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'

import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';

function Categories() {
    let emptyCategory = {
        name: ''
    }

    const state = useContext(GlobalState)
    const [categories] = state.categoryAPI.data
    const [token] = state.token
    const [category, setCategory] = useState(emptyCategory)
    const [onEdit, setOnEdit] = useState(false)
    const [selectedData, setSelectedData] = useState(null);
    const [metaKey] = useState(true);
    const [submitted, setSubmitted] = useState(false)
    const [dialog, setDialog] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const toast = useRef(null);

    const openNew = () => {
        setCategory(emptyCategory);
        setSubmitted(false);
        setDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDialog(false);
    };

    const hideDeleteDialog = () => {
        setDeleteDialog(false);
      };

    const saveCategory = async (event) => {
        event.preventDefault()
        setSubmitted(true)
        if (onEdit) {
            const res = await axios.put(`/api/category/${category._id}`, category, {
                headers: { Authorization: token }
            })
            toast.current.show({ severity: 'info', summary: 'Successful', detail: res.data.msg, life: 3000 });
            setOnEdit(false)
        } else {
            const res = await axios.post('/api/category', category, {
                headers: { Authorization: token }
            })
            toast.current.show({ severity: 'success', summary: 'Successful', detail: res.data.msg, life: 3000 });
        }
        setDialog(false)
        setCategory(emptyCategory)
    };
    
    const deleteCategory = async (event) => {
        event.preventDefault()
        const res = await axios.delete(`/api/category/${category._id}`, {
            headers: { Authorization: token }
        })
        toast.current.show({ severity: 'error', summary: 'Successful', detail: res.data.msg, life: 3000 });
        setDeleteDialog(false)
    }

    const editCategory = (category) => {
        setCategory({ ...category });
        setOnEdit(true)
        setDialog(true);
    };

    const confirmDelete = (category) => {
        setCategory(category);
        setDeleteDialog(true);
      };

    const onInputChange = e => {
        const { name, value } = e.target
        setCategory({ ...category, [name]: value })
    }

    const dialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveCategory} />
        </>
    );
    const deleteDialogFooter = (
        <>
          <Button label="No" icon="pi pi-times" text onClick={hideDeleteDialog} />
          <Button label="Yes" icon="pi pi-check" text onClick={deleteCategory} />
        </>
      );

    const topButton = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
            </React.Fragment>
        )
    }

    const actionTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap justify-content-center gap-3 mb-4">
                <Button icon="pi pi-pencil" severity="info" aria-label="Edit" onClick={() => editCategory(rowData)} />
                <Button icon="pi pi-trash" severity="danger" aria-label="Delete" onClick={() => confirmDelete(rowData)} />
            </div>
        );
    };

    return (
        <>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Kategori</h1>
                </div>
            </header>
            <main className='card m-6'>
                <Toast ref={toast} />
                <Toolbar className="mb-4" end={topButton}></Toolbar>
                <DataTable value={categories} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} selectionMode="single" selection={selectedData} onSelectionChange={(e) => setSelectedData(e.value)} dataKey="_id" metaKeySelection={metaKey} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="name" header="Name" style={{ width: '25%' }}></Column>
                    <Column field="action" header="Action" body={actionTemplate} style={{ width: '25%' }}></Column>
                </DataTable>

                <Dialog visible={dialog} style={{ width: '600px' }} header="Category Details" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                    <div className="field">
                        <label htmlFor="name">Kategori</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-tag"></i>
                            </span>
                            <InputText id="name" name="name" value={category.name} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !category.name })} />
                        </div>
                        {submitted && !category.name && <small className="p-invalid">Name is required.</small>}
                    </div>
                </Dialog>

                <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Konfirmasi" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {category && (
                            <span>
                                Yakin menghapus <b>{category.name}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>
            </main >
        </>
    )
}

export default Categories