/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Home,
  Compass,
  BookOpen,
  Bookmark,
  BarChart2,
  Bot,
  Settings,
  ShieldCheck,
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: UserProfile;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onLogout: () => void;
  isDarkMode: boolean;
}

export default function Sidebar({
  currentView,
  onNavigate,
  user,
  isSidebarCollapsed,
  setSidebarCollapsed,
  isMobileOpen,
  setMobileOpen,
  onLogout,
  isDarkMode
}: SidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'my-paths', label: 'My Learning Paths', icon: BookOpen },
    { id: 'saved', label: 'Saved Resources', icon: Bookmark },
    { id: 'progress', label: 'Progress & Analytics', icon: BarChart2 },
    { id: 'tutor', label: 'AI Tutor', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileOpen(false);
  };

  const currentActiveItem = menuItems.find(item => item.id === currentView) || { id: '' };

  const sidebarBg = isDarkMode 
    ? 'bg-[#0F1115] border-r border-slate-800 text-slate-100' 
    : 'bg-white border-r border-slate-100 text-slate-900';

  const hoverBg = isDarkMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50';
  const activeBg = isDarkMode ? 'bg-indigo-600/25 text-indigo-400 font-medium' : 'bg-indigo-50 text-indigo-600 font-medium';

  return (
    <>
      {/* Mobile Header bar */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 border-b ${
        isDarkMode ? 'bg-[#0F1115]/95 border-slate-800' : 'bg-white/95 border-slate-100'
      } backdrop-blur-md`}>
        <div className="flex items-center gap-2" onClick={() => handleNavClick('landing')}>
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center font-bold text-white text-lg shadow-sm">
            L
          </div>
          <span className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            LearnFlow <span className="text-indigo-600">AI</span>
          </span>
        </div>
        <button 
          id="mobile-menu-btn"
          onClick={() => setMobileOpen(!isMobileOpen)}
          className={`p-2 rounded-xl border ${isDarkMode ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-600'}`}
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Sidebar overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar (Floating desktop + sliding mobile) */}
      <aside className={`
        fixed md:relative md:top-auto md:bottom-auto md:left-auto md:z-auto top-0 bottom-0 left-0 z-40 shrink-0
        transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isSidebarCollapsed ? 'w-20' : 'w-64'}
        pt-16 md:pt-0
        flex flex-col h-full
        ${sidebarBg}
      `}>
        {/* Logo container for desktop */}
        <div className="hidden md:flex h-20 items-center justify-between px-6 border-b border-inherit">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => handleNavClick('landing')}
          >
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center font-bold text-white text-xl shadow-md hover:scale-105 transition-transform">
              L
            </div>
            {!isSidebarCollapsed && (
              <span className="text-xl font-extrabold tracking-tight">
                LearnFlow <span className="text-indigo-600">AI</span>
              </span>
            )}
          </div>
          {!isSidebarCollapsed && (
            <button 
              id="collapse-sidebar-btn"
              onClick={() => setSidebarCollapsed(true)}
              className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400`}
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Desktop Expand Trigger */}
        {isSidebarCollapsed && (
          <div className="hidden md:flex h-12 items-center justify-center border-b border-inherit">
            <button 
              id="expand-sidebar-btn"
              onClick={() => setSidebarCollapsed(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* User context badge */}
        <div className={`p-4 border-b border-inherit ${isSidebarCollapsed ? 'items-center' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold tracking-wider capitalize shadow-inner">
                {user.displayName ? user.displayName.substring(0, 2) : 'LF'}
              </div>
              {user.isPro && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 hover:scale-115 transition-transform text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  ★
                </span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.displayName || 'Learner'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    user.isPro 
                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {user.isPro ? 'Pro Member' : 'Free Learning'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {!isSidebarCollapsed && !user.isPro && (
            <button 
              id="sidebar-upgrade-btn"
              onClick={() => handleNavClick('settings')}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-bold shadow-xs hover:from-amber-600 hover:to-orange-600 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles size={14} />
              Upgrade to Pro
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar scroll-smooth">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}-btn`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium tracking-tight transition-all duration-200 outline-none ${
                  isActive ? activeBg : `${hoverBg} text-slate-500 dark:text-slate-400`
                } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                title={item.label}
              >
                <Icon size={18} className={isActive ? 'scale-110 text-indigo-500' : 'text-slate-400 dark:text-slate-500'} />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-inherit space-y-2">
          {user.email === 'obedasekhamen@gmail.com' && (
            <button
              id="sidebar-admin-btn"
              onClick={() => handleNavClick('admin')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-500 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all ${
                isSidebarCollapsed ? 'justify-center' : ''
              }`}
              title="Admin Panel"
            >
              <ShieldCheck size={16} />
              {!isSidebarCollapsed && <span>Admin Control</span>}
            </button>
          )}

          <button
            id="sidebar-logout-btn"
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
            title="Log out"
          >
            <LogOut size={16} />
            {!isSidebarCollapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
