import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './layout.css'; // Стили для Layout
import useSidebarPosition from '../../utils/sidebar';

const Layout = ({ children }) => {
  useSidebarPosition();
  return (
    <div className="app-container">
      <Header />
      <div className="content-wrapper">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;