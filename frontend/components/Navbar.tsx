"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Hide Navbar on Admin pages (they have full sidebar)
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    // On these pages, we hide the Navbar on MOBILE because the Floating Sidebar takes over.
    // On Desktop, we show the Navbar.
    const hideNavbarOnMobile =
        pathname?.startsWith('/dashboard') ||
        pathname?.startsWith('/gyms') ||
        pathname?.startsWith('/bookings') ||
        pathname?.startsWith('/profile');

    return (
        <nav className={`bg-brand-dark-gray border-b border-gray-800 w-full fixed top-0 z-50 ${hideNavbarOnMobile ? 'hidden md:block' : ''}`}>
            <div className="w-full px-6 md:px-12">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-brand-yellow">GYM<span className="text-white">ACCESS</span></span>
                        </Link>
                        <div className="hidden md:ml-10 md:flex md:space-x-8">
                            {user?.role === 'admin' && (
                                <Link href="/admin/commissions" className="text-gray-300 hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Admin
                                </Link>
                            )}
                            {user?.role === 'gym_owner' && (
                                <>
                                    <Link href="/dashboard/my-gyms" className="text-gray-300 hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                        My Gyms
                                    </Link>
                                    <Link href="/dashboard/payouts" className="text-gray-300 hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                        Payouts
                                    </Link>
                                </>
                            )}
                            {user?.role === 'user' && (
                                <>
                                    <Link href="/gyms" className="text-gray-300 hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                        Browse Gyms
                                    </Link>
                                    <Link href="/bookings" className="text-gray-300 hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                        My Bookings
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link href="/profile" className="flex items-center space-x-2 text-gray-300 hover:text-brand-yellow transition-colors group">
                                    <div className="p-1 bg-gray-800 rounded-full group-hover:bg-gray-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm hidden sm:block">{user.name}</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Login
                                </Link>
                                <Link href="/register" className="bg-brand-yellow text-black hover:bg-yellow-400 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
