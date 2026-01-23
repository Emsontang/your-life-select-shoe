import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMockData, type MemberTier } from '../../context/MockDataContext';
import { Package, MessageSquare, ChevronRight, Settings, CreditCard, Heart, PenSquare, ArrowUpCircle, Truck } from 'lucide-react';

export const MobileProfile: React.FC = () => {
    const { userProfile } = useMockData();
    const navigate = useNavigate();
    const [isFlipped, setIsFlipped] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    // Dynamic Card Styling
    const getCardStyle = (tier: MemberTier) => {
        switch (tier) {
            case 'god': return 'bg-gradient-to-br from-gray-900 via-stone-800 to-black text-amber-100 border-amber-500/30';
            case 'manager_l2': return 'bg-gradient-to-br from-purple-800 to-indigo-900 text-purple-100 border-purple-500/30';
            case 'manager_l1': return 'bg-gradient-to-br from-blue-600 to-sky-700 text-blue-50 border-blue-400/30';
            default: return 'bg-gradient-to-br from-gray-400 to-stone-500 text-white border-white/20';
        }
    };

    const getTierLabel = (tier: MemberTier) => {
        const map: Record<string, string> = {
            god: '空间之神 (GOD)',
            manager_l2: '空间主理人 Lv2',
            manager_l1: '空间主理人 Lv1',
            resident: '居家新人'
        };
        return map[tier];
    };

    const nextTierTarget = userProfile.tier === 'resident' ? 500 :
        userProfile.tier === 'manager_l1' ? 1000 :
            userProfile.tier === 'manager_l2' ? 2000 : null; // God has no next target

    const progressPercent = nextTierTarget
        ? Math.min(100, (userProfile.annualSpend / nextTierTarget) * 100)
        : 100;

    return (
        <div className="bg-background min-h-screen pb-24">
            {/* Header / Member Card Area */}
            <div className="bg-stone pt-12 pb-16 px-6 rounded-b-[3rem] shadow-sm overflow-hidden relative">
                <div className="flex justify-end mb-4 relative z-10">
                    <Settings className="text-gray-500" size={20} />
                </div>

                {/* 3D Flip Container */}
                <div className="perspective-1000 group h-56 w-full cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                    <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                        {/* Front Face */}
                        <div className={`absolute inset-0 backface-hidden rounded-2xl p-6 shadow-xl border ${getCardStyle(userProfile.tier)} flex flex-col justify-between overflow-hidden`}>
                            {/* Abstract Texture */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />

                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full border-2 border-white/30 overflow-hidden bg-white/10 backdrop-blur">
                                        <img src={userProfile.avatar} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg leading-tight">{userProfile.name}</h2>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur`}>
                                            {getTierLabel(userProfile.tier)}
                                        </span>
                                    </div>
                                </div>
                                <CreditCard className="text-white/50" />
                            </div>

                            <div className="relative z-10">
                                {nextTierTarget ? (
                                    <>
                                        <div className="flex justify-between text-xs mb-1 opacity-90 font-medium">
                                            <span>成长值</span>
                                            <span>{userProfile.annualSpend} / {nextTierTarget}</span>
                                        </div>
                                        <div className="h-1.5 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                                            <div style={{ width: `${progressPercent}%` }} className="h-full bg-white/90 rounded-full transition-all duration-1000 ease-out" />
                                        </div>
                                        <p className="text-[10px] mt-2 opacity-75">再消费 ¥{nextTierTarget - userProfile.annualSpend} 即可升级权益</p>
                                    </>
                                ) : (
                                    <div className="text-center py-2">
                                        <p className="font-serif italic text-lg opacity-90">Supreme Member</p>
                                        <p className="text-[10px] opacity-60">您已是尊贵的最高等级会员</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Back Face */}
                        <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-6 shadow-xl bg-gray-900 text-white flex flex-col justify-between overflow-hidden`}>
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <ArrowUpCircle size={18} className="text-primary" />
                                    当前权益
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">购物折扣</span>
                                        <span className="font-bold text-lg">
                                            {userProfile.tier === 'god' ? '8折' :
                                                userProfile.tier === 'manager_l2' ? '9折' :
                                                    userProfile.tier === 'manager_l1' ? '95折' : '原价'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">会员有效期</span>
                                        <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">
                                            {userProfile.expiryDate ? new Date(userProfile.expiryDate).toLocaleDateString() : '永久有效'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-center text-[10px] text-gray-500 mt-2">点击卡片翻转回正面</p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Order Status */}
            <div className="px-4 -mt-8 relative z-20">
                <div className="bg-white rounded-xl shadow-lg p-5">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                        <h3 className="font-bold text-sm text-gray-800">我的订单</h3>
                        <span onClick={() => navigate('/app/orders')} className="text-xs text-gray-400 flex items-center cursor-pointer">全部 <ChevronRight size={12} /></span>
                    </div>
                    <div className="flex justify-around">
                        <StatusItem icon={<CreditCard size={24} />} label="待付款" onClick={() => navigate('/app/orders?status=unpaid')} />
                        <StatusItem icon={<Package size={24} />} label="待发货" badge={1} onClick={() => navigate('/app/orders?status=pending_shipment')} />
                        <StatusItem icon={<Truck size={24} />} label="待收货" onClick={() => navigate('/app/orders?status=shipped')} />
                        <StatusItem icon={<MessageSquare size={24} />} label="评价" onClick={() => navigate('/app/orders?status=completed')} />
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

const StatusItem = ({ icon, label, badge, onClick }: { icon: any, label: string, badge?: number, onClick?: () => void }) => (
    <div className="flex flex-col items-center gap-2 relative group cursor-pointer" onClick={onClick}>
        <div className="text-gray-400 group-hover:text-primary transition-colors">{icon}</div>
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        {badge && (
            <span className="absolute -top-2 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm border-2 border-white">
                {badge}
            </span>
        )}
    </div>
)

const MenuItem = ({ icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
    <button onClick={onClick} className="w-full bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-stone/30 hover:bg-stone/50 active:scale-[0.98] transition-all">
        <div className="flex items-center gap-3 text-gray-700">
            <div className="p-2 bg-stone rounded-lg text-gray-600">{icon}</div>
            <span className="text-sm font-bold">{label}</span>
        </div>
        <ChevronRight size={16} className="text-gray-300" />
    </button>
)
