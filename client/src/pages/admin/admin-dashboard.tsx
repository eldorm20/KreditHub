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
  UserCheck,
  Save
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
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
          <Card className="modern-card animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-green-600">+{stats.newUsersToday} today</p>
            </CardContent>
          </Card>

          <Card className="modern-card animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
              <Banknote className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeLoans}</div>
              <p className="text-xs text-gray-500">Currently processing</p>
            </CardContent>
          </Card>

          <Card className="modern-card animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatAmount(stats.totalVolume)}</div>
              <p className="text-xs text-green-600">+{stats.monthlyGrowth}% this month</p>
            </CardContent>
          </Card>

          <Card className="modern-card animate-slide-up">
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
            <TabsTrigger value="overview" data-value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users" data-value="users">User Management</TabsTrigger>
            <TabsTrigger value="system" data-value="system">System Health</TabsTrigger>
            <TabsTrigger value="settings" data-value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* User Breakdown */}
              <Card className="modern-card animate-slide-up">
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
              <Card className="modern-card animate-slide-up">
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
              <Card className="modern-card animate-slide-up">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start btn-primary" 
                    onClick={() => {
                      const tab = document.querySelector('[data-value="users"]') as HTMLElement;
                      if (tab) tab.click();
                    }}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button 
                    className="w-full justify-start btn-primary" 
                    onClick={() => {
                      const tab = document.querySelector('[data-value="system"]') as HTMLElement;
                      if (tab) tab.click();
                    }}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    System Backup
                  </Button>
                  <Button 
                    className="w-full justify-start btn-primary" 
                    onClick={() => {
                      const tab = document.querySelector('[data-value="settings"]') as HTMLElement;
                      if (tab) tab.click();
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Platform Settings
                  </Button>
                  <Button 
                    className="w-full justify-start btn-primary" 
                    onClick={() => {
                      const tab = document.querySelector('[data-value="system"]') as HTMLElement;
                      if (tab) tab.click();
                    }}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Security Audit
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="modern-card animate-slide-up">
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

          <TabsContent value="users" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* User Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Users</span>
                      <span className="font-bold">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Today</span>
                      <span className="font-bold text-green-600">892</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New This Month</span>
                      <span className="font-bold text-blue-600">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Verification</span>
                      <span className="font-bold text-yellow-600">23</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Users */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "TechStart Solutions", type: "SMB", status: "Active", joinDate: "2024-01-15" },
                      { name: "Kapital Bank", type: "FI", status: "Active", joinDate: "2024-01-14" },
                      { name: "InnovateBiz LLC", type: "SMB", status: "Pending", joinDate: "2024-01-13" },
                      { name: "Aloqa Bank", type: "FI", status: "Active", joinDate: "2024-01-12" },
                      { name: "StartupHub Inc", type: "SMB", status: "Active", joinDate: "2024-01-11" },
                    ].map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            {user.type === 'FI' ? <Building className="h-4 w-4 text-blue-600" /> : <Users className="h-4 w-4 text-blue-600" />}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.type} • Joined {user.joinDate}</p>
                          </div>
                        </div>
                        <Badge className={user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {user.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Management Actions */}
            <Card>
              <CardHeader>
                <CardTitle>User Management Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button className="h-20 flex-col">
                    <Users className="h-6 w-6 mb-2" />
                    View All Users
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <UserCheck className="h-6 w-6 mb-2" />
                    Verify Pending
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Shield className="h-6 w-6 mb-2" />
                    Manage Permissions
                  </Button>
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

          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Platform Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Maintenance Mode</p>
                      <p className="text-sm text-gray-500">Enable maintenance mode for updates</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">User Registration</p>
                      <p className="text-sm text-gray-500">Allow new user registrations</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Send system email notifications</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Auto Backup</p>
                      <p className="text-sm text-gray-500">Automatic daily database backups</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">Session Timeout</p>
                    <select className="w-full p-2 border rounded">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>2 hours</option>
                      <option>4 hours</option>
                    </select>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Password Requirements</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>• Minimum 8 characters</div>
                      <div>• At least one uppercase letter</div>
                      <div>• At least one number</div>
                      <div>• At least one special character</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => window.location.href = '/admin/security-policies'}>
                    Configure Security Policies
                  </Button>
                </CardContent>
              </Card>

              {/* System Limits */}
              <Card>
                <CardHeader>
                  <CardTitle>System Limits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">Maximum File Upload Size</p>
                    <select className="w-full p-2 border rounded">
                      <option>10 MB</option>
                      <option>25 MB</option>
                      <option>50 MB</option>
                      <option>100 MB</option>
                    </select>
                  </div>
                  <div>
                    <p className="font-medium mb-2">API Rate Limit</p>
                    <select className="w-full p-2 border rounded">
                      <option>100 requests/minute</option>
                      <option>500 requests/minute</option>
                      <option>1000 requests/minute</option>
                      <option>Unlimited</option>
                    </select>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Maximum Loan Amount</p>
                    <input 
                      type="number" 
                      defaultValue="10000000"
                      className="w-full p-2 border rounded"
                      placeholder="Maximum allowed loan amount"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Integration Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Integration Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Credit Bureau Integration</p>
                      <p className="text-sm text-gray-500">Connect to KATM credit bureau</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">SMS Gateway</p>
                      <p className="text-sm text-gray-500">Enable SMS notifications</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Payment Gateway</p>
                      <p className="text-sm text-gray-500">Enable online payments</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => window.location.href = '/admin/api-management'}>
                    Manage API Keys
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Save Settings */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Changes will be applied immediately to the platform
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save All Settings
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