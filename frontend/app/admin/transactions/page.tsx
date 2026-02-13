
"use client";

import { useEffect, useState } from 'react';
import { getTransactions } from '../../../services/adminService';

interface Transaction {
    id: number;
    amount: string;
    commission_amount: string;
    gym_owner_amount: string;
    status: string;
    created_at: string;
    gym_name: string;
    user_name: string;
    owner_name: string;
    transaction_id: string;
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await getTransactions();
                if (data.success) {
                    setTransactions(data.transactions);
                }
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const formatCurrency = (amount: string) => {
        return `${parseFloat(amount).toLocaleString()} XOF`;
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-white">Transactions</h1>

            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gym / Owner</th>
                            <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Amount</th>
                            <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Commission</th>
                            <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Owner Net</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-gray-400">Loading...</td>
                            </tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-gray-400">No transactions found</td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-750 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-white font-medium">{tx.gym_name}</div>
                                        <div className="text-gray-500 text-xs">{tx.owner_name}</div>
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                                        {tx.user_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-white font-bold">
                                        {formatCurrency(tx.amount)}
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-green-400">
                                        +{formatCurrency(tx.commission_amount)}
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-blue-400">
                                        {formatCurrency(tx.gym_owner_amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${tx.status === 'completed' ? 'bg-green-900 text-green-200 border border-green-700' :
                                            tx.status === 'pending' ? 'bg-yellow-900 text-yellow-200 border border-yellow-700' :
                                                'bg-red-900 text-red-200 border border-red-700'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
