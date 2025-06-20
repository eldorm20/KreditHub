import React, { useState } from 'react';
import { Save, Plus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LoanType } from '../../types';

export function FIProfile() {
  const { fiProfile, updateFIProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    institutionName: fiProfile?.institutionName || '',
    contactPerson: fiProfile?.contactPerson || '',
    phoneNumber: fiProfile?.phoneNumber || '',
    email: fiProfile?.email || '',
    websiteUrl: fiProfile?.websiteUrl || '',
    loanTypesOffered: fiProfile?.loanTypesOffered || [] as LoanType[]
  });

  const availableLoanTypes: { value: LoanType; label: string }[] = [
    { value: 'working_capital', label: 'Working Capital' },
    { value: 'equipment_purchase', label: 'Equipment Purchase' },
    { value: 'investment', label: 'Investment' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFIProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      institutionName: fiProfile?.institutionName || '',
      contactPerson: fiProfile?.contactPerson || '',
      phoneNumber: fiProfile?.phoneNumber || '',
      email: fiProfile?.email || '',
      websiteUrl: fiProfile?.websiteUrl || '',
      loanTypesOffered: fiProfile?.loanTypesOffered || []
    });
    setIsEditing(false);
  };

  const handleAddLoanType = (loanType: LoanType) => {
    if (!formData.loanTypesOffered.includes(loanType)) {
      setFormData({
        ...formData,
        loanTypesOffered: [...formData.loanTypesOffered, loanType]
      });
    }
  };

  const handleRemoveLoanType = (loanType: LoanType) => {
    setFormData({
      ...formData,
      loanTypesOffered: formData.loanTypesOffered.filter(type => type !== loanType)
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Institution Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your financial institution information and loan offerings
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Institution Name *
              </label>
              <input
                type="text"
                value={formData.institutionName}
                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                disabled={!isEditing}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Person *
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                disabled={!isEditing}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                disabled={!isEditing}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Website URL
              </label>
              <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                disabled={!isEditing}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="https://yourbank.com"
              />
            </div>
          </div>

          {/* Loan Types Offered */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Loan Types Offered
            </label>
            
            {/* Currently Selected Loan Types */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {formData.loanTypesOffered.map((loanType) => (
                  <span
                    key={loanType}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                  >
                    {availableLoanTypes.find(type => type.value === loanType)?.label}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLoanType(loanType)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
                {formData.loanTypesOffered.length === 0 && (
                  <span className="text-sm text-gray-500 italic">No loan types selected</span>
                )}
              </div>
            </div>

            {/* Add Loan Types */}
            {isEditing && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Available loan types to add:</p>
                <div className="flex flex-wrap gap-2">
                  {availableLoanTypes
                    .filter(type => !formData.loanTypesOffered.includes(type.value))
                    .map((loanType) => (
                      <button
                        key={loanType.value}
                        type="button"
                        onClick={() => handleAddLoanType(loanType.value)}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-800 transition-colors"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {loanType.label}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Institution Stats */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Institution Statistics</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Applications Reviewed</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Offers Sent</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Loans Approved</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}