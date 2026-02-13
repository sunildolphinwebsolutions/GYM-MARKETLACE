"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import GymForm from '../../../../components/gym/GymForm';
import { useAuth } from '../../../../context/AuthContext';
import { gymService } from '../../../../services/gymService';
import { Gym } from '../../../../types/gym';

export default function EditGymPage() {
    const router = useRouter();
    const { id } = useParams();
    const { user, isLoading: authLoading } = useAuth();
    const [gym, setGym] = useState<Gym | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
                return;
            }
            fetchGym();
        }
    }, [user, authLoading, id, router]);

    const fetchGym = async () => {
        try {
            const data = await gymService.getGymById(Number(id));
            if (user?.id !== data.owner_id) {
                router.push('/dashboard'); // Unauthorized
                return;
            }
            setGym(data);
        } catch (error) {
            console.error("Failed to fetch gym", error);
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return <div className="min-h-screen flex items-center justify-center bg-brand-black text-brand-yellow">Loading...</div>;
    }

    if (!gym) return null;

    return (
        <div className="min-h-screen bg-brand-black py-12 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-3xl mx-auto">
                <GymForm
                    initialData={gym}
                    onSuccess={() => router.push(`/gyms/${id}`)}
                    onCancel={() => router.back()}
                />
            </div>
        </div>
    );
}
