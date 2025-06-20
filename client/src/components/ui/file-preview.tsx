import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Download, Eye, FileText, Image, File } from "lucide-react";

interface FilePreviewProps {
  file: {
    id: string;
    name: string;
    size: number;
    type: string;
    url?: string;
    status: 'pending' | 'verified' | 'rejected';
  };
  onRemove?: (id: string) => void;
  onView?: (id: string) => void;
}

export function FilePreview({ file, onRemove, onView }: FilePreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getFileIcon = () => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Card className="p-4 border border-gray-200 hover:border-gray-300 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {getFileIcon()}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{file.name}</p>
              <p className="text-xs text-gray-500">
                {formatFileSize(file.size)} • {file.type}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(file.status)}>
              {file.status}
            </Badge>
            
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsPreviewOpen(true);
                  onView?.(file.id);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
              
              {onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(file.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* File Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="truncate">{file.name}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPreviewOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-gray-50 h-96 flex items-center justify-center">
                {file.type.startsWith('image/') ? (
                  <img
                    src={file.url || '/api/placeholder/400/300'}
                    alt={file.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : file.type === 'application/pdf' ? (
                  <div className="text-center">
                    <FileText className="mx-auto h-24 w-24 text-red-500 mb-4" />
                    <p className="text-lg font-medium">PDF Document</p>
                    <p className="text-gray-500 mb-4">{file.name}</p>
                    <Button className="bg-red-500 hover:bg-red-600">
                      <Download className="h-4 w-4 mr-2" />
                      Download to View
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <File className="mx-auto h-24 w-24 text-gray-500 mb-4" />
                    <p className="text-lg font-medium">File Preview</p>
                    <p className="text-gray-500 mb-4">{file.name}</p>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download File
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}