import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Link } from "wouter";

interface LoanApplication {
  id: string;
  smbId: string;
  loanAmountRequested: number;
  loanPurpose: string;
  repaymentPeriodRequested: number;
  loanType: string;
  applicationStatus: string;
  submittedAt: string;
  supportingDocuments: string[];
}

export default function Applications() {
  const isLoading = false;
  
  // Mock applications data for demo
  const applications: LoanApplication[] = [
    {
      id: "L-001",
      smbId: "smb-1",
      loanAmountRequested: 50000,
      loanPurpose: "Working capital for business expansion and inventory purchase",
      repaymentPeriodRequested: 24,
      loanType: "working_capital",
      applicationStatus: "pending",
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      supportingDocuments: ["business_license.pdf", "tax_returns_2023.pdf"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'offer_sent': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'under_review': return <AlertCircle className="h-4 w-4" />;
      case 'offer_sent': return <CheckCircle className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getLoanTypeLabel = (type: string) => {
    switch (type) {
      case 'working_capital': return 'Working Capital';
      case 'equipment_purchase': return 'Equipment Purchase';
      case 'investment': return 'Investment';
      case 'other': return 'Other';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">My Loan Applications</h1>
          <p className="text-gray-600 mt-2">
            Here you can view the status and details of all your submitted loan applications.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Your User ID: <code className="bg-gray-100 px-2 py-1 rounded">wvD2qFJcAvz3YfR8NNgiqlqoQ2CKfY</code>
          </p>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="max-w-sm mx-auto">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  You haven't submitted any loan applications yet.
                </h3>
                <p className="text-gray-500 mb-6">
                  Start your first loan application to access financing for your business.
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/apply">
                    <Plus className="h-4 w-4 mr-2" />
                    Apply for a new loan
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        Application #{application.id.slice(0, 8)}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted on {new Date(application.submittedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(application.applicationStatus)} flex items-center gap-2`}>
                      {getStatusIcon(application.applicationStatus)}
                      {application.applicationStatus.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Loan Amount</p>
                      <p className="text-lg font-semibold">
                        ${application.loanAmountRequested.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Loan Type</p>
                      <p className="text-lg font-semibold">
                        {getLoanTypeLabel(application.loanType)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Repayment Period</p>
                      <p className="text-lg font-semibold">
                        {application.repaymentPeriodRequested} months
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Documents</p>
                      <p className="text-lg font-semibold">
                        {application.supportingDocuments.length} uploaded
                      </p>
                    </div>
                  </div>
                  
                  {application.loanPurpose && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 mb-2">Purpose</p>
                      <p className="text-gray-700">{application.loanPurpose}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {application.applicationStatus === 'pending' && (
                        <Button variant="outline" size="sm">
                          Edit Application
                        </Button>
                      )}
                    </div>
                    {application.applicationStatus === 'offer_sent' && (
                      <Button className="bg-green-600 hover:bg-green-700">
                        View Offers
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/apply">
              <Plus className="h-4 w-4 mr-2" />
              Apply for another loan
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}