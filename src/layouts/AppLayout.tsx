import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@heroui/button';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.nav
        className="bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col"
        initial={{ width: '64px' }}
        animate={{ width: isExpanded ? '240px' : '64px' }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              B
            </div>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-semibold text-gray-900"
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
                    : 'text-gray-600 hover:bg-gray-100'
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
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm"
              >
                <p className="font-medium text-gray-900">Admin User</p>
                <p className="text-gray-500">admin@beweos.com</p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}; 