import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  Download, 
  Search, 
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Calendar
} from 'lucide-react';
import { mockUsers, mockSwapRequests, mockFeedback } from '../data/mockData';
import { User, SwapRequest } from '../types';
import { useToast } from '../hooks/useToast';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToast();

  const stats = [
    {
      label: 'Total Users',
      value: mockUsers.filter(u => u.role === 'user').length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      label: 'Active Swaps',
      value: mockSwapRequests.filter(s => s.status === 'accepted').length,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      label: 'Pending Requests',
      value: mockSwapRequests.filter(s => s.status === 'pending').length,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      change: '+3',
    },
    {
      label: 'Completed Swaps',
      value: mockSwapRequests.filter(s => s.status === 'completed').length,
      icon: BarChart3,
      color: 'bg-purple-500',
      change: '+25%',
    },
  ];

  const filteredUsers = mockUsers.filter(user => 
    user.role === 'user' &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBanUser = (userId: string) => {
    addToast('success', 'User has been banned');
    // In real app, make API call to ban user
  };

  const handleUnbanUser = (userId: string) => {
    addToast('success', 'User has been unbanned');
    // In real app, make API call to unban user
  };

  const downloadStats = () => {
    const data = {
      users: mockUsers.length,
      swaps: mockSwapRequests.length,
      feedback: mockFeedback.length,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skillswap-stats.json';
    a.click();
    URL.revokeObjectURL(url);
    
    addToast('success', 'Statistics downloaded successfully');
  };

  const tabs = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'swaps', label: 'Swap Monitoring', icon: CheckCircle },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <span>Admin Dashboard</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage users, monitor activities, and view analytics</p>
        </div>
        <button
          onClick={downloadStats}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Swaps</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.profileImage || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{user.location}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(user.joinedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium">{user.rating.toFixed(1)}</span>
                          <span className="text-yellow-400">★</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{user.totalSwaps}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isBanned 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {user.isBanned ? (
                          <button
                            onClick={() => handleUnbanUser(user.id)}
                            className="flex items-center space-x-1 px-3 py-1 text-green-600 border border-green-300 rounded hover:bg-green-50 transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span className="text-xs">Unban</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBanUser(user.id)}
                            className="flex items-center space-x-1 px-3 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors"
                          >
                            <Ban className="w-3 h-3" />
                            <span className="text-xs">Ban</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'swaps' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Swap Activities</h3>
            <div className="space-y-3">
              {mockSwapRequests.map((swap) => (
                <div key={swap.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex -space-x-2">
                        <img
                          src={swap.fromUser.profileImage}
                          alt={swap.fromUser.name}
                          className="w-8 h-8 rounded-full object-cover border-2 border-white"
                        />
                        <img
                          src={swap.toUser.profileImage}
                          alt={swap.toUser.name}
                          className="w-8 h-8 rounded-full object-cover border-2 border-white"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {swap.fromUser.name} ↔ {swap.toUser.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {swap.skillOffered} ↔ {swap.skillWanted}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        swap.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {swap.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(swap.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Platform Analytics</h3>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">User Growth</h4>
                <p className="text-2xl font-bold text-blue-600">+24%</p>
                <p className="text-sm text-blue-600">This month</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Swap Success Rate</h4>
                <p className="text-2xl font-bold text-green-600">87%</p>
                <p className="text-sm text-green-600">Completed swaps</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">Avg Rating</h4>
                <p className="text-2xl font-bold text-purple-600">4.6★</p>
                <p className="text-sm text-purple-600">Platform wide</p>
              </div>
            </div>

            {/* Popular Skills */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Most Popular Skills</h4>
              <div className="space-y-2">
                {['React', 'Python', 'Design', 'JavaScript', 'Machine Learning'].map((skill, index) => (
                  <div key={skill} className="flex items-center justify-between py-2">
                    <span className="text-gray-700">{skill}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${100 - (index * 15)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{100 - (index * 15)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;