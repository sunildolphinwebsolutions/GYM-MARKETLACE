"use client";

import HeroSection from "../components/landing/HeroSection";
import FeatureSection from "../components/landing/FeatureSection";
import CTASection from "../components/landing/CTASection";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            router.push("/dashboard");
        }
    }, [user, isLoading, router]);

    return (
        <main className="min-h-screen bg-brand-black">
            <HeroSection />
            <FeatureSection />
            <CTASection />

            {/* Footer */}
            <footer className="bg-brand-dark-gray border-t border-gray-800 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Gym Access Marketplace. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}
