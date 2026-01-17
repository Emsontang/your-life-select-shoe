import React, { useState } from 'react';
import { useMockData, type PersonaId, type SpaceId } from '../../context/MockDataContext';
import { User, Users, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const MobileHome: React.FC = () => {
    const { personas, spaces, products, cart } = useMockData();
    const [currentPersonaId, setCurrentPersonaId] = useState<PersonaId>('single');
    const [activeSpaceId, setActiveSpaceId] = useState<SpaceId>('living');
    const [isPersonaSheetOpen, setIsPersonaSheetOpen] = useState(false);
    const navigate = useNavigate();

    const currentPersona = personas.find(p => p.id === currentPersonaId) || personas[0];

    // Filter available spaces for tabs
    const availableSpaces = spaces.filter(s => currentPersona.linkedSpaces.includes(s.id));

    // Ensure active space is valid for new persona, else switch to first available
    React.useEffect(() => {
        if (!currentPersona.linkedSpaces.includes(activeSpaceId)) {
            if (availableSpaces.length > 0) setActiveSpaceId(availableSpaces[0].id);
        }
    }, [currentPersonaId, availableSpaces, activeSpaceId]);

    // Filter products
    const filteredProducts = products.filter(p =>
        p.personaIds.includes(currentPersonaId) && p.spaceIds.includes(activeSpaceId)
    );

    return (
        <div className="pb-24">
            {/* Sticky Header */}
            <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md px-4 pb-3 pt-12 flex items-center justify-between border-b border-stone/50">
                <h1 className="text-xl font-bold text-primary tracking-tight">LifeSelect</h1>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsPersonaSheetOpen(true)}
                        className="flex items-center gap-2 bg-stone px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white transition-colors border border-transparent hover:border-gray-200 shadow-sm"
                    >
                        {currentPersona.id === 'single' ? <User size={14} /> : <Users size={14} />}
                        {currentPersona.name}
                    </button>
                    <Link to="/app/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
                        <ShoppingBag size={20} />
                        {cart.length > 0 && (
                            <span className="absolute top-1 right-0 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                                {cart.reduce((a, b) => a + b.quantity, 0)}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="sticky top-[96px] z-20 bg-background pt-2 pb-2 px-4 shadow-sm">
                <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
                    {availableSpaces.map(space => (
                        <button
                            key={space.id}
                            onClick={() => setActiveSpaceId(space.id)}
                            className={`whitespace-nowrap pb-2 text-sm font-medium transition-colors border-b-2 ${activeSpaceId === space.id
                                ? 'text-primary border-primary'
                                : 'text-gray-400 border-transparent hover:text-gray-600'
                                }`}
                        >
                            {space.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="px-4 mt-4 space-y-6">
                {/* Banner */}
                <div className="aspect-[16/9] w-full bg-stone rounded-2xl overflow-hidden relative shadow-inner group">
                    <img
                        src="/assets/home_banner_japandi_1768580167247.png"
                        alt="Banner"
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                        <div className="text-white">
                            <p className="text-xs font-medium opacity-80 mb-1">本季新品</p>
                            <h2 className="text-lg font-bold">Japandi Collection</h2>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div>
                    <h3 className="text-lg font-bold text-text mb-4">为您推荐</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {filteredProducts.map(product => (
                            <div key={product.id} onClick={() => navigate(`/app/product/${product.id}`)} className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone/50 hover:shadow-md transition-shadow cursor-pointer group">
                                <div className="aspect-square bg-gray-100 overflow-hidden relative">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                                </div>
                                <div className="p-3">
                                    <h4 className="text-sm font-medium text-text line-clamp-1">{product.name}</h4>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-primary font-bold">¥{product.price}</span>
                                        <span className="text-[10px] text-gray-400 border border-gray-100 px-1 rounded">
                                            {products.find(p => p.id === product.id)?.categoryId}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-10 text-gray-400 text-sm">
                            该空间下暂无推荐商品
                        </div>
                    )}
                </div>
            </div>

            {/* Persona Sheet Overlay */}
            {isPersonaSheetOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsPersonaSheetOpen(false)}></div>
                    <div className="relative w-full max-w-[390px] bg-white rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
                        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>
                        <h3 className="text-lg font-bold mb-4 text-center">选择您的生活角色</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {personas.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => {
                                        setCurrentPersonaId(p.id);
                                        setIsPersonaSheetOpen(false);
                                    }}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${currentPersonaId === p.id
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-stone hover:border-gray-300 bg-gray-50'
                                        }`}
                                >
                                    {p.id === 'single' ? <User size={24} /> : <Users size={24} />}
                                    <span className="font-medium">{p.name}</span>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setIsPersonaSheetOpen(false)} className="w-full mt-6 py-3 bg-gray-100 rounded-xl font-medium text-gray-600 hover:bg-gray-200">
                            取消
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
