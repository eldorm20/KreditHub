import { User, SMBProfile, FIProfile, LoanApplication, LoanOffer, Message } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'smbuser@example.com',
    userType: 'smb',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    email: 'bank@example.com',
    userType: 'fi',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    email: 'admin@kredithub.com',
    userType: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const mockSMBProfiles: SMBProfile[] = [
  {
    id: '1',
    userId: '1',
    companyName: 'TechSolutions LLC',
    tin: '123456789',
    legalForm: 'llc',
    legalAddress: 'Tashkent, Yunusabad district, Amir Temur street 25',
    contactPerson: 'John Doe',
    phoneNumber: '+998901234567',
    industrySector: 'Information Technology',
    numEmployees: 25,
    annualRevenue: '$500,000 - $1,000,000',
    isVerified: true,
    documentsUrls: ['doc1.pdf', 'financial-statements.pdf']
  }
];

export const mockFIProfiles: FIProfile[] = [
  {
    id: '1',
    userId: '2',
    institutionName: 'National Development Bank',
    contactPerson: 'Sarah Wilson',
    phoneNumber: '+998712345678',
    email: 'loans@ndb.uz',
    loanTypesOffered: ['working_capital', 'equipment_purchase', 'investment'],
    websiteUrl: 'https://ndb.uz'
  }
];

export const mockLoanApplications: LoanApplication[] = [
  {
    id: '1',
    smbId: '1',
    loanAmountRequested: 50000,
    loanPurpose: 'Equipment purchase for new production line',
    repaymentPeriodRequested: 24,
    loanType: 'equipment_purchase',
    applicationStatus: 'under_review',
    submittedAt: new Date('2024-01-20'),
    lastUpdatedAt: new Date('2024-01-22'),
    supportingDocuments: ['business-plan.pdf', 'equipment-quote.pdf'],
    smbProfile: mockSMBProfiles[0]
  },
  {
    id: '2',
    smbId: '1',
    loanAmountRequested: 25000,
    loanPurpose: 'Working capital for seasonal operations',
    repaymentPeriodRequested: 12,
    loanType: 'working_capital',
    applicationStatus: 'offer_sent',
    submittedAt: new Date('2024-01-18'),
    lastUpdatedAt: new Date('2024-01-21'),
    supportingDocuments: ['financial-statements.pdf'],
    smbProfile: mockSMBProfiles[0]
  }
];

export const mockLoanOffers: LoanOffer[] = [
  {
    id: '1',
    loanApplicationId: '2',
    fiId: '1',
    offeredAmount: 22000,
    interestRate: 12.5,
    repaymentPeriodOffered: 12,
    offerConditions: 'Monthly payments required. Collateral: Equipment or property.',
    offerStatus: 'pending_acceptance',
    offeredAt: new Date('2024-01-21'),
    fiProfile: mockFIProfiles[0]
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    loanApplicationId: '1',
    messageContent: 'Thank you for your application. We are reviewing your documents and will get back to you within 3-5 business days.',
    sentAt: new Date('2024-01-22T10:30:00'),
    isRead: true,
    senderName: 'National Development Bank'
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '2',
    loanApplicationId: '1',
    messageContent: 'I have additional financial statements from Q4 2023. Should I upload them?',
    sentAt: new Date('2024-01-22T14:15:00'),
    isRead: false,
    senderName: 'TechSolutions LLC'
  }
];