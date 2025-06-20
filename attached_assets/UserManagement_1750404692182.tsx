import React, { useState } from 'react';
import { Search, Filter, Eye, UserCheck, UserX, Shield } from 'lucide-react';
import { mockUsers, mockSMBProfiles, mockFIProfiles } from '../../data/mockData';
import { UserType } from '../../types';

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserType, setSelectedUserType] = useState<UserType | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const getUserProfile = (user: any) => {
    if (user.userType === 'smb') {
      return mockSMBProfiles.find(p => p.userId === user.id);
    } else if (user.userType === 'fi') {
      return mockFIProfiles.find(p => p.userId === user.id);
    }
    return null;
  };

  const filteredUsers = mockUsers.filter(user => {
    const profile = getUserProfile(user);
    const name = user.userType === 'smb' 
      ? profile?.companyName || user.email
      : user.userType === 'fi'
      ? profile?.institutionName || user.email
      : user.email;

    const matchesSearch = !searchTerm || 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUserType = !selectedUserType || user.userType === selectedUserType;
    
    return matchesSearch && matchesUserType;
  });

  const getUserTypeLabel = (userType: UserType) => {
    switch (userType) {
      case 'smb':
        return 'Business';
      case 'fi':
        return 'Financial Institution';
      case 'admin':
        return 'Administrator';
      default:
        return 'Unknown';
    }
  };

  const getUserTypeColor = (userType: UserType) => {
    switch (userType) {
      case 'smb':
        return 'text-blue-600 bg-blue-100';
      case 'fi':
        return 'text-green-600 bg-green-100';
      case 'admin':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleActivateUser = (userId: string) => {
    console.log('Activating user:', userId);
    // Here you would make an API call to activate the user
  };

  const handleDeactivateUser = (userId: string) => {
    console.log('Deactivating user:', userId);
    // Here you would make an API call to deactivate the user
  };

  const handleViewUser = (userId: string) => {
    console.log('Viewing user details:', userId);
    // Here you would open a modal or navigate to user details
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage and monitor all platform users</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Users
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Search by name or email..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Type
            </label>
            <select
              value={selectedUserType}
              onChange={(e) => setSelectedUserType(e.target.value as UserType | '')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">All Types</option>
              <option value="smb">Businesses</option>
              <option value="fi">Financial Institutions</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Users ({filteredUsers.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const profile = getUserProfile(user);
                const displayName = user.userType === 'smb' 
                  ? profile?.companyName || 'Unnamed Business'
                  : user.userType === 'fi'
                  ? profile?.institutionName || 'Unnamed Institution'
                  : 'Administrator';

                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            {user.userType === 'admin' ? (
                              <Shield className="h-5 w-5 text-gray-600" />
                            ) : (
                              <span className="text-sm font-medium text-gray-600">
                                {displayName.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {displayName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUserTypeColor(user.userType)}`}>
                        {getUserTypeLabel(user.userType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-green-600 bg-green-100">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewUser(user.id)}
                          className="text-purple-600 hover:text-purple-900 p-1"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleActivateUser(user.id)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Activate User"
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeactivateUser(user.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Deactivate User"
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria to see more results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}