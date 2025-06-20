import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Filter, Download, MessageSquare, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useToast } from "@/hooks/use-toast";

interface LoanApplication {
  id: string;
  companyName: string;
  contactPerson: string;
  loanAmountRequested: number;
  loanPurpose: string;
  repaymentPeriodRequested: number;
  loanType: string;
  applicationStatus: string;
  submittedAt: string;
  creditScore: number;
  industry: string;
  employees: number;
  revenue: string;
}

export default function FIApplications() {
  const { formatAmount } = useCurrency();
  const { toast } = useToast();
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [decision, setDecision] = useState("");
  const [notes, setNotes] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");

  // Mock applications data
  const applications: LoanApplication[] = [
    {
      id: "L-001",
      companyName: "TechStart Solutions",
      contactPerson: "John Smith",
      loanAmountRequested: 50000,
      loanPurpose: "Working capital for business expansion and new product development",
      repaymentPeriodRequested: 24,
      loanType: "working_capital",
      applicationStatus: "pending",
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      creditScore: 750,
      industry: "Technology",
      employees: 15,
      revenue: "$500K-$1M"
    },
    {
      id: "L-002",
      companyName: "Green Energy Corp",
      contactPerson: "Sarah Johnson",
      loanAmountRequested: 120000,
      loanPurpose: "Equipment purchase for solar panel installation business",
      repaymentPeriodRequested: 36,
      loanType: "equipment_purchase",
      applicationStatus: "under_review",
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      creditScore: 680,
      industry: "Renewable Energy",
      employees: 8,
      revenue: "$250K-$500K"
    },
    {
      id: "L-003",
      companyName: "Local Restaurant Chain",
      contactPerson: "Mike Chen",
      loanAmountRequested: 75000,
      loanPurpose: "Investment in new restaurant location in downtown area",
      repaymentPeriodRequested: 60,
      loanType: "investment",
      applicationStatus: "pending",
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      creditScore: 720,
      industry: "Food & Beverage",
      employees: 25,
      revenue: "$1M-$2M"
    }
  ];

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === "all" || app.applicationStatus === filter;
    const matchesSearch = app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDecision = (appId: string, newStatus: string) => {
    toast({
      title: "Application Updated",
      description: `Application ${appId} has been ${newStatus}`,
    });
    setSelectedApp(null);
    setDecision("");
    setNotes("");
    setOfferAmount("");
    setInterestRate("");
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
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Loan Applications Review
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Review and process business loan applications
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Applications List */}
          <div className="lg:col-span-2">
            {/* Filters and Search */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Applications */}
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <Card key={app.id} className={`cursor-pointer transition-all ${selectedApp?.id === app.id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'}`}
                      onClick={() => setSelectedApp(app)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {app.companyName}
                          </h3>
                          <Badge className={getStatusColor(app.applicationStatus)}>
                            {app.applicationStatus.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          Contact: {app.contactPerson} • {app.industry} • {app.employees} employees
                        </p>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Requested Amount:</span>
                            <div className="font-semibold">{formatAmount(app.loanAmountRequested)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Credit Score:</span>
                            <div className={`font-semibold ${getCreditScoreColor(app.creditScore)}`}>
                              {app.creditScore}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Term:</span>
                            <div className="font-semibold">{app.repaymentPeriodRequested} months</div>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm">
                          Purpose: {app.loanPurpose}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Applied {new Date(app.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Application Details & Decision Panel */}
          <div className="lg:col-span-1">
            {selectedApp ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Application Review</CardTitle>
                  <CardDescription>
                    {selectedApp.companyName} - {selectedApp.id}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Application Details */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Business Info</label>
                      <div className="text-sm">
                        <p><strong>Industry:</strong> {selectedApp.industry}</p>
                        <p><strong>Employees:</strong> {selectedApp.employees}</p>
                        <p><strong>Revenue:</strong> {selectedApp.revenue}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Loan Details</label>
                      <div className="text-sm">
                        <p><strong>Type:</strong> {selectedApp.loanType.replace('_', ' ')}</p>
                        <p><strong>Amount:</strong> {formatAmount(selectedApp.loanAmountRequested)}</p>
                        <p><strong>Term:</strong> {selectedApp.repaymentPeriodRequested} months</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Purpose</label>
                      <p className="text-sm">{selectedApp.loanPurpose}</p>
                    </div>
                  </div>

                  {/* Decision Making */}
                  <div className="border-t pt-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Decision</label>
                      <Select value={decision} onValueChange={setDecision}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select decision" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approve">Approve</SelectItem>
                          <SelectItem value="reject">Reject</SelectItem>
                          <SelectItem value="request_more_info">Request More Info</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {decision === "approve" && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Offer Amount</label>
                          <Input
                            type="number"
                            placeholder="Enter offer amount"
                            value={offerAmount}
                            onChange={(e) => setOfferAmount(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Interest Rate (%)</label>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="e.g., 8.5"
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                      <Textarea
                        placeholder="Add your review notes..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDecision(selectedApp.id, decision)}
                        disabled={!decision}
                        className="flex-1"
                      >
                        {decision === "approve" && <CheckCircle className="h-4 w-4 mr-2" />}
                        {decision === "reject" && <XCircle className="h-4 w-4 mr-2" />}
                        {decision === "request_more_info" && <AlertCircle className="h-4 w-4 mr-2" />}
                        Submit Decision
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-6">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Select an application to review</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}