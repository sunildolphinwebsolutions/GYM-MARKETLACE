"use client";

import { useRouter } from 'next/navigation';
import GymForm from '../../../components/gym/GymForm';
import { useAuth } from '../../../context/AuthContext';
import { useEffect } from 'react';

export default function NewGymPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'gym_owner')) {
            router.push('/dashboard');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-brand-black text-brand-yellow">Loading...</div>;
    }

    if (!user || user.role !== 'gym_owner') return null;

    return (
        <div className="min-h-screen bg-brand-black py-12 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-3xl mx-auto">
                <GymForm
                    onSuccess={() => router.push('/dashboard')}
                    onCancel={() => router.back()}
                />
            </div>
        </div>
    );
}
