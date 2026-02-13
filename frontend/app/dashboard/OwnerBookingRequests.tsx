
import { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';
import { Booking } from '../../types/gym';

export default function OwnerBookingRequests() {
    const [requests, setRequests] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const data = await bookingService.getOwnerBookings(); // Need to implement this
            // Filter only pending
            setRequests(data.filter((b: any) => b.status === 'pending'));
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleVerify = async (id: number) => {
        try {
            await bookingService.verifyBooking(id);
            // Refresh
            fetchRequests();
        } catch (error) {
            console.error("Verification failed", error);
            alert("Failed to verify booking");
        }
    };

    const handleReject = async (id: number) => {
        if (confirm("Reject this payment?")) {
            try {
                await bookingService.rejectBooking(id);
                fetchRequests();
            } catch (error) {
                console.error("Rejection failed", error);
            }
        }
    };

    if (isLoading) return <div className="text-gray-400">Loading requests...</div>;

    if (requests.length === 0) {
        return <div className="text-gray-500 bg-gray-900 border border-gray-800 p-4 rounded-lg">No pending booking requests.</div>;
    }

    return (
        <div className="bg-brand-dark-gray border border-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-800 text-gray-300">
                    <tr>
                        <th className="px-4 py-3 text-sm font-medium">Date</th>
                        <th className="px-4 py-3 text-sm font-medium">Gym</th>
                        <th className="px-4 py-3 text-sm font-medium">Ref ID</th>
                        <th className="px-4 py-3 text-sm font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {requests.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-700/50">
                            <td className="px-4 py-3 text-gray-300 text-sm">
                                {new Date(req.booking_date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-white font-medium text-sm">
                                {req.gym_name || `Gym #${req.gym_id}`}
                            </td>
                            <td className="px-4 py-3 text-brand-yellow font-mono text-sm tracking-wider">
                                {req.payment_reference_id || 'N/A'}
                            </td>
                            <td className="px-4 py-3 flex space-x-2">
                                <button
                                    onClick={() => handleVerify(req.id)}
                                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(req.id)}
                                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                                >
                                    Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
