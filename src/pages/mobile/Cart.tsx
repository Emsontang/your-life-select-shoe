import React, { useState } from 'react';
import { useMockData } from '../../context/MockDataContext';
import { Trash2, Minus, Plus, ChevronLeft, Ticket, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MobileCart: React.FC = () => {
    const { cart, cartSummary, updateCartQuantity, removeFromCart, clearCart, userProfile, coupons, applyCouponToCart } = useMockData();
    const navigate = useNavigate();
    const [showCouponSelector, setShowCouponSelector] = useState(false);

    // Filter usable coupons
    const availableCoupons = coupons.filter(c =>
        c.status === 'active' &&
        (!c.targetTier || c.targetTier.includes(userProfile.tier))
    );

    const handleCheckout = () => {
        if (cart.length === 0) return;
        clearCart();
        alert(`支付成功！实付: ¥${cartSummary.finalPrice.toFixed(2)}`);
        navigate('/app/profile');
    };

    // Upsell Logic
    // Find the next best coupon user could use but hasn't met threshold for
    const nextCoupon = availableCoupons.find(c =>
        cartSummary.subtotal < c.minSpend &&
        (c.minSpend - cartSummary.subtotal) < 500 // Only show close targets
    );

    return (
        <div className="bg-background min-h-screen pb-40 flex flex-col">
            <div className="sticky top-0 bg-white/90 backdrop-blur z-20 px-4 pb-4 pt-12 flex items-center justify-between border-b border-stone">
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate(-1)}><ChevronLeft /></button>
                    <h1 className="text-lg font-bold">购物车 ({cart.length})</h1>
                </div>
            </div>

            {/* Upsell Bar */}
            {nextCoupon && (
                <div className="bg-amber-50 px-4 py-2 flex items-center gap-2 text-xs text-amber-700 animate-in slide-in-from-top-2">
                    <AlertCircle size={14} />
                    <span>
                        再买 ¥{(nextCoupon.minSpend - cartSummary.subtotal).toFixed(0)}
                        可减 {nextCoupon.type === 'cash_off' ? `¥${nextCoupon.value}` : '更多优惠'}
                        ({nextCoupon.title})
                    </span>
                    <button onClick={() => navigate('/app/category')} className="ml-auto font-bold underline">去凑单 &gt;</button>
                </div>
            )}

            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-stone flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            <img src={product.image} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <h3 className="text-sm font-medium text-text line-clamp-2">{product.name}</h3>
                                <button onClick={() => removeFromCart(product.id)} className="text-gray-400 hover:text-red-500">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="font-bold text-primary">¥{product.price}</span>
                                    {cartSummary.memberDiscountRate < 1 && (
                                        <span className="text-[10px] text-purple-600 bg-purple-50 px-1 rounded ml-2">
                                            会员{(cartSummary.memberDiscountRate * 10).toFixed(1)}折
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 bg-stone/50 rounded-lg p-1">
                                    <button
                                        onClick={() => updateCartQuantity(product.id, -1)}
                                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 disabled:opacity-50"
                                    >
                                        <Minus size={12} />
                                    </button>
                                    <span className="text-xs font-medium w-4 text-center">{quantity}</span>
                                    <button
                                        onClick={() => updateCartQuantity(product.id, 1)}
                                        className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600"
                                    >
                                        <Plus size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Smart Bill Footer */}
            {cart.length > 0 && (
                <div className="fixed bottom-[80px] left-0 right-0 max-w-[390px] mx-auto bg-white rounded-t-2xl shadow-[0_-5px_30px_rgba(0,0,0,0.1)] z-30 overflow-hidden">
                    {/* Coupon Selector Trigger */}
                    <div
                        onClick={() => setShowCouponSelector(!showCouponSelector)}
                        className="bg-red-50 px-4 py-3 flex items-center justify-between cursor-pointer active:bg-red-100"
                    >
                        <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                            <Ticket size={16} />
                            {cartSummary.appliedCouponId
                                ? `已享: ${coupons.find(c => c.id === cartSummary.appliedCouponId)?.title}`
                                : `可用优惠券 (${availableCoupons.length})`}
                        </div>
                        <ChevronLeft className={`transform transition-transform text-red-400 ${showCouponSelector ? '-rotate-90' : 'rotate-180'}`} size={16} />
                    </div>

                    {/* Coupon Dropdown */}
                    {showCouponSelector && (
                        <div className="bg-gray-50 max-h-48 overflow-y-auto p-2 space-y-2 border-b border-gray-100">
                            <button
                                onClick={() => applyCouponToCart(undefined)}
                                className={`w-full p-2 rounded-lg text-xs text-left ${!cartSummary.appliedCouponId ? 'bg-primary text-white' : 'bg-white'}`}
                            >
                                不使用优惠券
                            </button>
                            {availableCoupons.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => applyCouponToCart(c.id)}
                                    disabled={cartSummary.finalPrice < c.minSpend} // Simple disable logic
                                    className={`w-full p-3 rounded-lg text-left flex justify-between items-center ${cartSummary.appliedCouponId === c.id ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-white border border-gray-100'}`}
                                >
                                    <div>
                                        <div className="font-bold text-sm">{c.title}</div>
                                        <div className="text-[10px] opacity-75">{c.desc}</div>
                                    </div>
                                    {c.type === 'cash_off' ? <span className="font-bold text-lg">-¥{c.value}</span> : <span className="font-bold text-lg">{c.value * 10}折</span>}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Price Breakdown */}
                    <div className="p-4 bg-white">
                        <div className="space-y-1 text-xs text-gray-500 mb-4">
                            <div className="flex justify-between">
                                <span>商品总额</span>
                                <span>¥{cartSummary.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-purple-600">
                                <span>会员折扣 ({userProfile.tier !== 'resident' ? `${(cartSummary.memberDiscountRate * 10).toFixed(1)}折` : '无'})</span>
                                <span>-¥{cartSummary.savings.member.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-red-500">
                                <span>优惠券抵扣</span>
                                <span>-¥{cartSummary.savings.coupon.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xs text-primary font-bold">¥</span>
                                    <span className="text-3xl text-primary font-bold">{cartSummary.finalPrice.toFixed(0)}</span>
                                    <span className="text-sm font-bold text-primary">.{cartSummary.finalPrice.toFixed(2).split('.')[1]}</span>
                                </div>
                                <div className="text-[10px] text-gray-400">已省 ¥{(cartSummary.savings.member + cartSummary.savings.coupon).toFixed(2)}</div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="flex-1 bg-primary text-white h-12 rounded-xl font-bold shadow-lg hover:bg-black/90 active:scale-95 transition-all"
                            >
                                立即结算
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
