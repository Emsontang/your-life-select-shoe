import React, { useState } from 'react';
import { Package, MessageSquare, ChevronRight, Settings, CreditCard, Heart, PenSquare } from 'lucide-react';

export const MobileProfile: React.FC = () => {
    const [showFeedback, setShowFeedback] = useState(false);

    return (
        <div className="bg-background min-h-screen pb-24">
            {/* Header */}
            <div className="bg-stone pt-12 pb-8 px-6 rounded-b-[3rem] shadow-sm">
                <div className="flex justify-end mb-4">
                    <Settings className="text-gray-500" size={20} />
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden border-2 border-white shadow-md">
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-text">Antigravity User</h2>
                        <p className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full inline-block mt-1">普通会员</p>
                    </div>
                </div>

                {/* Order Stats Row */}
                <div className="flex justify-between mt-8 px-4 text-center">
                    <div><div className="font-bold text-lg">12</div><div className="text-[10px] text-gray-500 uppercase">收藏</div></div>
                    <div><div className="font-bold text-lg">2</div><div className="text-[10px] text-gray-500 uppercase">关注</div></div>
                    <div><div className="font-bold text-lg">5</div><div className="text-[10px] text-gray-500 uppercase">足迹</div></div>
                    <div><div className="font-bold text-lg">1</div><div className="text-[10px] text-gray-500 uppercase">卡券</div></div>
                </div>
            </div>

            {/* Order Status */}
            <div className="px-4 -mt-6">
                <div className="bg-white rounded-xl shadow-sm p-4 border border-stone/50">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                        <h3 className="font-bold text-sm">我的订单</h3>
                        <span className="text-xs text-gray-400 flex items-center">全部 <ChevronRight size={12} /></span>
                    </div>
                    <div className="flex justify-around">
                        <StatusItem icon={<CreditCard size={20} />} label="待付款" />
                        <StatusItem icon={<Package size={20} />} label="待发货" badge={1} />
                        <StatusItem icon={<Package size={20} />} label="待收货" />
                        <StatusItem icon={<MessageSquare size={20} />} label="待收货" />
                    </div>
                </div>
            </div>

            {/* Menu List */}
            <div className="px-4 mt-6 space-y-3">
                <MenuItem
                    icon={<PenSquare size={20} />}
                    label="发布笔记"
                    onClick={() => {
                        const title = prompt("请输入笔记标题");
                        if (title) alert(`模拟发布成功：${title}`);
                    }}
                />
                <MenuItem icon={<Heart size={20} />} label="我的收藏" />
                <MenuItem icon={<MessageSquare size={20} />} label="意见反馈" onClick={() => setShowFeedback(true)} />
                <MenuItem icon={<Settings size={20} />} label="设置" />
            </div>

            {/* Feedback Modal */}
            {showFeedback && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFeedback(false)}></div>
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 relative z-10 shadow-xl animate-in fade-in zoom-in duration-200">
                        <h3 className="font-bold text-lg mb-2">意见反馈</h3>
                        <p className="text-sm text-gray-500 mb-4">您的建议是我们进步的动力</p>
                        <textarea
                            className="w-full bg-gray-50 rounded-xl p-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="请输入您的反馈..."
                        ></textarea>
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setShowFeedback(false)} className="flex-1 py-2 text-gray-500 text-sm">取消</button>
                            <button onClick={() => { setShowFeedback(false); alert('感谢您的反馈！'); }} className="flex-1 py-2 bg-text text-white rounded-xl text-sm font-bold">提交</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatusItem = ({ icon, label, badge }: { icon: any, label: string, badge?: number }) => (
    <div className="flex flex-col items-center gap-2 relative">
        <div className="text-gray-600">{icon}</div>
        <span className="text-xs text-gray-500">{label}</span>
        {badge && (
            <span className="absolute -top-1 right-0 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                {badge}
            </span>
        )}
    </div>
)

const MenuItem = ({ icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
    <button onClick={onClick} className="w-full bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-stone/30 hover:bg-stone/50 transition-colors">
        <div className="flex items-center gap-3 text-gray-700">
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </div>
        <ChevronRight size={16} className="text-gray-400" />
    </button>
)
