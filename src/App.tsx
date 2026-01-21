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
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/app/home" replace />} />

          {/* Mobile Routes */}
          <Route path="/app" element={<MobileLayoutWrapper />}>
            <Route path="home" element={<MobileHome />} />
            <Route path="inspiration" element={<MobileInspiration />} />
            <Route path="category" element={<MobileCategory />} />
            <Route path="product/list" element={<Navigate to="/app/category" replace />} /> {/* Mock list route fix */}
            <Route path="product/:id" element={<MobileProduct />} />
            <Route path="cart" element={<MobileCart />} />
            <Route path="profile" element={<MobileProfile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
            <Route index element={<Navigate to="tags" replace />} />
            <Route path="tags" element={<AdminTagConfig />} />
            <Route path="products" element={<AdminProductManagement />} />
            <Route path="orders" element={<AdminOrderManagement />} />
            <Route path="content" element={<AdminContentOps />} />
            <Route path="content/post/:id" element={<AdminPostDetail />} />
            <Route path="banners" element={<AdminBannerManagement />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </MockDataProvider>
  );
};

export default App;
