import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { Messages } from './components/common/Messages';

// SMB Components
import { SMBDashboard } from './components/smb/SMBDashboard';
import { SMBProfile } from './components/smb/SMBProfile';
import { SMBApplications } from './components/smb/SMBApplications';
import { SMBOffers } from './components/smb/SMBOffers';

// FI Components
import { FIDashboard } from './components/fi/FIDashboard';
import { FIProfile } from './components/fi/FIProfile';
import { FIApplications } from './components/fi/FIApplications';
import { FIOffers } from './components/fi/FIOffers';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserManagement } from './components/admin/UserManagement';

function AuthenticatedApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    if (user?.userType === 'smb') {
      switch (activeTab) {
        case 'dashboard':
          return <SMBDashboard />;
        case 'profile':
          return <SMBProfile />;
        case 'applications':
          return <SMBApplications />;
        case 'offers':
          return <SMBOffers />;
        case 'messages':
          return <Messages />;
        default:
          return <SMBDashboard />;
      }
    } else if (user?.userType === 'fi') {
      switch (activeTab) {
        case 'dashboard':
          return <FIDashboard />;
        case 'profile':
          return <FIProfile />;
        case 'applications':
          return <FIApplications />;
        case 'offers':
          return <FIOffers />;
        case 'messages':
          return <Messages />;
        default:
          return <FIDashboard />;
      }
    } else if (user?.userType === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'users':
          return <UserManagement />;
        case 'applications':
          return <div>All Applications View</div>;
        case 'analytics':
          return <div>Analytics View</div>;
        case 'settings':
          return <div>Settings View</div>;
        default:
          return <AdminDashboard />;
      }
    }

    return <div>Unknown user type</div>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

function UnauthenticatedApp() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">KreditHub</h1>
          <p className="text-gray-600">Connecting businesses with financial institutions</p>
        </div>
        
        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();

  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

export default App;