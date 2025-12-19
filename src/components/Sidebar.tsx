import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Users', href: '/users' },
    { name: 'Listings', href: '/listings' },
    { name: 'Deals', href: '/deals' },
    { name: 'Reports', href: '/reports' },
    { name: 'Chat Moderation', href: '/chat' },
    { name: 'Verification', href: '/verification' },
    { name: 'Ratings & Trust', href: '/ratings' },
    { name: 'Notifications', href: '/notifications' },
    { name: 'Content Management', href: '/content' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'System Settings', href: '/settings' },
    { name: 'Audit Logs', href: '/logs' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold">UniMart Admin</h1>
      </div>
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.href
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">© 2025 UniMart Admin Dashboard</p>
      </div>
    </div>
  );
};

export default Sidebar;