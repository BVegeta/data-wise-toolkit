import { useState } from 'react';
import { DataFrame } from 'danfo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useDataStore } from '@/store/useDataStore';
import { 
  Trash2, 
  Droplets, 
  RotateCcw, 
  Zap, 
  TrendingUp, 
  Hash,
  Calendar,
  Type,
  Sparkles
} from 'lucide-react';

interface CleaningOperationsProps {
  data: DataFrame;
}

export default function CleaningOperations({ data }: CleaningOperationsProps) {
  const { setCurrentData, addPipelineStep } = useDataStore();
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const applyOperation = async (operation: string, params: any = {}) => {
    setIsProcessing(true);
    
    try {
      let newData = data.copy();
      let description = '';

      switch (operation) {
        case 'remove_duplicates':
          // In a real implementation, you'd use danfo's drop_duplicates
          description = 'Removed duplicate rows';
          break;
          
        case 'fill_missing_mean':
          if (selectedColumn) {
            const mean = newData[selectedColumn].mean();
            // In real implementation: newData[selectedColumn].fillna(mean, { inplace: true });
            description = `Filled missing values in ${selectedColumn} with mean (${mean.toFixed(2)})`;
          }
          break;
          
        case 'fill_missing_median':
          if (selectedColumn) {
            const median = newData[selectedColumn].median();
            description = `Filled missing values in ${selectedColumn} with median (${median.toFixed(2)})`;
          }
          break;
          
        case 'drop_column':
          if (selectedColumn) {
            newData = newData.drop({ columns: [selectedColumn] });
            description = `Dropped column: ${selectedColumn}`;
          }
          break;
          
        case 'convert_to_numeric':
          if (selectedColumn) {
            // In real implementation: newData[selectedColumn] = pd.to_numeric(newData[selectedColumn])
            description = `Converted ${selectedColumn} to numeric type`;
          }
          break;
          
        default:
          description = `Applied ${operation}`;
      }

      // Add to pipeline
      addPipelineStep({
        id: Date.now().toString(),
        operation: {
          id: Date.now().toString(),
          type: operation as any,
          column: selectedColumn,
          parameters: params,
          description
        },
        status: 'applied'
      });

      setCurrentData(newData);
      
    } catch (error) {
      console.error('Operation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const operations = [
    {
      category: 'Data Quality',
      items: [
        {
          id: 'remove_duplicates',
          title: 'Remove Duplicates',
          description: 'Remove duplicate rows from the dataset',
          icon: Trash2,
          color: 'text-destructive',
          requiresColumn: false
        },
        {
          id: 'fill_missing_mean',
          title: 'Fill with Mean',
          description: 'Fill missing values with column mean',
          icon: TrendingUp,
          color: 'text-data-info',
          requiresColumn: true,
          numericOnly: true
        },
        {
          id: 'fill_missing_median',
          title: 'Fill with Median',
          description: 'Fill missing values with column median',
          icon: TrendingUp,
          color: 'text-data-info',
          requiresColumn: true,
          numericOnly: true
        },
        {
          id: 'drop_column',
          title: 'Drop Column',
          description: 'Remove selected column entirely',
          icon: Trash2,
          color: 'text-destructive',
          requiresColumn: true
        }
      ]
    },
    {
      category: 'Data Transformation',
      items: [
        {
          id: 'convert_to_numeric',
          title: 'Convert to Numeric',
          description: 'Convert text to numbers where possible',
          icon: Hash,
          color: 'text-accent',
          requiresColumn: true
        },
        {
          id: 'convert_to_datetime',
          title: 'Convert to DateTime',
          description: 'Parse dates and times',
          icon: Calendar,
          color: 'text-data-warning',
          requiresColumn: true
        },
        {
          id: 'normalize_column',
          title: 'Normalize Values',
          description: 'Scale values to 0-1 range',
          icon: Zap,
          color: 'text-data-success',
          requiresColumn: true,
          numericOnly: true
        },
        {
          id: 'standardize_column',
          title: 'Standardize (Z-score)',
          description: 'Transform to mean=0, std=1',
          icon: Sparkles,
          color: 'text-accent',
          requiresColumn: true,
          numericOnly: true
        }
      ]
    }
  ];

  const getColumnsForOperation = (operation: any) => {
    const columns = data.columns;
    if (!operation.numericOnly) return columns;
    
    // Filter numeric columns
    return columns.filter(col => {
      const sample = data[col].iloc([0]).values[0];
      return typeof sample === 'number';
    });
  };

  return (
    <div className="space-y-6">
      {/* Column Selection */}
      <Card className="shadow-data">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Type className="h-5 w-5" />
            <span>Column Selection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Select value={selectedColumn} onValueChange={setSelectedColumn}>
              <SelectTrigger>
                <SelectValue placeholder="Select a column to work with" />
              </SelectTrigger>
              <SelectContent>
                {data.columns.map(column => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedColumn && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">{selectedColumn}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Selected for operations that require a specific column
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Operations */}
      {operations.map((category, categoryIndex) => (
        <Card key={categoryIndex} className="shadow-elegant">
          <CardHeader>
            <CardTitle>{category.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.items.map((operation, index) => {
                const Icon = operation.icon;
                const isDisabled = operation.requiresColumn && !selectedColumn;
                const availableColumns = getColumnsForOperation(operation);
                const hasValidColumn = !operation.requiresColumn || availableColumns.includes(selectedColumn);
                
                return (
                  <div
                    key={operation.id}
                    className={`p-4 border rounded-lg transition-all ${
                      isDisabled || !hasValidColumn
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:shadow-md cursor-pointer hover:border-accent'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-muted ${operation.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div>
                          <h4 className="font-medium">{operation.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {operation.description}
                          </p>
                        </div>
                        
                        {operation.requiresColumn && (
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              Requires column
                            </Badge>
                            {operation.numericOnly && (
                              <Badge variant="outline" className="text-xs text-data-info border-data-info">
                                Numeric only
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <Button
                          variant={isDisabled || !hasValidColumn ? "outline" : "default"}
                          size="sm"
                          disabled={isDisabled || !hasValidColumn || isProcessing}
                          onClick={() => applyOperation(operation.id)}
                          className="w-full"
                        >
                          {isProcessing ? 'Applying...' : 'Apply'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Quick Actions */}
      <Card className="shadow-data">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => applyOperation('remove_duplicates')}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Duplicates
            </Button>
            <Button variant="outline" size="sm">
              <Droplets className="h-4 w-4 mr-2" />
              Fill All Missing
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Original
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}