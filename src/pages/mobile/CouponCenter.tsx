import React from 'react';
import { useMockData } from '../../context/MockDataContext';
import { Ticket, ChevronLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MobileCouponCenter: React.FC = () => {
    const { coupons, userProfile, claimCoupon } = useMockData();
    const navigate = useNavigate();

    const handleClaim = (id: string, isLocked: boolean) => {
        if (isLocked) {
            alert('等级不足，请升级后再来领取！Earn higher tier to unlock.');
            return;
        }
        claimCoupon(id);
        alert('领取成功！Claimed successfully.');
    };

    return (
        <div className="bg-background min-h-screen pb-20">
            {/* Header */}
            <div className="bg-primary/5 pt-12 pb-6 px-4">
                <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm"><ChevronLeft size={20} /></button>
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <Ticket className="text-primary" />
                        领券中心
                    </h1>
                </div>
                <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                    <h2 className="font-bold text-lg mb-1">会员专享好券</h2>
                    <p className="text-white/80 text-xs">先领券，再购物，折上折更优惠</p>
                </div>
            </div>

            {/* Coupon List */}
            <div className="p-4 space-y-4 -mt-4">
                {coupons.map(coupon => {
                    // Check if locked
                    const isLocked = coupon.targetTier && !coupon.targetTier.includes(userProfile.tier);

                    return (
                        <div key={coupon.id} className={`bg-white rounded-xl shadow-sm border border-stone overflow-hidden flex relative ${isLocked ? 'grayscale opacity-80' : ''}`}>
                            {/* Left Value Part */}
                            <div className="w-24 bg-red-50 flex flex-col items-center justify-center p-2 border-r border-dashed border-red-200 relative">
                                {coupon.type === 'cash_off' ? (
                                    <>
                                        <span className="text-xs text-red-500 font-bold">¥</span>
                                        <span className="text-3xl text-red-600 font-bold">{coupon.value}</span>
                                    </>
                                ) : (
                                    <span className="text-2xl text-red-600 font-bold">{coupon.value * 10}折</span>
                                )}
                                <span className="text-[10px] text-red-400 mt-1">满{coupon.minSpend}可用</span>

                                {/* Decor circles */}
                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full" />
                                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white rounded-full" />
                            </div>

                            {/* Right Info Part */}
                            <div className="flex-1 p-4 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-gray-800">{coupon.title}</h3>
                                        {isLocked && <Lock size={14} className="text-gray-400" />}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{coupon.desc}</p>
                                </div>

                                <div className="flex justify-between items-end mt-4">
                                    <span className="text-[10px] text-gray-400 border border-gray-100 px-1 rounded">
                                        {coupon.targetTier?.length ? '等级专享' : '全员可用'}
                                    </span>
                                    <button
                                        onClick={() => handleClaim(coupon.id, !!isLocked)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${isLocked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-200'}`}
                                    >
                                        {isLocked ? '等级不足' : '立即领取'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
