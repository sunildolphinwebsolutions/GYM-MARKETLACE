"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { bookingService } from '../../../services/bookingService';
import Link from 'next/link';

function PaymentCallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [message, setMessage] = useState('Verifying payment...');

    useEffect(() => {
        const verifyPayment = async () => {
            const bookingId = searchParams.get('booking_id');
            const transactionId = searchParams.get('id'); // FedaPay sends transaction ID as 'id'
            const statusParam = searchParams.get('status');

            if (!bookingId || !transactionId) {
                setStatus('error');
                setMessage('Invalid payment callback parameters.');
                return;
            }

            if (statusParam && statusParam !== 'approved') {
                setStatus('error');
                setMessage('Payment was not approved.');
                return;
            }

            try {
                // Determine transaction ID to use (FedaPay might send it differently)
                // If FedaPay sends ?id=... use that.

                await bookingService.confirmPayment(Number(bookingId), transactionId);
                setStatus('success');
                setMessage('Payment confirmed! Redirecting to your bookings...');
                setTimeout(() => {
                    router.push('/bookings');
                }, 3000);
            } catch (err: any) {
                console.error(err);
                setStatus('error');
                setMessage(err.response?.data?.message || 'Payment verification failed.');
            }
        };

        verifyPayment();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
            <div className="bg-brand-dark-gray p-8 rounded-xl shadow-2xl max-w-md w-full text-center border border-gray-800">
                {status === 'processing' && (
                    <>
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-yellow mx-auto mb-6"></div>
                        <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment</h2>
                        <p className="text-gray-400">{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="bg-green-900/50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6 border border-green-500">
                            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                        <p className="text-gray-400 mb-6">{message}</p>
                        <Link href="/bookings" className="inline-block bg-brand-yellow text-black px-6 py-3 rounded font-bold hover:bg-yellow-400 transition-colors">
                            View My Bookings
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="bg-red-900/50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6 border border-red-500">
                            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Payment Failed</h2>
                        <p className="text-red-400 mb-6">{message}</p>
                        <Link href="/gyms" className="inline-block bg-gray-700 text-white px-6 py-3 rounded font-bold hover:bg-gray-600 transition-colors">
                            Return to Gyms
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default function PaymentCallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-brand-black flex items-center justify-center text-white">Loading...</div>}>
            <PaymentCallbackContent />
        </Suspense>
    );
}
