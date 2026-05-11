import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';
import { Button, Input } from '../ui/index.js';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0">
        <div className="absolute top-20 -left-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute bottom-20 -right-40 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">
            Welcome Back
          </h1>
          <p className="text-slate-400 mt-2">
            Sign in to your CollabSync account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-dark-800/80 backdrop-blur-xl border border-dark-600 rounded-2xl p-8 space-y-6"
        >
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-dark-500 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Sign In
          </Button>

          <p className="text-center text-slate-400 text-sm">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
