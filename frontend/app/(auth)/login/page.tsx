"use client";

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.data.success) {
                login(res.data.token, res.data.user);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-black text-white">
            <div className="bg-brand-dark-gray p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-800">
                <h2 className="text-3xl font-bold mb-6 text-brand-yellow text-center">Login</h2>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-colors"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-yellow text-black font-bold py-3 rounded hover:bg-yellow-400 transition-colors uppercase tracking-wide"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-brand-yellow hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
