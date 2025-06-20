import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SMBProfile, FIProfile, AuthContextType, UserType } from '../types';
import { mockUsers, mockSMBProfiles, mockFIProfiles } from '../data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [smbProfile, setSMBProfile] = useState<SMBProfile | null>(null);
  const [fiProfile, setFIProfile] = useState<FIProfile | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('kredithub_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      loadUserProfile(userData);
    }
  }, []);

  const loadUserProfile = (userData: User) => {
    if (userData.userType === 'smb') {
      const profile = mockSMBProfiles.find(p => p.userId === userData.id);
      setSMBProfile(profile || null);
    } else if (userData.userType === 'fi') {
      const profile = mockFIProfiles.find(p => p.userId === userData.id);
      setFIProfile(profile || null);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('kredithub_user', JSON.stringify(foundUser));
      loadUserProfile(foundUser);
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, userType: UserType): Promise<boolean> => {
    // Simulate API call
    const newUser: User = {
      id: Date.now().toString(),
      email,
      userType,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setUser(newUser);
    localStorage.setItem('kredithub_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setSMBProfile(null);
    setFIProfile(null);
    localStorage.removeItem('kredithub_user');
  };

  const updateSMBProfile = (profileUpdates: Partial<SMBProfile>) => {
    if (smbProfile) {
      const updatedProfile = { ...smbProfile, ...profileUpdates };
      setSMBProfile(updatedProfile);
    }
  };

  const updateFIProfile = (profileUpdates: Partial<FIProfile>) => {
    if (fiProfile) {
      const updatedProfile = { ...fiProfile, ...profileUpdates };
      setFIProfile(updatedProfile);
    }
  };

  const value: AuthContextType = {
    user,
    smbProfile,
    fiProfile,
    login,
    register,
    logout,
    updateSMBProfile,
    updateFIProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}