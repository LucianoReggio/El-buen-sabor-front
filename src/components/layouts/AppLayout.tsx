import React, { useState } from "react";
import { Header } from "./Header";
import { Sidebar, type MenuItem } from "./SideBar";

export interface AppLayoutProps {
  children: React.ReactNode;
  menuItems?: MenuItem[];
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  notifications?: number;
  onMenuItemClick?: (item: MenuItem) => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  onSearchChange?: (value: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  menuItems,
  user,
  notifications,
  onMenuItemClick,
  onNotificationsClick,
  onProfileClick,
  onSearchChange,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menuItems={menuItems}
        onMenuItemClick={(item) => {
          onMenuItemClick?.(item);
          setSidebarOpen(false); // Close on mobile after selection
        }}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          notifications={notifications}
          onNotificationsClick={onNotificationsClick}
          onProfileClick={onProfileClick}
          onSearchChange={onSearchChange}
        />

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};
