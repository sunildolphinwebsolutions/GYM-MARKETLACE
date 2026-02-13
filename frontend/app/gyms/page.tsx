"use client";

import { useEffect, useState } from 'react';
import { gymService } from '../../services/gymService';
import { Gym } from '../../types/gym';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import Navbar from '../../components/Navbar'; // Assuming we have a Navbar or I should create one/use default layout? 
// The user has a landing page components... let's stick to a simple layout for now or reuse what's available.
// Looking at file list, there is a layout.tsx in app root, so I can just output the page content.

export default function GymsPage() {
    const { user } = useAuth(); // Import useAuth
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        min_price: '',
        max_price: '',
        location: '',
        features: ''
    });

    useEffect(() => {
        fetchGyms();
    }, []);

    const fetchGyms = async (currentFilters = filters) => {
        setIsLoading(true);
        try {
            const apiFilters: any = {};
            if (currentFilters.min_price) apiFilters.min_price = parseFloat(currentFilters.min_price);
            if (currentFilters.max_price) apiFilters.max_price = parseFloat(currentFilters.max_price);
            if (currentFilters.location) apiFilters.location = currentFilters.location;
            if (currentFilters.features) apiFilters.features = currentFilters.features.split(',').map((f: string) => f.trim()).filter((f: string) => f !== '');

            const data = await gymService.getAllGyms(apiFilters);
            setGyms(data);
        } catch (error) {
            console.error("Failed to fetch gyms", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = (e: React.FormEvent) => {
        e.preventDefault();
        fetchGyms();
    };

    const clearFilters = () => {
        const emptyFilters = {
            min_price: '',
            max_price: '',
            location: '',
            features: ''
        };
        setFilters(emptyFilters);
        fetchGyms(emptyFilters);
    };

    const isOwner = user?.role === 'gym_owner';

    return (
        <div className="min-h-screen bg-brand-black py-12 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    {isOwner ? (
                        <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
                            Marketplace <span className="text-brand-yellow">Overview</span>
                        </h1>
                    ) : (
                        <>
                            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                                Find Your <span className="text-brand-yellow">Perfect Gym</span>
                            </h1>
                            <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                                Browse through our selection of top-rated gyms and fitness centers.
                            </p>
                        </>
                    )}
                </div>

                <div className={`flex flex-col ${isOwner ? '' : 'lg:flex-row'} gap-8`}>
                    {/* Filters Sidebar - Only for non-owners */}
                    {!isOwner && (
                        <div className="lg:w-1/4">
                            <div className="bg-brand-dark-gray p-6 rounded-lg border border-gray-800 sticky top-24">
                                <h3 className="text-xl font-bold text-white mb-4">Filters</h3>
                                <form onSubmit={applyFilters} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={filters.location}
                                            onChange={handleFilterChange}
                                            placeholder="City or Area"
                                            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-brand-yellow focus:outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Min Price</label>
                                            <input
                                                type="number"
                                                name="min_price"
                                                value={filters.min_price}
                                                onChange={handleFilterChange}
                                                placeholder="0"
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-brand-yellow focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Max Price</label>
                                            <input
                                                type="number"
                                                name="max_price"
                                                value={filters.max_price}
                                                onChange={handleFilterChange}
                                                placeholder="100"
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-brand-yellow focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Features (comma separated)</label>
                                        <input
                                            type="text"
                                            name="features"
                                            value={filters.features}
                                            onChange={handleFilterChange}
                                            placeholder="Pool, Sauna..."
                                            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-brand-yellow focus:outline-none"
                                        />
                                    </div>
                                    <div className="pt-2 flex flex-col gap-2">
                                        <button
                                            type="submit"
                                            className="w-full bg-brand-yellow text-black font-bold py-2 rounded hover:bg-yellow-400 transition-colors"
                                        >
                                            Apply Filters
                                        </button>
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="w-full bg-gray-700 text-white font-bold py-2 rounded hover:bg-gray-600 transition-colors"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Gym Grid */}
                    <div className={isOwner ? 'w-full' : 'lg:w-3/4'}>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-yellow"></div>
                            </div>
                        ) : gyms.length === 0 ? (
                            <div className="text-center py-20 bg-brand-dark-gray rounded-lg border border-gray-800">
                                <p className="text-xl text-gray-400">No gyms available.</p>
                            </div>
                        ) : (
                            <div className={`grid grid-cols-1 md:grid-cols-2 ${isOwner ? 'lg:grid-cols-3' : ''} gap-6`}>
                                {gyms.map((gym) => (
                                    <Link href={`/gyms/${gym.id}`} key={gym.id} className="group">
                                        <div className="bg-brand-dark-gray border border-gray-800 rounded-lg shadow-md overflow-hidden hover:border-brand-yellow/50 transition-all duration-300 h-full flex flex-col">
                                            <div className="relative h-56 bg-gray-800">
                                                {gym.images && gym.images.length > 0 ? (
                                                    <img
                                                        src={`http://localhost:5000${gym.images[0]}`}
                                                        alt={gym.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                        No Image Available
                                                    </div>
                                                )}
                                                <div className="absolute top-4 right-4 bg-brand-yellow text-black px-3 py-1 rounded font-bold shadow-sm">
                                                    ${gym.price_per_session}/session
                                                </div>
                                            </div>
                                            <div className="p-6 flex-grow flex flex-col">
                                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-yellow transition-colors">
                                                    {gym.name}
                                                </h3>
                                                <p className="text-sm text-gray-400 mb-4 flex items-center">
                                                    <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {gym.location}
                                                </p>
                                                <p className="text-gray-400 mb-4 line-clamp-3">{gym.description}</p>

                                                <div className="mt-auto">
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {gym.features && gym.features.slice(0, 3).map((feature, idx) => (
                                                            <span key={idx} className="bg-black border border-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                                                                {feature}
                                                            </span>
                                                        ))}
                                                        {gym.features && gym.features.length > 3 && (
                                                            <span className="bg-black border border-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                                                                +{gym.features.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="block w-full text-center py-2 border border-brand-yellow text-brand-yellow rounded font-bold group-hover:bg-brand-yellow group-hover:text-black transition-colors">
                                                        View Details
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
