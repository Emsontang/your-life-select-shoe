import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMockData, type PersonaId } from '../../context/MockDataContext';
import {
    TrendingUp,
    Package,
    Users,
    Sparkles,
    AlertCircle,
    ShoppingBag,
    FileText,
    AlertTriangle,
    RotateCcw,
    Plus,
    Gift,
    Settings,
    ArrowUpRight,
    ArrowDownRight,
    Zap
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const { orders, products, posts, userProfile, coupons, personas } = useMockData();

    // ========== Section A: Core Business Metrics ==========

    // GMV (Total Revenue) - summing all paid orders
    const gmv = useMemo(() => {
        return orders
            .filter(o => o.status !== 'unpaid' && o.status !== 'refunded')
            .reduce((sum, o) => sum + o.total, 0);
    }, [orders]);

    // Order Volume - count of all orders
    const orderCount = useMemo(() => orders.length, [orders]);

    // Completed Order Count
    const completedOrders = useMemo(() =>
        orders.filter(o => o.status === 'completed').length,
        [orders]);

    // Community Conversion Rate - mock calculation (orders linked to posts)
    const conversionRate = useMemo(() => {
        // Simulate: ~12% of orders came from inspiration content
        const fromInspiration = Math.floor(orders.length * 0.12);
        return {
            count: fromInspiration,
            rate: orders.length > 0 ? ((fromInspiration / orders.length) * 100).toFixed(1) : '0'
        };
    }, [orders]);

    // Member Growth - users with tier above 'resident'
    const premiumMembers = useMemo(() => {
        // Since we only have one user in mock, simulate
        const hasUpgraded = userProfile.tier !== 'resident';
        return hasUpgraded ? 1 : 0;
    }, [userProfile]);

    // ========== Section B: Operational To-Dos ==========

    // Pending Shipment
    const pendingShipment = useMemo(() =>
        orders.filter(o => o.status === 'pending_shipment').length,
        [orders]);

    // Low Stock Alert (stock < 10)
    const lowStockProducts = useMemo(() =>
        products.filter(p => p.stock < 10 && p.isOnShelf).length,
        [products]);

    // Content Review - posts count (mock: all posts need review)
    const pendingReview = useMemo(() => posts.length, [posts]);

    // Refund Requests
    const refundRequests = useMemo(() =>
        orders.filter(o => o.status === 'refunded').length,
        [orders]);

    // ========== Section C: Insights ==========

    // Persona Distribution based on orders
    const personaDistribution = useMemo(() => {
        const distribution: Record<PersonaId, { count: number; revenue: number }> = {
            single: { count: 0, revenue: 0 },
            couple: { count: 0, revenue: 0 },
            family: { count: 0, revenue: 0 },
            three_gens: { count: 0, revenue: 0 }
        };

        orders.forEach(order => {
            order.items.forEach(item => {
                const primaryPersona = item.product.personaIds[0];
                if (primaryPersona && distribution[primaryPersona]) {
                    distribution[primaryPersona].count += item.quantity;
                    distribution[primaryPersona].revenue += item.product.price * item.quantity;
                }
            });
        });

        const totalRevenue = Object.values(distribution).reduce((sum, d) => sum + d.revenue, 0);

        return Object.entries(distribution).map(([id, data]) => ({
            id: id as PersonaId,
            name: personas.find(p => p.id === id)?.name || id,
            count: data.count,
            revenue: data.revenue,
            percent: totalRevenue > 0 ? (data.revenue / totalRevenue * 100) : 0
        })).sort((a, b) => b.revenue - a.revenue);
    }, [orders, personas]);

    // Active Coupons
    const activeCoupons = useMemo(() =>
        coupons.filter(c => c.status === 'active').length,
        [coupons]);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">运营中心</h1>
                    <p className="text-gray-500 mt-1">欢迎回来，实时掌握 LifeSelect 运营全局</p>
                </div>
                <div className="text-sm text-gray-400">
                    {new Date().toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                    })}
                </div>
            </div>

            {/* ========== Section A: The Pulse ========== */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Zap size={18} className="text-orange-500" />
                    <h2 className="text-lg font-bold text-gray-700">核心指标</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        icon={<TrendingUp />}
                        label="累计营收 (GMV)"
                        value={`¥${gmv.toLocaleString()}`}
                        trend={{ value: '+12.5%', up: true }}
                        color="orange"
                    />
                    <MetricCard
                        icon={<Package />}
                        label="订单总量"
                        value={orderCount.toString()}
                        subValue={`已完成 ${completedOrders}`}
                        color="blue"
                    />
                    <MetricCard
                        icon={<Sparkles />}
                        label="内容转化率"
                        value={`${conversionRate.rate}%`}
                        subValue={`来自灵感社区 ${conversionRate.count} 单`}
                        color="purple"
                    />
                    <MetricCard
                        icon={<Users />}
                        label="高级会员"
                        value={premiumMembers.toString()}
                        subValue="主理人及以上"
                        trend={{ value: '+3', up: true }}
                        color="green"
                    />
                </div>
            </section>

            {/* ========== Section B: The Workbench ========== */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <AlertCircle size={18} className="text-red-500" />
                    <h2 className="text-lg font-bold text-gray-700">待办事项</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <TodoCard
                        icon={<ShoppingBag />}
                        label="待发货订单"
                        count={pendingShipment}
                        link="/admin/orders"
                        urgent={pendingShipment > 0}
                    />
                    <TodoCard
                        icon={<FileText />}
                        label="内容待审"
                        count={pendingReview}
                        link="/admin/content"
                        urgent={pendingReview > 3}
                    />
                    <TodoCard
                        icon={<AlertTriangle />}
                        label="库存预警"
                        count={lowStockProducts}
                        link="/admin/products"
                        urgent={lowStockProducts > 0}
                        urgentColor="amber"
                    />
                    <TodoCard
                        icon={<RotateCcw />}
                        label="退款申请"
                        count={refundRequests}
                        link="/admin/orders"
                        urgent={refundRequests > 0}
                        urgentColor="red"
                    />
                </div>
            </section>

            {/* ========== Section C: Insights ========== */}
            <section className="grid lg:grid-cols-3 gap-6">
                {/* Persona Distribution */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Users size={18} className="text-primary" />
                            人群销售分布
                        </h3>
                        <span className="text-xs text-gray-400">基于订单商品人群标签</span>
                    </div>

                    <div className="space-y-4">
                        {personaDistribution.map((persona, idx) => (
                            <div key={persona.id} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-700 flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${getPersonaColor(idx)}`}></span>
                                        {persona.name}
                                    </span>
                                    <div className="text-right">
                                        <span className="font-bold text-gray-800">¥{persona.revenue.toLocaleString()}</span>
                                        <span className="text-gray-400 ml-2">({persona.percent.toFixed(1)}%)</span>
                                    </div>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${getPersonaColor(idx)}`}
                                        style={{ width: `${Math.max(persona.percent, 2)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {personaDistribution.every(p => p.revenue === 0) && (
                        <div className="text-center text-gray-400 py-8">
                            暂无订单数据
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-800 mb-4">快捷操作</h3>
                        <div className="space-y-3">
                            <QuickAction
                                icon={<Plus />}
                                label="新增商品"
                                link="/admin/products"
                            />
                            <QuickAction
                                icon={<Gift />}
                                label="发放优惠券"
                                link="/admin/marketing"
                                badge={`${activeCoupons} 张生效中`}
                            />
                            <QuickAction
                                icon={<Settings />}
                                label="配置首页"
                                link="/admin/tags"
                            />
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-6 text-white">
                        <h3 className="font-bold text-white/90 mb-4">今日快报</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-white/70">在售商品</span>
                                <span className="font-bold">{products.filter(p => p.isOnShelf).length} 件</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/70">社区帖子</span>
                                <span className="font-bold">{posts.length} 篇</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/70">有效优惠券</span>
                                <span className="font-bold">{activeCoupons} 张</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// ========== Helper Components ==========

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    subValue?: string;
    trend?: { value: string; up: boolean };
    color: 'orange' | 'blue' | 'purple' | 'green';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, subValue, trend, color }) => {
    const colorMap = {
        orange: 'bg-orange-50 text-orange-600',
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        green: 'bg-green-50 text-green-600'
    };
    const IconWrapper = colorMap[color];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl ${IconWrapper}`}>
                    {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${trend.up ? 'text-green-600' : 'text-red-500'}`}>
                        {trend.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trend.value}
                    </div>
                )}
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
            {subValue && <div className="text-xs text-gray-400 mt-1">{subValue}</div>}
        </div>
    );
};

interface TodoCardProps {
    icon: React.ReactNode;
    label: string;
    count: number;
    link: string;
    urgent: boolean;
    urgentColor?: 'red' | 'amber';
}

const TodoCard: React.FC<TodoCardProps> = ({ icon, label, count, link, urgent, urgentColor = 'red' }) => {
    const urgentBg = urgentColor === 'amber' ? 'bg-amber-500' : 'bg-red-500';
    return (
        <Link
            to={link}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-primary/30 transition-all group relative"
        >
            {urgent && (
                <span className={`absolute -top-1 -right-1 w-5 h-5 ${urgentBg} text-white text-[10px] flex items-center justify-center rounded-full font-bold animate-pulse`}>
                    {count}
                </span>
            )}
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
                </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{count}</div>
            <div className="text-sm text-gray-500">{label}</div>
        </Link>
    );
};

interface QuickActionProps {
    icon: React.ReactNode;
    label: string;
    link: string;
    badge?: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, label, link, badge }) => (
    <Link
        to={link}
        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors group"
    >
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white text-gray-600 group-hover:text-primary transition-colors shadow-sm">
                {React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}
            </div>
            <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">{label}</span>
        </div>
        {badge && <span className="text-xs text-gray-400">{badge}</span>}
    </Link>
);

const getPersonaColor = (index: number): string => {
    const colors = ['bg-orange-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500'];
    return colors[index % colors.length];
};
