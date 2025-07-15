import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDataStore } from '@/store/useDataStore';
import DataTable from './DataTable';
import DataProfile from './DataProfile';
import CleaningOperations from './CleaningOperations';
import { Database, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function DataCleaning() {
  const { currentData, originalData, setActiveTab } = useDataStore();
  const [dataStats, setDataStats] = useState<any>(null);

  useEffect(() => {
    if (currentData) {
      // Calculate basic statistics
      const shape = currentData.shape;
      const columns = currentData.columns;
      const nullCounts = columns.map(col => {
        const series = currentData[col];
        const nullCount = series.isna().sum();
        return { column: col, nulls: nullCount, percentage: (nullCount / shape[0]) * 100 };
      });

      setDataStats({
        rows: shape[0],
        columns: shape[1],
        nullCounts,
        duplicates: 0 // Would need to implement duplicate detection
      });
    }
  }, [currentData]);

  if (!currentData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="space-y-4">
          <div className="h-16 w-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
            <Database className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">No Data Loaded</h2>
            <p className="text-muted-foreground">Upload a dataset to start cleaning</p>
          </div>
        </div>
        <Button onClick={() => setActiveTab('upload')} size="lg">
          Upload Data
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Data Cleaning</h2>
          <p className="text-muted-foreground mt-2">
            Clean and transform your data with intelligent suggestions
          </p>
        </div>

        {dataStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">{dataStats.rows.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Rows</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-data-info" />
                  <div>
                    <p className="text-2xl font-bold">{dataStats.columns}</p>
                    <p className="text-xs text-muted-foreground">Columns</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-data-warning" />
                  <div>
                    <p className="text-2xl font-bold">
                      {dataStats.nullCounts.reduce((sum: number, item: any) => sum + item.nulls, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Missing Values</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-data-success" />
                  <div>
                    <p className="text-2xl font-bold">
                      {((dataStats.rows * dataStats.columns - dataStats.nullCounts.reduce((sum: number, item: any) => sum + item.nulls, 0)) / (dataStats.rows * dataStats.columns) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Data Quality</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Main content tabs */}
      <Tabs defaultValue="table" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="table">Data View</TabsTrigger>
          <TabsTrigger value="profile">Data Profile</TabsTrigger>
          <TabsTrigger value="operations">Clean Data</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <DataTable data={currentData} />
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <DataProfile data={currentData} />
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <CleaningOperations data={currentData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}