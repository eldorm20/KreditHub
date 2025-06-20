import React from 'react';
import { FileText, Clock, CheckCircle, XCircle, DollarSign, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockLoanApplications, mockLoanOffers } from '../../data/mockData';

export function SMBDashboard() {
  const { smbProfile } = useAuth();

  const applications = mockLoanApplications.filter(app => app.smbId === smbProfile?.id);
  const offers = mockLoanOffers.filter(offer => 
    applications.some(app => app.id === offer.loanApplicationId)
  );

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'under_review':
        return <FileText className="h-4 w-4" />;
      case 'offer_sent':
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const totalRequested = applications.reduce((sum, app) => sum + app.loanAmountRequested, 0);
  const totalOffered = offers.reduce((sum, offer) => sum + offer.offeredAmount, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {smbProfile?.companyName || 'Business Owner'}!
        </h1>
        <p className="text-blue-100">
          Manage your loan applications and track your funding progress.
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
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-semibold text-gray-900">{applications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Offers</p>
              <p className="text-2xl font-semibold text-gray-900">{offers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requested</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${totalRequested.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Offered</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${totalOffered.toLocaleString()}
              </p>
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
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first loan application.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          ${application.loanAmountRequested.toLocaleString()} - {application.loanPurpose}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.applicationStatus)}`}>
                          {getStatusIcon(application.applicationStatus)}
                          <span className="ml-1 capitalize">{application.applicationStatus.replace('_', ' ')}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {application.loanType.replace('_', ' ')} • {application.repaymentPeriodRequested} months
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted {application.submittedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900">New Application</p>
                <p className="text-sm text-gray-600">Submit a new loan application</p>
              </div>
            </button>

            <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900">Update Profile</p>
                <p className="text-sm text-gray-600">Keep your company information current</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}