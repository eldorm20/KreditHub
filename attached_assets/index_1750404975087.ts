export type UserType = 'smb' | 'fi' | 'admin';

export type ApplicationStatus = 'pending' | 'under_review' | 'offer_sent' | 'accepted' | 'rejected';

export type OfferStatus = 'pending_acceptance' | 'accepted' | 'rejected_by_smb';

export type LoanType = 'working_capital' | 'equipment_purchase' | 'investment' | 'other';

export type LegalForm = 'llc' | 'individual_entrepreneur' | 'joint_stock' | 'other';

export interface User {
  id: string;
  email: string;
  userType: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export interface SMBProfile {
  id: string;
  userId: string;
  companyName: string;
  tin: string;
  legalForm: LegalForm;
  legalAddress: string;
  contactPerson: string;
  phoneNumber: string;
  industrySector: string;
  numEmployees: number;
  annualRevenue: string;
  isVerified: boolean;
  documentsUrls: string[];
}

export interface FIProfile {
  id: string;
  userId: string;
  institutionName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  loanTypesOffered: LoanType[];
  websiteUrl?: string;
}

export interface LoanApplication {
  id: string;
  smbId: string;
  loanAmountRequested: number;
  loanPurpose: string;
  repaymentPeriodRequested: number;
  loanType: LoanType;
  applicationStatus: ApplicationStatus;
  submittedAt: Date;
  lastUpdatedAt: Date;
  supportingDocuments: string[];
  smbProfile?: SMBProfile;
}

export interface LoanOffer {
  id: string;
  loanApplicationId: string;
  fiId: string;
  offeredAmount: number;
  interestRate: number;
  repaymentPeriodOffered: number;
  offerConditions: string;
  offerStatus: OfferStatus;
  offeredAt: Date;
  fiProfile?: FIProfile;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  loanApplicationId?: string;
  messageContent: string;
  sentAt: Date;
  isRead: boolean;
  senderName?: string;
}

export interface AuthContextType {
  user: User | null;
  smbProfile: SMBProfile | null;
  fiProfile: FIProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, userType: UserType) => Promise<boolean>;
  logout: () => void;
  updateSMBProfile: (profile: Partial<SMBProfile>) => void;
  updateFIProfile: (profile: Partial<FIProfile>) => void;
}