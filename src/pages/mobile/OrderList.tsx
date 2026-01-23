import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMockData, type Order, type OrderStatus } from '../../context/MockDataContext';
import { ChevronLeft, Search, ShoppingBag } from 'lucide-react';

const STATUS_TABS: { id: OrderStatus | 'all'; label: string }[] = [
    { id: 'all', label: '全部' },
    { id: 'unpaid', label: '待付款' },
    { id: 'pending_shipment', label: '待发货' },
    { id: 'shipped', label: '待收货' },
    { id: 'completed', label: '评价' }, // Using 'completed' for ease, representing Finished/To Review
];

export const OrderList: React.FC = () => {
    const { orders, payOrder, confirmReceipt } = useMockData();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const currentTab = (searchParams.get('status') as OrderStatus | 'all') || 'all';

    const filteredOrders = useMemo(() => {
        if (currentTab === 'all') return orders;
        return orders.filter(o => o.status === currentTab);
    }, [orders, currentTab]);

    const handleTabClick = (status: string) => {
        setSearchParams({ status });
    };

    return (
        <div className="min-h-screen bg-background pb-10">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone/50">
                <div className="px-4 h-12 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600">
                        <ChevronLeft size={24} />
                    </button>
                    <span className="font-bold text-lg text-gray-800">我的订单</span>
                    <button className="p-2 -mr-2 text-gray-600">
                        <Search size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto scrollbar-hide px-2">
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`flex-none px-4 py-3 text-sm font-medium border-b-2 transition-colors ${currentTab === tab.id
                                ? 'text-primary border-primary'
                                : 'text-gray-500 border-transparent hover:text-gray-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="px-4 py-4 space-y-4">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onPay={() => {
                                if (confirm(`确认支付 ¥${order.total} 吗？`)) {
                                    payOrder(order.id);
                                    alert('支付成功！');
                                }
                            }}
                            onConfirmReceipt={() => {
                                if (confirm('确认收到商品了吗？')) {
                                    confirmReceipt(order.id);
                                }
                            }}
                            onClick={() => navigate(`/app/order/${order.id}`)}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                            <ShoppingBag size={32} className="opacity-20" />
                        </div>
                        <p className="text-sm">暂无相关订单</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Internal Card Component
const OrderCard: React.FC<{
    order: Order;
    onPay: () => void;
    onConfirmReceipt: () => void;
    onClick: () => void;
}> = ({ order, onPay, onConfirmReceipt, onClick }) => {

    const getStatusInfo = (status: OrderStatus) => {
        switch (status) {
            case 'unpaid': return { color: 'text-orange-500', text: '等待付款' };
            case 'pending_shipment': return { color: 'text-blue-500', text: '等待发货' };
            case 'shipped': return { color: 'text-primary', text: '卖家已发货' };
            case 'completed': return { color: 'text-green-600', text: '交易成功' };
            case 'refunded': return { color: 'text-gray-500', text: '退款成功' };
            default: return { color: 'text-gray-500', text: '未知状态' };
        }
    };

    const statusInfo = getStatusInfo(order.status);

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-stone/30 active:scale-[0.99] transition-transform" onClick={onClick}>
            {/* Header */}
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-50">
                <span className="text-xs font-mono text-gray-400">订单号: {order.id.split('-')[1]}...</span>
                <span className={`text-xs font-bold ${statusInfo.color}`}>{statusInfo.text}</span>
            </div>

            {/* Body */}
            <div className="flex gap-3 mb-3">
                {order.items.map((item, idx) => (
                    <div key={idx} className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                        <img src={item.product.image} className="w-full h-full object-cover" alt="" />
                    </div>
                ))}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                        <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{order.items[0].product.name}</h4>
                        {order.items.length > 1 && <p className="text-xs text-gray-400 mt-1">等 {order.items.reduce((s, i) => s + i.quantity, 0)} 件商品</p>}
                    </div>
                    <div className="flex justify-end items-end gap-1">
                        <span className="text-xs text-gray-400 mb-0.5">合计</span>
                        <span className="text-sm font-bold font-mono">¥{order.total}</span>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                {order.status === 'unpaid' && (
                    <>
                        <button className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600">取消订单</button>
                        <button onClick={onPay} className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium shadow-sm shadow-primary/30">立即付款</button>
                    </>
                )}
                {order.status === 'pending_shipment' && (
                    <button className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600">提醒发货</button>
                )}
                {order.status === 'shipped' && (
                    <>
                        <button className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600">查看物流</button>
                        <button onClick={onConfirmReceipt} className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium">确认收货</button>
                    </>
                )}
                {order.status === 'completed' && (
                    <>
                        <button className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600">申请售后</button>
                        <button className="px-3 py-1.5 rounded-full border border-primary text-primary text-xs font-medium">评价晒单</button>
                    </>
                )}
            </div>
        </div>
    );
};
