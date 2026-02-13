import { useEffect, useState } from 'react';
import DashboardCard from '../../components/dashboard/DashboardCard';
import StatCard from '../../components/dashboard/StatCard';
import { gymService } from '../../services/gymService';
import OwnerBookingRequests from './OwnerBookingRequests';
import RevenueChart from '../../components/dashboard/RevenueChart';
import StatusChart from '../../components/dashboard/StatusChart';

interface OwnerViewProps {
    user: any;
}

export default function OwnerView({ user }: OwnerViewProps) {
    const [stats, setStats] = useState({
        totalGyms: 0,
        activePasses: 0,
        totalRevenue: 0,
        avgRating: 0
    });

    const [chartData, setChartData] = useState({
        revenueData: [],
        statusData: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, dashboardStats] = await Promise.all([
                    gymService.getOwnerStats(),
                    gymService.getDashboardStats()
                ]);
                setStats(statsData);
                setChartData({
                    revenueData: dashboardStats.revenueData,
                    statusData: dashboardStats.statusData
                });
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Dashboard for <span className="text-brand-yellow">{user.name}</span></h2>
                <DashboardCard
                    title=""
                    description=""
                    actionText="Add New Gym"
                    actionLink="/dashboard/my-gyms"
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Gyms" value={stats.totalGyms.toString()} />
                <StatCard label="Active Passes" value={stats.activePasses.toString()} />
                <StatCard label="Total Revenue" value={`$${stats.totalRevenue}`} />
                <StatCard label="Avg. Rating" value={stats.avgRating > 0 ? stats.avgRating.toString() : "-"} />
            </div>

            {/* PENDING BOOKINGS SECTION */}
            <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    Booking Requests
                    <span className="ml-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">New</span>
                </h3>
                <OwnerBookingRequests />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2">
                    <RevenueChart data={chartData.revenueData} />
                </div>
                <div>
                    <StatusChart data={chartData.statusData} />
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                    title="Visitor Analytics"
                    description="See who is visiting your gym and when."
                    actionText="View Analytics"
                    actionLink="/analytics"
                />
            </div>
        </div>
    );
}
