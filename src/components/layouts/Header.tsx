import React from 'react';
import { Bell, User, Menu, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  notifications?: number;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  onSearchChange?: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  showMenuButton = true,
  user = { name: 'Usuario', role: 'Administrador' },
  notifications = 0,
  onNotificationsClick,
  onProfileClick,
  onSearchChange,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
              icon={<Menu className="h-5 w-5" />}
            />
          )}
          
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BS</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">El Buen Sabor</h1>
              <p className="text-xs text-gray-500">Sistema de Gestión</p>
            </div>
          </div>
        </div>

        {/* Center - Search (optional) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos, ingredientes..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNotificationsClick}
              icon={<Bell className="h-5 w-5" />}
            />
            {notifications > 0 && (
              <Badge
                variant="danger"
                size="sm"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {notifications > 99 ? '99+' : notifications}
              </Badge>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3 border-l border-gray-200 pl-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onProfileClick}
              className="rounded-full p-2"
            >
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};