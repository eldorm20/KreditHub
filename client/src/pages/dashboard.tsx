import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, BarChart3, MessageCircle, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Link } from "wouter";

interface User {
  id: string;
  email: string;
  userType: 'smb' | 'fi' | 'admin';
}

interface LoanApplication {
  id: string;
  smbId: string;
  loanAmountRequested: number;
  loanPurpose: string;
  applicationStatus: string;
  submittedAt: string;
}

export default function Dashboard() {
  // Mock user data for now - in real app would come from auth context
  const user = {
    id: "current-user",
    email: "eliot.anderson@example.com",
    userType: "smb" as const
  };

  // Mock applications data for demo - in real app would come from API
  const applications: LoanApplication[] = [
    {
      id: "L-001",
      smbId: "smb-1",
      loanAmountRequested: 50000,
      loanPurpose: "Working capital for expansion",
      applicationStatus: "pending",
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'under_review': return <AlertCircle className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user.userType === 'smb' ? 'Business User' : 'Financial Institution'}!
              </h1>
              <p className="text-gray-600 mt-2">
                Your central hub for managing loan applications and documents.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">English</span>
            </div>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/apply">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Apply for a New Loan</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Start your application process quickly and easily.
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/documents">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Manage Documents</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Upload, view, and track the status of your documents.
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/applications">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle className="text-lg">Check Loan Status</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  View the progress of your submitted loan applications.
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/analytics">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">View Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Get insights on your loan applications.
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/messages">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                  <MessageCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-lg">Messages</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Communicate directly with bank officers.
                </CardDescription>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(app.applicationStatus)}
                      <div>
                        <p className="font-medium">
                          Loan application #{app.id.slice(0, 6)} submitted.
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(app.submittedAt).toLocaleDateString()} • Amount: ${app.loanAmountRequested.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(app.applicationStatus)}>
                      {app.applicationStatus.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No recent activity</p>
                <Button asChild className="mt-4">
                  <Link href="/apply">Apply for your first loan</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}