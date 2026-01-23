import React, { useState } from 'react';
import { useMockData, type Coupon } from '../../context/MockDataContext';
import { Tag, Send, Users, Plus } from 'lucide-react';

export const AdminMarketingOps: React.FC = () => {
    const { coupons, pushCoupon } = useMockData();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handlePushAll = (coupon: Coupon) => {
        if (confirm(`确定要向全量用户推送 "${coupon.title}" 吗？`)) {
            // In a real app this would call an API
            alert('Push notification sent to all users!');
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
                        <Tag className="text-primary" />
                        营销配置 (Marketing Ops)
                    </h2>
                    <p className="text-gray-500">管理优惠券模板及推送策略</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                    <Plus size={18} />
                    新建优惠券
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map(coupon => (
                    <div key={coupon.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            Active
                        </div>

                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{coupon.title}</h3>
                            <p className="text-sm text-gray-500">{coupon.desc}</p>
                        </div>

                        <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-3xl font-bold text-primary">
                                {coupon.type === 'cash_off' ? `¥${coupon.value}` : `${coupon.value * 10}折`}
                            </span>
                            <span className="text-xs text-gray-400">
                                门槛: ¥{coupon.minSpend}
                            </span>
                        </div>

                        {/* Audience Info */}
                        <div className="text-xs text-gray-400 mb-6 flex gap-2">
                            <Users size={14} />
                            {coupon.targetTier?.length ? `限: ${coupon.targetTier.join(', ')}` : '全员可用'}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePushAll(coupon)}
                                className="flex-1 bg-gray-50 hover:bg-primary hover:text-white text-gray-600 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                <Send size={16} />
                                全员推送
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-xl text-gray-800">新建优惠券</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="bg-gray-100 p-1 rounded-full hover:bg-gray-200 transition-colors">
                                <Plus size={20} className="rotate-45 text-gray-600" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">优惠券名称</label>
                                <input id="c_title" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. 新人见面礼" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">描述文案</label>
                                <input id="c_desc" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. 仅限首单使用" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
                                    <select id="c_type" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none">
                                        <option value="cash_off">满减券 (Cash Off)</option>
                                        <option value="percent_off">折扣券 (Percent Off)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">面额 / 折扣</label>
                                    <input id="c_value" type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" placeholder="50 or 0.88" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">使用门槛 (Min Spend)</label>
                                <input id="c_min" type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" placeholder="0" defaultValue="0" />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={() => {
                                        const title = (document.getElementById('c_title') as HTMLInputElement).value;
                                        const desc = (document.getElementById('c_desc') as HTMLInputElement).value;
                                        const type = (document.getElementById('c_type') as HTMLSelectElement).value as any;
                                        const value = Number((document.getElementById('c_value') as HTMLInputElement).value);
                                        const minSpend = Number((document.getElementById('c_min') as HTMLInputElement).value);

                                        if (!title || !value) {
                                            alert('请填写完整信息');
                                            return;
                                        }

                                        pushCoupon({
                                            id: `c_${Date.now()}`,
                                            title,
                                            desc,
                                            type,
                                            value,
                                            minSpend,
                                            status: 'active'
                                        });

                                        setIsCreateModalOpen(false);
                                        alert('优惠券创建成功并已入库！');
                                    }}
                                    className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:brightness-110 active:scale-95 transition-all"
                                >
                                    确认创建
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
