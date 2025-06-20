import React from 'react';
import { CheckCircle, XCircle, Clock, DollarSign, Calendar, Percent } from 'lucide-react';
import { mockLoanOffers, mockLoanApplications } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

export function SMBOffers() {
  const { smbProfile } = useAuth();

  const applications = mockLoanApplications.filter(app => app.smbId === smbProfile?.id);
  const offers = mockLoanOffers.filter(offer => 
    applications.some(app => app.id === offer.loanApplicationId)
  );

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

  const handleAcceptOffer = (offerId: string) => {
    console.log('Accepting offer:', offerId);
    // Here you would make an API call to accept the offer
  };

  const handleRejectOffer = (offerId: string) => {
    console.log('Rejecting offer:', offerId);
    // Here you would make an API call to reject the offer
  };

  const getApplicationForOffer = (loanApplicationId: string) => {
    return applications.find(app => app.id === loanApplicationId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Loan Offers</h1>
        <p className="text-gray-600 mt-1">Review and respond to offers from financial institutions</p>
      </div>

      {/* Offers List */}
      <div className="space-y-6">
        {offers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No offers yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Offers from financial institutions will appear here once they review your applications.
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
                        {offer.fiProfile?.institutionName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Offer for: {application?.loanPurpose}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getOfferStatusColor(offer.offerStatus)}`}>
                      {getOfferStatusIcon(offer.offerStatus)}
                      <span className="ml-1 capitalize">{offer.offerStatus.replace('_', ' ')}</span>
                    </span>
                  </div>

                  {/* Offer Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-sm text-gray-600">Offered Amount</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${offer.offeredAmount.toLocaleString()}
                      </p>
                      {application && (
                        <p className="text-xs text-gray-500">
                          Requested: ${application.loanAmountRequested.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Percent className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600">Interest Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{offer.interestRate}%</p>
                      <p className="text-xs text-gray-500">per annum</p>
                    </div>

                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Calendar className="h-6 w-6 text-orange-600" />
                      </div>
                      <p className="text-sm text-gray-600">Repayment Period</p>
                      <p className="text-2xl font-bold text-gray-900">{offer.repaymentPeriodOffered}</p>
                      <p className="text-xs text-gray-500">months</p>
                    </div>
                  </div>

                  {/* Offer Conditions */}
                  {offer.offerConditions && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Terms & Conditions</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700">{offer.offerConditions}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {offer.offerStatus === 'pending_acceptance' && (
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleRejectOffer(offer.id)}
                        className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Decline Offer</span>
                      </button>
                      <button
                        onClick={() => handleAcceptOffer(offer.id)}
                        className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Accept Offer</span>
                      </button>
                    </div>
                  )}

                  {/* Offer Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Offered on {offer.offeredAt.toLocaleDateString()}</span>
                      <span>Contact: {offer.fiProfile?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}