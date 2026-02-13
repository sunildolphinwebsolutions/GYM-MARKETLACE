"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { gymService } from '../../services/gymService';
import { Gym } from '../../types/gym';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserView from './UserView';
import OwnerView from './OwnerView';

export default function Dashboard() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-black flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-yellow"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-brand-black">
            <div className="max-w-7xl mx-auto">
                {user.role === 'gym_owner' ? (
                    <OwnerView user={user} />
                ) : (
                    <UserView user={user} />
                )}
            </div>
        </div>
    );
}
