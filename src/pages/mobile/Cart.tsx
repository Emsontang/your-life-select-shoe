import React from 'react';
import { useMockData } from '../../context/MockDataContext';
import { Trash2, Minus, Plus, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MobileCart: React.FC = () => {
    const { cart, updateCartQuantity, removeFromCart, clearCart } = useMockData();
    const navigate = useNavigate();

    const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        clearCart();
        alert('订单已提交！Order Placed.');
        navigate('/app/profile'); // Go to orders
    };

    return (
        <div className="bg-background min-h-screen pb-32 flex flex-col">
            <div className="sticky top-0 bg-white/90 backdrop-blur z-20 px-4 pb-4 pt-12 flex items-center justify-between border-b border-stone">
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate(-1)}><ChevronLeft /></button>
                    <h1 className="text-lg font-bold">购物车 ({cart.length})</h1>
                </div>

            </div>

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
                                <span className="font-bold text-primary">¥{product.price}</span>

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

                {cart.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <p>购物车空空如也</p>
                        <button onClick={() => navigate('/app/home')} className="mt-4 px-6 py-2 bg-text text-white rounded-full text-sm">
                            去逛逛
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Checkout */}
            {cart.length > 0 && (
                <div className="fixed bottom-[80px] left-0 right-0 max-w-[390px] mx-auto bg-white border-t border-stone p-4 pb-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 text-sm">合计</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xs text-primary font-bold">¥</span>
                            <span className="text-2xl text-primary font-bold">{totalPrice}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="w-full bg-text text-white py-4 rounded-xl font-bold hover:bg-black transition-colors"
                    >
                        立即结算
                    </button>
                </div>
            )}
        </div>
    );
};
