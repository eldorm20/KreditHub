import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Upload, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { FilePreview } from "@/components/ui/file-preview";

interface Document {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'rejected';
  uploadDate: string;
  required: boolean;
  size: number;
  type: string;
  url?: string;
}

const requiredDocuments = [
  { name: "Business Registration Certificate", required: true },
  { name: "Tax Returns (Latest 2 years)", required: true },
  { name: "Financial Statements (Latest)", required: true },
  { name: "Bank Statement (Latest 6 months)", required: true },
  { name: "Business Plan", required: false },
  { name: "Proof of Collateral", required: false },
];

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const newDoc: Document = {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        status: 'pending',
        uploadDate: new Date().toISOString(),
        required: false,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      };
      setDocuments(prev => [...prev, newDoc]);
    });
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const viewDocument = (id: string) => {
    // Handle document viewing
    console.log('Viewing document:', id);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const verifiedCount = documents.filter(doc => doc.status === 'verified').length;
  const pendingCount = documents.filter(doc => doc.status === 'pending').length;
  const rejectedCount = documents.filter(doc => doc.status === 'rejected').length;

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
          <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600 mt-2">
            Upload and manage your business documents for loan applications.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Area */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Drop files here or click to upload
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Support for PDF, DOC, DOCX, JPG, XLSX, PNG, GIF files up to 10MB each.
                  </p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Choose Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileInput}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.xlsx,.xls"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Your Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Your Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No documents uploaded
                    </h3>
                    <p className="text-gray-500">
                      Upload your first document to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <FilePreview
                        key={doc.id}
                        file={{
                          id: doc.id,
                          name: doc.name,
                          size: doc.size,
                          type: doc.type,
                          url: doc.url,
                          status: doc.status,
                        }}
                        onRemove={removeDocument}
                        onView={viewDocument}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document Status Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Document Status Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Verified</span>
                  </div>
                  <span className="font-semibold">{verifiedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span>Pending</span>
                  </div>
                  <span className="font-semibold">{pendingCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span>Rejected</span>
                  </div>
                  <span className="font-semibold">{rejectedCount}</span>
                </div>
              </CardContent>
            </Card>

            {/* Required Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Required Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {requiredDocuments.map((reqDoc, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-gray-300" />
                        <span className="text-sm">{reqDoc.name}</span>
                      </div>
                      <Badge variant={reqDoc.required ? "destructive" : "secondary"}>
                        {reqDoc.required ? "Required" : "Optional"}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-2">
                    0 documents uploaded
                  </p>
                  <Progress value={0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Upload Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>Ensure all documents are clear and legible.</li>
                  <li>File size should not exceed 10MB per document.</li>
                  <li>Accepted formats: PDF, DOC/DOCX, JPG/PNG/GIF, XLS/XLSX.</li>
                  <li>Documents should be recent (within last 6 months).</li>
                  <li>Scanned documents must be in color.</li>
                  <li>All pages of multi-page documents must be included.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}