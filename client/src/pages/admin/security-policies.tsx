import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Lock, AlertTriangle, CheckCircle, Save } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  lastUpdated: string;
}

export default function SecurityPolicies() {
  const { toast } = useToast();
  
  const [policies, setPolicies] = useState<SecurityPolicy[]>([
    {
      id: "password-policy",
      name: "Password Policy",
      description: "Minimum 8 characters, uppercase, lowercase, numbers, and special characters required",
      enabled: true,
      severity: "high",
      lastUpdated: "2024-01-15"
    },
    {
      id: "session-timeout",
      name: "Session Timeout",
      description: "Automatic logout after 30 minutes of inactivity",
      enabled: true,
      severity: "medium",
      lastUpdated: "2024-01-14"
    },
    {
      id: "login-attempts",
      name: "Failed Login Protection",
      description: "Account lockout after 5 failed login attempts",
      enabled: true,
      severity: "high",
      lastUpdated: "2024-01-13"
    },
    {
      id: "2fa-requirement",
      name: "Two-Factor Authentication",
      description: "Require 2FA for admin and FI users",
      enabled: false,
      severity: "critical",
      lastUpdated: "2024-01-12"
    },
    {
      id: "ip-whitelist",
      name: "IP Address Whitelist",
      description: "Restrict access to specific IP addresses",
      enabled: false,
      severity: "medium",
      lastUpdated: "2024-01-11"
    }
  ]);

  const [settings, setSettings] = useState({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    passwordExpiry: 90,
    dataRetention: 365
  });

  const togglePolicy = (id: string) => {
    setPolicies(policies.map(policy => 
      policy.id === id 
        ? { ...policy, enabled: !policy.enabled, lastUpdated: new Date().toISOString().split('T')[0] }
        : policy
    ));
    
    toast({
      title: "Policy Updated",
      description: "Security policy has been updated successfully",
    });
  };

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Security settings have been saved successfully",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/admin/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Policies</h1>
          <p className="text-gray-600">
            Configure and manage platform security policies and settings
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Security Policies */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="modern-card animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Security Policies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {policies.map((policy) => (
                    <div 
                      key={policy.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{policy.name}</h3>
                            <Badge className={getSeverityColor(policy.severity)}>
                              {policy.severity.toUpperCase()}
                            </Badge>
                            {policy.enabled ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{policy.description}</p>
                          <p className="text-xs text-gray-500">
                            Last updated: {policy.lastUpdated}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle ml-4"
                          checked={policy.enabled}
                          onChange={() => togglePolicy(policy.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="modern-card animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Session Timeout (minutes)
                    </label>
                    <Input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({...settings, sessionTimeout: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Max Login Attempts
                    </label>
                    <Input
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => setSettings({...settings, maxLoginAttempts: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Password Minimum Length
                    </label>
                    <Input
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) => setSettings({...settings, passwordMinLength: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Password Expiry (days)
                    </label>
                    <Input
                      type="number"
                      value={settings.passwordExpiry}
                      onChange={(e) => setSettings({...settings, passwordExpiry: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Data Retention Period (days)
                  </label>
                  <Input
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => setSettings({...settings, dataRetention: Number(e.target.value)})}
                  />
                </div>

                <Button onClick={saveSettings} className="btn-primary w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Security Overview */}
          <div className="space-y-6">
            <Card className="modern-card animate-slide-up">
              <CardHeader>
                <CardTitle>Security Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {policies.filter(p => p.enabled).length}/{policies.length}
                    </div>
                    <div className="text-sm text-gray-600">Policies Active</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Critical</span>
                      <span className="text-red-600">
                        {policies.filter(p => p.severity === 'critical' && p.enabled).length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>High</span>
                      <span className="text-orange-600">
                        {policies.filter(p => p.severity === 'high' && p.enabled).length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Medium</span>
                      <span className="text-yellow-600">
                        {policies.filter(p => p.severity === 'medium' && p.enabled).length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Low</span>
                      <span className="text-blue-600">
                        {policies.filter(p => p.severity === 'low' && p.enabled).length}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card animate-slide-up">
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="status-dot status-active"></div>
                    <span>Password policy updated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="status-dot status-pending"></div>
                    <span>2FA policy pending activation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="status-dot status-active"></div>
                    <span>Session timeout configured</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}