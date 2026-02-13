import DashboardCard from '../../components/dashboard/DashboardCard';
import StatCard from '../../components/dashboard/StatCard';

interface UserViewProps {
    user: any;
}

export default function UserView({ user }: UserViewProps) {

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Welcome back, <span className="text-brand-yellow">{user.name}</span></h2>
                <div className="flex space-x-4">
                    <StatCard label="Active Passes" value="0" />
                    <StatCard label="Completed Workouts" value="0" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                    title="Find a Gym"
                    description="Browse top-rated gyms near you and purchase a pass instantly."
                    actionText="Browse Gyms"
                    actionLink="/gyms"
                />



                <DashboardCard
                    title="My Passes"
                    description="View your active and upcoming gym passes."
                    actionText="View Passes"
                    actionLink="/my-passes"
                />
                <DashboardCard
                    title="Workout History"
                    description="Track your gym visits and workout progress."
                    actionText="View History"
                    actionLink="/history"
                />
            </div>
        </div>
    );
}
