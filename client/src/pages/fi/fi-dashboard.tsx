import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Users, TrendingUp, Clock, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { Link } from "wouter";
import { useCurrency } from "@/contexts/CurrencyContext";

interface LoanApplication {
  id: string;
  smbId: string;
  companyName: string;
  loanAmountRequested: number;
  loanPurpose: string;
  repaymentPeriodRequested: number;
  loanType: string;
  applicationStatus: string;
  submittedAt: string;
  creditScore: number;
}

export default function FIDashboard() {
  const { formatAmount } = useCurrency();

  // Mock data for FI dashboard
  const applications: LoanApplication[] = [
    {
      id: "L-001",
      smbId: "smb-1",
      companyName: "TechStart Solutions",
      loanAmountRequested: 50000,
      loanPurpose: "Working capital for business expansion",
      repaymentPeriodRequested: 24,
      loanType: "working_capital",
      applicationStatus: "pending",
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      creditScore: 750
    },
    {
      id: "L-002",
      smbId: "smb-2",
      companyName: "Green Energy Corp",
      loanAmountRequested: 120000,
      loanPurpose: "Equipment purchase for solar panel installation",
      repaymentPeriodRequested: 36,
      loanType: "equipment_purchase",
      applicationStatus: "under_review",
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      creditScore: 680
    },
    {
      id: "L-003",
      smbId: "smb-3",
      companyName: "Local Restaurant Chain",
      loanAmountRequested: 75000,
      loanPurpose: "Investment in new location",
      repaymentPeriodRequested: 60,
      loanType: "investment",
      applicationStatus: "pending",
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      creditScore: 720
    }
  ];

  const stats = {
    totalApplications: applications.length,
    pendingReview: applications.filter(app => app.applicationStatus === 'pending').length,
    underReview: applications.filter(app => app.applicationStatus === 'under_review').length,
    totalRequestedAmount: applications.reduce((sum, app) => sum + app.loanAmountRequested, 0),
    averageCreditScore: Math.round(applications.reduce((sum, app) => sum + app.creditScore, 0) / applications.length)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'under_review': return <Eye className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Financial Institution Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Review loan applications and manage your lending portfolio
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <p className="text-xs text-gray-500">Active loan requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReview}</div>
              <p className="text-xs text-gray-500">Awaiting initial review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requested</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatAmount(stats.totalRequestedAmount)}</div>
              <p className="text-xs text-gray-500">Combined loan requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Credit Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageCreditScore}</div>
              <p className="text-xs text-gray-500">Portfolio average</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/fi/applications">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
                  <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Review Applications</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Evaluate loan applications and make approval decisions
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/fi/portfolio">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-3">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">Manage Portfolio</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Monitor active loans and portfolio performance
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/messages">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">Client Communication</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Communicate directly with business applicants
                </CardDescription>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Loan Applications</CardTitle>
            <CardDescription>
              Latest applications requiring your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{app.companyName}</p>
                      <p className="text-sm text-gray-500">Application #{app.id} • {formatAmount(app.loanAmountRequested)}</p>
                      <p className="text-xs text-gray-400 mt-1">{app.loanPurpose}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getCreditScoreColor(app.creditScore)}`}>
                        Credit Score: {app.creditScore}
                      </div>
                      <div className="text-xs text-gray-500">
                        {app.repaymentPeriodRequested} months
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(app.applicationStatus)} flex items-center gap-1`}>
                      {getStatusIcon(app.applicationStatus)}
                      {app.applicationStatus.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}