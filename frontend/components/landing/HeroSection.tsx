import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';

export default function HeroSection() {
    const { user } = useAuth();

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/img/risen-wang-20jX9b35r_M-unsplash.jpg"
                    alt="High-end Gym Interior"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                    className="brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-black/30"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 max-w-5xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
                    UNLOCKACCESS TO <br />
                    <span className="text-brand-yellow">TOP GYMS</span> NEAR YOU
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl font-light">
                    Pay per visit. No contracts. Just train. <br />
                    Experience the freedom of fitness on your terms.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    {user ? (
                        <Link
                            href="/dashboard"
                            className="bg-brand-yellow text-black font-bold text-lg py-4 px-10 rounded hover:bg-yellow-400 transition-transform transform hover:scale-105 uppercase tracking-wide shadow-lg shadow-yellow-900/20"
                        >
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/register"
                                className="bg-brand-yellow text-black font-bold text-lg py-4 px-10 rounded hover:bg-yellow-400 transition-transform transform hover:scale-105 uppercase tracking-wide shadow-lg shadow-yellow-900/20"
                            >
                                Get Started
                            </Link>
                            <Link
                                href="/login"
                                className="bg-transparent border-2 border-white text-white font-bold text-lg py-4 px-10 rounded hover:bg-white hover:text-black transition-colors uppercase tracking-wide"
                            >
                                Member Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
