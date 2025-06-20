import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Copy, Trash2, Eye, EyeOff, Key } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed: string;
  status: 'active' | 'revoked';
  createdAt: string;
}

export default function APIManagement() {
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});
  const [newKeyName, setNewKeyName] = useState("");
  
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: "key-1",
      name: "Production API",
      key: "pk_live_51234567890abcdef",
      permissions: ["read", "write", "admin"],
      lastUsed: "2024-01-15 14:30:00",
      status: "active",
      createdAt: "2024-01-01"
    },
    {
      id: "key-2", 
      name: "Development API",
      key: "pk_test_09876543210fedcba",
      permissions: ["read", "write"],
      lastUsed: "2024-01-14 09:15:00",
      status: "active",
      createdAt: "2024-01-10"
    }
  ]);

  const generateAPIKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the API key",
        variant: "destructive"
      });
      return;
    }

    const newKey: APIKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key: `pk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      permissions: ["read"],
      lastUsed: "Never",
      status: "active",
      createdAt: new Date().toISOString().split('T')[0]
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    
    toast({
      title: "API Key Generated",
      description: "New API key has been created successfully",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const revokeKey = (id: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, status: 'revoked' as const } : key
    ));
    
    toast({
      title: "API Key Revoked",
      description: "The API key has been revoked and is no longer valid",
      variant: "destructive"
    });
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskKey = (key: string) => {
    return key.substring(0, 8) + '••••••••••••••••' + key.substring(key.length - 4);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Key Management</h1>
          <p className="text-gray-600">
            Manage API keys for external integrations and third-party services
          </p>
        </div>

        {/* Create New API Key */}
        <Card className="mb-8 modern-card animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-600" />
              Generate New API Key
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter API key name (e.g., Production, Development)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={generateAPIKey} className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Generate Key
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Keys List */}
        <Card className="modern-card animate-slide-up">
          <CardHeader>
            <CardTitle>Active API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div 
                  key={apiKey.id} 
                  className={`p-4 border rounded-lg transition-all duration-300 ${
                    apiKey.status === 'active' 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{apiKey.name}</h3>
                        <Badge 
                          className={apiKey.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                          }
                        >
                          <span className={`status-dot status-${apiKey.status === 'active' ? 'active' : 'inactive'}`}></span>
                          {apiKey.status}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <strong>API Key:</strong>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">
                              {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                              className="p-1 h-6 w-6"
                            >
                              {showKeys[apiKey.id] ? 
                                <EyeOff className="h-3 w-3" /> : 
                                <Eye className="h-3 w-3" />
                              }
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(apiKey.key)}
                              className="p-1 h-6 w-6"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <strong>Permissions:</strong>
                          <div className="flex gap-1 mt-1">
                            {apiKey.permissions.map((permission) => (
                              <Badge key={permission} variant="secondary" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <strong>Last Used:</strong>
                          <span className="ml-2">{apiKey.lastUsed}</span>
                        </div>
                        
                        <div>
                          <strong>Created:</strong>
                          <span className="ml-2">{apiKey.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {apiKey.status === 'active' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => revokeKey(apiKey.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Usage Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="modern-card animate-slide-up">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{apiKeys.filter(k => k.status === 'active').length}</div>
                <div className="text-sm text-gray-600">Active Keys</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="modern-card animate-slide-up">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1,247</div>
                <div className="text-sm text-gray-600">API Calls Today</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="modern-card animate-slide-up">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}