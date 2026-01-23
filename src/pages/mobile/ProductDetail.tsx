import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMockData } from '../../context/MockDataContext';
import { ChevronLeft, Share } from 'lucide-react';

export const MobileProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { products, addToCart, getProductsByPersonaAndSpace, cart } = useMockData();

    const product = products.find(p => p.id === id);

    if (!product) return <div className="p-8 text-center">商品不存在</div>;

    // Scenario Recommendations: match first persona/space combo of this product
    const relatedProducts = getProductsByPersonaAndSpace(product.personaIds[0], product.spaceIds[0])
        .filter(p => p.id !== product.id);

    const handleAddToCart = () => {
        addToCart(product.id);
        // Simple toast mock
        alert('已加入购物车');
    };

    return (
        <div className="bg-background pb-24 min-h-full relative font-sans">
            {/* Header Actions (Absolute) */}
            <div className="fixed top-0 max-w-[390px] w-full z-10 p-4 pt-12 flex justify-between items-start pointer-events-none">
                <button onClick={() => navigate(-1)} className="pointer-events-auto bg-white/80 backdrop-blur rounded-full p-2 shadow-sm hover:bg-white text-text">
                    <ChevronLeft size={24} />
                </button>
                <button className="pointer-events-auto bg-white/80 backdrop-blur rounded-full p-2 shadow-sm hover:bg-white text-text">
                    <Share size={24} />
                </button>
            </div>

            {/* Hero Image */}
            <div className="w-full h-[400px] bg-gray-100 relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            <div className="relative -mt-6 bg-background rounded-t-3xl p-6 shadow-[-10px_-10px_30px_rgba(0,0,0,0.05)]">
                {/* Title & Price */}
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-xl font-bold text-text max-w-[70%] leading-tight">{product.name}</h1>
                    <div className="text-xl font-bold text-primary">¥{product.price}</div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-2 py-1 bg-stone rounded-md text-[10px] font-medium text-gray-500">
                        {product.categoryId}
                    </span>
                    {product.personaIds.map(pid => (
                        <span key={pid} className="px-2 py-1 bg-orange-50 text-orange-600 rounded-md text-[10px] font-medium border border-orange-100">
                            {(() => {
                                const map: Record<string, string> = {
                                    single: '单身贵族',
                                    family: '三口之家',
                                    couple: '幸福爱侣',
                                    three_gens: '三代同堂'
                                };
                                return map[pid] || pid;
                            })()}
                        </span>
                    ))}
                </div>

                {/* Description */}
                <div className="prose prose-sm text-gray-500 mb-8">
                    <p>
                        这款{product.name}完美融合了现代Japandi风格，为您打造宁静舒适的居家体验。
                        精选环保材质，匠心工艺，经久耐用。
                    </p>
                </div>

                {/* Scenario Match */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-text">场景搭配</h3>
                        <button className="text-xs text-primary font-medium">查看全部</button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6">
                        {relatedProducts.map(rp => (
                            <div key={rp.id} onClick={() => navigate(`/app/product/${rp.id}`)} className="min-w-[120px] cursor-pointer">
                                <div className="w-[120px] h-[120px] rounded-xl bg-gray-100 overflow-hidden mb-2">
                                    <img src={rp.image} className="w-full h-full object-cover" />
                                </div>
                                <p className="text-xs font-medium text-text line-clamp-1">{rp.name}</p>
                                <p className="text-xs text-gray-400">¥{rp.price}</p>
                            </div>
                        ))}
                        {relatedProducts.length === 0 && <p className="text-xs text-gray-400">暂无搭配推荐</p>}
                    </div>
                </div>
            </div>

            {/* Fixed Footer */}
            <div className="fixed bottom-0 max-w-[390px] w-full bg-white border-t border-gray-100 p-4 pb-8 flex items-center gap-4 z-50">
                <button
                    onClick={() => navigate('/app/cart')}
                    className="p-3 rounded-full hover:bg-stone transition-colors text-gray-600 relative"
                >
                    <ShoppingBag size={24} />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                            {cart.reduce((a, b) => a + b.quantity, 0)}
                        </span>
                    )}
                </button>
                <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-text text-white h-12 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                    加入购物车
                </button>
            </div>
        </div>
    );
};

// Simple Icon component helper
const ShoppingBag = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
)
