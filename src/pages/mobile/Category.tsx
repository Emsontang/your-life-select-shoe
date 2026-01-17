import React, { useState } from 'react';
import { useMockData } from '../../context/MockDataContext';
import { useNavigate } from 'react-router-dom';

export const MobileCategory: React.FC = () => {
    const { categories } = useMockData();
    const [selectedParentId, setSelectedParentId] = useState<string>(categories[0]?.id || '');
    const navigate = useNavigate();

    // Root categories (no parentId)
    const rootCategories = categories.filter(c => !c.parentId);

    // Child categories of selected
    const childCategories = categories.filter(c => c.parentId === selectedParentId);

    // Initialize selection
    React.useEffect(() => {
        if (!selectedParentId && rootCategories.length > 0) {
            setSelectedParentId(rootCategories[0].id);
        }
    }, [rootCategories, selectedParentId]);

    return (
        <div className="flex flex-col h-full bg-background pt-12">
            <div className="px-4 pb-4 border-b border-stone/50">
                <h1 className="text-xl font-bold">全屋分类</h1>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-24 bg-stone/30 overflow-y-auto scrollbar-hide">
                    {rootCategories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedParentId(cat.id)}
                            className={`w-full py-4 text-xs font-medium relative transition-colors ${selectedParentId === cat.id
                                ? 'bg-white text-primary'
                                : 'text-gray-500 hover:bg-stone/50'
                                }`}
                        >
                            {selectedParentId === cat.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                            )}
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Right Content */}
                <div className="flex-1 overflow-y-auto p-4 bg-white">
                    {/* Banner for category */}
                    <div className="w-full h-24 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden shadow-sm">
                        <img src="/assets/category_banner_subtle_1768580290446.png" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                        <div className="relative z-10 text-gray-500 text-sm font-medium tracking-wide">
                            {rootCategories.find(c => c.id === selectedParentId)?.name} 专区
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-y-6 gap-x-2">
                        {childCategories.map(sub => (
                            <div
                                key={sub.id}
                                onClick={() => navigate(`/app/product/list?category=${sub.id}`)} // Mock route
                                className="flex flex-col items-center gap-2 cursor-pointer"
                            >
                                <div className="w-14 h-14 rounded-full bg-stone flex items-center justify-center text-gray-400 overflow-hidden p-2">
                                    {/* Icon Mapping */}
                                    {(() => {
                                        let iconSrc = '/assets/icon_table_1768580184802.png'; // fallback
                                        if (sub.parentId === 'tables') iconSrc = '/assets/icon_table_1768580184802.png';
                                        if (sub.parentId === 'sofas') iconSrc = '/assets/icon_sofa_1768580202534.png';
                                        if (sub.parentId === 'beds') iconSrc = '/assets/icon_bed_1768580219311.png';
                                        if (sub.parentId === 'storage') iconSrc = '/assets/icon_storage_1768580237753.png';

                                        return <img src={iconSrc} alt={sub.name} className="w-full h-full object-contain mix-blend-multiply" />;
                                    })()}
                                </div>
                                <span className="text-xs text-text">{sub.name}</span>
                            </div>
                        ))}
                    </div>

                    {childCategories.length === 0 && (
                        <div className="text-center text-gray-400 text-sm mt-10">
                            暂无子分类
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
