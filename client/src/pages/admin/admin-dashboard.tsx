import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Building, 
  Banknote, 
  TrendingUp, 
  Shield, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Database,
  UserCheck
} from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

export default function AdminDashboard() {
  const { formatAmount } = useCurrency();

  // Mock admin data
  const stats = {
    totalUsers: 1247,
    activeLoans: 89,
    totalVolume: 5420000,
    systemHealth: 98.5,
    newUsersToday: 23,
    pendingApprovals: 7,
    activeInstitutions: 45,
    monthlyGrowth: 12.3
  };

  const recentActivity = [
    { type: "user_registration", message: "New SMB user registered: TechStart Solutions", time: "2 mins ago", severity: "info" },
    { type: "loan_approved", message: "Loan L-001 approved for $50,000", time: "15 mins ago", severity: "success" },
    { type: "system_alert", message: "Database backup completed successfully", time: "1 hour ago", severity: "info" },
    { type: "security_alert", message: "Multiple failed login attempts detected", time: "2 hours ago", severity: "warning" },
    { type: "fi_registration", message: "New FI registered: Regional Credit Union", time: "3 hours ago", severity: "info" }
  ];

  const userBreakdown = {
    smb: 892,
    fi: 67,
    admin: 8
  };

  const platformMetrics = {
    applicationVolume: [
      { month: "Jan", applications: 45 },
      { month: "Feb", applications: 52 },
      { month: "Mar", applications: 61 },
      { month: "Apr", applications: 73 },
      { month: "May", applications: 89 },
      { month: "Jun", applications: 94 }
    ],
    approvalRate: 78.5,
    averageProcessingTime: 3.2
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "success": return "text-green-600";
      case "warning": return "text-yellow-600";
      case "error": return "text-red-600";
      default: return "text-blue-600";
    }
  };

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case "loan_approved": return <CheckCircle className="h-4 w-4" />;
      case "security_alert": return <AlertTriangle className="h-4 w-4" />;
      case "user_registration": return <UserCheck className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Platform overview and system management
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-green-600">+{stats.newUsersToday} today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
              <Banknote className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeLoans}</div>
              <p className="text-xs text-gray-500">Currently processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatAmount(stats.totalVolume)}</div>
              <p className="text-xs text-green-600">+{stats.monthlyGrowth}% this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.systemHealth}%</div>
              <Progress value={stats.systemHealth} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* User Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">SMB Users</span>
                      </div>
                      <span className="font-medium">{userBreakdown.smb}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Banknote className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Financial Institutions</span>
                      </div>
                      <span className="font-medium">{userBreakdown.fi}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Administrators</span>
                      </div>
                      <span className="font-medium">{userBreakdown.admin}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Approval Rate</span>
                        <span>{platformMetrics.approvalRate}%</span>
                      </div>
                      <Progress value={platformMetrics.approvalRate} className="mt-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Avg Processing Time</span>
                        <span>{platformMetrics.averageProcessingTime} days</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Active Institutions</span>
                        <span>{stats.activeInstitutions}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    System Backup
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Platform Settings
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Audit
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform events and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className={`mt-0.5 ${getSeverityColor(activity.severity)}`}>
                        {getSeverityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">User Management Panel</h3>
                  <p className="text-gray-500 mb-6">Comprehensive user management features coming soon</p>
                  <Button>View All Users</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">API Server</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Database</span>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">File Storage</span>
                      <Badge className="bg-green-100 text-green-800">Available</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Email Service</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>CPU Usage</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Memory Usage</span>
                        <span>67%</span>
                      </div>
                      <Progress value={67} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Storage Usage</span>
                        <span>23%</span>
                      </div>
                      <Progress value={23} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure platform-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Settings Panel</h3>
                  <p className="text-gray-500 mb-6">Advanced configuration options available here</p>
                  <Button>Access Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}