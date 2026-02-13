
"use client";

import { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';
import { Booking } from '../../types/gym';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function MyBookingsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await bookingService.getUserBookings();
                setBookings(data);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchBookings();
        }
    }, [user]);

    const handleCancel = async (bookingId: number) => {
        if (confirm('Are you sure you want to cancel this booking?')) {
            try {
                await bookingService.cancelBooking(bookingId);
                // Refresh list
                const data = await bookingService.getUserBookings();
                setBookings(data);
            } catch (error) {
                console.error("Failed to cancel booking", error);
                alert("Failed to cancel booking");
            }
        }
    };

    const upcomingBookings = bookings.filter(b => new Date(b.booking_date) >= new Date(new Date().setHours(0, 0, 0, 0)) && b.status !== 'cancelled');
    const pastBookings = bookings.filter(b => new Date(b.booking_date) < new Date(new Date().setHours(0, 0, 0, 0)) || b.status === 'cancelled');

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-brand-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-yellow"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-brand-black flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 mb-4">Please login to view your bookings.</p>
                    <Link href="/login" className="inline-block bg-brand-yellow text-black px-6 py-3 rounded font-bold hover:bg-yellow-400 transition-colors">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-black py-12 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-white mb-8">My <span className="text-brand-yellow">Bookings</span></h1>

                <div className="mb-12">
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Upcoming Sessions</h2>
                    {upcomingBookings.length === 0 ? (
                        <p className="text-gray-400">No upcoming bookings.</p>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {upcomingBookings.map((booking: any) => (
                                <div key={booking.id} className="bg-brand-dark-gray border border-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col">
                                    <div className="h-32 bg-gray-700 relative">
                                        {booking.images && booking.images.length > 0 ? (
                                            <img src={`http://localhost:5000${booking.images[0]}`} alt={booking.gym_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-brand-yellow text-black text-xs font-bold px-2 py-1 rounded">
                                            {new Date(booking.booking_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-white mb-1">{booking.gym_name}</h3>
                                        <div className="mb-2">
                                            <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded ${booking.status === 'confirmed' ? 'bg-green-900/50 text-green-400' :
                                                booking.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' :
                                                    'bg-red-900/50 text-red-400'
                                                }`}>
                                                {booking.status === 'confirmed' ? 'Confirmed' :
                                                    booking.status === 'pending' ? 'Pending Verification' :
                                                        'Cancelled'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-4">{booking.location}</p>

                                        <div className="mt-auto flex justify-between items-center pt-2 border-t border-gray-700">
                                            <span className="text-brand-yellow font-bold">${booking.price_per_session}</span>
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Past & Cancelled</h2>
                    {pastBookings.length === 0 ? (
                        <p className="text-gray-400">No history found.</p>
                    ) : (
                        <div className="bg-brand-dark-gray rounded-lg overflow-hidden border border-gray-800">
                            <table className="w-full text-left">
                                <thead className="bg-gray-800 text-gray-300">
                                    <tr>
                                        <th className="px-6 py-3 text-sm font-medium">Date</th>
                                        <th className="px-6 py-3 text-sm font-medium">Gym</th>
                                        <th className="px-6 py-3 text-sm font-medium">Status</th>
                                        <th className="px-6 py-3 text-sm font-medium">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {pastBookings.map((booking: any) => (
                                        <tr key={booking.id} className="hover:bg-gray-700/50">
                                            <td className="px-6 py-4 text-gray-300 text-sm">
                                                {new Date(booking.booking_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-white font-medium">
                                                <Link href={`/gyms/${booking.gym_id}`} className="hover:text-brand-yellow">
                                                    {booking.gym_name}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-bold rounded ${booking.status === 'confirmed' ? 'bg-green-900/50 text-green-400' :
                                                    booking.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' :
                                                        'bg-red-900/50 text-red-400'
                                                    }`}>
                                                    {booking.status === 'confirmed' ? 'Completed' :
                                                        booking.status === 'pending' ? 'Pending' :
                                                            booking.status === 'cancelled' ? 'Cancelled' : booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                ${booking.price_per_session}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
