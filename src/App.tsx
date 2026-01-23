import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MockDataProvider } from './context/MockDataContext';
import { MobileFrame } from './components/MobileFrame';
import { ReqSidebar } from './components/ReqSidebar';
import { MobileNav } from './components/MobileNav';
import { AdminLayout } from './components/AdminLayout';

// Pages
import { MobileHome } from './pages/mobile/Home';
import { MobileCategory } from './pages/mobile/Category';
import { MobileProduct } from './pages/mobile/ProductDetail';
import { MobileCart } from './pages/mobile/Cart';
import { MobileProfile } from './pages/mobile/Profile';
import { MobileInspiration } from './pages/mobile/Inspiration';
import { AdminTagConfig } from './pages/admin/TagConfig';
import { AdminProductManagement } from './pages/admin/ProductManagement';
import { AdminOrderManagement } from './pages/admin/OrderManagement';
import { AdminContentOps } from './pages/admin/ContentOps';
import { AdminBannerManagement } from './pages/admin/BannerManagement';
import { AdminPostDetail } from './pages/admin/PostDetail';
import { AdminUserManagement } from './pages/admin/UserManagement';
import { AdminMarketingOps } from './pages/admin/MarketingOps';
import { AdminDashboard } from './pages/admin/Dashboard';
import { MobileCouponCenter } from './pages/mobile/CouponCenter';
import { OrderList } from './pages/mobile/OrderList';
import { OrderDetail } from './pages/mobile/OrderDetail';
import { PRDDocument } from './pages/docs/PRDDocument';

import { LandingPage } from './pages/LandingPage';

// Wrappers
const MobileLayoutWrapper = () => (
  <MobileFrame>
    {/* Page Content Scroll Container */}
    <div className="w-full h-full overflow-y-auto scrollbar-hide pb-[90px]">
      <Outlet />
    </div>

    <MobileNav />
    <ReqSidebar position="absolute" /> {/* Sidebar also on Mobile */}
  </MobileFrame>
);

const App: React.FC = () => {
  return (
    <MockDataProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Mobile Routes */}
          <Route path="/app" element={<MobileLayoutWrapper />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<MobileHome />} />
            <Route path="inspiration" element={<MobileInspiration />} />
            <Route path="category" element={<MobileCategory />} />
            <Route path="product/list" element={<Navigate to="/app/category" replace />} /> {/* Mock list route fix */}
            <Route path="product/:id" element={<MobileProduct />} />
            <Route path="cart" element={<MobileCart />} />
            <Route path="profile" element={<MobileProfile />} />
            <Route path="coupon" element={<MobileCouponCenter />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="order/:id" element={<OrderDetail />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
            <Route index element={<AdminDashboard />} />
            <Route path="tags" element={<AdminTagConfig />} />
            <Route path="products" element={<AdminProductManagement />} />
            <Route path="orders" element={<AdminOrderManagement />} />
            <Route path="content" element={<AdminContentOps />} />
            <Route path="content/post/:id" element={<AdminPostDetail />} />
            <Route path="banners" element={<AdminBannerManagement />} />
            <Route path="users" element={<AdminUserManagement />} />
            <Route path="marketing" element={<AdminMarketingOps />} />
          </Route>

          {/* Docs Routes */}
          <Route path="/docs/prd" element={<PRDDocument />} />

        </Routes>
      </BrowserRouter>
    </MockDataProvider>
  );
};

export default App;
