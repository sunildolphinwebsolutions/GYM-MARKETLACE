"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface StatusChartProps {
    data: { name: string; value: number }[];
}

const COLORS = ['#10B981', '#FBBF24', '#EF4444']; // Emerald, Amber, Red

export default function StatusChart({ data }: StatusChartProps) {
    const chartData = data && data.length > 0 ? data : [
        { name: 'Completed', value: 0 },
        { name: 'Pending', value: 0 },
        { name: 'Cancelled', value: 0 },
    ];
    const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-xl font-bold text-white mb-6 pl-2">Booking Status</h3>

            <div className="flex-1 w-full relative min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={5}
                            cornerRadius={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            cursor={false}
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                borderColor: '#374151',
                                color: '#F3F4F6',
                                borderRadius: '0.75rem'
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            height={36}
                            iconType="circle"
                            iconSize={8}
                            formatter={(value) => (
                                <span className="text-gray-300 ml-2 text-sm">{value}</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none -mt-4">
                    <div className="text-3xl font-extrabold text-white">
                        {total}
                    </div>
                </div>
            </div>
        </div>
    );
}
