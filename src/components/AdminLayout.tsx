import React, { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Tag, Package, LogOut, ShoppingBag, MessageSquare, Image, Users, Ticket, LayoutDashboard } from 'lucide-react';
import { ReqSidebar } from './ReqSidebar'; // Global requirement sidebar

export const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed top-0 bottom-0 z-30 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-primary tracking-tight">LifeSelect 后台管理</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <LayoutDashboard size={18} />
                        运营中心
                    </NavLink>
                    <NavLink
                        to="/admin/tags"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Tag size={18} />
                        标签管理
                    </NavLink>
                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Package size={18} />
                        商品发布
                    </NavLink>
                    <NavLink
                        to="/admin/orders"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <ShoppingBag size={18} />
                        订单履约
                    </NavLink>
                    <NavLink
                        to="/admin/content"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <MessageSquare size={18} />
                        社区运营
                    </NavLink>
                    <NavLink
                        to="/admin/banners"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Image size={18} />
                        轮播配置
                    </NavLink>
                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Users size={18} />
                        用户管理
                    </NavLink>
                    <NavLink
                        to="/admin/marketing"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Ticket size={18} />
                        营销配置
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <NavLink to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100">
                        <LogOut size={18} />
                        返回应用
                    </NavLink>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                {children}
            </main>

            {/* Global Requirements Sidebar */}
            <ReqSidebar />
        </div>
    );
};
