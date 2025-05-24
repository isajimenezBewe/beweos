import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeSelector } from '../components/ThemeSelector';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems: NavItem[] = [

    { path: '/contacts', icon: '📇', label: 'Contactos' },
    { path: '/deals', icon: '💼', label: 'Negocios' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.nav
        className="bg-content1 border-r border-divider h-screen sticky top-0 flex flex-col"
        initial={{ width: '64px' }}
        animate={{ width: isExpanded ? '240px' : '64px' }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <div className="p-4 border-b border-divider">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              B
            </div>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-semibold text-foreground"
              >
                BeweOS
              </motion.span>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 mx-2 rounded-2xl transition-all
                  ${isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-default-600 hover:bg-content2'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-divider">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-content3 rounded-full flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm"
              >
                <p className="font-medium text-foreground">Admin User</p>
                <p className="text-default-500">admin@beweos.com</p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-content1 border-b border-divider sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">BeweOS</h1>
            <ThemeSelector />
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-6 bg-background">
          <Outlet />
        </div>
      </main>
    </div>
  );
}; 