import { useDataStore } from '@/store/useDataStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Database } from 'lucide-react';

export default function DataExport() {
  const { currentData, setActiveTab } = useDataStore();

  if (!currentData) {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <div className="h-16 w-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
            <Download className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">No Data to Export</h2>
            <p className="text-muted-foreground">Process your data first</p>
          </div>
        </div>
        <Button onClick={() => setActiveTab('upload')} size="lg">
          Upload Data
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Export Data</h2>
        <p className="text-muted-foreground mt-2">
          Download your cleaned and transformed data
        </p>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Options</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex flex-col">
              <Download className="h-6 w-6 mb-2" />
              <span>CSV Format</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Download className="h-6 w-6 mb-2" />
              <span>Excel Format</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Download className="h-6 w-6 mb-2" />
              <span>JSON Format</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Download className="h-6 w-6 mb-2" />
              <span>Python Code</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}