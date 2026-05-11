import React, { useState } from 'react';
import { Menu, Bell, Search, Moon, Sun, LogOut, ChevronDown, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';
import { useNotificationStore } from '../../store/notificationStore.js';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../types';

interface HeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const [darkMode, setDarkMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-30 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700" role="banner">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            aria-label="Toggle menu"
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <Menu size={24} aria-hidden="true" />
          </button>
          <h1 className="text-xl font-semibold text-white">{title || 'Dashboard'}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-dark-800 border border-dark-600">
            <label htmlFor="header-search" className="sr-only">Search</label>
            <Search size={18} className="text-slate-400" aria-hidden="true" />
            <input
              id="header-search"
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-64 focus:outline-none focus:ring-0"
            />
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            {darkMode ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
              aria-expanded={showNotifications}
              aria-haspopup="true"
              className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              <Bell size={20} aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center" aria-hidden="true">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                  aria-hidden="true"
                />
                <div
                  className="absolute right-0 mt-2 w-80 bg-dark-800 border border-dark-600 rounded-xl shadow-xl z-50 overflow-hidden"
                  role="dialog"
                  aria-label="Notifications"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-dark-600">
                    <span className="font-semibold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead()}
                        className="text-xs text-purple-400 hover:text-purple-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center text-slate-500 py-8">No notifications</p>
                    ) : (
                      <ul role="list">
                        {notifications.slice(0, 5).map((notification: Notification) => (
                          <li key={notification._id}>
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => {
                                if (!notification.read) markAsRead(notification._id);
                                setShowNotifications(false);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  if (!notification.read) markAsRead(notification._id);
                                  setShowNotifications(false);
                                }
                              }}
                              className={`px-4 py-3 hover:bg-dark-700 cursor-pointer border-b border-dark-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                                !notification.read ? 'bg-purple-500/10' : ''
                              }`}
                            >
                              <p className="text-sm text-white">{notification.title}</p>
                              <p className="text-xs text-slate-400 mt-1">{notification.message}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User menu"
              aria-expanded={showUserMenu}
              aria-haspopup="true"
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-dark-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={16} className="text-slate-400 hidden sm:block" aria-hidden="true" />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                  aria-hidden="true"
                />
                <div
                  className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-600 rounded-xl shadow-xl z-50 overflow-hidden"
                  role="menu"
                >
                  <button
                    role="menuitem"
                    onClick={() => {
                      navigate('/settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-slate-300 hover:bg-dark-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  >
                    <User size={16} aria-hidden="true" />
                    <span className="text-sm">Profile</span>
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-red-400 hover:bg-dark-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  >
                    <LogOut size={16} aria-hidden="true" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;