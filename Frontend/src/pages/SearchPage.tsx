import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, MessageSquare, ChevronDown } from 'lucide-react';
import { mockUsers, skillTags } from '../data/mockData';
import { User } from '../types';
import { useAuth } from '../hooks/useAuth.tsx';
import { useToast } from '../hooks/useToast';

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [requestData, setRequestData] = useState({
    skillOffered: '',
    skillWanted: '',
    message: '',
  });

  const { user } = useAuth();
  const { addToast } = useToast();

  const usersPerPage = 6;

  useEffect(() => {
    let filtered = mockUsers.filter(u => 
      u.id !== user?.id && 
      u.isPublic && 
      u.role === 'user' &&
      !u.isBanned
    );

    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.skillsOffered.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedSkill) {
      filtered = filtered.filter(u =>
        u.skillsOffered.includes(selectedSkill)
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedSkill, user?.id]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const displayedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handleRequestSwap = (targetUser: User) => {
    setSelectedUser(targetUser);
    setShowRequestModal(true);
    setRequestData({
      skillOffered: '',
      skillWanted: '',
      message: '',
    });
  };

  const handleSubmitRequest = () => {
    if (!requestData.skillOffered || !requestData.skillWanted) {
      addToast('error', 'Please select skills for the swap');
      return;
    }

    // Validate that offered skill is in user's skills
    if (!user?.skillsOffered.includes(requestData.skillOffered)) {
      addToast('error', 'You can only offer skills from your profile');
      return;
    }

    // Validate that wanted skill is in target user's skills
    if (!selectedUser?.skillsOffered.includes(requestData.skillWanted)) {
      addToast('error', 'Selected skill is not offered by this user');
      return;
    }

    addToast('success', `Swap request sent to ${selectedUser?.name}!`);
    setShowRequestModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Skills</h1>
        <p className="text-gray-600">Find talented people to swap skills with</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, location, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Skill Filter */}
          <div className="relative">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Skills</option>
              {skillTags.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>All</option>
                  <option>Available</option>
                  <option>Busy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Rating
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Any</option>
                  <option>4.0+</option>
                  <option>4.5+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Most Recent</option>
                  <option>Highest Rated</option>
                  <option>Most Swaps</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedUsers.map((targetUser) => (
          <div key={targetUser.id} className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-6
                          animate-fade-in slide-in-up">
            {/* User Header */}
            <div className="flex items-center space-x-4 mb-4 text-gray-300">
              <img
                src={targetUser.profileImage || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                alt={targetUser.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{targetUser.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {targetUser.location}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900 ml-1">
                      {targetUser.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    {targetUser.totalSwaps} swaps
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                targetUser.availability === 'Available' 
                  ? 'bg-green-100 text-green-800' 
                  : targetUser.availability === 'Busy'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {targetUser.availability}
              </span>
            </div>

            {/* Skills Offered */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Offered</h4>
              <div className="flex flex-wrap gap-2">
                {targetUser.skillsOffered.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {targetUser.skillsOffered.length > 3 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    +{targetUser.skillsOffered.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Skills Wanted */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Looking to Learn</h4>
              <div className="flex flex-wrap gap-2">
                {targetUser.skillsWanted.slice(0, 2).map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {targetUser.skillsWanted.length > 2 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    +{targetUser.skillsWanted.length - 2} more
                  </span>
                )}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleRequestSwap(targetUser)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Request Swap</span>
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Request Swap Modal */}
      {showRequestModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Request Swap with {selectedUser.name}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill You'll Offer
                </label>
                <select
                  value={requestData.skillOffered}
                  onChange={(e) => setRequestData(prev => ({ ...prev, skillOffered: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select a skill</option>
                  {user?.skillsOffered.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill You Want to Learn
                </label>
                <select
                  value={requestData.skillWanted}
                  onChange={(e) => setRequestData(prev => ({ ...prev, skillWanted: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select a skill</option>
                  {selectedUser.skillsOffered.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={requestData.message}
                  onChange={(e) => setRequestData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Introduce yourself and explain why you'd like to swap..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;