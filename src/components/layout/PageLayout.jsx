import React from 'react';
import Sidebar from './Sidebar';
import OfflineNotification from '../ui/OfflineNotification';

const PageLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <OfflineNotification />
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
