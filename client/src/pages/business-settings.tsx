import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building, Bell, Shield, Save, User } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

const businessProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  email: z.string().email("Valid email is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  website: z.string().url("Valid website URL is required").optional().or(z.literal("")),
  industry: z.string().min(1, "Industry is required"),
  companySize: z.string().min(1, "Company size is required"),
  annualRevenue: z.string().min(1, "Annual revenue is required"),
  taxId: z.string().min(1, "Tax ID is required"),
});

type BusinessProfileForm = z.infer<typeof businessProfileSchema>;

export default function BusinessSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const profileForm = useForm<BusinessProfileForm>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      companyName: "TechStart Solutions LLC",
      contactPerson: "John Smith",
      email: "john@techstart.com",
      phoneNumber: "+1 (555) 123-4567",
      address: "123 Business Ave, Tech City, TC 12345",
      website: "https://techstart.com",
      industry: "Technology",
      companySize: "11-50",
      annualRevenue: "500000-1000000",
      taxId: "12-3456789",
    },
  });

  const onProfileSubmit = async (data: BusinessProfileForm) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Profile Updated",
        description: "Your business profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Business Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your business profile and account preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Business Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Business Profile */}
          <TabsContent value="profile">
            <Card className="modern-card animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Company Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="contactPerson"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Person</FormLabel>
                            <FormControl>
                              <Input placeholder="Primary Contact" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="contact@company.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Full business address" {...field} rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://your-website.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="retail">Retail</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="companySize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Size</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select company size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1-10">1-10 employees</SelectItem>
                                <SelectItem value="11-50">11-50 employees</SelectItem>
                                <SelectItem value="51-200">51-200 employees</SelectItem>
                                <SelectItem value="201-500">201-500 employees</SelectItem>
                                <SelectItem value="500+">500+ employees</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="annualRevenue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Annual Revenue (USD)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select revenue range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0-100000">$0 - $100K</SelectItem>
                                <SelectItem value="100000-500000">$100K - $500K</SelectItem>
                                <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
                                <SelectItem value="1000000-5000000">$1M - $5M</SelectItem>
                                <SelectItem value="5000000+">$5M+</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="taxId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax ID / EIN</FormLabel>
                          <FormControl>
                            <Input placeholder="12-3456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isLoading} className="btn-primary">
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Profile"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences">
            <Card className="modern-card animate-slide-up">
              <CardHeader>
                <CardTitle>Application Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Default Currency</label>
                  <Select defaultValue="usd">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="uzs">UZS - Uzbek Som</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Time Zone</label>
                  <Select defaultValue="utc-5">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-5">UTC-5 (Eastern Time)</SelectItem>
                      <SelectItem value="utc+5">UTC+5 (Uzbekistan Time)</SelectItem>
                      <SelectItem value="utc+3">UTC+3 (Moscow Time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Language</label>
                  <Select defaultValue="english">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="uzbek">Uzbek</SelectItem>
                      <SelectItem value="russian">Russian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="btn-primary">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card className="modern-card animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <p className="text-base font-medium">Application Updates</p>
                    <p className="text-sm text-gray-500">Get notified about loan application status changes</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <p className="text-base font-medium">New Offers</p>
                    <p className="text-sm text-gray-500">Receive notifications when new loan offers arrive</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <p className="text-base font-medium">Messages</p>
                    <p className="text-sm text-gray-500">Get notified of new messages from lenders</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <p className="text-base font-medium">Marketing Communications</p>
                    <p className="text-sm text-gray-500">Receive news and promotional content</p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>

                <Button className="btn-primary w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <Card className="modern-card animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Password</h3>
                  <p className="text-sm text-gray-500 mb-4">Last changed 30 days ago</p>
                  <Button variant="outline">Change Password</Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500 mb-4">Add an extra layer of security</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Login History</h3>
                  <p className="text-sm text-gray-500 mb-4">View recent login activity</p>
                  <Button variant="outline">View History</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}