import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Gym Access Marketplace",
    description: "Find and book gym passes",
};

import { AuthProvider } from "../context/AuthContext";
import UserSidebar from "../components/UserSidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <Navbar />
                    <UserSidebar />
                    <main className="min-h-screen bg-brand-black">
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}
