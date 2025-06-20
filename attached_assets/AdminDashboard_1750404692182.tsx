import React from 'react';
import { Users, FileText, Building2, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { mockUsers, mockSMBProfiles, mockFIProfiles, mockLoanApplications, mockLoanOffers } from '../../data/mockData';
import CurrencyUpdater from './CurrencyUpdater';
import CurrencyRatesDisplay from './CurrencyRatesDisplay';

export function AdminDashboard() {
  const totalUsers = mockUsers.length;
  const smbUsers = mockUsers.filter(u => u.userType === 'smb').length;
  const fiUsers = mockUsers.filter(u => u.userType === 'fi').length;
  const totalApplications = mockLoanApplications.length;
  const totalOffers = mockLoanOffers.length;
  const verifiedSMBs = mockSMBProfiles.filter(p => p.isVerified).length;

  const recentActivity = [
    { id: 1, type: 'application', message: 'New loan application from TechSolutions LLC', time: '2 hours ago' },
    { id: 2, type: 'offer', message: 'National Development Bank sent an offer', time: '4 hours ago' },
    { id: 3, type: 'user', message: 'New financial institution registered', time: '1 day ago' },
    { id: 4, type: 'verification', message: 'TechSolutions LLC verified successfully', time: '2 days ago' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'offer':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'user':
        return <Users className="h-4 w-4 text-purple-600" />;
      case 'verification':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-purple-100">
          Monitor platform activity and manage users across KreditHub.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">SMB Users</p>
              <p className="text-2xl font-semibold text-gray-900">{smbUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Building2 className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Financial Institutions</p>
              <p className="text-2xl font-semibold text-gray-900">{fiUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified SMBs</p>
              <p className="text-2xl font-semibold text-gray-900">{verifiedSMBs}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Application Metrics */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Application Metrics</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Total Applications</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{totalApplications}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Total Offers</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{totalOffers}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Success Rate</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {totalApplications > 0 ? Math.round((totalOffers / totalApplications) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="p-1 bg-gray-100 rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Currency Update Button */}
      <div className="mt-8">
        <CurrencyUpdater />
      </div>

      {/* Currency Rates Display */}
      <div className="mt-8">
        <CurrencyRatesDisplay />
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">System Status</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Platform Status</p>
              <p className="text-lg font-semibold text-green-600">Operational</p>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Uptime</p>
              <p className="text-lg font-semibold text-blue-600">99.9%</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Active Sessions</p>
              <p className="text-lg font-semibold text-purple-600">24</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
