import { useState, useEffect } from 'react';
import { DataFrame } from 'danfo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, Info, Database } from 'lucide-react';

interface DataProfileProps {
  data: DataFrame;
}

export default function DataProfile({ data }: DataProfileProps) {
  const [profileData, setProfileData] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const columns = data.columns;
      const profiles = columns.map(column => {
        const series = data[column];
        const nullCount = series.isna().sum();
        const totalCount = data.shape[0];
        const uniqueCount = series.unique().values.length;
        
        // Get data type
        const sampleValue = series.iloc([0]).values[0];
        let dataType = 'object';
        if (typeof sampleValue === 'number') dataType = 'numeric';
        else if (typeof sampleValue === 'boolean') dataType = 'boolean';
        else if (sampleValue instanceof Date) dataType = 'datetime';

        let stats: any = {};
        if (dataType === 'numeric') {
          try {
            stats = {
              mean: series.mean(),
              median: series.median(),
              std: series.std(),
              min: series.min(),
              max: series.max()
            };
          } catch (e) {
            stats = {};
          }
        }

        return {
          column,
          dataType,
          nullCount,
          nullPercentage: (nullCount / totalCount) * 100,
          uniqueCount,
          uniquePercentage: (uniqueCount / totalCount) * 100,
          completeness: ((totalCount - nullCount) / totalCount) * 100,
          ...stats
        };
      });

      setProfileData(profiles);
    }
  }, [data]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'numeric': return 'text-data-info';
      case 'datetime': return 'text-data-warning';
      case 'boolean': return 'text-data-success';
      default: return 'text-muted-foreground';
    }
  };

  const getQualityLevel = (completeness: number) => {
    if (completeness >= 95) return { level: 'Excellent', color: 'text-data-success' };
    if (completeness >= 80) return { level: 'Good', color: 'text-data-info' };
    if (completeness >= 60) return { level: 'Fair', color: 'text-data-warning' };
    return { level: 'Poor', color: 'text-destructive' };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profileData.map((profile, index) => {
          const quality = getQualityLevel(profile.completeness);
          
          return (
            <Card key={profile.column} className="shadow-data">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="truncate">{profile.column}</span>
                  <Badge variant="outline" className={getTypeColor(profile.dataType)}>
                    {profile.dataType}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Completeness */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Data Quality</span>
                    <span className={quality.color}>{quality.level}</span>
                  </div>
                  <Progress value={profile.completeness} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{profile.completeness.toFixed(1)}% complete</span>
                    <span>{profile.nullCount} missing</span>
                  </div>
                </div>

                {/* Uniqueness */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uniqueness</span>
                    <span>{profile.uniquePercentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{profile.uniqueCount} unique values</span>
                    <span>
                      {profile.uniqueCount === data.shape[0] ? (
                        <Badge variant="outline" className="text-data-success border-data-success">
                          <Database className="h-3 w-3 mr-1" />
                          Primary Key
                        </Badge>
                      ) : profile.uniquePercentage < 5 ? (
                        <Badge variant="outline" className="text-data-warning border-data-warning">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Low Variance
                        </Badge>
                      ) : null}
                    </span>
                  </div>
                </div>

                {/* Numeric stats */}
                {profile.dataType === 'numeric' && profile.mean !== undefined && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="text-sm font-medium">Statistics</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Mean:</span>
                        <span className="ml-1 font-mono">{profile.mean.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Median:</span>
                        <span className="ml-1 font-mono">{profile.median.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Min:</span>
                        <span className="ml-1 font-mono">{profile.min.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Max:</span>
                        <span className="ml-1 font-mono">{profile.max.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div className="pt-2 border-t">
                  <div className="flex items-center space-x-1 text-xs">
                    <Info className="h-3 w-3 text-accent" />
                    <span className="text-muted-foreground">
                      {profile.nullPercentage > 50 ? 'Consider dropping this column' :
                       profile.nullPercentage > 20 ? 'High missing values detected' :
                       profile.nullPercentage > 5 ? 'Some missing values' :
                       'Good data quality'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Data Quality Overview Chart */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Data Quality Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profileData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="column" 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis />
                <Bar dataKey="completeness" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}