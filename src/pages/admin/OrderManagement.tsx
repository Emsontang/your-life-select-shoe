import React, { useState } from 'react';
import { useMockData } from '../../context/MockDataContext';
import { Package, Clock, RotateCcw } from 'lucide-react';

export const AdminOrderManagement: React.FC = () => {
    const { orders, shipOrder } = useMockData();
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'shipped' | 'refunded'>('all');
    const [trackingInput, setTrackingInput] = useState<string>('');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const filteredOrders = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab);

    const handleShip = (orderId: string) => {
        if (!trackingInput) return alert('请输入物流单号');
        shipOrder(orderId, trackingInput);
        setSelectedOrderId(null);
        setTrackingInput('');
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">订单履约中心</h2>
                <p className="text-gray-500 mt-1">处理用户订单发货及售后申请。</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
                {(['all', 'pending', 'shipped', 'refunded'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 px-4 font-medium text-sm transition-colors border-b-2 ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        {tab === 'all' && '全部订单'}
                        {tab === 'pending' && '待发货'}
                        {tab === 'shipped' && '已发货'}
                        {tab === 'refunded' && '售后/退款'}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                        <tr>
                            <th className="p-4 font-medium">订单号 / 时间</th>
                            <th className="p-4 font-medium">商品信息</th>
                            <th className="p-4 font-medium">用户</th>
                            <th className="p-4 font-medium">总金额</th>
                            <th className="p-4 font-medium">状态</th>
                            <th className="p-4 font-medium text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50/50">
                                <td className="p-4">
                                    <div className="font-bold text-gray-700">{order.id}</div>
                                    <div className="text-xs text-gray-400 mt-1">{order.date}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        {order.items.map((item, idx) => (
                                            <img key={idx} src={item.product.image} className="w-10 h-10 rounded-md object-cover border border-gray-100" title={item.product.name} />
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600">{order.user}</td>
                                <td className="p-4 font-bold text-gray-800">¥{order.total}</td>
                                <td className="p-4">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="p-4 text-right">
                                    {order.status === 'pending' && (
                                        <button
                                            onClick={() => setSelectedOrderId(order.id)}
                                            className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold shadow-sm hover:bg-primary/90"
                                        >
                                            发货
                                        </button>
                                    )}
                                    {order.status === 'refunded' && (
                                        <span className="text-gray-400 text-xs">已处理</span>
                                    )}
                                    {order.status === 'shipped' && (
                                        <div className="text-xs text-gray-500">单号: {order.trackingNumber}</div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="p-12 text-center text-gray-400">暂无相关订单</div>
                )}
            </div>

            {/* Ship Modal */}
            {selectedOrderId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedOrderId(null)} />
                    <div className="bg-white w-full max-w-sm rounded-xl p-6 relative z-10 shadow-xl">
                        <h3 className="font-bold text-lg mb-4">填写发货信息</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">物流单号</label>
                                <input
                                    autoFocus
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="输入快递单号..."
                                    value={trackingInput}
                                    onChange={e => setTrackingInput(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setSelectedOrderId(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-medium">取消</button>
                                <button onClick={() => handleShip(selectedOrderId)} className="flex-1 py-2.5 bg-primary text-white rounded-lg font-bold">确认发货</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'pending': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium"><Clock size={12} /> 待发货</span>;
        case 'shipped': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"><Package size={12} /> 已发货</span>;
        case 'refunded': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"><RotateCcw size={12} /> 售后中</span>;
        default: return null;
    }
};
