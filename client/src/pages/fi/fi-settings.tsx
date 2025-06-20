import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Building, Bell, Shield, DollarSign, Save } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

const institutionProfileSchema = z.object({
  institutionName: z.string().min(1, "Institution name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  email: z.string().email("Valid email is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  website: z.string().url("Valid website URL is required").optional().or(z.literal("")),
  licenseNumber: z.string().min(1, "License number is required"),
  establishedYear: z.number().min(1900, "Invalid year"),
});

const lendingCriteriaSchema = z.object({
  minLoanAmount: z.number().min(1000, "Minimum amount must be at least $1,000"),
  maxLoanAmount: z.number().min(1000, "Maximum amount must be at least $1,000"),
  minInterestRate: z.number().min(0.1, "Interest rate must be positive"),
  maxInterestRate: z.number().min(0.1, "Interest rate must be positive"),
  maxLoanTerm: z.number().min(6, "Maximum term must be at least 6 months"),
  creditScoreRequirement: z.number().min(300, "Invalid credit score"),
  collateralRequired: z.boolean(),
  businessAgeRequirement: z.number().min(0, "Invalid business age"),
});

type InstitutionProfileForm = z.infer<typeof institutionProfileSchema>;
type LendingCriteriaForm = z.infer<typeof lendingCriteriaSchema>;

export default function FISettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const profileForm = useForm<InstitutionProfileForm>({
    resolver: zodResolver(institutionProfileSchema),
    defaultValues: {
      institutionName: "National Bank of Uzbekistan",
      contactPerson: "Sarah Johnson",
      email: "sarah.johnson@nbu.uz",
      phoneNumber: "+998 71 123 4567",
      address: "15 Amir Timur Avenue, Tashkent, Uzbekistan",
      website: "https://nbu.uz",
      licenseNumber: "FI-UZ-2018-001",
      establishedYear: 1991,
    },
  });

  const lendingForm = useForm<LendingCriteriaForm>({
    resolver: zodResolver(lendingCriteriaSchema),
    defaultValues: {
      minLoanAmount: 5000,
      maxLoanAmount: 1000000,
      minInterestRate: 8.5,
      maxInterestRate: 25.0,
      maxLoanTerm: 60,
      creditScoreRequirement: 650,
      collateralRequired: true,
      businessAgeRequirement: 2,
    },
  });

  const onProfileSubmit = async (data: InstitutionProfileForm) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Profile Updated",
        description: "Institution profile has been saved successfully.",
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

  const onLendingSubmit = async (data: LendingCriteriaForm) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Lending Criteria Updated",
        description: "Your lending criteria have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lending criteria. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/fi/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">FI Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your financial institution settings and lending criteria
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Institution Profile</TabsTrigger>
            <TabsTrigger value="lending">Lending Criteria</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Institution Profile */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Institution Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="institutionName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Bank Name" {...field} />
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
                            <FormLabel>Primary Contact</FormLabel>
                            <FormControl>
                              <Input placeholder="Contact Person" {...field} />
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
                              <Input type="email" placeholder="contact@bank.com" {...field} />
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
                              <Input placeholder="+998 71 123 4567" {...field} />
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
                          <FormLabel>Institution Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Full address" {...field} rows={3} />
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
                              <Input placeholder="https://your-bank.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="licenseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Banking License Number</FormLabel>
                            <FormControl>
                              <Input placeholder="FI-UZ-XXXX-XXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="establishedYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Established Year</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="2020" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Profile"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lending Criteria */}
          <TabsContent value="lending">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Lending Criteria & Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...lendingForm}>
                  <form onSubmit={lendingForm.handleSubmit(onLendingSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={lendingForm.control}
                        name="minLoanAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Loan Amount ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="5000" 
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={lendingForm.control}
                        name="maxLoanAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Loan Amount ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="1000000" 
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={lendingForm.control}
                        name="minInterestRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Interest Rate (%)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.1"
                                placeholder="8.5" 
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={lendingForm.control}
                        name="maxInterestRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Interest Rate (%)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.1"
                                placeholder="25.0" 
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={lendingForm.control}
                        name="maxLoanTerm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Loan Term (months)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="60" 
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={lendingForm.control}
                        name="creditScoreRequirement"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Credit Score</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="650" 
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={lendingForm.control}
                      name="businessAgeRequirement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Business Age (years)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="2" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={lendingForm.control}
                      name="collateralRequired"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Collateral Required</FormLabel>
                            <p className="text-sm text-gray-500">
                              Require collateral for loan approval
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Lending Criteria"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <p className="text-base font-medium">New Applications</p>
                      <p className="text-sm text-gray-500">Get notified when new loan applications are submitted</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <p className="text-base font-medium">Application Updates</p>
                      <p className="text-sm text-gray-500">Receive updates on application status changes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <p className="text-base font-medium">Messages</p>
                      <p className="text-sm text-gray-500">Get notified of new messages from applicants</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Password</h3>
                    <p className="text-sm text-gray-500 mb-4">Last changed 15 days ago</p>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">API Access</h3>
                    <p className="text-sm text-gray-500 mb-4">Manage API keys for system integration</p>
                    <Button variant="outline">Manage API Keys</Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Audit Logs</h3>
                    <p className="text-sm text-gray-500 mb-4">View access and transaction logs</p>
                    <Button variant="outline">View Audit Logs</Button>
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