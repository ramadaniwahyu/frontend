import React, { useContext, useRef, useState } from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'

import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Image } from 'primereact/image'
import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';

function Authors() {
    let emptyAuthor = {
        name: '',
        email: ''
    }

    const state = useContext(GlobalState)
    const [authors] = state.authorAPI.data
    const [token] = state.token
    const [author, setAuthor] = useState(emptyAuthor)
    const [onEdit, setOnEdit] = useState(false)
    const [selectedData, setSelectedData] = useState(null);
    const [metaKey] = useState(true);
    const [submitted, setSubmitted] = useState(false)
    const [dialog, setDialog] = useState(false)
    const [deleteAuthorDialog, setDeleteAuthorDialog] = useState(false)
    const toast = useRef(null);

    const openNew = () => {
        setAuthor(emptyAuthor);
        setSubmitted(false);
        setDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDialog(false);
    };

    const hideDeleteAuthorDialog = () => {
        setDeleteAuthorDialog(false);
      };

    const saveAuthor = async (event) => {
        event.preventDefault()
        setSubmitted(true)
        if (onEdit) {
            const res = await axios.put(`/api/authors/${author._id}`, author, {
                headers: { Authorization: token }
            })
            toast.current.show({ severity: 'success', summary: 'Successful', detail: res.data.msg, life: 3000 });
            setOnEdit(false)
        } else {
            const res = await axios.post('/api/authors', author, {
                headers: { Authorization: token }
            })
            toast.current.show({ severity: 'primary', summary: 'Successful', detail: res.data.msg, life: 3000 });
        }
        setDialog(false)
        setAuthor(emptyAuthor)
    };
    
    const deleteAuthor = async (event) => {
        event.preventDefault()
        const res = await axios.delete(`/api/authors/${author._id}`, {
            headers: { Authorization: token }
        })
        toast.current.show({ severity:'error', summary:'Successful', detail: res.data.msg, life: 3000 });
        setDeleteAuthorDialog(false)
    }

    const editAuthor = (author) => {
        setAuthor({ ...author });
        setOnEdit(true)
        setDialog(true);
    };

    const confirmDeleteAuthor = (author) => {
        setAuthor(author);
        setDeleteAuthorDialog(true);
      };

    const onInputChange = e => {
        const { name, value } = e.target
        setAuthor({ ...author, [name]: value })
    }

    const nameTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <Image alt={rowData.name} src={`https://robohash.org/${rowData._id}`} width={32} />
                <span>{rowData.name}</span>
            </div>
        );
    };

    const dialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveAuthor} />
        </>
    );
    const deleteAuthorDialogFooter = (
        <>
          <Button label="No" icon="pi pi-times" text onClick={hideDeleteAuthorDialog} />
          <Button label="Yes" icon="pi pi-check" text onClick={deleteAuthor} />
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
                <Button icon="pi pi-pencil" severity="info" aria-label="Edit" onClick={() => editAuthor(rowData)} />
                <Button icon="pi pi-trash" severity="danger" aria-label="Delete" onClick={() => confirmDeleteAuthor(rowData)} />
            </div>
        );
    };

    return (
        <>
            <header className="bg-white shadow gap-3">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pengarang</h1>
                </div>
            </header>
            <main className='card m-6'>
                <Toast ref={toast} />
                <Toolbar className="mb-4" end={topButton}></Toolbar>
                <DataTable value={authors} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} selectionMode="single" selection={selectedData} onSelectionChange={(e) => setSelectedData(e.value)} dataKey="_id" metaKeySelection={metaKey} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="name" header="Name" body={nameTemplate} style={{ width: '25%' }}></Column>
                    <Column field="email" header="Email" style={{ width: '50%' }}></Column>
                    <Column field="action" header="Action" body={actionTemplate} style={{ width: '25%' }}></Column>
                </DataTable>

                <Dialog visible={dialog} style={{ width: '600px' }} header="Author Details" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                    {author._id && <img src={`https://robohash.org/${author._id}`} alt={author.name} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                    <div className="field">
                        <label htmlFor="name">Nama</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <InputText id="name" name="name" value={author.name} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !author.name })} />
                        </div>
                        {submitted && !author.name && <small className="p-invalid">Name is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-envelope"></i>
                            </span>
                            <InputText id="email" name="email" value={author.email} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !author.email })} />
                        </div>
                        {submitted && !author.email && <small className="p-invalid">Email is required.</small>}
                    </div>
                </Dialog>
                <Dialog visible={deleteAuthorDialog} style={{ width: '450px' }} header="Konfirmasi" modal footer={deleteAuthorDialogFooter} onHide={hideDeleteAuthorDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {author && (
                            <span>
                                Yakin menghapus <b>{author.name} ({author.email})</b>?
                            </span>
                        )}
                    </div>
                </Dialog>
            </main >
        </>
    )
}

export default Authors
