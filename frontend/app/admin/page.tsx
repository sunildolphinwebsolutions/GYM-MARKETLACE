"use client";

import { useEffect, useState } from 'react';
import { getDashboardStats, DashboardStats } from '../../services/adminService';

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                if (data.success) {
                    setStats(data.stats);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-400">Loading dashboard data...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Revenue Card */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm font-medium uppercase">Total Revenue</h3>
                        <div className="p-2 bg-green-900 rounded-full">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white">{stats?.totalRevenue.toLocaleString()} <span className="text-sm font-normal text-gray-400">XOF</span></div>
                    <p className="text-sm text-green-400 mt-2 font-medium">+12% from last month</p>
                </div>

                {/* Users Card */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm font-medium uppercase">Total Users</h3>
                        <div className="p-2 bg-blue-900 rounded-full">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white">{stats?.totalUsers}</div>
                    <p className="text-sm text-gray-400 mt-2">Active accounts</p>
                </div>

                {/* Gyms Card */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm font-medium uppercase">Active Gyms</h3>
                        <div className="p-2 bg-purple-900 rounded-full">
                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white">{stats?.totalGyms}</div>
                    <p className="text-sm text-gray-400 mt-2">Partnered gyms</p>
                </div>

                {/* Bookings Card */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm font-medium uppercase">Total Bookings</h3>
                        <div className="p-2 bg-yellow-900 rounded-full">
                            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white">{stats?.totalBookings}</div>
                    <p className="text-sm text-gray-400 mt-2">All time bookings</p>
                </div>
            </div>

            {/* Recent Activity Section (Placeholder) */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
                <h2 className="text-lg font-bold text-white mb-4">System Health</h2>
                <p className="text-gray-400">All systems operational.</p>
            </div>
        </div>
    );
}
