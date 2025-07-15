import { useDataStore } from '@/store/useDataStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Database } from 'lucide-react';

export default function DataAnalysis() {
  const { currentData, setActiveTab } = useDataStore();

  if (!currentData) {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <div className="h-16 w-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">No Data to Analyze</h2>
            <p className="text-muted-foreground">Upload and clean your data first</p>
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
        <h2 className="text-3xl font-bold text-foreground">Data Analysis</h2>
        <p className="text-muted-foreground mt-2">
          Explore your data with visualizations and statistical insights
        </p>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Analysis Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Analysis features coming soon! This will include interactive charts, 
            statistical summaries, correlation analysis, and more.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}