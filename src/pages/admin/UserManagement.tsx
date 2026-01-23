import React, { useState, useEffect } from 'react';
import { useMockData } from '../../context/MockDataContext';
import { User, CreditCard, Calendar, RefreshCw, Zap } from 'lucide-react';

export const AdminUserManagement: React.FC = () => {
    const { userProfile, updateUserSpend, simulateYearPass } = useMockData();

    // Local state for editing form
    const [lifetime, setLifetime] = useState(userProfile.lifetimeSpend);
    const [annual, setAnnual] = useState(userProfile.annualSpend);

    // Sync local state when external profile changes
    useEffect(() => {
        setLifetime(userProfile.lifetimeSpend);
        setAnnual(userProfile.annualSpend);
    }, [userProfile]);

    const handleSave = () => {
        updateUserSpend(Number(lifetime), Number(annual));
        alert('用户数据已更新 / User data updated');
    };

    const handleSimulateYear = () => {
        if (confirm('确定要模拟一年过去吗？这将触发会员降级逻辑。\nAre you sure to simulate one year passing?')) {
            simulateYearPass();
        }
    };

    // Helper to get color for tier
    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'god': return 'bg-black text-yellow-500 border-yellow-500';
            case 'manager_l2': return 'bg-purple-600 text-white';
            case 'manager_l1': return 'bg-blue-600 text-white';
            default: return 'bg-gray-400 text-white';
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Zap className="text-yellow-500" />
                用户管理 (God Mode)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Controller Panel */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-gray-700">数据控制台</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Lifetime Spend (累计消费)</label>
                            <div className="flex gap-2">
                                <span className="bg-gray-100 px-3 py-2 rounded-lg text-gray-500">¥</span>
                                <input
                                    type="number"
                                    value={lifetime}
                                    onChange={e => setLifetime(Number(e.target.value))}
                                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 font-mono"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">决定是否脱离新人身份 (Threshold: ¥500)</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Annual Spend (本年消费)</label>
                            <div className="flex gap-2">
                                <span className="bg-gray-100 px-3 py-2 rounded-lg text-gray-500">¥</span>
                                <input
                                    type="number"
                                    value={annual}
                                    onChange={e => setAnnual(Number(e.target.value))}
                                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 font-mono"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">决定具体等级 (Lv1 -&gt; Lv2/God)</p>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
                        >
                            立即生效 / Apply Changes
                        </button>

                        <div className="pt-4 border-t border-gray-100 mt-4">
                            <button
                                onClick={handleSimulateYear}
                                className="w-full flex items-center justify-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 font-bold py-3 rounded-xl transition-colors"
                            >
                                <RefreshCw size={18} />
                                模拟一年后过期 (Simulate Expiry)
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Live Preview Panel */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-4 text-gray-700">实时预览</h3>

                        {/* Member Card Preview */}
                        <div className={`aspect-[1.6] rounded-2xl p-6 relative overflow-hidden shadow-2xl transition-all duration-500 ${getTierColor(userProfile.tier)}`}>
                            {/* Texture */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-white/80 text-sm tracking-wider uppercase">LifeSelect Member</p>
                                        <h2 className="text-2xl font-bold mt-1 capitalize">{userProfile.tier.replace('_', ' ')}</h2>
                                    </div>
                                    <User className="bg-white/20 p-1.5 rounded-full w-10 h-10" />
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-2 opacity-90">
                                        <span>No. {userProfile.id}</span>
                                        <span>Pts: {userProfile.points}</span>
                                    </div>
                                    <div className="h-1 bg-black/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white/80 w-[60%]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Grid */}
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2 text-gray-400 mb-1">
                                    <CreditCard size={14} />
                                    <span className="text-xs">Current Discount</span>
                                </div>
                                <div className="text-xl font-bold text-gray-800">
                                    {userProfile.tier === 'resident' ? 'No Discount' :
                                        userProfile.tier === 'manager_l1' ? '5% OFF' :
                                            userProfile.tier === 'manager_l2' ? '10% OFF' : '20% OFF'}
                                </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2 text-gray-400 mb-1">
                                    <Calendar size={14} />
                                    <span className="text-xs">Expiry Date</span>
                                </div>
                                <div className="text-lg font-bold text-gray-800 truncate">
                                    {userProfile.expiryDate ? new Date(userProfile.expiryDate).toLocaleDateString() : 'Permanent'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
