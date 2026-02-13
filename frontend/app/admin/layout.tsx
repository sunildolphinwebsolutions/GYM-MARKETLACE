"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === '/admin' && pathname === '/admin') return true;
        if (path !== '/admin' && pathname?.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            {/* Mobile Sidebar Toggle */}
            <button
                className="md:hidden fixed bottom-4 right-4 z-50 bg-brand-yellow text-black p-3 rounded-full shadow-lg"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isSidebarOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0 z-40 transition-transform duration-300 ease-in-out shadow-xl border-r border-gray-800
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:block
            `}>
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
                        <span className="text-brand-yellow">GYM</span> ADMIN
                    </h2>
                </div>

                <nav className="p-4 space-y-1">
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">Overview</p>

                    <Link
                        href="/admin"
                        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive('/admin') ? 'bg-gray-800 text-brand-yellow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <svg className={`mr-3 h-5 w-5 ${isActive('/admin') ? 'text-brand-yellow' : 'text-gray-400 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Dashboard
                    </Link>

                    <Link
                        href="/admin/sellers"
                        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive('/admin/sellers') ? 'bg-gray-800 text-brand-yellow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <svg className={`mr-3 h-5 w-5 ${isActive('/admin/sellers') ? 'text-brand-yellow' : 'text-gray-400 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Sellers
                    </Link>

                    {/* <Link
                        href="/admin/approvals"
                        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive('/admin/approvals') ? 'bg-gray-800 text-brand-yellow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <svg className={`mr-3 h-5 w-5 ${isActive('/admin/approvals') ? 'text-brand-yellow' : 'text-gray-400 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Approvals
                    </Link> */}


                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Management</p>

                    <Link
                        href="/admin/commissions"
                        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive('/admin/commissions') ? 'bg-gray-800 text-brand-yellow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <svg className={`mr-3 h-5 w-5 ${isActive('/admin/commissions') ? 'text-brand-yellow' : 'text-gray-400 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Commissions
                    </Link>
                    <Link
                        href="/admin/transactions"
                        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive('/admin/transactions') ? 'bg-gray-800 text-brand-yellow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <svg className={`mr-3 h-5 w-5 ${isActive('/admin/transactions') ? 'text-brand-yellow' : 'text-gray-400 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Transactions
                    </Link>
                    <Link
                        href="/admin/payments"
                        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive('/admin/payments') ? 'bg-gray-800 text-brand-yellow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <svg className={`mr-3 h-5 w-5 ${isActive('/admin/payments') ? 'text-brand-yellow' : 'text-gray-400 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Payments
                    </Link>

                    <Link
                        href="/admin/payouts"
                        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive('/admin/payouts') ? 'bg-gray-800 text-brand-yellow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <svg className={`mr-3 h-5 w-5 ${isActive('/admin/payouts') ? 'text-brand-yellow' : 'text-gray-400 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Payouts
                    </Link>
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
                    <Link href="/" className="flex items-center text-gray-400 hover:text-white transition-colors">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Back to App
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="md:ml-64 min-h-screen flex flex-col">
                {/* Top Navigation Bar */}
                <header className="bg-gray-900 border-b border-gray-800 shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-20">
                    <div className="font-semibold text-white">Admin Portal</div>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-brand-yellow flex items-center justify-center text-black font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
