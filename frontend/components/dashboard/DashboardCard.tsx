import Link from 'next/link';

interface DashboardCardProps {
    title: string;
    description: string;
    actionText: string;
    actionLink: string;
}

export default function DashboardCard({ title, description, actionText, actionLink }: DashboardCardProps) {
    return (
        <div className="bg-brand-dark-gray border border-gray-800 rounded-lg p-6 hover:border-brand-yellow transition-all duration-300 shadow-lg group">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-yellow transition-colors">{title}</h3>
            <p className="text-gray-400 mb-6 h-12">{description}</p>
            <Link href={actionLink} className="inline-block bg-brand-yellow text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400 transition-colors uppercase text-sm tracking-wide">
                {actionText}
            </Link>
        </div>
    );
}
