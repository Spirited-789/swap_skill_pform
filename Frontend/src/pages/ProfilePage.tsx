import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Star, 
  Users, 
  Plus,
  X,
  Save,
  Edit3
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import { useToast } from '../hooks/useToast';
import { skillTags } from '../data/mockData';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    profileImage: user?.profileImage || '',
    availability: user?.availability || 'Available',
    isPublic: user?.isPublic || true,
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
  });

  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [showOfferedDropdown, setShowOfferedDropdown] = useState(false);
  const [showWantedDropdown, setShowWantedDropdown] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addSkillOffered = (skill: string) => {
    if (skill && !formData.skillsOffered.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, skill],
      }));
      setNewSkillOffered('');
      setShowOfferedDropdown(false);
    }
  };

  const addSkillWanted = (skill: string) => {
    if (skill && !formData.skillsWanted.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, skill],
      }));
      setNewSkillWanted('');
      setShowWantedDropdown(false);
    }
  };

  const removeSkillOffered = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter(s => s !== skill),
    }));
  };

  const removeSkillWanted = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter(s => s !== skill),
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.location.trim()) {
      addToast('error', 'Name and location are required');
      return;
    }

    updateUser(formData);
    setIsEditing(false);
    addToast('success', 'Profile updated successfully!');
  };

  const availableOfferedSkills = skillTags.filter(skill => 
    !formData.skillsOffered.includes(skill) &&
    skill.toLowerCase().includes(newSkillOffered.toLowerCase())
  );

  const availableWantedSkills = skillTags.filter(skill => 
    !formData.skillsWanted.includes(skill) &&
    skill.toLowerCase().includes(newSkillWanted.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Profile Image */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img
                  src={formData.profileImage || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                  alt={formData.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {isEditing && (
                <div className="mt-4">
                  <input
                    type="url"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleInputChange}
                    placeholder="Profile image URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 text-center">
                    {user?.name}
                  </h2>
                  <div className="flex items-center justify-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{user?.location}</span>
                  </div>
                </>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-900">{user?.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-500">Average Rating</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold text-gray-900">{user?.totalSwaps}</span>
                  </div>
                  <p className="text-xs text-gray-500">Total Swaps</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Availability & Visibility */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability Status
                </label>
                {isEditing ? (
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                ) : (
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    user?.availability === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : user?.availability === 'Busy'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user?.availability}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Visibility
                </label>
                {isEditing ? (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Make profile public</span>
                  </label>
                ) : (
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    user?.isPublic ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user?.isPublic ? 'Public' : 'Private'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Skills I Offer */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills I Offer</h3>
            
            {isEditing && (
              <div className="mb-4 relative">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSkillOffered}
                    onChange={(e) => {
                      setNewSkillOffered(e.target.value);
                      setShowOfferedDropdown(true);
                    }}
                    onFocus={() => setShowOfferedDropdown(true)}
                    placeholder="Add a skill you can teach..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={() => addSkillOffered(newSkillOffered)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {showOfferedDropdown && availableOfferedSkills.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                    {availableOfferedSkills.slice(0, 5).map(skill => (
                      <button
                        key={skill}
                        onClick={() => addSkillOffered(skill)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {formData.skillsOffered.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkillOffered(skill)}
                      className="ml-2 hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              {formData.skillsOffered.length === 0 && (
                <p className="text-gray-500 text-sm">No skills added yet</p>
              )}
            </div>
          </div>

          {/* Skills I Want to Learn */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills I Want to Learn</h3>
            
            {isEditing && (
              <div className="mb-4 relative">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSkillWanted}
                    onChange={(e) => {
                      setNewSkillWanted(e.target.value);
                      setShowWantedDropdown(true);
                    }}
                    onFocus={() => setShowWantedDropdown(true)}
                    placeholder="Add a skill you want to learn..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={() => addSkillWanted(newSkillWanted)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {showWantedDropdown && availableWantedSkills.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                    {availableWantedSkills.slice(0, 5).map(skill => (
                      <button
                        key={skill}
                        onClick={() => addSkillWanted(skill)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {formData.skillsWanted.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkillWanted(skill)}
                      className="ml-2 hover:text-purple-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              {formData.skillsWanted.length === 0 && (
                <p className="text-gray-500 text-sm">No learning goals added yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;