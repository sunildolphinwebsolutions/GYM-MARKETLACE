"use client";

import { useState } from 'react';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    gymName: string;
    date: string;
    price: number;
}

export default function BookingModal({ isOpen, onClose, onConfirm, gymName, date, price }: BookingModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsProcessing(true);
        await onConfirm();
        setIsProcessing(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-brand-dark-gray border border-gray-700 rounded-xl max-w-md w-full p-6 shadow-2xl relative animate-fadeIn">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold text-white mb-6 text-center">Confirm Booking</h2>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Gym</span>
                        <span className="text-white font-medium">{gymName}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Date</span>
                        <span className="text-white font-medium">{date}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-400">Total Price</span>
                        <span className="text-2xl font-bold text-brand-yellow">${price}</span>
                    </div>
                </div>

                <div className="alert bg-gray-800 border-l-4 border-brand-yellow p-4 mb-6 rounded">
                    <p className="text-sm text-gray-300">
                        You will be redirected to <strong>FedaPay</strong> to complete your secure payment.
                    </p>
                </div>

                <button
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    className="w-full bg-brand-yellow text-black py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-all shadow-lg flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Redirecting...
                        </>
                    ) : (
                        'Pay with FedaPay'
                    )}
                </button>
            </div>
        </div>
    );
}
