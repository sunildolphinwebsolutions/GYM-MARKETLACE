interface StatCardProps {
    label: string;
    value: string | number;
}

export default function StatCard({ label, value }: StatCardProps) {
    return (
        <div className="bg-brand-dark-gray border border-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">{label}</p>
            <p className="text-3xl font-bold text-brand-yellow">{value}</p>
        </div>
    );
}
