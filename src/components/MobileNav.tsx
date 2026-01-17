import React from 'react';
import { Home, Grid, User, ShoppingCart } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const MobileNav: React.FC = () => {
    return (
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 flex items-center justify-around pb-6 pt-3 z-40">
            <NavLink
                to="/app/home"
                className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}
            >
                <Home size={24} strokeWidth={1.5} />
                首页
            </NavLink>
            <NavLink
                to="/app/inspiration"
                className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}
            >
                <Grid size={24} strokeWidth={1.5} />
                灵感
            </NavLink>
            <NavLink
                to="/app/category"
                className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}
            >
                <Grid size={24} strokeWidth={1.5} className="rotate-45" /> {/* Different icon for visual distinction or use List/Menu */}
                分类
            </NavLink>
            <NavLink
                to="/app/cart"
                className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}
            >
                <ShoppingCart size={24} strokeWidth={1.5} />
                购物车
            </NavLink>
            <NavLink
                to="/app/profile"
                className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}
            >
                <User size={24} strokeWidth={1.5} />
                我的
            </NavLink>
        </div>
    );
}
