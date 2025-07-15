import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useDataStore } from '@/store/useDataStore';
import { Database, TrendingUp, Zap, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@app.com');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);
  const login = useDataStore(state => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = login(email, password);
    if (!success) {
      alert('Invalid credentials. Use demo@app.com / 123456');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl grid lg:grid-cols-2 gap-8"
      >
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="hidden lg:flex flex-col justify-center space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                DataClean Pro
              </h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Professional-grade data cleaning and transformation platform
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-start space-x-4 p-4 rounded-lg bg-card border"
            >
              <TrendingUp className="h-8 w-8 text-accent mt-1" />
              <div>
                <h3 className="font-semibold text-card-foreground">Smart Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Automated data profiling and intelligent cleaning suggestions
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-start space-x-4 p-4 rounded-lg bg-card border"
            >
              <Zap className="h-8 w-8 text-data-warning mt-1" />
              <div>
                <h3 className="font-semibold text-card-foreground">Visual Pipeline</h3>
                <p className="text-sm text-muted-foreground">
                  Build transformation workflows with drag-and-drop interface
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-start space-x-4 p-4 rounded-lg bg-card border"
            >
              <Shield className="h-8 w-8 text-data-success mt-1" />
              <div>
                <h3 className="font-semibold text-card-foreground">Code Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Export to Python, R, or JavaScript for production use
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex items-center justify-center"
        >
          <Card className="w-full max-w-md shadow-elegant">
            <CardHeader className="space-y-4">
              <div className="lg:hidden flex items-center justify-center space-x-3">
                <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Database className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  DataClean Pro
                </h1>
              </div>
              <div className="text-center">
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your data cleaning workspace
                </CardDescription>
              </div>
              <Badge variant="secondary" className="self-center">
                Demo Mode Available
              </Badge>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-11"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground text-center mb-2">
                  Demo Credentials
                </p>
                <div className="text-sm font-mono text-center space-y-1">
                  <div>Email: demo@app.com</div>
                  <div>Password: 123456</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}