import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building, User, DollarSign } from "lucide-react";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const loanApplicationSchema = z.object({
  // Business Information
  applicantName: z.string().min(1, "Applicant name is required"),
  businessName: z.string().min(1, "Business name is required"),
  
  // Contact Information
  contactEmail: z.string().email("Valid email is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  
  // Loan Details
  loanAmountRequested: z.number().min(1000, "Minimum loan amount is $1,000"),
  loanPurpose: z.string().min(10, "Please describe the purpose of the loan"),
  repaymentPeriodRequested: z.number().min(6, "Minimum repayment period is 6 months"),
  loanType: z.enum(["working_capital", "equipment_purchase", "investment", "other"]),
});

type LoanApplicationForm = z.infer<typeof loanApplicationSchema>;

export default function LoanApplication() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);

  const form = useForm<LoanApplicationForm>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      applicantName: "",
      businessName: "",
      contactEmail: "",
      phoneNumber: "",
      loanAmountRequested: 0,
      loanPurpose: "",
      repaymentPeriodRequested: 12,
      loanType: "working_capital",
    },
  });

  const createApplicationMutation = {
    mutate: (data: LoanApplicationForm) => {
      // Simulate successful submission
      setTimeout(() => {
        toast({
          title: "Application Submitted",
          description: "Your loan application has been submitted successfully.",
        });
        navigate("/applications");
      }, 1000);
    },
    isPending: false,
  };

  const onSubmit = (data: LoanApplicationForm) => {
    createApplicationMutation.mutate(data);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const getLoanTypeLabel = (type: string) => {
    switch (type) {
      case "working_capital": return "Working Capital";
      case "equipment_purchase": return "Equipment Purchase";
      case "investment": return "Investment";
      case "other": return "Other";
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Loan Application</h1>
          <p className="text-gray-600 mt-2">
            Complete the form below to apply for a business loan. Required fields are marked with an asterisk (*).
          </p>
        </div>

        {/* Language Selector */}
        <div className="mb-6">
          <Select defaultValue="english">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="uzbek">Uzbek</SelectItem>
              <SelectItem value="russian">Russian</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Business Information */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="applicantName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Applicant Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Full Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Acme Corp" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Contact Information */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="placeholder@example.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Loan Details */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Loan Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="loanAmountRequested"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Requested Loan Amount *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                USD
                              </span>
                              <Input
                                type="number"
                                placeholder="5,000"
                                className="pl-12"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="repaymentPeriodRequested"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Repayment Period (months) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="12"
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
                    control={form.control}
                    name="loanType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select loan type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="working_capital">Working Capital</SelectItem>
                            <SelectItem value="equipment_purchase">Equipment Purchase</SelectItem>
                            <SelectItem value="investment">Investment</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="loanPurpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purpose of Loan *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Briefly describe how you plan to use this loan (business expansion, working capital, equipment, etc.)"
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                    <div className="space-x-2">
                      <Button type="button" variant="outline">
                        Save as Draft
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createApplicationMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {createApplicationMutation.isPending ? "Submitting..." : "Submit Application"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}