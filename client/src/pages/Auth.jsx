import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../lib/api';
import { Navigation2, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        const res = await authAPI.register(formData);
        localStorage.setItem('token', res.data.token);
        await signIn(formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <Card className="w-full max-w-md bg-card/60 backdrop-blur-2xl border-border/50 shadow-2xl relative z-10 overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-primary to-blue-500" />
        <CardHeader className="text-center pt-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.2)]">
            <Navigation2 className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">{isLogin ? 'Welcome back' : 'Create an account'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Enter your credentials to continue to RoadSync.' : 'Join the intelligent city network today.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                  <Label>Full Name</Label>
                  <Input required placeholder="John Doe" className="bg-secondary/50" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" required placeholder="name@example.com" className="bg-secondary/50" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                {isLogin && <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>}
              </div>
              <Input type="password" required className="bg-secondary/50" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>

            <Button className="w-full h-11 text-base mt-2" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="justify-center border-t border-border/50 bg-secondary/20 pt-6">
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-primary hover:underline font-medium">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}