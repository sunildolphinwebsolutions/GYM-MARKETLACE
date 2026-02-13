
"use client";

import { useEffect, useState } from 'react';
import { getSellers } from '../../../services/adminService';

interface Seller {
    id: number;
    name: string;
    email: string;
    created_at: string;
    gym_count: number;
}

export default function SellersPage() {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const data = await getSellers();
                if (data.success) {
                    setSellers(data.sellers);
                }
            } catch (error) {
                console.error('Failed to fetch sellers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSellers();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-white">Gym Owners</h1>

            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gyms Owned</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-400">Loading...</td>
                            </tr>
                        ) : sellers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-400">No gym owners found</td>
                            </tr>
                        ) : (
                            sellers.map((seller) => (
                                <tr key={seller.id} className="hover:bg-gray-750 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-white font-medium">{seller.name}</div>
                                        <div className="text-gray-400 text-sm md:hidden">{seller.email}</div>
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-gray-300">
                                        {seller.email}
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                                        {new Date(seller.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-brand-yellow font-bold">
                                        {seller.gym_count}
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
