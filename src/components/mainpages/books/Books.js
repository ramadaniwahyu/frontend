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
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Link } from 'react-router-dom'

function Books() {
    let emptyBook = {
        title: '',
        category: '',
        images: '',
        year: '',
        author: [],
        description: '',
        is_published: false
    }

    const state = useContext(GlobalState)
    const [books] = state.bookAPI.data
    const [categories] = state.categoryAPI.data
    const [authors] = state.authorAPI.data
    const [token] = state.token
    const [book, setBook] = useState(emptyBook)
    const [onEdit, setOnEdit] = useState(false)
    const [selectedData, setSelectedData] = useState(null);
    const [metaKey] = useState(true);
    const [submitted, setSubmitted] = useState(false)
    const [dialog, setDialog] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const toast = useRef(null);

    const openNew = () => {
        setBook(emptyBook);
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

    const saveBook = async (event) => {
        event.preventDefault()
        setSubmitted(true)
        if (onEdit) {
            try {
                const res = await axios.put(`/api/books/${book._id}`, book, {
                    headers: { Authorization: token }
                })
                toast.current.show({ severity: 'info', summary: 'Successful', detail: res.data.msg, life: 3000 });
                setOnEdit(false)
                setDialog(false)
                setBook(emptyBook)
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'There is an error', detail: error.message, life: 3000 });
            }
        } else {
            try {
                const res = await axios.post('/api/books', book, {
                    headers: { Authorization: token }
                })
                toast.current.show({ severity: 'success', summary: 'Successful', detail: res.data.msg, life: 3000 });
                console.log(book);

                setDialog(false)
                setBook(emptyBook)
            } catch (error) {
                toast.current.show({ severity: 'error', summary: error.response.statusText, detail: error.message, life: 3000 });
            }
        }
    };

    const deleteBook = async (event) => {
        event.preventDefault()
        const res = await axios.delete(`/api/books/${book._id}`, {
            headers: { Authorization: token }
        })
        toast.current.show({ severity: 'error', summary: 'Successful', detail: res.data.msg, life: 3000 });
        setDeleteDialog(false)
    }

    const editBook = (book) => {
        setBook({ ...book });
        setOnEdit(true)
        setDialog(true);
    };

    const confirmDelete = (book) => {
        setBook(book);
        setDeleteDialog(true);
    };

    const onInputChange = e => {
        const { name, value } = e.target
        setBook({ ...book, [name]: value })
    }

    const dialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveBook} />
        </>
    );
    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteBook} />
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
                <Button icon="pi pi-pencil" severity="info" aria-label="Edit" onClick={() => editBook(rowData)} />
                <Button icon="pi pi-trash" severity="danger" aria-label="Delete" onClick={() => confirmDelete(rowData)} />
            </div>
        );
    };

    const titleTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-3 mb-4">
                <span>{rowData.title}</span><br />
                <i><small>({rowData.category.name}, {rowData.year})</small></i>
            </div>
        );
    };
    const authorBodyTemplate = (rowData) => {
        return (
            <>
                {
                    rowData.author.map(item => {
                        return (
                            
                            <Link to="#" className="flex flex-fill gap-2 mb-4 no-underline">
                            <img alt={item.name} src={`https://robohash.org/${item._id}`} className="mr-2" style={{ width: '18px' }} />
                            <div>{item.name}</div>
                            </Link>
                        )
                    })
                }
            </>
        );
    };

    const authorTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <img alt={option.name} src={`https://robohash.org/${option._id}`} className="mr-2" style={{ width: '18px' }} />
                <div>{option.name} - {option.email}</div>
            </div>
        );
    };

    const panelAuthorFooterTemplate = () => {
        const length = book.author ? book.author.length : 0;

        return (
            <div className="py-2 px-3">
                <b>{length}</b> item{length > 1 ? 's' : ''} selected.
            </div>
        );
    };

    return (
        <>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Buku</h1>
                </div>
            </header>
            <main className='card m-6'>
                <Toast ref={toast} />
                <Toolbar className="mb-4" end={topButton}></Toolbar>
                <DataTable value={books} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} selectionMode="single" selection={selectedData} onSelectionChange={(e) => setSelectedData(e.value)} dataKey="_id" metaKeySelection={metaKey} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="title" header="Title" body={titleTemplate} style={{ width: '20%' }}></Column>
                    <Column field="author" header="Author" body={authorBodyTemplate} style={{ width: '20%' }}></Column>
                    <Column field="description" header="Description" style={{ width: '35%' }}></Column>
                    <Column field="action" header="Action" body={actionTemplate} style={{ width: '25%' }}></Column>
                </DataTable>

                <Dialog visible={dialog} style={{ width: '600px' }} header="Book Details" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                    <div className="field">
                        <label htmlFor="category">Category</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-tag"></i>
                            </span>
                            <Dropdown id="category" name="category" value={book.category} onChange={onInputChange} options={categories} optionLabel='name'
                                filter className="md:w-20rem w-full" placeholder="Select a category" />
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="title">Title</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-book"></i>
                            </span>
                            <InputText id="title" name="title" value={book.title} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !book.title })} />
                        </div>
                        {submitted && !book.title && <small className="p-invalid">Title is required.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="year">Year</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-calendar"></i>
                            </span>
                            <InputText id="year" name="year" value={book.year} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !book.year })} />
                        </div>
                        {submitted && !book.year && <small className="p-invalid">Year is required.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="author">Author</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-tag"></i>
                            </span>
                            <MultiSelect id="author" name="author" value={book.author} onChange={onInputChange} options={authors} optionLabel='name' display="chip"
                                itemTemplate={authorTemplate} panelFooterTemplate={panelAuthorFooterTemplate} filter className="md:w-20rem w-full" placeholder="Select authors" />
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="description">Description</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-align-justify"></i>
                            </span>
                            <InputTextarea id="description" name="description" value={book.description} rows={5} onChange={onInputChange} />
                        </div>
                    </div>
                    {/* <div className="field">
                        <label htmlFor="images">Images</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-image"></i>
                            </span>
                            <InputText id="images" name="images" value={book.images} onChange={onInputChange} />
                        </div>
                    </div> */}
                </Dialog>

                <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Konfirmasi" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {book && (
                            <span>
                                Yakin menghapus <b>{book.title}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>
            </main >
        </>
    )
}

export default Books
