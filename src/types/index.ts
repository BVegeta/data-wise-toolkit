export interface DataProfile {
  columnName: string;
  dataType: string;
  nullCount: number;
  nullPercentage: number;
  uniqueCount: number;
  mean?: number;
  median?: number;
  std?: number;
  min?: number;
  max?: number;
  outliers?: any[];
}

export interface CleaningOperation {
  id: string;
  type: 'remove_duplicates' | 'fill_missing' | 'drop_column' | 'convert_type' | 'normalize' | 'encode_categorical';
  column?: string;
  parameters?: any;
  description: string;
}

export interface DataPipelineStep {
  id: string;
  operation: CleaningOperation;
  status: 'pending' | 'applied' | 'error';
  result?: any;
}

export interface UserSession {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  pipeline: DataPipelineStep[];
  dataProfile?: DataProfile[];
}

export interface ChartConfig {
  [key: string]: {
    label: string;
    color?: string;
  };
}