import React from 'react';
import { LogOut, User, Building2, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user, smbProfile, fiProfile, logout } = useAuth();

  const getUserIcon = () => {
    switch (user?.userType) {
      case 'smb':
        return <Building2 className="h-5 w-5" />;
      case 'fi':
        return <Building2 className="h-5 w-5" />;
      case 'admin':
        return <Shield className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getUserName = () => {
    if (user?.userType === 'smb' && smbProfile) {
      return smbProfile.companyName;
    }
    if (user?.userType === 'fi' && fiProfile) {
      return fiProfile.institutionName;
    }
    if (user?.userType === 'admin') {
      return 'Admin';
    }
    return user?.email || 'User';
  };

  const getUserRole = () => {
    switch (user?.userType) {
      case 'smb':
        return 'Business';
      case 'fi':
        return 'Financial Institution';
      case 'admin':
        return 'Administrator';
      default:
        return 'User';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">KreditHub</h1>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                {getUserIcon()}
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {getUserName()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getUserRole()}
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}