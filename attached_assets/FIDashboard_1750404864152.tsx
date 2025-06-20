import React from 'react';
import { Users, FileText, DollarSign, TrendingUp, Eye, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockLoanApplications, mockLoanOffers } from '../../data/mockData';

export function FIDashboard() {
  const { fiProfile } = useAuth();

  const allApplications = mockLoanApplications;
  const myOffers = mockLoanOffers.filter(offer => offer.fiId === fiProfile?.id);

  const totalApplications = allApplications.length;
  const underReview = allApplications.filter(app => app.applicationStatus === 'under_review').length;
  const totalOffered = myOffers.reduce((sum, offer) => sum + offer.offeredAmount, 0);
  const pendingOffers = myOffers.filter(offer => offer.offerStatus === 'pending_acceptance').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'under_review':
        return 'text-blue-600 bg-blue-100';
      case 'offer_sent':
        return 'text-green-600 bg-green-100';
      case 'accepted':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {fiProfile?.institutionName || 'Financial Institution'}!
        </h1>
        <p className="text-green-100">
          Review loan applications and manage your lending pipeline.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Applications</p>
              <p className="text-2xl font-semibold text-gray-900">{totalApplications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Eye className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Under Review</p>
              <p className="text-2xl font-semibold text-gray-900">{underReview}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Offered</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${totalOffered.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Responses</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingOffers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {allApplications.slice(0, 5).map((application) => (
              <div
                key={application.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        {application.smbProfile?.companyName}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.applicationStatus)}`}>
                        {application.applicationStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      ${application.loanAmountRequested.toLocaleString()} - {application.loanPurpose}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {application.loanType.replace('_', ' ')} • {application.repaymentPeriodRequested} months • 
                      Submitted {application.submittedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900">Review Applications</p>
                <p className="text-sm text-gray-600">Browse available loan applications</p>
              </div>
            </button>

            <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900">Manage Offers</p>
                <p className="text-sm text-gray-600">Track your loan offers</p>
              </div>
            </button>

            <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900">Update Profile</p>
                <p className="text-sm text-gray-600">Manage institution details</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}