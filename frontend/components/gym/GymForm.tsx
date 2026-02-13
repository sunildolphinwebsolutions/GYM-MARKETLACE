"use client";

import { useState } from 'react';
import { gymService } from '../../services/gymService';
import { CreateGymData } from '../../types/gym';

import { Gym } from '../../types/gym';

interface GymFormProps {
    initialData?: Gym;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function GymForm({ initialData, onSuccess, onCancel }: GymFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [location, setLocation] = useState(initialData?.location || '');
    const [price, setPrice] = useState(initialData?.price_per_session?.toString() || '');
    const [capacity, setCapacity] = useState(initialData?.capacity?.toString() || '10');
    const [features, setFeatures] = useState(initialData?.features?.join(', ') || '');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status || 'draft');
    const [submitStatus, setSubmitStatus] = useState<'draft' | 'published'>('draft'); // To track which button was clicked
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const gymData: any = {
                name,
                description,
                location,
                price_per_session: parseFloat(price),
                features: features.split(',').map(f => f.trim()).filter(f => f !== ''),
                images: selectedFiles,
                status: submitStatus,
                capacity: parseInt(capacity)
            };

            if (initialData) {
                await gymService.updateGym(initialData.id, gymData);
            } else {
                await gymService.createGym(gymData);
            }
            onSuccess();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to save gym');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-brand-dark-gray p-6 rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-4">{initialData ? 'Edit Gym' : 'Add New Gym'}</h3>
            {error && <div className="text-red-400 mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Gym Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-brand-yellow focus:outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-1">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-brand-yellow focus:outline-none"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Price per Session ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-brand-yellow focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Daily Capacity</label>
                        <input
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-brand-yellow focus:outline-none"
                            placeholder="10"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-brand-yellow focus:outline-none"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-1">Features (comma separated)</label>
                    <input
                        type="text"
                        value={features}
                        onChange={(e) => setFeatures(e.target.value)}
                        placeholder="Pool, Sauna, 24/7 Access"
                        className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-brand-yellow focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-1">Gym Images</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-gray-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-brand-yellow file:text-black hover:file:bg-yellow-400"
                    />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={() => setSubmitStatus('draft')}
                        className="px-4 py-2 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        Save as Draft
                    </button>
                    <button
                        type="submit"
                        onClick={() => setSubmitStatus('published')}
                        className="px-4 py-2 bg-brand-yellow text-black font-bold rounded hover:bg-yellow-400 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : (initialData && initialData.status === 'published' ? 'Update & Publish' : 'Publish')}
                    </button>
                </div>
            </form>
        </div>
    );
}
