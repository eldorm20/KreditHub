import React from 'react';
import { DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { mockLoanOffers, mockLoanApplications } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

export function FIOffers() {
  const { fiProfile } = useAuth();

  const offers = mockLoanOffers.filter(offer => offer.fiId === fiProfile?.id);

  const getOfferStatusColor = (status: string) => {
    switch (status) {
      case 'pending_acceptance':
        return 'text-yellow-600 bg-yellow-100';
      case 'accepted':
        return 'text-green-600 bg-green-100';
      case 'rejected_by_smb':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getOfferStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_acceptance':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected_by_smb':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getApplicationForOffer = (loanApplicationId: string) => {
    return mockLoanApplications.find(app => app.id === loanApplicationId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Loan Offers</h1>
        <p className="text-gray-600 mt-1">Track the status of offers you've sent to businesses</p>
      </div>

      {/* Offers List */}
      <div className="space-y-6">
        {offers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No offers sent yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your loan offers to businesses will appear here once you start reviewing applications.
            </p>
          </div>
        ) : (
          offers.map((offer) => {
            const application = getApplicationForOffer(offer.loanApplicationId);
            return (
              <div key={offer.id} className="bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="p-6">
                  {/* Offer Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application?.smbProfile?.companyName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {application?.loanPurpose}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getOfferStatusColor(offer.offerStatus)}`}>
                      {getOfferStatusIcon(offer.offerStatus)}
                      <span className="ml-1 capitalize">{offer.offerStatus.replace('_', ' ')}</span>
                    </span>
                  </div>

                  {/* Offer vs Request Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Original Request</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Amount:</span>
                          <span className="text-sm font-medium">
                            ${application?.loanAmountRequested.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Period:</span>
                          <span className="text-sm font-medium">
                            {application?.repaymentPeriodRequested} months
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Type:</span>
                          <span className="text-sm font-medium capitalize">
                            {application?.loanType.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Your Offer</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Amount:</span>
                          <span className="text-sm font-medium text-green-700">
                            ${offer.offeredAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Period:</span>
                          <span className="text-sm font-medium text-green-700">
                            {offer.repaymentPeriodOffered} months
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Interest Rate:</span>
                          <span className="text-sm font-medium text-green-700">
                            {offer.interestRate}% p.a.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Offer Conditions */}
                  {offer.offerConditions && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Terms & Conditions</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{offer.offerConditions}</p>
                      </div>
                    </div>
                  )}

                  {/* Company Information */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Company Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Industry:</span>
                        <span className="ml-2 font-medium">{application?.smbProfile?.industrySector}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Employees:</span>
                        <span className="ml-2 font-medium">{application?.smbProfile?.numEmployees}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Revenue:</span>
                        <span className="ml-2 font-medium">{application?.smbProfile?.annualRevenue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>
                        Application submitted: {application?.submittedAt.toLocaleDateString()}
                      </span>
                      <span>
                        Offer sent: {offer.offeredAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Status-specific Actions */}
                  {offer.offerStatus === 'accepted' && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Offer Accepted!</p>
                          <p className="text-sm text-green-600">You can now proceed with the loan processing.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {offer.offerStatus === 'rejected_by_smb' && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <XCircle className="h-5 w-5 text-red-600 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-red-800">Offer Declined</p>
                          <p className="text-sm text-red-600">The business has declined your offer.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {offer.offerStatus === 'pending_acceptance' && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Awaiting Response</p>
                          <p className="text-sm text-yellow-600">The business is reviewing your offer.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}