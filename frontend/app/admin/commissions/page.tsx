
"use client";

import { useEffect, useState } from 'react';
import { getCommissions, createCommissionRule, updateCommissionRule, deleteCommissionRule } from '../../../services/adminService';

interface CommissionStats {
    total_commission: string;
    total_transactions: string;
    avg_commission: string;
}

interface CommissionRule {
    id: number;
    name: string;
    type: 'percentage' | 'fixed';
    value: string;
    is_default: boolean;
    created_at: string;
}

export default function CommissionsPage() {
    const [stats, setStats] = useState<CommissionStats | null>(null);
    const [rules, setRules] = useState<CommissionRule[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentRuleId, setCurrentRuleId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'percentage' as 'percentage' | 'fixed',
        value: '',
        is_default: false
    });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        fetchCommissions();
    }, []);

    const fetchCommissions = async () => {
        try {
            const data = await getCommissions();
            if (data.success) {
                setStats(data.stats);
                setRules(data.rules);
            }
        } catch (error) {
            console.error('Failed to fetch commissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'percentage',
            value: '',
            is_default: false
        });
        setIsEditing(false);
        setCurrentRuleId(null);
        setFormError('');
    };

    const handleEdit = (rule: CommissionRule) => {
        setFormData({
            name: rule.name,
            type: rule.type,
            value: rule.value,
            is_default: rule.is_default
        });
        setCurrentRuleId(rule.id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this rule?')) return;

        try {
            const res = await deleteCommissionRule(id);
            if (res.success) {
                setRules(rules.filter(r => r.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete rule:', error);
            alert('Failed to delete rule');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!formData.name || !formData.value) {
            setFormError('Please fill in all fields');
            return;
        }

        try {
            let res;
            if (isEditing && currentRuleId) {
                res = await updateCommissionRule(currentRuleId, formData);
            } else {
                res = await createCommissionRule(formData);
            }

            if (res.success) {
                resetForm();
                fetchCommissions(); // Refresh list to catch any default overrides
            } else {
                setFormError(res.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Submit error:', error);
            setFormError('An error occurred');
        }
    };

    const formatCurrency = (amount: string | number) => {
        if (!amount) return '0 XOF';
        return `${parseFloat(amount.toString()).toLocaleString()} XOF`;
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-white">Commissions Management</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
                    <p className="text-gray-400 text-sm font-medium mb-2">Total Commission Earned</p>
                    <p className="text-3xl font-bold text-green-400">{loading ? '...' : formatCurrency(stats?.total_commission || 0)}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
                    <p className="text-gray-400 text-sm font-medium mb-2">Total Transactions</p>
                    <p className="text-3xl font-bold text-white">{loading ? '...' : stats?.total_transactions || 0}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
                    <p className="text-gray-400 text-sm font-medium mb-2">Average Commission</p>
                    <p className="text-3xl font-bold text-blue-400">{loading ? '...' : formatCurrency(stats?.avg_commission || 0)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-24">
                        <h2 className="text-xl font-bold text-white mb-4">
                            {isEditing ? 'Edit Rule' : 'Add New Rule'}
                        </h2>

                        {formError && (
                            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded text-sm">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Rule Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2.5 text-white focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none"
                                    placeholder="e.g. Standard Commission"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2.5 text-white focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none"
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (XOF)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Value</label>
                                <input
                                    type="number"
                                    name="value"
                                    value={formData.value}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2.5 text-white focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none"
                                    placeholder={formData.type === 'percentage' ? 'e.g. 10' : 'e.g. 500'}
                                    step="0.01"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_default"
                                    id="is_default"
                                    checked={formData.is_default}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-brand-yellow bg-gray-900 border-gray-700 rounded focus:ring-brand-yellow"
                                />
                                <label htmlFor="is_default" className="ml-2 text-sm text-gray-300">
                                    Set as Default Rule
                                </label>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-brand-yellow text-black font-bold py-2 px-4 rounded hover:bg-yellow-400 transition-colors"
                                >
                                    {isEditing ? 'Update Rule' : 'Create Rule'}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
                        <div className="px-6 py-4 border-b border-gray-700">
                            <h2 className="text-xl font-bold text-white">Commission Rules</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Default</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-gray-400">Loading...</td>
                                        </tr>
                                    ) : rules.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-gray-400">No rules defined</td>
                                        </tr>
                                    ) : (
                                        rules.map((rule) => (
                                            <tr key={rule.id} className="hover:bg-gray-750 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                                                    {rule.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-300 capitalize">
                                                    {rule.type}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-brand-yellow font-bold">
                                                    {rule.type === 'percentage' ? `${rule.value}%` : formatCurrency(rule.value)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {rule.is_default ? (
                                                        <span className="px-2 py-0.5 text-xs font-bold bg-green-900 text-green-200 rounded-full border border-green-700">
                                                            Yes
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEdit(rule)}
                                                        className="text-brand-yellow hover:text-yellow-300 mr-4"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(rule.id)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
