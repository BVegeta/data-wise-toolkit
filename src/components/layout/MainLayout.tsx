import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDataStore } from '@/store/useDataStore';
import { Database, Upload, Settings, BarChart3, Workflow, Download, LogOut, Moon, Sun } from 'lucide-react';

const tabs = [
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'clean', label: 'Clean', icon: Settings },
  { id: 'analyze', label: 'Analyze', icon: BarChart3 },
  { id: 'pipeline', label: 'Pipeline', icon: Workflow },
  { id: 'export', label: 'Export', icon: Download },
] as const;

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { activeTab, setActiveTab, isDarkMode, toggleDarkMode, logout, currentUser } = useDataStore();

  return (
    <div className={`min-h-screen bg-background transition-colors ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  DataClean Pro
                </h1>
                <p className="text-xs text-muted-foreground">Data Science Platform</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-2 bg-muted/50 rounded-lg p-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 transition-all ${
                    activeTab === tab.id 
                      ? 'bg-background shadow-sm' 
                      : 'hover:bg-background/50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </Button>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="h-9 w-9 rounded-lg"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <Badge variant="secondary" className="px-3 py-1">
                {currentUser}
              </Badge>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4">
            <div className="flex space-x-2 overflow-x-auto bg-muted/30 rounded-lg p-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 whitespace-nowrap transition-all ${
                    activeTab === tab.id 
                      ? 'bg-background shadow-sm' 
                      : 'hover:bg-background/50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="space-y-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}