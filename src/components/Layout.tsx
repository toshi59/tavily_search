'use client';

import React, { useState } from 'react';
import { Home, History, Settings, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'ホーム',
    icon: <Home size={20} />,
    href: '/'
  },
  {
    id: 'history',
    label: '検索履歴',
    icon: <History size={20} />,
    href: '/history'
  },
  {
    id: 'settings',
    label: '設定',
    icon: <Settings size={20} />,
    href: '/settings'
  }
];

export default function Layout({ children, currentPage = 'home' }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[var(--color-background)]">
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-md bg-[var(--color-primary)] text-white hover:bg-blue-700 transition-colors"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-[var(--color-secondary)] border-r border-[var(--color-border)] z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <h1 className="text-xl font-bold text-[var(--color-foreground)] mb-8">
            Tavily検索
          </h1>
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-foreground)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}