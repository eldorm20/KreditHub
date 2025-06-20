import React, { useState } from 'react';
import { Save, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LegalForm } from '../../types';

export function SMBProfile() {
  const { smbProfile, updateSMBProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: smbProfile?.companyName || '',
    tin: smbProfile?.tin || '',
    legalForm: smbProfile?.legalForm || 'llc' as LegalForm,
    legalAddress: smbProfile?.legalAddress || '',
    contactPerson: smbProfile?.contactPerson || '',
    phoneNumber: smbProfile?.phoneNumber || '',
    industrySector: smbProfile?.industrySector || '',
    numEmployees: smbProfile?.numEmployees || 0,
    annualRevenue: smbProfile?.annualRevenue || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSMBProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      companyName: smbProfile?.companyName || '',
      tin: smbProfile?.tin || '',
      legalForm: smbProfile?.legalForm || 'llc' as LegalForm,
      legalAddress: smbProfile?.legalAddress || '',
      contactPerson: smbProfile?.contactPerson || '',
      phoneNumber: smbProfile?.phoneNumber || '',
      industrySector: smbProfile?.industrySector || '',
      numEmployees: smbProfile?.numEmployees || 0,
      annualRevenue: smbProfile?.annualRevenue || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your business information and verification status
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {smbProfile?.isVerified ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Verified</span>
              </div>
            ) : (
              <div className="flex items-center text-yellow-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Verification Pending</span>
              </div>
            )}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                disabled={!isEditing}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                TIN (Taxpayer ID) *
              </label>
              <input
                type="text"
                value={formData.tin}
                onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                disabled={!isEditing}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Legal Form *
              </label>
              <select
                value={formData.legalForm}
                onChange={(e) => setFormData({ ...formData, legalForm: e.target.value as LegalForm })}
                disabled={!isEditing}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="llc">Limited Liability Company (LLC)</option>
                <option value="individual_entrepreneur">Individual Entrepreneur</option>
                <option value="joint_stock">Joint Stock Company</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Industry Sector *
              </label>
              <input
                type="text"
                value={formData.industrySector}
                onChange={(e) => setFormData({ ...formData, industrySector: e.target.value })}
                disabled={!isEditing}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Employees
              </label>
              <input
                type="number"
                value={formData.numEmployees}
                onChange={(e) => setFormData({ ...formData, numEmployees: parseInt(e.target.value) || 0 })}
                disabled={!isEditing}
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Annual Revenue Range
              </label>
              <select
                value={formData.annualRevenue}
                onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                disabled={!isEditing}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="">Select range</option>
                <option value="Under $100,000">Under $100,000</option>
                <option value="$100,000 - $500,000">$100,000 - $500,000</option>
                <option value="$500,000 - $1,000,000">$500,000 - $1,000,000</option>
                <option value="$1,000,000 - $5,000,000">$1,000,000 - $5,000,000</option>
                <option value="Over $5,000,000">Over $5,000,000</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Legal Address *
            </label>
            <textarea
              value={formData.legalAddress}
              onChange={(e) => setFormData({ ...formData, legalAddress: e.target.value })}
              disabled={!isEditing}
              required
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Documents Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Supporting Documents</h2>
          <p className="text-sm text-gray-600 mt-1">
            Upload required documents for verification and loan applications
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-900">Company Charter</p>
              <p className="text-xs text-gray-500">PDF, DOC (max 10MB)</p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-500">
                Upload Document
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-900">Financial Statements</p>
              <p className="text-xs text-gray-500">PDF, XLS (max 10MB)</p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-500">
                Upload Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}