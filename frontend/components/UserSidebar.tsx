"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserSidebar() {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();

    // Only show for logged in users, and NOT on Admin pages (Admin has its own layout)
    if (!user || pathname?.startsWith('/admin') || pathname?.startsWith('/login') || pathname?.startsWith('/register')) {
        return null;
    }

    // Also maybe hide on Home page if desired? User said "on all the pages", implies inside the app.
    // Let's keep it on Home too if user is logged in, or restrict to app routes.
    // For now, let's include Home but maybe the user wants it everywhere.

    const isActive = (path: string) => {
        if (path === pathname) return true;
        if (path !== '/' && pathname?.startsWith(path)) return true;
        return false;
    };

    const userLinks = [
        {
            name: 'Dashboard', href: '/dashboard', icon: (
                <svg className={`mr-3 h-5 w-5 ${isActive('/dashboard') ? 'text-black' : 'text-gray-400 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            )
        },
        {
            name: 'Browse Gyms', href: '/gyms', icon: (
                <svg className={`mr-3 h-5 w-5 ${isActive('/gyms') ? 'text-black' : 'text-gray-400 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        {
            name: 'My Bookings', href: '/bookings', icon: (
                <svg className={`mr-3 h-5 w-5 ${isActive('/bookings') ? 'text-black' : 'text-gray-400 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            name: 'Profile', href: '/profile', icon: (
                <svg className={`mr-3 h-5 w-5 ${isActive('/profile') ? 'text-black' : 'text-gray-400 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
    ];

    const ownerLinks = [
        {
            name: 'Dashboard', href: '/dashboard', icon: (
                <svg className={`mr-3 h-5 w-5 ${isActive('/dashboard') ? 'text-black' : 'text-gray-400 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            )
        },
        {
            name: 'Add New Gym', href: '/gyms/new', icon: (
                <svg className={`mr-3 h-5 w-5 ${isActive('/gyms/new') ? 'text-black' : 'text-gray-400 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            )
        },
        {
            name: 'Profile', href: '/profile', icon: (
                <svg className={`mr-3 h-5 w-5 ${isActive('/profile') ? 'text-black' : 'text-gray-400 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
    ];

    const links = user.role === 'gym_owner' ? ownerLinks : userLinks;

    return (
        <>
            {/* Mobile Sidebar Toggle - Only visible on mobile (md:hidden) */}
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
                    className="fixed inset-0 bg-black bg-opacity-70 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar - Hidden on Desktop (md:hidden) */}
            <aside className={`
                w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0 z-40 transition-transform duration-300 ease-in-out shadow-xl border-r border-gray-800
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:hidden
            `}>
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
                        <span className="text-brand-yellow">GYM</span> ACCESS
                    </h2>
                </div>

                <nav className="p-4 space-y-2">
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">Menu</p>
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive(link.href) ? 'bg-brand-yellow text-black' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            {link.icon}
                            {link.name}
                        </Link>
                    ))}

                    <button
                        onClick={logout}
                        className="w-full group flex items-center px-4 py-3 text-sm font-medium rounded-md text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors mt-6"
                    >
                        <svg className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </nav>
            </aside>
        </>
    );
}
