"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

interface PayoutStats {
    totalEarned: number;
    pendingBalance: number;
    lastPayout: {
        amount: number;
        created_at: string;
    } | null;
}

interface Payout {
    id: number;
    amount: number;
    status: string;
    transaction_ref: string | null;
    created_at: string;
}

export default function PayoutsPage() {
    const { user, token } = useAuth();
    const [stats, setStats] = useState<PayoutStats | null>(null);
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (user && user.role === 'gym_owner') {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [statsRes, listRes] = await Promise.all([
                axios.get('http://localhost:5000/api/payouts/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5000/api/payouts/list', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            if (statsRes.data.success) setStats(statsRes.data);
            if (listRes.data.success) setPayouts(listRes.data.payouts);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestPayout = async () => {
        try {
            setRequesting(true);
            setMsg('');
            const res = await axios.post('http://localhost:5000/api/payouts/request', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setMsg('Payout requested successfully!');
                fetchData(); // Refresh data
            }
        } catch (err: any) {
            setMsg(err.response?.data?.error || 'Failed to request payout');
        } finally {
            setRequesting(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;

    if (user?.role !== 'gym_owner') {
        return <div className="p-8 text-red-500">Access Denied. Gym Owners only.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Payouts & Earnings</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">Total Earned</h3>
                    <p className="text-3xl font-bold text-brand-yellow mt-2">${stats?.totalEarned.toFixed(2)}</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">Pending Balance</h3>
                    <p className="text-3xl font-bold text-white mt-2">${stats?.pendingBalance.toFixed(2)}</p>
                    {stats?.pendingBalance! > 0 && (
                        <button
                            onClick={handleRequestPayout}
                            disabled={requesting}
                            className="mt-4 w-full bg-brand-yellow text-black font-bold py-2 px-4 rounded hover:bg-yellow-400 transition-colors disabled:opacity-50"
                        >
                            {requesting ? 'Processing...' : 'Request Payout'}
                        </button>
                    )}
                </div>
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">Last Payout</h3>
                    <p className="text-3xl font-bold text-white mt-2">
                        {stats?.lastPayout ? `$${parseFloat(stats.lastPayout.amount.toString()).toFixed(2)}` : 'N/A'}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                        {stats?.lastPayout ? new Date(stats.lastPayout.created_at).toLocaleDateString() : '-'}
                    </p>
                </div>
            </div>

            {msg && (
                <div className={`mb-6 p-4 rounded ${msg.includes('success') ? 'bg-green-900/50 text-green-300 border border-green-800' : 'bg-red-900/50 text-red-300 border border-red-800'}`}>
                    {msg}
                </div>
            )}

            {/* Payout History */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white">Payout History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-800 text-gray-200 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Reference</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {payouts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No payout history found.
                                    </td>
                                </tr>
                            ) : (
                                payouts.map((payout) => (
                                    <tr key={payout.id} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            {new Date(payout.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">
                                            ${parseFloat(payout.amount.toString()).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${payout.status === 'paid' ? 'bg-green-900/30 text-green-400 border-green-800' :
                                                    payout.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' :
                                                        payout.status === 'failed' ? 'bg-red-900/30 text-red-400 border-red-800' :
                                                            'bg-blue-900/30 text-blue-400 border-blue-800'
                                                }`}>
                                                {payout.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">
                                            {payout.transaction_ref || '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
