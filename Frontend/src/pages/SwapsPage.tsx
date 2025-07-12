import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Star,
  Calendar,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { mockSwapRequests } from '../data/mockData';
import { SwapRequest } from '../types';
import { useAuth } from '../hooks/useAuth.tsx';
import { useToast } from '../hooks/useToast';

const SwapsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [mySwaps, setMySwaps] = useState<SwapRequest[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null);
  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    comment: '',
  });

  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    if (user) {
      const userSwaps = mockSwapRequests.filter(
        swap => swap.fromUserId === user.id || swap.toUserId === user.id
      );
      setMySwaps(userSwaps);
    }
  }, [user]);

  const tabs = [
    { id: 'pending', label: 'Pending', icon: Clock, count: mySwaps.filter(s => s.status === 'pending').length },
    { id: 'accepted', label: 'Active', icon: CheckCircle, count: mySwaps.filter(s => s.status === 'accepted').length },
    { id: 'completed', label: 'Completed', icon: Star, count: mySwaps.filter(s => s.status === 'completed').length },
    { id: 'rejected', label: 'Rejected', icon: XCircle, count: mySwaps.filter(s => s.status === 'rejected').length },
  ];

  const filteredSwaps = mySwaps.filter(swap => {
    if (activeTab === 'pending') return swap.status === 'pending';
    if (activeTab === 'accepted') return swap.status === 'accepted';
    if (activeTab === 'completed') return swap.status === 'completed';
    if (activeTab === 'rejected') return swap.status === 'rejected' || swap.status === 'cancelled';
    return true;
  });

  const handleAcceptSwap = (swapId: string) => {
    addToast('success', 'Swap request accepted!');
    // In real app, update the swap status via API
  };

  const handleRejectSwap = (swapId: string) => {
    addToast('info', 'Swap request rejected');
    // In real app, update the swap status via API
  };

  const handleCompleteSwap = (swap: SwapRequest) => {
    setSelectedSwap(swap);
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = () => {
    if (!feedbackData.comment.trim()) {
      addToast('error', 'Please provide feedback comments');
      return;
    }

    addToast('success', 'Feedback submitted successfully!');
    setShowFeedbackModal(false);
    setSelectedSwap(null);
    setFeedbackData({ rating: 5, comment: '' });
  };

  const getSwapPartner = (swap: SwapRequest) => {
    return swap.fromUserId === user?.id ? swap.toUser : swap.fromUser;
  };

  const isSwapReceived = (swap: SwapRequest) => {
    return swap.toUserId === user?.id;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Swaps</h1>
        <p className="text-gray-600">Manage your skill exchange requests and activities</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
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
              {tab.count > 0 && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id ? 'bg-blue-100' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Swap Cards */}
      <div className="space-y-4">
        {filteredSwaps.map((swap) => {
          const partner = getSwapPartner(swap);
          const isReceived = isSwapReceived(swap);
          
          return (
            <div key={swap.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={partner.profileImage || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                    alt={partner.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                    <p className="text-sm text-gray-500">{partner.location}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {isReceived ? 'Received' : 'Sent'} • {new Date(swap.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(swap.status)}`}>
                        {swap.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{partner.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Skill Exchange Details */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      {isReceived ? 'They offer' : 'You offer'}
                    </p>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {isReceived ? swap.skillOffered : swap.skillWanted}
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      {isReceived ? 'You offer' : 'They offer'}
                    </p>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                      {isReceived ? swap.skillWanted : swap.skillOffered}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message */}
              {swap.message && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700">"{swap.message}"</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Updated {new Date(swap.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex space-x-2">
                  {swap.status === 'pending' && isReceived && (
                    <>
                      <button
                        onClick={() => handleRejectSwap(swap.id)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAcceptSwap(swap.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                    </>
                  )}

                  {swap.status === 'pending' && !isReceived && (
                    <button
                      onClick={() => handleRejectSwap(swap.id)}
                      className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  )}

                  {swap.status === 'accepted' && (
                    <button
                      onClick={() => handleCompleteSwap(swap)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      Mark Complete
                    </button>
                  )}

                  {swap.status === 'completed' && (
                    <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg cursor-not-allowed">
                      Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSwaps.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} swaps
          </h3>
          <p className="text-gray-500 mb-4">
            {activeTab === 'pending' 
              ? "You don't have any pending requests"
              : `No ${activeTab} swaps to show`
            }
          </p>
          {activeTab === 'pending' && (
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
              Find Skills to Swap
            </button>
          )}
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedSwap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Rate your experience
            </h2>
            
            <div className="text-center mb-6">
              <img
                src={getSwapPartner(selectedSwap).profileImage}
                alt={getSwapPartner(selectedSwap).name}
                className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
              />
              <p className="text-gray-600">
                How was your swap with {getSwapPartner(selectedSwap).name}?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFeedbackData(prev => ({ ...prev, rating }))}
                      className={`w-8 h-8 ${
                        rating <= feedbackData.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your feedback
                </label>
                <textarea
                  value={feedbackData.comment}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience with this skill swap..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapsPage;