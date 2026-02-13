"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
    data: { name: string; revenue: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
    // Use prop data if available, or empty array (or loading state) if not
    const chartData = data && data.length > 0 ? data : [];
    return (
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Total Revenue</h3>
                <button className="flex items-center text-sm text-gray-400 hover:text-white border border-gray-700 rounded px-3 py-1 transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filter
                </button>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FCD34D" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#FCD34D" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                        <XAxis
                            dataKey="name"
                            stroke="#9CA3AF"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#111827',
                                borderColor: '#374151',
                                color: '#F3F4F6',
                                borderRadius: '0.5rem',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                            }}
                            itemStyle={{ color: '#FCD34D' }}
                            formatter={(value) => [`$${value}`, 'Revenue']}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#FCD34D"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
