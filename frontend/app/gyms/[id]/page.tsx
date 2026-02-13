"use client";

import { useEffect, useState } from 'react';
import { gymService } from '../../../services/gymService';
import { bookingService } from '../../../services/bookingService';
import { Gym } from '../../../types/gym';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import BookingModal from '../../../components/booking/BookingModal';

export default function GymDetailsPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [gym, setGym] = useState<Gym | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [availability, setAvailability] = useState<{ available: number; capacity: number } | null>(null);
    const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    useEffect(() => {
        const fetchGym = async () => {
            if (!id) return;
            try {
                const data = await gymService.getGymById(Number(id));
                setGym(data);
            } catch (err: any) {
                console.error("Failed to fetch gym", err);
                setError(err.response?.data?.message || 'Failed to load gym details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchGym();
    }, [id]);

    useEffect(() => {
        const checkAvailability = async () => {
            if (gym && selectedDate) {
                try {
                    const data = await bookingService.checkAvailability(gym.id, selectedDate);
                    setAvailability(data);
                } catch (error) {
                    console.error("Failed to check availability", error);
                }
            } else {
                setAvailability(null);
            }
        };

        checkAvailability();
    }, [gym, selectedDate]);

    const initiateBooking = () => {
        if (!gym || !selectedDate) return;
        setIsBookingModalOpen(true);
    };

    const handleConfirmBooking = async () => {
        if (!gym || !selectedDate) return;
        setBookingMessage({ type: '', text: '' });
        try {
            const data = await bookingService.createBooking(gym.id, selectedDate);
            if (data.payment_url) {
                window.location.href = data.payment_url;
            } else {
                setBookingMessage({ type: 'error', text: 'Payment initiation failed' });
            }
        } catch (err: any) {
            console.error(err);
            setBookingMessage({ type: 'error', text: err.response?.data?.message || 'Booking failed' });
            setIsBookingModalOpen(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-brand-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-yellow"></div>
            </div>
        );
    }

    if (error || !gym) {
        return (
            <div className="min-h-screen bg-brand-black flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
                    <p className="text-gray-400 mb-4">{error || 'Gym not found'}</p>
                    <Link href="/gyms" className="text-brand-yellow hover:underline">
                        &larr; Back to Gyms
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-black py-12 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-4xl mx-auto bg-brand-dark-gray rounded-lg shadow-xl overflow-hidden border border-gray-800">
                <div className="relative h-96 bg-gray-800">
                    {gym.images && gym.images.length > 0 ? (
                        <div className="h-full flex overflow-x-auto snap-x snap-mandatory">
                            {gym.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={`http://localhost:5000${img}`}
                                    alt={`${gym.name} ${idx + 1}`}
                                    className="w-full h-full object-cover flex-shrink-0 snap-center"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xl font-medium">
                            No Images Available
                        </div>
                    )}
                    <div className="absolute top-4 right-4 bg-brand-yellow text-black px-4 py-2 rounded font-bold shadow-lg text-lg">
                        ${gym.price_per_session}/session
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-extrabold text-white mb-2">{gym.name}</h1>
                            <p className="text-gray-400 flex items-center text-lg">
                                <svg className="w-5 h-5 mr-2 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {gym.location}
                            </p>
                        </div>
                        {user?.id === gym.owner_id && (
                            <Link href={`/gyms/${gym.id}/edit`} className="bg-brand-dark-gray border border-gray-600 text-gray-300 hover:text-white hover:border-brand-yellow px-4 py-2 rounded transition-colors">
                                Edit Gym Details
                            </Link>
                        )}
                    </div>

                    <div className="prose prose-invert max-w-none mb-8">
                        <h3 className="text-xl font-bold text-white mb-3">About this Gym</h3>
                        <p className="text-gray-400 whitespace-pre-wrap">{gym.description}</p>
                    </div>

                    <div className="mb-10">
                        <h3 className="text-xl font-bold text-white mb-4">Features & Amenities</h3>
                        <div className="flex flex-wrap gap-3">
                            {gym.features && gym.features.map((feature, idx) => (
                                <span key={idx} className="bg-black border border-gray-800 text-brand-yellow px-3 py-1 rounded-full text-sm font-medium">
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>

                    {user && user.role !== 'gym_owner' && (
                        <div className="border-t border-gray-800 pt-8">
                            <h3 className="text-2xl font-bold text-white mb-6">Book a Session</h3>

                            <div className="bg-black/50 p-6 rounded-lg border border-gray-800">
                                <div className="mb-6">
                                    <label className="block text-gray-300 mb-2 font-medium">Select Date</label>
                                    <input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full bg-brand-dark-gray border border-gray-700 rounded px-4 py-3 text-white focus:border-brand-yellow focus:outline-none"
                                    />
                                </div>

                                {selectedDate && (
                                    <div className="mb-6">
                                        {availability ? (
                                            <div className="flex items-center space-x-4">
                                                <div className={`text-lg font-bold ${availability.available > 0 ? 'text-green-400' : 'text-red-500'}`}>
                                                    {availability.available > 0
                                                        ? `${availability.available} slots available`
                                                        : 'Fully Booked'}
                                                </div>
                                                <div className="text-gray-500 text-sm">
                                                    (Capacity: {availability.capacity})
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-gray-400">Checking availability...</div>
                                        )}
                                    </div>
                                )}

                                {bookingMessage.text && (
                                    <div className={`p-4 rounded mb-4 ${bookingMessage.type === 'success' ? 'bg-green-900/50 text-green-400 border border-green-700' : 'bg-red-900/50 text-red-400 border border-red-700'}`}>
                                        {bookingMessage.text}
                                    </div>
                                )}

                                <button
                                    onClick={initiateBooking}
                                    disabled={!selectedDate || !availability || availability.available === 0}
                                    className="w-full bg-brand-yellow text-black py-4 rounded-lg font-bold text-xl hover:bg-yellow-400 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {availability && availability.available === 0 ? 'Fully Booked' : 'Book Session'}
                                </button>
                            </div>
                        </div>
                    )}

                    {!user && (
                        <div className="mt-10 border-t border-gray-800 pt-6 text-center">
                            <p className="text-gray-400 mb-4">Please login to book a session.</p>
                            <Link href="/login" className="inline-block bg-brand-yellow text-black px-6 py-3 rounded font-bold hover:bg-yellow-400 transition-colors">
                                Login to Book
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                onConfirm={handleConfirmBooking}
                gymName={gym.name}
                date={selectedDate}
                price={gym.price_per_session}
            />
        </div>
    );
}
