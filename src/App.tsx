import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDataStore } from "@/store/useDataStore";
import LoginPage from "@/components/auth/LoginPage";
import MainLayout from "@/components/layout/MainLayout";
import FileUpload from "@/components/upload/FileUpload";
import DataCleaning from "@/components/cleaning/DataCleaning";
import DataAnalysis from "@/components/analysis/DataAnalysis";
import PipelineBuilder from "@/components/pipeline/PipelineBuilder";
import DataExport from "@/components/export/DataExport";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated, activeTab } = useDataStore();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'upload':
        return <FileUpload />;
      case 'clean':
        return <DataCleaning />;
      case 'analyze':
        return <DataAnalysis />;
      case 'pipeline':
        return <PipelineBuilder />;
      case 'export':
        return <DataExport />;
      default:
        return <FileUpload />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!isAuthenticated ? (
          <LoginPage />
        ) : (
          <MainLayout>
            {renderActiveTab()}
          </MainLayout>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;