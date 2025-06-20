import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Download, FileText, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
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
  lastUpdatedAt: string;
  supportingDocuments: string[];
  applicantName: string;
  businessName: string;
  contactEmail: string;
  phoneNumber: string;
}

interface LoanOffer {
  id: string;
  fiName: string;
  offeredAmount: number;
  interestRate: number;
  repaymentPeriod: number;
  offerConditions: string;
  offerStatus: string;
  offeredAt: string;
}

export default function ApplicationDetails() {
  const [match, params] = useRoute("/applications/:id");
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [offers, setOffers] = useState<LoanOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      // Mock data for demo
      const mockApplication: LoanApplication = {
        id: params.id,
        smbId: "smb-1",
        loanAmountRequested: 50000,
        loanPurpose: "Working capital for business expansion and inventory purchase to meet growing customer demand and establish new product lines.",
        repaymentPeriodRequested: 24,
        loanType: "working_capital",
        applicationStatus: "under_review",
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        supportingDocuments: ["business_license.pdf", "tax_returns_2023.pdf", "financial_statements.xlsx", "bank_statements.pdf"],
        applicantName: "John Smith",
        businessName: "TechStart Solutions LLC",
        contactEmail: "john@techstart.com",
        phoneNumber: "+1 (555) 123-4567"
      };

      const mockOffers: LoanOffer[] = [
        {
          id: "offer-1",
          fiName: "National Bank of Uzbekistan",
          offeredAmount: 45000,
          interestRate: 12.5,
          repaymentPeriod: 24,
          offerConditions: "Standard business loan terms with monthly payments. Requires business insurance and personal guarantee.",
          offerStatus: "pending_acceptance",
          offeredAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "offer-2",
          fiName: "Kapital Bank",
          offeredAmount: 50000,
          interestRate: 13.2,
          repaymentPeriod: 30,
          offerConditions: "Flexible repayment terms with option for early payment without penalty. Business collateral required.",
          offerStatus: "pending_acceptance",
          offeredAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ];

      setApplication(mockApplication);
      setOffers(mockOffers);
      setIsLoading(false);
    }
  }, [params?.id]);

  if (!match || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h1>
          <Button asChild>
            <Link href="/applications">Return to Applications</Link>
          </Button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/applications">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Application #{application.id.slice(0, 8)}
              </h1>
              <p className="text-gray-600 mt-2">
                Submitted on {new Date(application.submittedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={`${getStatusColor(application.applicationStatus)} flex items-center gap-2 px-3 py-1`}>
                {getStatusIcon(application.applicationStatus)}
                {application.applicationStatus.replace('_', ' ').toUpperCase()}
              </Badge>
              {application.applicationStatus === 'pending' && (
                <Button asChild>
                  <Link href={`/applications/${application.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Application
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Application Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="offers">Loan Offers ({offers.length})</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Loan Information */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Loan Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Requested Amount</p>
                      <p className="text-2xl font-bold">${application.loanAmountRequested.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Repayment Period</p>
                      <p className="text-xl font-semibold">{application.repaymentPeriodRequested} months</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Loan Type</p>
                    <Badge variant="secondary">
                      {application.loanType.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Purpose</p>
                    <p className="text-gray-700">{application.loanPurpose}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Business Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Business Name</p>
                    <p className="font-semibold">{application.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact Person</p>
                    <p className="font-semibold">{application.applicantName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-blue-600">{application.contactEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p>{application.phoneNumber}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Supporting Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application.supportingDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="font-medium">{doc}</p>
                          <p className="text-sm text-gray-500">Uploaded with application</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers">
            <div className="space-y-6">
              {offers.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Offers Yet</h3>
                    <p className="text-gray-500">Financial institutions are reviewing your application. You'll be notified when offers arrive.</p>
                  </CardContent>
                </Card>
              ) : (
                offers.map((offer) => (
                  <Card key={offer.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{offer.fiName}</CardTitle>
                        <Badge className="bg-blue-100 text-blue-800">
                          {offer.offerStatus.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Offered Amount</p>
                          <p className="text-xl font-bold">${offer.offeredAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Interest Rate</p>
                          <p className="text-xl font-bold">{offer.interestRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Repayment Period</p>
                          <p className="text-xl font-bold">{offer.repaymentPeriod} months</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500 mb-2">Terms & Conditions</p>
                        <p className="text-gray-700">{offer.offerConditions}</p>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t">
                        <p className="text-sm text-gray-500">
                          Offered {new Date(offer.offeredAt).toLocaleDateString()}
                        </p>
                        <div className="space-x-2">
                          <Button variant="outline">View Details</Button>
                          <Button className="bg-green-600 hover:bg-green-700">Accept Offer</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Application Submitted</p>
                      <p className="text-sm text-gray-500">
                        {new Date(application.submittedAt).toLocaleDateString()} at {new Date(application.submittedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Application Under Review</p>
                      <p className="text-sm text-gray-500">
                        {new Date(application.lastUpdatedAt).toLocaleDateString()} at {new Date(application.lastUpdatedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-500">Waiting for Decision</p>
                      <p className="text-sm text-gray-400">Pending</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}