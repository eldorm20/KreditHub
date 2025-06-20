import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Filter, Eye, CheckCircle, XCircle, Clock, Building } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface LoanApplication {
  id: string;
  applicantName: string;
  businessName: string;
  loanAmount: number;
  loanType: string;
  submittedAt: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  riskScore: number;
  documents: number;
}

export default function RecentApplications() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [applications, setApplications] = useState<LoanApplication[]>([
    {
      id: "APP-001",
      applicantName: "John Smith",
      businessName: "TechStart Solutions LLC",
      loanAmount: 50000,
      loanType: "working_capital",
      submittedAt: "2024-01-15 09:30:00",
      status: "pending",
      riskScore: 72,
      documents: 4
    },
    {
      id: "APP-002",
      applicantName: "Sarah Johnson",
      businessName: "Green Energy Corp",
      loanAmount: 120000,
      loanType: "equipment_purchase",
      submittedAt: "2024-01-14 14:20:00",
      status: "under_review",
      riskScore: 85,
      documents: 6
    },
    {
      id: "APP-003",
      applicantName: "Mike Chen",
      businessName: "Digital Marketing Pro",
      loanAmount: 35000,
      loanType: "investment",
      submittedAt: "2024-01-13 11:45:00",
      status: "approved",
      riskScore: 91,
      documents: 5
    },
    {
      id: "APP-004",
      applicantName: "Emma Wilson",
      businessName: "Retail Plus Ltd",
      loanAmount: 75000,
      loanType: "working_capital",
      submittedAt: "2024-01-12 16:10:00",
      status: "rejected",
      riskScore: 45,
      documents: 3
    }
  ]);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateApplicationStatus = (id: string, newStatus: LoanApplication['status']) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
    
    toast({
      title: "Status Updated",
      description: `Application ${id} status updated to ${newStatus.replace('_', ' ')}`,
    });
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

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/fi/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to FI Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recent Loan Applications</h1>
          <p className="text-gray-600">
            Review and manage incoming loan applications from businesses
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 modern-card animate-slide-up">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by business name, applicant, or application ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-6">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="modern-card hover:shadow-lg transition-all animate-slide-up">
              <CardContent className="pt-6">
                <div className="grid lg:grid-cols-5 gap-6">
                  {/* Application Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{application.businessName}</h3>
                        <p className="text-gray-600">{application.applicantName}</p>
                        <p className="text-sm text-gray-500">ID: {application.id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Loan Details */}
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Loan Amount</div>
                    <div className="font-semibold text-lg">${application.loanAmount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{getLoanTypeLabel(application.loanType)}</div>
                  </div>

                  {/* Risk & Status */}
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Risk Score</div>
                    <div className={`font-semibold text-lg ${getRiskScoreColor(application.riskScore)}`}>
                      {application.riskScore}%
                    </div>
                    <div className="text-sm text-gray-600">{application.documents} documents</div>
                  </div>

                  {/* Status & Actions */}
                  <div>
                    <Badge className={`${getStatusColor(application.status)} flex items-center gap-1 mb-3`}>
                      {getStatusIcon(application.status)}
                      {application.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    
                    <div className="space-y-2">
                      {application.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            className="w-full btn-primary"
                            onClick={() => updateApplicationStatus(application.id, 'under_review')}
                          >
                            Start Review
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full"
                          >
                            View Details
                          </Button>
                        </>
                      )}
                      
                      {application.status === 'under_review' && (
                        <>
                          <Button 
                            size="sm" 
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => updateApplicationStatus(application.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="w-full"
                            onClick={() => updateApplicationStatus(application.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {(application.status === 'approved' || application.status === 'rejected') && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                        >
                          View Details
                        </Button>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-2">
                      Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <Card className="modern-card animate-slide-up">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {applications.filter(a => a.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </CardContent>
          </Card>
          
          <Card className="modern-card animate-slide-up">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {applications.filter(a => a.status === 'under_review').length}
              </div>
              <div className="text-sm text-gray-600">Under Review</div>
            </CardContent>
          </Card>
          
          <Card className="modern-card animate-slide-up">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {applications.filter(a => a.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </CardContent>
          </Card>
          
          <Card className="modern-card animate-slide-up">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {Math.round((applications.filter(a => a.status === 'approved').length / applications.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Approval Rate</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}