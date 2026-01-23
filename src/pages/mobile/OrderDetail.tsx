import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMockData, type OrderStatus } from '../../context/MockDataContext';
import { ChevronLeft, MapPin, Truck, Copy, MessageSquare } from 'lucide-react';

export const OrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { orders } = useMockData();

    const order = orders.find(o => o.id === id);

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background p-4">
                <p className="text-gray-500 mb-4">订单未找到</p>
                <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white border rounded-full text-sm">返回</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-primary text-white px-4 pt-10 pb-4 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => navigate(-1)} className="p-1 -ml-1 hover:bg-white/20 rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <span className="font-bold text-lg">订单详情</span>
                </div>
                <div className="pl-2">
                    <h2 className="text-2xl font-bold mb-1">
                        {order.status === 'unpaid' ? '等待买家付款' :
                            order.status === 'pending_shipment' ? '等待卖家发货' :
                                order.status === 'shipped' ? '卖家已发货' :
                                    order.status === 'completed' ? '交易成功' :
                                        order.status === 'refunded' ? '退款成功' : '订单详情'}
                    </h2>
                    <p className="text-xs opacity-80">
                        {order.status === 'unpaid' ? '剩23小时59分自动关闭' :
                            order.status === 'shipped' ? '您的包裹正在飞奔向您' :
                                '感谢您的信任与支持'}
                    </p>
                </div>
            </div>

            <div className="px-4 -mt-4 space-y-4">
                {/* Logistics (Mock) */}
                {['shipped', 'completed'].includes(order.status) && (
                    <div className="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-full mt-1">
                            <Truck size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-blue-600 mb-1">【上海市】快件已到达 上海浦东转运中心</p>
                            <p className="text-xs text-gray-400">2026-01-22 14:30:22</p>
                        </div>
                        <ChevronLeft size={16} className="text-gray-300 rotate-180" />
                    </div>
                )}

                {/* Address (Mock) */}
                <div className="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-full mt-1">
                        <MapPin size={18} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-800">Emson</span>
                            <span className="text-gray-500 text-sm">138****8888</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">上海市 浦东新区 张江高科技园区 123号</p>
                    </div>
                </div>

                {/* Product List */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-4 text-sm font-bold text-gray-800 border-b border-gray-50 pb-2">
                        <span>LifeSelect 自营店</span>
                    </div>
                    <div className="space-y-4">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-3">
                                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                    <img src={item.product.image} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-medium text-gray-800 line-clamp-2 w-3/4">{item.product.name}</h4>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">¥{item.product.price}</p>
                                            <p className="text-xs text-gray-400">x{item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">标准规格</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-50 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">商品总价</span>
                            <span className="font-medium">¥{order.total}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">运费</span>
                            <span className="font-medium">¥0.00</span>
                        </div>
                        <div className="flex justify-between items-end pt-2">
                            <span className="font-bold text-gray-800">实付款</span>
                            <span className="text-lg font-bold text-primary">¥{order.total}</span>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="bg-white rounded-xl p-4 shadow-sm text-xs text-gray-500 space-y-2">
                    <div className="flex justify-between">
                        <span>订单编号</span>
                        <div className="flex items-center gap-1">
                            <span>{order.id}</span>
                            <Copy size={12} className="cursor-pointer" onClick={() => alert('已复制')} />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span>创建时间</span>
                        <span>{order.date} 12:00:00</span>
                    </div>
                </div>
            </div>

            {/* Sticky Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 px-4 flex justify-end gap-3 z-30 safebottom">
                <button className="flex items-center gap-1 text-gray-600 text-sm mr-auto">
                    <MessageSquare size={16} />
                    <span>联系客服</span>
                </button>

                {order.status === 'unpaid' && (
                    <button className="px-5 py-2 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30">立即付款</button>
                )}
                {(['shipped', 'completed', 'pending_shipment'] as OrderStatus[]).includes(order.status) && (
                    <button className="px-4 py-2 rounded-full border border-gray-300 text-gray-600 font-medium text-sm">再次购买</button>
                )}
            </div>
        </div>
    );
};
