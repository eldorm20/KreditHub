import React, { useState } from 'react';
import { Plus, FileText, Clock, CheckCircle, XCircle, Eye, MessageSquare } from 'lucide-react';
import { mockLoanApplications } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { LoanType } from '../../types';

export function SMBApplications() {
  const { smbProfile } = useAuth();
  const [showNewApplicationModal, setShowNewApplicationModal] = useState(false);
  const [newApplication, setNewApplication] = useState({
    loanAmountRequested: '',
    loanPurpose: '',
    repaymentPeriodRequested: '',
    loanType: 'working_capital' as LoanType
  });

  const applications = mockLoanApplications.filter(app => app.smbId === smbProfile?.id);

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

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally submit to your API
    console.log('New application:', newApplication);
    setShowNewApplicationModal(false);
    setNewApplication({
      loanAmountRequested: '',
      loanPurpose: '',
      repaymentPeriodRequested: '',
      loanType: 'working_capital'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Applications</h1>
          <p className="text-gray-600 mt-1">Track and manage your loan applications</p>
        </div>
        <button
          onClick={() => setShowNewApplicationModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow">
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first loan application.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowNewApplicationModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {applications.map((application) => (
              <div key={application.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        ${application.loanAmountRequested.toLocaleString()}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.applicationStatus)}`}>
                        {getStatusIcon(application.applicationStatus)}
                        <span className="ml-1 capitalize">{application.applicationStatus.replace('_', ' ')}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{application.loanPurpose}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Type: {application.loanType.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>Term: {application.repaymentPeriodRequested} months</span>
                      <span>•</span>
                      <span>Submitted: {application.submittedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Application Modal */}
      {showNewApplicationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">New Loan Application</h3>
                <button
                  onClick={() => setShowNewApplicationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loan Amount *
                    </label>
                    <input
                      type="number"
                      value={newApplication.loanAmountRequested}
                      onChange={(e) => setNewApplication({ ...newApplication, loanAmountRequested: e.target.value })}
                      required
                      min="1000"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter amount in USD"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Repayment Period *
                    </label>
                    <select
                      value={newApplication.repaymentPeriodRequested}
                      onChange={(e) => setNewApplication({ ...newApplication, repaymentPeriodRequested: e.target.value })}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select period</option>
                      <option value="6">6 months</option>
                      <option value="12">12 months</option>
                      <option value="18">18 months</option>
                      <option value="24">24 months</option>
                      <option value="36">36 months</option>
                      <option value="48">48 months</option>
                      <option value="60">60 months</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loan Type *
                  </label>
                  <select
                    value={newApplication.loanType}
                    onChange={(e) => setNewApplication({ ...newApplication, loanType: e.target.value as LoanType })}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="working_capital">Working Capital</option>
                    <option value="equipment_purchase">Equipment Purchase</option>
                    <option value="investment">Investment</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loan Purpose *
                  </label>
                  <textarea
                    value={newApplication.loanPurpose}
                    onChange={(e) => setNewApplication({ ...newApplication, loanPurpose: e.target.value })}
                    required
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe how you plan to use the loan funds..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewApplicationModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}