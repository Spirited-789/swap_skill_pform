import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  User,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/search', icon: Search, label: 'Find Skills' },
    { path: '/swaps', icon: MessageSquare, label: 'My Swaps' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', icon: Shield, label: 'Admin' });
  }

  useEffect(() => {
    setSidebarOpen(false); // auto close drawer on nav
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SkillSwap
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <img
            src={user?.profileImage || 'https://i.pravatar.cc/300'}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      </div>

      {/* Slide Drawer Navigation */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-40 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <span className="text-lg font-bold">Menu</span>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center space-x-3">
            <img
              src={
                user?.profileImage ||
                'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
              }
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.location}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.label}
              </Link>
            );
          })}

          <Link
            to="/settings"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8 bg-transparent bg-gradient-to-br from-indigo-900 to-purple-900">{children}</div>
    </div>
  );
};

export default Layout;
