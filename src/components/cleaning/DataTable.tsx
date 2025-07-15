import { useState, useMemo } from 'react';
import { DataFrame } from 'danfo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Search, Filter, Download } from 'lucide-react';

interface DataTableProps {
  data: DataFrame;
}

export default function DataTable({ data }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { paginatedData, totalPages, columns, displayData } = useMemo(() => {
    const columns = data.columns;
    let processedData = data;

    // Apply sorting
    if (sortColumn) {
      processedData = data.sortValues(sortColumn, { ascending: sortDirection === 'asc' });
    }

    // Convert to array for display
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // Get the data slice
    const slicedData = processedData.iloc({ rows: [`${startIndex}:${endIndex}`] });
    
    // Convert to display format
    const displayRows: any[] = [];
    const shape = slicedData.shape;
    
    for (let i = 0; i < shape[0]; i++) {
      const row: any = {};
      columns.forEach(col => {
        row[col] = slicedData.at(i, col);
      });
      displayRows.push(row);
    }

    return {
      paginatedData: slicedData,
      totalPages: Math.ceil(data.shape[0] / pageSize),
      columns,
      displayData: displayRows
    };
  }, [data, currentPage, pageSize, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getCellValue = (value: any) => {
    if (value === null || value === undefined || value === '') {
      return <Badge variant="secondary" className="text-xs">NULL</Badge>;
    }
    
    if (typeof value === 'number') {
      return <span className="font-mono">{value.toLocaleString()}</span>;
    }
    
    return <span className="truncate max-w-[200px]" title={String(value)}>{String(value)}</span>;
  };

  const getColumnType = (column: string) => {
    const sample = data[column].iloc([0]);
    const value = sample.values[0];
    
    if (typeof value === 'number') return 'numeric';
    if (typeof value === 'boolean') return 'boolean';
    if (value instanceof Date) return 'date';
    return 'text';
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>Data Table</span>
            <Badge variant="secondary">
              {data.shape[0].toLocaleString()} rows × {data.shape[1]} columns
            </Badge>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="border rounded-lg">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  {columns.map((column) => {
                    const columnType = getColumnType(column);
                    return (
                      <TableHead
                        key={column}
                        className="cursor-pointer hover:bg-muted/50 min-w-[120px]"
                        onClick={() => handleSort(column)}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="truncate">{column}</span>
                          <div className="flex flex-col">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                columnType === 'numeric' ? 'border-data-info text-data-info' :
                                columnType === 'date' ? 'border-data-warning text-data-warning' :
                                columnType === 'boolean' ? 'border-data-success text-data-success' :
                                'border-muted-foreground text-muted-foreground'
                              }`}
                            >
                              {columnType}
                            </Badge>
                          </div>
                          {sortColumn === column && (
                            <span className="text-xs">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="text-center text-muted-foreground font-mono">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell key={column} className="max-w-[200px]">
                        {getCellValue(row[column])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, data.shape[0])} of {data.shape[0].toLocaleString()} entries
          </p>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + Math.max(1, currentPage - 2);
                if (page > totalPages) return null;
                
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}