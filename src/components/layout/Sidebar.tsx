import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Plus,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';
import { useWorkspaceStore } from '../../store/workspaceStore.js';
import { Workspace } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore();
  const { workspaces, currentWorkspace } = useWorkspaceStore();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-dark-800 border-r border-dark-600 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-dark-600">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold font-display">
                Collab<span className="text-gradient">Sync</span>
              </span>
            </div>
          </div>

          {/* Workspaces Section */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase">Workspaces</span>
              <button className="p-1 rounded hover:bg-dark-700 text-slate-400 hover:text-white">
                <Plus size={16} />
              </button>
            </div>

            <nav className="space-y-1">
              {workspaces.map((workspace: Workspace) => (
                <NavLink
                  key={workspace._id}
                  to={`/workspace/${workspace._id}`}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-xl transition-colors ${
                      isActive || currentWorkspace?._id === workspace._id
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'text-slate-400 hover:bg-dark-700 hover:text-white'
                    }`
                  }
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-semibold text-white">
                    {workspace.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate text-sm font-medium">{workspace.name}</span>
                </NavLink>
              ))}

              {workspaces.length === 0 && (
                <p className="text-sm text-slate-500 px-3 py-2">No workspaces yet</p>
              )}
            </nav>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-dark-600">
            <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-dark-700 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.username}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="mt-2 w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-400 hover:bg-dark-700 hover:text-white transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;