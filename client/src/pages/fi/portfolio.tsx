import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart
} from "lucide-react";
import { Link } from "wouter";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Loan {
  id: string;
  companyName: string;
  principal: number;
  currentBalance: number;
  interestRate: number;
  termMonths: number;
  remainingMonths: number;
  monthlyPayment: number;
  status: string;
  riskLevel: string;
  disbursedDate: string;
  nextPaymentDate: string;
  totalPaid: number;
  loanType: string;
}

export default function FIPortfolio() {
  const { formatAmount } = useCurrency();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  // Mock portfolio data
  const loans: Loan[] = [
    {
      id: "L-001",
      companyName: "TechStart Solutions",
      principal: 50000,
      currentBalance: 35000,
      interestRate: 8.5,
      termMonths: 24,
      remainingMonths: 17,
      monthlyPayment: 2300,
      status: "current",
      riskLevel: "low",
      disbursedDate: "2024-01-15",
      nextPaymentDate: "2024-07-15",
      totalPaid: 15000,
      loanType: "working_capital"
    },
    {
      id: "L-002",
      companyName: "Green Energy Corp",
      principal: 120000,
      currentBalance: 95000,
      interestRate: 7.8,
      termMonths: 36,
      remainingMonths: 28,
      monthlyPayment: 3800,
      status: "current",
      riskLevel: "medium",
      disbursedDate: "2024-02-01",
      nextPaymentDate: "2024-07-01",
      totalPaid: 25000,
      loanType: "equipment_purchase"
    },
    {
      id: "L-003",
      companyName: "Local Restaurant Chain",
      principal: 75000,
      currentBalance: 68000,
      interestRate: 9.2,
      termMonths: 60,
      remainingMonths: 54,
      monthlyPayment: 1580,
      status: "late",
      riskLevel: "high",
      disbursedDate: "2024-03-10",
      nextPaymentDate: "2024-06-10",
      totalPaid: 7000,
      loanType: "investment"
    }
  ];

  const portfolioStats = {
    totalLoans: loans.length,
    totalPrincipal: loans.reduce((sum, loan) => sum + loan.principal, 0),
    currentOutstanding: loans.reduce((sum, loan) => sum + loan.currentBalance, 0),
    totalCollected: loans.reduce((sum, loan) => sum + loan.totalPaid, 0),
    averageInterestRate: loans.reduce((sum, loan) => sum + loan.interestRate, 0) / loans.length,
    currentLoans: loans.filter(loan => loan.status === 'current').length,
    lateLoans: loans.filter(loan => loan.status === 'late').length,
    defaultLoans: loans.filter(loan => loan.status === 'default').length
  };

  const riskDistribution = {
    low: loans.filter(loan => loan.riskLevel === 'low').length,
    medium: loans.filter(loan => loan.riskLevel === 'medium').length,
    high: loans.filter(loan => loan.riskLevel === 'high').length
  };

  const filteredLoans = loans.filter(loan => {
    const matchesFilter = filter === "all" || loan.status === filter;
    const matchesSearch = loan.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800 border-green-300';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'default': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current': return <CheckCircle className="h-4 w-4" />;
      case 'late': return <Clock className="h-4 w-4" />;
      case 'default': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Loan Portfolio Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor and manage your active loan portfolio
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Portfolio</CardTitle>
              <DollarSign className="h-4 w-4 opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatAmount(portfolioStats.totalPrincipal)}</div>
              <p className="text-xs opacity-75">{portfolioStats.totalLoans} active loans</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Outstanding</CardTitle>
              <TrendingUp className="h-4 w-4 opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatAmount(portfolioStats.currentOutstanding)}</div>
              <p className="text-xs opacity-75">Current balance</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Collected</CardTitle>
              <CheckCircle className="h-4 w-4 opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatAmount(portfolioStats.totalCollected)}</div>
              <p className="text-xs opacity-75">Total payments received</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Avg Interest</CardTitle>
              <BarChart3 className="h-4 w-4 opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{portfolioStats.averageInterestRate.toFixed(1)}%</div>
              <p className="text-xs opacity-75">Portfolio average</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 shadow-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="loans" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Active Loans
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Loan Status Distribution */}
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blue-600" />
                    Loan Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Current</span>
                      </div>
                      <span className="font-medium">{portfolioStats.currentLoans}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Late</span>
                      </div>
                      <span className="font-medium">{portfolioStats.lateLoans}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Default</span>
                      </div>
                      <span className="font-medium">{portfolioStats.defaultLoans}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Distribution */}
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Risk Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Low Risk</span>
                        <span>{riskDistribution.low} loans</span>
                      </div>
                      <Progress value={(riskDistribution.low / loans.length) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Medium Risk</span>
                        <span>{riskDistribution.medium} loans</span>
                      </div>
                      <Progress value={(riskDistribution.medium / loans.length) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>High Risk</span>
                        <span>{riskDistribution.high} loans</span>
                      </div>
                      <Progress value={(riskDistribution.high / loans.length) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    <Download className="h-4 w-4 mr-2" />
                    Export Portfolio Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Contact Borrowers
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Performance Analysis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="loans" className="space-y-6">
            {/* Filters */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search loans..."
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
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="default">Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Loans List */}
            <div className="space-y-4">
              {filteredLoans.map((loan) => (
                <Card key={loan.id} className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedLoan(loan)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {loan.companyName}
                          </h3>
                          <Badge className={`${getStatusColor(loan.status)} flex items-center gap-1`}>
                            {getStatusIcon(loan.status)}
                            {loan.status.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Principal:</span>
                            <div className="font-semibold">{formatAmount(loan.principal)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Balance:</span>
                            <div className="font-semibold">{formatAmount(loan.currentBalance)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Payment:</span>
                            <div className="font-semibold">{formatAmount(loan.monthlyPayment)}/mo</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Risk Level:</span>
                            <div className={`font-semibold ${getRiskColor(loan.riskLevel)}`}>
                              {loan.riskLevel.charAt(0).toUpperCase() + loan.riskLevel.slice(1)}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{loan.termMonths - loan.remainingMonths} / {loan.termMonths} months</span>
                          </div>
                          <Progress 
                            value={((loan.termMonths - loan.remainingMonths) / loan.termMonths) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <p className="text-xs text-gray-500">Next Payment</p>
                        <p className="text-sm font-medium">{new Date(loan.nextPaymentDate).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500 mt-1">{loan.interestRate}% APR</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Portfolio Analytics</CardTitle>
                <CardDescription>Detailed performance metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Advanced Analytics</h3>
                  <p className="text-gray-500 mb-6">Comprehensive portfolio analytics coming soon</p>
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    Enable Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Portfolio Reports</CardTitle>
                <CardDescription>Generate and download detailed portfolio reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Download className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Report Generation</h3>
                  <p className="text-gray-500 mb-6">Custom report generation tools coming soon</p>
                  <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}