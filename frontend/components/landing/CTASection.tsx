import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';

export default function CTASection() {
    const { user } = useAuth();
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/img/brett-jordan-U2q73PfHFpM-unsplash.jpg"
                    alt="Start Your Journey"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="brightness-25"
                />
                <div className="absolute inset-0 bg-brand-yellow/10 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase">
                    Your Fitness Journey <span className="text-brand-yellow">Starts Here</span>
                </h2>
                <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
                    Stop making excuses and start making progress. With access to the best gyms in your city, there's nothing holding you back.
                </p>
                {user ? (
                    <Link
                        href="/dashboard"
                        className="inline-block bg-brand-yellow text-black font-bold text-lg py-4 px-12 rounded hover:bg-yellow-400 transition-transform transform hover:scale-105 uppercase tracking-wide shadow-lg"
                    >
                        Go to Dashboard
                    </Link>
                ) : (
                    <Link
                        href="/register"
                        className="inline-block bg-brand-yellow text-black font-bold text-lg py-4 px-12 rounded hover:bg-yellow-400 transition-transform transform hover:scale-105 uppercase tracking-wide shadow-lg"
                    >
                        Join Now
                    </Link>
                )}
            </div>
        </section>
    );
}
