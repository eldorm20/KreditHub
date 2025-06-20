import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Filter, UserCheck, UserX, Edit, Trash2, Plus } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  userType: 'smb' | 'fi' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
  name: string;
}

export default function UserManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      email: "admin@kredithub.com",
      userType: "admin",
      status: "active",
      createdAt: "2024-01-01",
      lastLogin: "2024-01-20 10:30:00",
      name: "Admin User"
    },
    {
      id: "2", 
      email: "john@techstart.com",
      userType: "smb",
      status: "active",
      createdAt: "2024-01-05",
      lastLogin: "2024-01-19 14:20:00",
      name: "John Smith"
    },
    {
      id: "3",
      email: "bank@nationalbank.com",
      userType: "fi",
      status: "active", 
      createdAt: "2024-01-03",
      lastLogin: "2024-01-20 09:15:00",
      name: "National Bank"
    },
    {
      id: "4",
      email: "sarah@greenenergy.com",
      userType: "smb",
      status: "inactive",
      createdAt: "2024-01-10",
      lastLogin: "2024-01-15 16:45:00",
      name: "Sarah Johnson"
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesType = typeFilter === "all" || user.userType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const updateUserStatus = (id: string, newStatus: User['status']) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    ));
    
    toast({
      title: "User Status Updated",
      description: `User status has been changed to ${newStatus}`,
    });
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    toast({
      title: "User Deleted",
      description: "User has been removed from the system",
      variant: "destructive"
    });
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-300';
      case 'fi': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-300';
      case 'smb': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button variant="ghost" asChild className="mb-4 text-gray-400 hover:text-white">
            <Link href="/admin/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin Dashboard
            </Link>
          </Button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black heading-gradient mb-2">User Management</h1>
              <p className="text-gray-400 text-lg">
                Manage platform users, permissions, and access control
              </p>
            </div>
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 jeton-card animate-slide-up">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg bg-gray-800 border-gray-600 text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg bg-gray-800 border-gray-600 text-white"
                >
                  <option value="all">All Types</option>
                  <option value="admin">Admin</option>
                  <option value="fi">Financial Institution</option>
                  <option value="smb">Business</option>
                </select>
                <Button variant="outline" className="btn-secondary">
                  <Filter className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="jeton-card animate-slide-up">
          <CardHeader>
            <CardTitle className="text-white text-xl">Platform Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div 
                  key={user.id}
                  className="border border-gray-600 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 interactive-glow"
                >
                  <div className="grid lg:grid-cols-6 gap-4 items-center">
                    {/* User Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">{user.name}</h3>
                          <p className="text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* User Type */}
                    <div>
                      <Badge className={getUserTypeColor(user.userType)}>
                        {user.userType.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Status */}
                    <div>
                      <Badge className={getStatusColor(user.status)}>
                        <span className={`status-dot status-${user.status === 'active' ? 'active' : user.status === 'inactive' ? 'pending' : 'inactive'}`}></span>
                        {user.status.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Last Login */}
                    <div>
                      <div className="text-sm text-gray-400">Last Login</div>
                      <div className="text-white font-semibold">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {user.status === 'active' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateUserStatus(user.id, 'suspended')}
                          className="btn-secondary hover:bg-red-600"
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => updateUserStatus(user.id, 'active')}
                          className="btn-primary"
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="btn-secondary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <Card className="jeton-card animate-scale-in">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-white">
                {users.filter(u => u.status === 'active').length}
              </div>
              <div className="text-gray-400">Active Users</div>
            </CardContent>
          </Card>
          
          <Card className="jeton-card animate-scale-in">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-white">
                {users.filter(u => u.userType === 'smb').length}
              </div>
              <div className="text-gray-400">Businesses</div>
            </CardContent>
          </Card>
          
          <Card className="jeton-card animate-scale-in">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-white">
                {users.filter(u => u.userType === 'fi').length}
              </div>
              <div className="text-gray-400">Financial Institutions</div>
            </CardContent>
          </Card>
          
          <Card className="jeton-card animate-scale-in">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-white">
                {users.filter(u => u.status === 'suspended').length}
              </div>
              <div className="text-gray-400">Suspended</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}