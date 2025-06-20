import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Calendar, FileText, AlertCircle } from "lucide-react";
import { Link } from "wouter";

interface AnalyticsData {
  creditScore: number;
  lastUpdated: string;
  loanHistory: {
    onTimePayments: string;
    latePayments: string;
    outstandingLoans: number;
  };
}

export default function Analytics() {
  // Mock data - in real app this would come from API
  const analyticsData: AnalyticsData = {
    creditScore: 750,
    lastUpdated: "6/19/2024",
    loanHistory: {
      onTimePayments: "95%",
      latePayments: "5%",
      outstandingLoans: 1
    }
  };

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
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          </div>
          <p className="text-gray-600">
            Gain insights into your credit standing and loan application performance.
          </p>
        </div>

        {/* Date Range Selector */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Select Date Range:</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">From</span>
                <select className="px-3 py-1 border rounded-md text-sm">
                  <option>mm/dd/yyyy</option>
                </select>
                <span className="text-sm text-gray-500">To</span>
                <select className="px-3 py-1 border rounded-md text-sm">
                  <option>mm/dd/yyyy</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Your Loan Application Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Your Loan Application Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">You haven't submitted any loan applications yet.</p>
              </div>
            </CardContent>
          </Card>

          {/* Credit Bureau Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Credit Bureau of Uzbekistan (KATM) Info
                <Badge variant="secondary" className="ml-2">Mock Data</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Credit Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Credit Score:</span>
                  <span className="text-2xl font-bold text-green-600">{analyticsData.creditScore}</span>
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  Last Updated: {analyticsData.lastUpdated}
                </div>
                
                {/* Credit Score Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(analyticsData.creditScore / 850) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Loan History */}
              <div>
                <h4 className="font-medium mb-3">Loan History (Mock):</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">• On-time payments:</span>
                    <span className="font-medium text-green-600">{analyticsData.loanHistory.onTimePayments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">• Late payments:</span>
                    <span className="font-medium text-red-600">{analyticsData.loanHistory.latePayments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">• Outstanding loans:</span>
                    <span className="font-medium">{analyticsData.loanHistory.outstandingLoans}</span>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>Note:</strong> All KATM data is simulated for demonstration purposes. 
                  Real integrations require API access.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Insights */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Application Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">0%</div>
              <p className="text-sm text-gray-500">No applications submitted yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Average Processing Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">N/A</div>
              <p className="text-sm text-gray-500">Submit an application to see data</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Funding Received</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">$0</div>
              <p className="text-sm text-gray-500">No loans disbursed yet</p>
            </CardContent>
          </Card>
        </div>

        {/* Get Started */}
        <div className="mt-8 text-center">
          <Card className="p-8">
            <h3 className="text-xl font-semibold mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">
              Submit your first loan application to start building your credit profile and see detailed analytics.
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/apply">Apply for a Loan</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}