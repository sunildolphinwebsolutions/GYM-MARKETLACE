"use client";

import { useEffect, useState } from 'react';
import { gymService } from '../../../services/gymService';
import { Gym } from '../../../types/gym';
import Link from 'next/link';

export default function MyGymsPage() {
    const [myGyms, setMyGyms] = useState<Gym[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyGyms();
    }, []);

    const fetchMyGyms = async () => {
        try {
            const data = await gymService.getMyGyms();
            setMyGyms(data);
        } catch (error) {
            console.error("Failed to fetch gyms", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">My Gyms</h1>
                <Link
                    href="/gyms/new"
                    className="bg-brand-yellow text-black font-bold py-2 px-6 rounded hover:bg-yellow-400 transition-colors"
                >
                    Add New Gym
                </Link>
            </div>

            {myGyms.length === 0 ? (
                <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center">
                    <h3 className="text-xl font-medium text-white mb-2">You haven't listed any gyms yet.</h3>
                    <p className="text-gray-400 mb-6">Start growing your business by adding your first gym.</p>
                    <Link
                        href="/gyms/new"
                        className="inline-block bg-brand-yellow text-black font-bold py-3 px-8 rounded hover:bg-yellow-400 transition-colors"
                    >
                        Add Your First Gym
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myGyms.map((gym) => (
                        <div key={gym.id} className="bg-brand-dark-gray border border-gray-800 rounded-lg overflow-hidden flex flex-col group hover:border-brand-yellow transition-colors">
                            <div className="h-48 bg-gray-700 relative">
                                {gym.images && gym.images.length > 0 ? (
                                    <img src={`http://localhost:5000${gym.images[0]}`} alt={gym.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${gym.status === 'published' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-200'
                                        }`}>
                                        {gym.status === 'published' ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h4 className="text-xl font-bold text-white mb-2 line-clamp-1">{gym.name}</h4>
                                <p className="text-sm text-gray-400 mb-2 line-clamp-2">{gym.location}</p>
                                <div className="flex items-center text-sm text-gray-300 mb-4">
                                    <svg className="w-4 h-4 mr-1 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="font-semibold text-white mr-1">{gym.member_count || 0}</span> Paid Members
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-700 flex justify-between items-center">
                                    <span className="text-brand-yellow font-bold text-lg">${gym.price_per_session}<span className="text-xs text-gray-500 font-normal">/session</span></span>
                                    <div className="flex space-x-2">
                                        <Link href={`/gyms/${gym.id}/edit`} className="text-sm bg-gray-800 text-white px-3 py-1.5 rounded hover:bg-gray-700 transition-colors">
                                            Edit
                                        </Link>
                                        <Link href={`/gyms/${gym.id}`} className="text-sm bg-gray-800 text-white px-3 py-1.5 rounded hover:bg-gray-700 transition-colors">
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
