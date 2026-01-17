import React, { useState } from 'react';
import { useMockData, type PersonaId, type SpaceId, type Product } from '../../context/MockDataContext';
import { Plus } from 'lucide-react';

export const AdminProductManagement: React.FC = () => {
    const { categories, personas, spaces, addProduct, products, toggleProductShelf, banners } = useMockData();

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [selectedPersonas, setSelectedPersonas] = useState<PersonaId[]>([]);
    const [selectedSpaces, setSelectedSpaces] = useState<SpaceId[]>([]);

    // Helpers to get L2 categories
    const level2Categories = categories.filter(c => c.parentId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || !categoryId) return alert('Please fill required fields');

        const newProduct: Product = {
            id: `p${Date.now()}`,
            name,
            price: Number(price),
            image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=800', // Default placeholder
            categoryId,
            personaIds: selectedPersonas,
            spaceIds: selectedSpaces,
            stock: 100, // Default stock
            isOnShelf: true
        };

        addProduct(newProduct);
        alert('Product Added Successfully!');
        // Reset
        setName('');
        setPrice('');
        setCategoryId('');
        setSelectedPersonas([]);
        setSelectedSpaces([]);
    };

    const togglePersona = (id: PersonaId) => {
        setSelectedPersonas(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const toggleSpace = (id: SpaceId) => {
        setSelectedSpaces(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleToggleShelf = (productId: string, currentStatus: boolean) => {
        if (currentStatus) {
            // Trying to turn OFF shelf
            const activeBanner = banners.find(b => b.active && b.linkProductId === productId);
            if (activeBanner) {
                alert(`该商品正在推广中（轮播图: ${activeBanner.title}），请先下线轮播图`);
                return;
            }
        }
        toggleProductShelf(productId);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">商品管理</h2>
                    <p className="text-gray-500 mt-2">管理现货商品，配置上下架状态。</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm text-gray-500">
                    商品总数: <span className="font-bold text-primary">{products.length}</span>
                </div>
            </div>

            {/* Product List Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                        <tr>
                            <th className="p-4">商品</th>
                            <th className="p-4">价格</th>
                            <th className="p-4">库存</th>
                            <th className="p-4">状态</th>
                            <th className="p-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50/50">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={p.image} className="w-10 h-10 rounded-md object-cover bg-gray-100" />
                                    <span className="font-medium text-gray-700">{p.name}</span>
                                </td>
                                <td className="p-4">¥{p.price}</td>
                                <td className="p-4 text-gray-500">{p.stock}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold ${p.isOnShelf ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${p.isOnShelf ? 'bg-green-500' : 'bg-gray-400'}`} />
                                        {p.isOnShelf ? '上架中' : '已下架'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleToggleShelf(p.id, p.isOnShelf)}
                                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${p.isOnShelf ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                                    >
                                        {p.isOnShelf ? '下架' : '上架'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="mb-6 pb-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">发布新商品</h3>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">商品名称</label>
                            <input
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                placeholder="例如：现代简约沙发"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">价格</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">¥</span>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg p-3 pl-8 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="999"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">物理类目</label>
                        <select
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
                            value={categoryId}
                            onChange={e => setCategoryId(e.target.value)}
                        >
                            <option value="">选择类目...</option>
                            {level2Categories.map(c => (
                                <option key={c.id} value={c.id}>
                                    {categories.find(p => p.id === c.parentId)?.name} &gt; {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Smart Tags */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h3 className="tex-sm font-bold text-primary flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary rounded-full" />
                            场景标签
                        </h3>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">适用人群</label>
                                <div className="space-y-2">
                                    {personas.map(p => (
                                        <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded text-primary focus:ring-primary"
                                                checked={selectedPersonas.includes(p.id)}
                                                onChange={() => togglePersona(p.id)}
                                            />
                                            <span className="text-sm text-gray-700">{p.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">适用空间</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {spaces.map(s => (
                                        <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded text-primary focus:ring-primary"
                                                checked={selectedSpaces.includes(s.id)}
                                                onChange={() => toggleSpace(s.id)}
                                            />
                                            <span className="text-sm text-gray-700">{s.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={20} />
                            发布商品
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
