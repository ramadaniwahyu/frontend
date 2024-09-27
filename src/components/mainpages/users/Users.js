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
import { Password } from 'primereact/password';

function Users() {
    let emptyUser = {
        name: '',
        email: '',
        role: 0,
        password: ''
    }

    const state = useContext(GlobalState)
    const [users] = state.userAPI.data
    const [token] = state.token
    const [user, setUser] = useState(emptyUser)
    const [onEdit, setOnEdit] = useState(false)
    const [selectedData, setSelectedData] = useState(null);
    const [metaKey] = useState(true);
    const [submitted, setSubmitted] = useState(false)
    const [dialog, setDialog] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const [activateUserDialog, setActivateUserDialog] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [matched, setMatched] = useState(true)
    const [confirm_password] = useState(null)
    const toast = useRef(null);

    const openNew = () => {
        setUser(emptyUser);
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

    const hideActivateUserDialog = () => {
        setActivateUserDialog(false);
    };

    const saveUser = async (event) => {
        event.preventDefault()
        setSubmitted(true)
        if (onEdit) {
            try {
                const res = await axios.put(`/api/users/${user._id}`, user, {
                    headers: { Authorization: token }
                })
                toast.current.show({ severity: 'success', summary: 'Successful', detail: res.data.msg, life: 3000 });
                setOnEdit(false)
            } catch (error) {
                toast.current.show({ severity: 'error', summary: error.response.statusText, detail: error.message, life: 3000 });
            }
        } else {
            try {
                const res = await axios.post('/api/users', user, {
                    headers: { Authorization: token }
                })
                toast.current.show({ severity: 'primary', summary: 'Successful', detail: res.data.msg, life: 3000 });
            } catch (error) {
                toast.current.show({ severity: 'error', summary: error.response.statusText, detail: error.message, life: 3000 });
            }
        }
        setDialog(false)
        setUser(emptyUser)
    };

    const activateUser = async (event) => {
        event.preventDefault()
        try {
            const res = await axios.patch(`/api/users/${user._id}`, {...user, is_active: isActive}, {
                headers: { Authorization: token }
            })
            toast.current.show({ severity: 'success', summary: 'Successful', detail: res.data.msg, life: 3000 });
            setIsActive(false)
        } catch (error) {
            toast.current.show({ severity: 'error', summary: error.response.statusText, detail: error.message, life: 3000 });
        }
        setActivateUserDialog(false)
    }

    const deleteUser = async (event) => {
        event.preventDefault()
        try {
            const res = await axios.delete(`/api/users/${user._id}`, {
                headers: { Authorization: token }
            })
            toast.current.show({ severity: 'error', summary: 'Successful', detail: res.data.msg, life: 3000 });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: error.response.statusText, detail: error.message, life: 3000 });
        }
        setDeleteDialog(false)
    }

    const editUser = (user) => {
        setUser({ ...user });
        setOnEdit(true)
        setDialog(true);
    };

    const confirmActivateUser = (user) => {
        setUser(user)
        setIsActive(!user.is_active)
        setActivateUserDialog(true);
    };

    const confirmDeleteUser = (user) => {
        setUser(user);
        setDeleteDialog(true);
    };

    const onInputChange = e => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value })
    }

    const onPasswordChange = e => {
        if (user.password !== confirm_password) {
            setMatched(false)
        }
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
            <Button label="Save" icon="pi pi-check" text onClick={saveUser} />
        </>
    );

    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteUser} />
        </>
    );

    const activateUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideActivateUserDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={activateUser} />
        </>
    )

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
                <Button icon="pi pi-pencil" severity="info" aria-label="Edit" onClick={() => editUser(rowData)} tooltip="Edit User" tooltipOptions={{ position: 'bottom' }} />
                <Button icon="pi pi-user" severity={rowData.is_active ? "success" : "secondary"} onClick={() => confirmActivateUser(rowData)} tooltip={!rowData.is_active ? "Activate user" : "Deactivate User"} tooltipOptions={{ position: 'bottom' }} aria-label='Activate User' />
                <Button icon="pi pi-trash" severity="danger" aria-label="Delete" onClick={() => confirmDeleteUser(rowData)} tooltip="Delete User" tooltipOptions={{ position: 'bottom' }} />
            </div>
        );
    };

    return (
        <>
            <header className="bg-white shadow gap-3">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pengguna</h1>
                </div>
            </header>
            <main className='card m-6'>
                <Toast ref={toast} />
                <Toolbar className="mb-4" end={topButton}></Toolbar>
                <DataTable value={users} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} selectionMode="single" selection={selectedData} onSelectionChange={(e) => setSelectedData(e.value)} dataKey="_id" metaKeySelection={metaKey} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="name" header="Name" body={nameTemplate} style={{ width: '25%' }}></Column>
                    <Column field="email" header="Email" style={{ width: '50%' }}></Column>
                    <Column field="action" header="Action" body={actionTemplate} style={{ width: '25%' }}></Column>
                </DataTable>

                <Dialog visible={dialog} style={{ width: '600px' }} header="User Details" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                    {user._id && <img src={`https://robohash.org/${user._id}`} alt={user.name} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                    <div className="field">
                        <label htmlFor="name">Nama</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <InputText id="name" name="name" value={user.name} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !user.name })} />
                        </div>
                        {submitted && !user.name && <small className="p-invalid">Name is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-envelope"></i>
                            </span>
                            <InputText id="email" name="email" value={user.email} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !user.name })} />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="password">Password</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <Password id="password" name="password" value={user.password} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !user.password })} />
                        </div>
                        {submitted && !user.password && <small className="p-invalid">Password is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="password2">Confirm Password</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-envelope"></i>
                            </span>
                            <Password id="password2" name="password2" value={confirm_password} onChange={onPasswordChange} required autoFocus
                                className={classNames({ 'p-invalid': !matched && !confirm_password })} />
                        </div>
                        {submitted && !confirm_password && <small className="p-invalid">Confirm Password is required.</small>}
                    </div>
                </Dialog>

                <Dialog visible={activateUserDialog} style={{ width: '450px' }} header="Konfirmasi" modal footer={activateUserDialogFooter} onHide={hideActivateUserDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {user && (
                            <span>
                                {user.is_active ? 'Deaktivasi': 'Aktivasi'} <b>{user.name} ({user.email})</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Konfirmasi" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {user && (
                            <span>
                                Yakin menghapus <b>{user.name} ({user.email})</b>?
                            </span>
                        )}
                    </div>
                </Dialog>
            </main >
        </>
    )
}

export default Users
