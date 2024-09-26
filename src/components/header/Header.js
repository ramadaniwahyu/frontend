import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Menubar } from 'primereact/menubar';
import { GlobalState } from '../../GlobalState'
import axios from 'axios'

export default function Header() {
    const state = useContext(GlobalState)
    const [isAdmin] = state.authAPI.isAdmin
    const [isLogged] = state.authAPI.isLogged

    const logoutUser = async () => {
        await axios.get('/api/logout')

        localStorage.removeItem('firstLogin')

        window.location.href = "/";
    }

    const itemRenderer = (item) => (
        <Link to={item.url} className="flex align-items-center p-menuitem-link">
            <span className={item.icon} />
            <span className="mx-2">{item.label}</span>
        </Link>
    );

    const items = [
        {
            label: 'Pengarang',
            icon: 'pi pi-user',
            url: '/authors',
            template: itemRenderer
        },
        {
            label: 'Buku',
            icon: 'pi pi-book',
            url: '/books',
            template: itemRenderer
        }
    ]

    const adminItems = [
        {
            label: 'Pengarang',
            icon: 'pi pi-users',
            url: '/authors',
            template: itemRenderer
        },
        {
            label: 'Buku',
            icon: 'pi pi-book',
            url: '/books',
            template: itemRenderer
        },
        {
            label: 'Menu Admin',
            icon: 'pi pi-cog',
            items: [
                {
                    label: 'Kategori',
                    icon: 'pi pi-tags',
                    url: '/categories',
                    template: itemRenderer
                },
                {
                    label: 'Pengguna',
                    icon: 'pi pi-users',
                    url: '/users',
                    template: itemRenderer
                }
            ]
        },
    ];

    const start = (
        <Link to='/'>
        <img alt="logo" src="/logo.png" height="40" className="mr-2" />
        </Link>
    );
    const end = (
        <div className="flex align-items-center gap-2">
            {
                isLogged ? <Link className="flex align-items-center p-menuitem-link"
                onClick={logoutUser}>
                    Log out
                </Link>
                : <Link to='/login' className="flex align-items-center p-menuitem-link"> Log in
                </Link>
            }
        </div>
    );

    return (
        <>
            <div className="card m-6">
                {
                    isAdmin ? <Menubar model={adminItems} start={start} end={end} /> :
                    isLogged ? <Menubar model={items} start={start} end={end} />:
                    <Menubar start={start} end={end} />
                }
            </div>
        </>
    )

    // return (

    //     <>
    //     <header className="bg-white">
    //         <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
    //             <div className="flex lg:flex-1">
    //                 <Link to="/" className="-m-1.5 p-1.5">
    //                     <span className="sr-only">FrontEnd Apps</span>
    //                     <img alt="" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" className="h-8 w-auto" />
    //                 </Link>
    //             </div>
    //             <div className="flex lg:hidden">
    //                 <button
    //                     type="button"
    //                     onClick={() => setMobileMenuOpen(true)}
    //                     className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
    //                 >
    //                     <span className="sr-only">Open main menu</span>
    //                     <Bars3Icon aria-hidden="true" className="h-6 w-6" />
    //                 </button>
    //             </div>
    //             <PopoverGroup className="hidden lg:flex lg:gap-x-12">
    //                 {
    //                     !isLogged ? '' :
    //                         <><Link
    //                             to="/books"
    //                             className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
    //                         >
    //                             Buku
    //                         </Link><Link
    //                             to="/authors"
    //                             className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
    //                         >
    //                                 Pengarang
    //                             </Link>
    //                         </>
    //                 }
    //                 {
    //                     !isAdmin ? '' :
    //                         <>
    //                             <Link
    //                                 to="/categories"
    //                                 className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
    //                             >
    //                                 Kategori
    //                             </Link>
    //                             <Link
    //                                 to="/users"
    //                                 className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
    //                             >
    //                                 Pengguna
    //                             </Link>
    //                         </>
    //                 }
    //             </PopoverGroup>
    //             <div className="hidden lg:flex lg:flex-1 lg:justify-end">
    //                 {
    //                     isLogged ?
    //                         <Link onClick={logoutUser} className="text-sm font-semibold leading-6 text-gray-900">
    //                             Log out <span aria-hidden="true">&larr;</span>
    //                         </Link> :
    //                         <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">
    //                             Log in <span aria-hidden="true">&rarr;</span>
    //                         </Link>
    //                 }
    //             </div>
    //         </nav>
    //         <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
    //             <div className="fixed inset-0 z-10" />
    //             <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
    //                 <div className="flex items-center justify-between">
    //                     <Link to="#" className="-m-1.5 p-1.5">
    //                         <span className="sr-only">Your Company</span>
    //                         <img
    //                             alt=""
    //                             src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
    //                             className="h-8 w-auto"
    //                         />
    //                     </Link>
    //                     <button
    //                         type="button"
    //                         onClick={() => setMobileMenuOpen(false)}
    //                         className="-m-2.5 rounded-md p-2.5 text-gray-700"
    //                     >
    //                         <span className="sr-only">Close menu</span>
    //                         <XMarkIcon aria-hidden="true" className="h-6 w-6" />
    //                     </button>
    //                 </div>
    //                 <div className="mt-6 flow-root">
    //                     <div className="-my-6 divide-y divide-gray-500/10">
    //                         <div className="space-y-2 py-6">
    //                             {
    //                                 !isLogged ? '' :
    //                                     <>
    //                                         <Link
    //                                             to="/books"
    //                                             className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
    //                                         >
    //                                             Buku
    //                                         </Link>
    //                                         <Link
    //                                             to="/authors"
    //                                             className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
    //                                         >
    //                                             Pengarang
    //                                         </Link></>
    //                             }
    //                             {
    //                                 !isAdmin ? '' :
    //                                 <>
    //                                 <Link
    //                                         to="/categories"
    //                                         className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
    //                                     >
    //                                         Kategori
    //                                     </Link>
    //                                     <Link
    //                                         to="/users"
    //                                         className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
    //                                     >
    //                                         Pengguna
    //                                     </Link>
    //                                 </>
    //                             }
    //                         </div>
    //                         <div className="py-6">
    //                             {
    //                                 isLogged ?
    //                                     <Link
    //                                         onClick={logoutUser}
    //                                         className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
    //                                     >
    //                                         Log out
    //                                     </Link> :
    //                                     <Link
    //                                         to="/login"
    //                                         className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
    //                                     >
    //                                         Log in
    //                                     </Link>
    //                             }
    //                         </div>
    //                     </div>
    //                 </div>
    //             </DialogPanel>
    //         </Dialog>
    //     </header>
    //     </>
    // )


}