"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService, UserProfile } from '../../services/userService';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user, login } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const data = await userService.getProfile();
                setProfile(data);
                setName(data.name);
                setEmail(data.email);
            } catch (err) {
                console.error('Failed to fetch profile', err);
                setMessage({ type: 'error', text: 'Failed to load profile' });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const updatedUser = await userService.updateProfile({ name, email });
            setProfile(updatedUser);

            // Update auth context if needed (optional, depends on if context stores full user object)
            // Assuming login function updates state without needing a new token
            const token = localStorage.getItem('token');
            if (token) {
                login(token, updatedUser);
            }

            setMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (err: any) {
            console.error('Failed to update profile', err);
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-brand-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-yellow"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-black py-12 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-md mx-auto bg-brand-dark-gray rounded-lg shadow-md overflow-hidden border border-gray-800">
                <div className="bg-brand-yellow py-4 px-6">
                    <h2 className="text-xl font-bold text-black">My Profile</h2>
                </div>

                <div className="p-6">
                    {message && (
                        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-900/50 text-green-200 border border-green-800' : 'bg-red-900/50 text-red-200 border border-red-800'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-400 font-medium mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:border-brand-yellow"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-400 font-medium mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:border-brand-yellow"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-400 font-medium mb-2">Role</label>
                            <div className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-500 capitalize">
                                {profile?.role.replace('_', ' ')}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Role cannot be changed.</p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className={`px-4 py-2 bg-brand-yellow text-black font-bold rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
