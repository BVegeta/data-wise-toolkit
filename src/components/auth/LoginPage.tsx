import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useDataStore } from '@/store/useDataStore';
import { Database, Info } from 'lucide-react';

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
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border border-border/50 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="h-16 w-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-md">
                <Database className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-3 text-foreground">
                DataClean Pro
              </h1>
              <p className="text-muted-foreground">
                Professional data cleaning and transformation platform
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-primary mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Demo Credentials
              </h3>
              <div className="text-sm text-primary/80 space-y-1">
                <p className="font-mono">Email: demo@app.com</p>
                <p className="font-mono">Password: 123456</p>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-11"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Demo version - No registration required
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}