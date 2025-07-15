import { useDataStore } from '@/store/useDataStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Workflow, Database } from 'lucide-react';

export default function PipelineBuilder() {
  const { pipeline, setActiveTab } = useDataStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Pipeline Builder</h2>
        <p className="text-muted-foreground mt-2">
          Visual workflow builder for data transformation pipelines
        </p>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Workflow className="h-5 w-5" />
            <span>Transformation Pipeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pipeline.length === 0 ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                No pipeline steps yet. Start by cleaning your data to build a pipeline.
              </p>
              <Button onClick={() => setActiveTab('clean')} variant="outline">
                Go to Data Cleaning
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {pipeline.length} step(s) in your pipeline
              </p>
              {pipeline.map((step, index) => (
                <div key={step.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Step {index + 1}</span>
                    <span className="text-sm text-muted-foreground">
                      {step.operation.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}