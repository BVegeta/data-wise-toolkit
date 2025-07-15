import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, File, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import * as XLSX from 'xlsx';
import { DataFrame } from 'danfo';

export default function FileUpload() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { setOriginalData, setActiveTab } = useDataStore();

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const data = await file.arrayBuffer();
      let jsonData: any[] = [];

      if (file.name.endsWith('.csv')) {
        // Parse CSV
        const text = new TextDecoder().decode(data);
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        jsonData = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const row: any = {};
          headers.forEach((header, index) => {
            const value = values[index];
            // Try to parse as number
            const numValue = parseFloat(value);
            row[header] = isNaN(numValue) ? value : numValue;
          });
          return row;
        });
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Parse Excel
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        jsonData = XLSX.utils.sheet_to_json(worksheet);
      } else {
        throw new Error('Unsupported file format. Please use CSV or Excel files.');
      }

      // Create DataFrame using danfo.js
      const df = new DataFrame(jsonData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setOriginalData(df);
        setActiveTab('clean');
        setIsProcessing(false);
      }, 500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Upload Your Data</h2>
        <p className="text-muted-foreground mt-2">
          Start by uploading a CSV or Excel file to begin your data cleaning journey
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>File Upload</span>
            </CardTitle>
            <CardDescription>
              Drag and drop your file or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${
                isDragActive 
                  ? 'border-accent bg-accent/10' 
                  : 'border-border hover:border-accent'
              }`}
            >
              <input {...getInputProps()} />
              
              {isProcessing ? (
                <div className="space-y-4">
                  <div className="h-16 w-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Upload className="h-8 w-8 text-white" />
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Processing your file...</p>
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-16 w-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      {isDragActive ? 'Drop your file here' : 'Choose a file or drag it here'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supports CSV, XLSX, and XLS files up to 50MB
                    </p>
                  </div>
                  <Button variant="outline">
                    Browse Files
                  </Button>
                </div>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center space-x-2"
              >
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Features & Guidelines */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-data-success" />
                <span>Supported Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <FileSpreadsheet className="h-4 w-4 text-accent" />
                <span className="text-sm">CSV files with custom delimiters</span>
              </div>
              <div className="flex items-center space-x-3">
                <File className="h-4 w-4 text-accent" />
                <span className="text-sm">Excel files (.xlsx, .xls)</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 text-data-success" />
                <span className="text-sm">Automatic data type detection</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 text-data-success" />
                <span className="text-sm">Missing value identification</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>File Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Maximum file size</span>
                <Badge variant="secondary">50 MB</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Recommended rows</span>
                <Badge variant="secondary">{"< 100K"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Column limit</span>
                <Badge variant="secondary">{"< 1000"}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}