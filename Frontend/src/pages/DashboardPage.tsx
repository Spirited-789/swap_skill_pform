import React, { useState, useEffect } from 'react';
import {
  Star,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';
import { mockSwapRequests, mockFeedback } from '../data/mockData';
import { SwapRequest, Feedback } from '../types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [mySwaps, setMySwaps] = useState<SwapRequest[]>([]);
  const [myFeedback, setMyFeedback] = useState<Feedback[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const userSwaps = mockSwapRequests.filter(
        swap => swap.fromUserId === user.id || swap.toUserId === user.id
      );
      setMySwaps(userSwaps);

      const userFeedback = mockFeedback.filter(
        feedback => feedback.toUserId === user.id
      );
      setMyFeedback(userFeedback);
    }
  }, [user]);

  // Updated color palette for stats cards to fit dark theme
  const stats = [
    {
      label: 'Total Swaps',
      value: mySwaps.filter(swap => swap.status === 'completed').length,
      icon: Users,
      bgColor: 'bg-indigo-800', // Darker indigo
      textColor: 'text-indigo-100', // Lighter text
      iconColor: 'text-indigo-300', // Lighter icon
      trend: '+12%',
    },
    {
      label: 'Pending Requests',
      value: mySwaps.filter(swap => swap.status === 'pending').length,
      icon: Clock,
      bgColor: 'bg-amber-800', // Darker amber
      textColor: 'text-amber-100',
      iconColor: 'text-amber-300',
      trend: '+3',
    },
    {
      label: 'Average Rating',
      value: user?.rating.toFixed(1) || '0.0',
      icon: Star,
      bgColor: 'bg-emerald-800', // Darker emerald
      textColor: 'text-emerald-100',
      iconColor: 'text-emerald-300',
      trend: '+0.2',
    },
    {
      label: 'Skills Offered',
      value: user?.skillsOffered.length || 0,
      icon: TrendingUp,
      bgColor: 'bg-purple-800', // Darker purple
      textColor: 'text-purple-100',
      iconColor: 'text-purple-300',
      trend: '+2',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-300" />; // Adjusted for dark theme
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-emerald-300" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-indigo-300" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-rose-300" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-900 text-amber-100 border-amber-700'; // Darker shades
      case 'accepted':
        return 'bg-emerald-900 text-emerald-100 border-emerald-700';
      case 'completed':
        return 'bg-indigo-900 text-indigo-100 border-indigo-700';
      case 'rejected':
        return 'bg-rose-900 text-rose-100 border-rose-700';
      default:
        return 'bg-gray-700 text-gray-100 border-gray-600';
    }
  };

  return (
    <div className="min-h-screen w-full  text-gray-100 overflow-auto font-sans">
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
        <div
          className="fixed inset-0 bg-black bg-opacity-70 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        <div className={`fixed inset-y-0 left-0 w-64 bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-out
                         ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h1 className="text-xl font-extrabold text-white">SkillSwap</h1>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="p-4">
            <Link
              to="/dashboard"
              className="block py-3 px-5 rounded-xl bg-indigo-600 text-white font-bold mb-3 transition-all hover:bg-indigo-700"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="block py-3 px-5 rounded-xl text-gray-300 font-medium mb-3 transition-all hover:bg-gray-700"
            >
              Profile
            </Link>
            <Link
              to="/swaps"
              className="block py-3 px-5 rounded-xl text-gray-300 font-medium mb-3 transition-all hover:bg-gray-700"
            >
              Swaps
            </Link>
            <Link
              to="/search"
              className="block py-3 px-5 rounded-xl text-gray-300 font-medium mb-3 transition-all hover:bg-gray-700"
            >
              Search
            </Link>
            <Link
              to="/feedback"
              className="block py-3 px-5 rounded-xl text-gray-300 font-medium mb-3 transition-all hover:bg-gray-700"
            >
              Feedback
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 lg:px-10 py-6 space-y-8 w-full">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-8">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 rounded-lg bg-gray-800 shadow-sm border border-gray-700 transition-all hover:shadow-md text-gray-300"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-inner ${
              user?.availability === 'Available'
                ? 'bg-emerald-800 text-emerald-100' // Darker emerald
                : user?.availability === 'Busy'
                ? 'bg-amber-800 text-amber-100' // Darker amber
                : 'bg-rose-800 text-rose-100' // Darker rose
            } transition-colors duration-300`}>
              {user?.availability}
            </span>
          </div>
        </div>

        {/* Header (Desktop) */}
        <div className="hidden lg:flex items-center justify-between animate-fade-in slide-in-up">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Welcome back, {user?.name}! 👋</h1>
            <p className="text-gray-300 text-lg mt-3">Here's a snapshot of your SkillSwap activity.</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-inner ${
              user?.availability === 'Available'
                ? 'bg-emerald-800 text-emerald-100'
                : user?.availability === 'Busy'
                ? 'bg-amber-800 text-amber-100'
                : 'bg-rose-800 text-rose-100'
            } transition-colors duration-300`}>
              {user?.availability}
            </span>
          </div>
        </div>

        {/* Stats Grid - Updated with new color scheme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-2xl shadow-md border border-gray-700 p-6
                          hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1
                          animate-fade-in slide-in-up`}
              style={{ animationDelay: `${index * 150 + 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">{stat.label}</p>
                  <p className={`text-3xl font-extrabold ${stat.textColor} mt-2`}>{stat.value}</p>
                  <div className="flex items-center mt-3">
                    <span className="text-sm font-semibold text-emerald-300">{stat.trend}</span>
                    <span className="text-sm text-gray-400 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Swap Requests */}
          <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-6
                          animate-fade-in slide-in-up"
               style={{ animationDelay: '800ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Requests</h2>
              <Link
                to="/swaps"
                className="text-indigo-400 hover:text-indigo-200 font-medium flex items-center space-x-1 transition-transform hover:scale-105"
              >
                <span>View all</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="space-y-4">
              {mySwaps.slice(0, 3).map((swap) => (
                <div
                  key={swap.id}
                  className="border border-gray-700 rounded-xl p-5 hover:shadow-md transition-all duration-300 hover:border-indigo-500 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <img
                        src={swap.fromUserId === user?.id ? swap.toUser.profileImage : swap.fromUser.profileImage}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover shadow-sm"
                      />
                      <div>
                        <p className="font-semibold text-gray-100">
                          {swap.fromUserId === user?.id ? swap.toUser.name : swap.fromUser.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {swap.fromUserId === user?.id ? 'Requested' : 'Received'} • {new Date(swap.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(swap.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(swap.status)}`}>
                        {swap.status}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 mt-2 border border-gray-600">
                    <p className="text-sm text-gray-200 font-medium text-center">
                      <span className="font-bold text-indigo-400">{swap.skillOffered}</span>
                      <span className="text-gray-500 mx-3">↔</span>
                      <span className="font-bold text-purple-400">{swap.skillWanted}</span>
                    </p>
                  </div>
                </div>
              ))}
              {mySwaps.length === 0 && (
                <div className="text-center py-10 rounded-xl border-2 border-dashed border-gray-600 bg-gray-700">
                  <MessageSquare className="w-14 h-14 text-gray-500 mx-auto mb-5" />
                  <p className="text-gray-300 font-medium">No swap requests yet</p>
                  <Link
                    to="/search"
                    className="text-indigo-400 hover:text-indigo-200 font-semibold mt-3 inline-block transition-colors"
                  >
                    Find skills to swap
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-6
                          animate-fade-in slide-in-up"
               style={{ animationDelay: '900ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Feedback</h2>
              <Link
                to="/feedback"
                className="text-indigo-400 hover:text-indigo-200 font-medium flex items-center space-x-1 transition-transform hover:scale-105"
              >
                <span>View all</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="space-y-4">
              {myFeedback.slice(0, 3).map((feedback) => (
                <div
                  key={feedback.id}
                  className="border border-gray-700 rounded-xl p-5 hover:shadow-md transition-all duration-300 hover:border-purple-500 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <img
                        src={feedback.fromUser.profileImage}
                        alt={feedback.fromUser.name}
                        className="w-10 h-10 rounded-full object-cover shadow-sm"
                      />
                      <div>
                        <p className="font-semibold text-gray-100">{feedback.fromUser.name}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < feedback.rating ? 'text-amber-300 fill-current' : 'text-gray-500' // Adjusted for dark theme
                              } transition-colors`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 mt-2 italic border-l-4 border-gray-600 pl-4 py-1">
                    "{feedback.comment}"
                  </p>
                </div>
              ))}
              {myFeedback.length === 0 && (
                <div className="text-center py-10 rounded-xl border-2 border-dashed border-gray-600 bg-gray-700">
                  <Star className="w-14 h-14 text-gray-500 mx-auto mb-5" />
                  <p className="text-gray-300 font-medium">No feedback received yet</p>
                  <p className="text-sm text-gray-400 mt-2">Complete swaps to receive feedback</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions - Updated with new gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl
                        animate-fade-in slide-in-up"
             style={{ animationDelay: '1000ms' }}>
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/search"
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300
                          hover:bg-opacity-20 hover:scale-[1.03] transform border border-white border-opacity-20"
            >
              <Users className="w-10 h-10 mb-4 text-white" />
              <h3 className="font-bold text-xl">Find Skills</h3>
              <p className="text-sm opacity-90 mt-2">Discover new learning opportunities</p>
            </Link>
            <Link
              to="/profile"
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300
                          hover:bg-opacity-20 hover:scale-[1.03] transform border border-white border-opacity-20"
            >
              <Star className="w-10 h-10 mb-4 text-white" />
              <h3 className="font-bold text-xl">Update Profile</h3>
              <p className="text-sm opacity-90 mt-2">Add more skills to your profile</p>
            </Link>
            <Link
              to="/swaps"
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300
                          hover:bg-opacity-20 hover:scale-[1.03] transform border border-white border-opacity-20"
            >
              <MessageSquare className="w-10 h-10 mb-4 text-white" />
              <h3 className="font-bold text-xl">Manage Swaps</h3>
              <p className="text-sm opacity-90 mt-2">View and respond to requests</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
