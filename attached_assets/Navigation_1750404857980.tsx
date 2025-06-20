import React from 'react';
import { 
  Home, 
  FileText, 
  MessageSquare, 
  Building2, 
  Users, 
  BarChart3, 
  Settings,
  CreditCard,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { user } = useAuth();

  const getSMBNavItems = () => [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Company Profile', icon: Building2 },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'offers', label: 'Loan Offers', icon: CreditCard },
    { id: 'messages', label: 'Messages', icon: MessageSquare }
  ];

  const getFINavItems = () => [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Institution Profile', icon: Building2 },
    { id: 'applications', label: 'Review Applications', icon: Search },
    { id: 'offers', label: 'My Offers', icon: CreditCard },
    { id: 'messages', label: 'Messages', icon: MessageSquare }
  ];

  const getAdminNavItems = () => [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'applications', label: 'All Applications', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const getNavItems = () => {
    switch (user?.userType) {
      case 'smb':
        return getSMBNavItems();
      case 'fi':
        return getFINavItems();
      case 'admin':
        return getAdminNavItems();
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-gray-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === item.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}