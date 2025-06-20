import React, { useState } from 'react';
import { Search, Filter, Eye, MessageSquare, DollarSign, Clock, Building2 } from 'lucide-react';
import { mockLoanApplications } from '../../data/mockData';
import { LoanType } from '../../types';

export function FIApplications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoanType, setSelectedLoanType] = useState<LoanType | ''>('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);

  const filteredApplications = mockLoanApplications.filter(app => {
    const matchesSearch = !searchTerm || 
      app.smbProfile?.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.loanPurpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLoanType = !selectedLoanType || app.loanType === selectedLoanType;
    
    const matchesMinAmount = !minAmount || app.loanAmountRequested >= parseInt(minAmount);
    const matchesMaxAmount = !maxAmount || app.loanAmountRequested <= parseInt(maxAmount);
    
    return matchesSearch && matchesLoanType && matchesMinAmount && matchesMaxAmount;
  });

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

  const handleMarkUnderReview = (applicationId: string) => {
    console.log('Marking application under review:', applicationId);
    // Here you would make an API call to update the status
  };

  const handleSendOffer = (applicationId: string) => {
    console.log('Sending offer for application:', applicationId);
    // Here you would open a modal to create and send an offer
  };

  const handleRejectApplication = (applicationId: string) => {
    console.log('Rejecting application:', applicationId);
    // Here you would make an API call to reject the application
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Review Applications</h1>
        <p className="text-gray-600 mt-1">Browse and evaluate loan applications from businesses</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Search by company name or purpose..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Type
            </label>
            <select
              value={selectedLoanType}
              onChange={(e) => setSelectedLoanType(e.target.value as LoanType | '')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Types</option>
              <option value="working_capital">Working Capital</option>
              <option value="equipment_purchase">Equipment Purchase</option>
              <option value="investment">Investment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Amount
            </label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="$0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Amount
            </label>
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="No limit"
            />
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria to see more results.
            </p>
          </div>
        ) : (
          filteredApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="p-6">
                {/* Application Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.smbProfile?.companyName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {application.smbProfile?.industrySector}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.applicationStatus)}`}>
                    {application.applicationStatus.replace('_', ' ')}
                  </span>
                </div>

                {/* Loan Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <DollarSign className="h-5 w-5 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-600">Requested Amount</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${application.loanAmountRequested.toLocaleString()}
                    </p>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="h-5 w-5 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-600">Repayment Period</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {application.repaymentPeriodRequested} months
                    </p>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Loan Type</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {application.loanType.replace('_', ' ')}
                    </p>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Employees</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {application.smbProfile?.numEmployees || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Purpose */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Loan Purpose</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                    {application.loanPurpose}
                  </p>
                </div>

                {/* Company Info */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Company Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">TIN:</span>
                      <span className="ml-2 font-medium">{application.smbProfile?.tin}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Legal Form:</span>
                      <span className="ml-2 font-medium capitalize">
                        {application.smbProfile?.legalForm.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Revenue:</span>
                      <span className="ml-2 font-medium">{application.smbProfile?.annualRevenue}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Verified:</span>
                      <span className={`ml-2 font-medium ${application.smbProfile?.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                        {application.smbProfile?.isVerified ? 'Yes' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Submitted {application.submittedAt.toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <MessageSquare className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    {application.applicationStatus === 'pending' && (
                      <button
                        onClick={() => handleMarkUnderReview(application.id)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Mark Under Review
                      </button>
                    )}
                    {(application.applicationStatus === 'under_review' || application.applicationStatus === 'pending') && (
                      <>
                        <button
                          onClick={() => handleSendOffer(application.id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          Send Offer
                        </button>
                        <button
                          onClick={() => handleRejectApplication(application.id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}