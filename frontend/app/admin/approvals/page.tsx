
"use client";

import { useEffect, useState } from 'react';
import { getPendingGyms, approveGym, rejectGym } from '../../../services/adminService';

interface Gym {
    id: number;
    name: string;
    location: string;
    description: string;
    price_per_session: string;
    status: string;
    owner_name: string;
    owner_email: string;
    created_at: string;
}

export default function ApprovalsPage() {
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        fetchGyms();
    }, []);

    const fetchGyms = async () => {
        try {
            const data = await getPendingGyms();
            if (data.success) {
                setGyms(data.gyms);
            }
        } catch (error) {
            console.error('Failed to fetch pending gyms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        setProcessingId(id);
        try {
            const response = await approveGym(id);
            if (response.success) {
                setGyms(gyms.filter(g => g.id !== id));
            }
        } catch (error) {
            console.error('Failed to approve gym:', error);
            alert('Failed to approve gym');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: number) => {
        if (!confirm('Are you sure you want to reject this gym?')) return;

        setProcessingId(id);
        try {
            const response = await rejectGym(id);
            if (response.success) {
                setGyms(gyms.filter(g => g.id !== id));
            }
        } catch (error) {
            console.error('Failed to reject gym:', error);
            alert('Failed to reject gym');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-white">Pending Approvals</h1>

            <div className="grid gap-6">
                {loading ? (
                    <div className="text-center text-gray-400 py-10">Loading...</div>
                ) : gyms.length === 0 ? (
                    <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-white">No pending approvals</h3>
                        <p className="mt-1 text-sm text-gray-400">All gyms have been reviewed.</p>
                    </div>
                ) : (
                    gyms.map((gym) => (
                        <div key={gym.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-1">{gym.name}</h2>
                                        <p className="text-brand-yellow font-medium text-sm mb-4">
                                            Owner: {gym.owner_name} ({gym.owner_email})
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-yellow-900 text-yellow-200 text-xs font-semibold rounded-full border border-yellow-700">
                                        Pending Review
                                    </span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300 mb-6">
                                    <div>
                                        <p className="text-gray-500 mb-1">Location</p>
                                        <p>{gym.location}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Price</p>
                                        <p>{gym.price_per_session} XOF / session</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-gray-500 mb-1">Description</p>
                                        <p className="bg-gray-900 p-3 rounded text-gray-400">{gym.description}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                                    <button
                                        onClick={() => handleReject(gym.id)}
                                        disabled={processingId === gym.id}
                                        className="px-4 py-2 bg-red-900/30 text-red-400 border border-red-900 rounded hover:bg-red-900/50 transition-colors disabled:opacity-50"
                                    >
                                        {processingId === gym.id ? 'Processing...' : 'Reject'}
                                    </button>
                                    <button
                                        onClick={() => handleApprove(gym.id)}
                                        disabled={processingId === gym.id}
                                        className="px-4 py-2 bg-brand-yellow text-black font-bold rounded hover:bg-yellow-400 transition-colors disabled:opacity-50"
                                    >
                                        {processingId === gym.id ? 'Processing...' : 'Approve'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
