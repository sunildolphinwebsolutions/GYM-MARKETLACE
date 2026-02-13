"use client";

import { useEffect, useState } from 'react';
import { getPayments } from '../../../services/paymentService';

export default function PaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const data = await getPayments();
                if (data.success) {
                    setPayments(data.payments);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-white">Payments & Commissions</h1>

            <div className="bg-gray-800 rounded-lg overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Booking Info</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Platform (Comm.)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gym Owner</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-400">Loading...</td>
                            </tr>
                        ) : payments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-400">No payments found</td>
                            </tr>
                        ) : (
                            payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                                        {new Date(payment.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                                        <div className="font-medium text-white">{payment.gym_name}</div>
                                        <div className="text-gray-400">User: {payment.user_name}</div>
                                        <div className="text-gray-500 text-xs">ID: {payment.booking_id}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-white font-bold">
                                        {payment.amount} XOF
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-green-400 font-medium">
                                        +{payment.commission_amount} XOF
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-blue-400 font-medium">
                                        {payment.gym_owner_amount} XOF
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {payment.status}
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
