import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        Skip to main content
      </a>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64" id="main-content" role="main">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;