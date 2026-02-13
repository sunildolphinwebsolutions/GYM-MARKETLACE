"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

interface Payout {
    id: number;
    amount: number;
    status: string;
    transaction_ref: string | null;
    created_at: string;
    gym_owner_name: string;
    gym_owner_email: string;
}

export default function AdminPayoutsPage() {
    const { token } = useAuth();
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [transactionRef, setTransactionRef] = useState('');
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchPayouts();
    }, []);

    const fetchPayouts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/payouts/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setPayouts(res.data.payouts);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        if (status === 'paid' && !transactionRef) {
            alert('Please enter a transaction reference');
            return;
        }

        try {
            setProcessingId(id);
            const res = await axios.put(`http://localhost:5000/api/payouts/${id}/status`, {
                status,
                transaction_ref: transactionRef
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setMsg(`Payout marked as ${status.toUpperCase()}`);
                setTransactionRef('');
                fetchPayouts();
                setTimeout(() => setMsg(''), 3000);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Payout Management</h1>

            {msg && (
                <div className="mb-6 p-4 rounded bg-green-900/50 text-green-300 border border-green-800">
                    {msg}
                </div>
            )}

            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-800 text-gray-200 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3">Owner</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Date Requested</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {payouts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No payout requests found.
                                    </td>
                                </tr>
                            ) : (
                                payouts.map((payout) => (
                                    <tr key={payout.id} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{payout.gym_owner_name}</div>
                                            <div className="text-xs text-gray-500">{payout.gym_owner_email}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">
                                            ${parseFloat(payout.amount.toString()).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(payout.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${payout.status === 'paid' ? 'bg-green-900/30 text-green-400 border-green-800' :
                                                    payout.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' :
                                                        payout.status === 'failed' ? 'bg-red-900/30 text-red-400 border-red-800' :
                                                            'bg-blue-900/30 text-blue-400 border-blue-800'
                                                }`}>
                                                {payout.status.toUpperCase()}
                                            </span>
                                            {payout.transaction_ref && (
                                                <div className="text-xs font-mono mt-1 text-gray-500">Ref: {payout.transaction_ref}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {payout.status === 'pending' && (
                                                <div className="flex flex-col gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Txn Ref ID"
                                                        className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-yellow mb-1"
                                                        value={transactionRef}
                                                        onChange={(e) => setTransactionRef(e.target.value)}
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleUpdateStatus(payout.id, 'paid')}
                                                            disabled={processingId === payout.id}
                                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(payout.id, 'failed')}
                                                            disabled={processingId === payout.id}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
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
