import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { RootState, AppDispatch } from '../../redux/store';
import { loginAdmin, clearError } from '../../redux/slices/authSlice';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isLoading, error } = useSelector((s: RootState) => s.auth);
  const [showPwd, setShowPwd] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'admin@real.rw', password: 'admin123' },
  });

  useEffect(() => { return () => { dispatch(clearError()); }; }, [dispatch]);

  if (token) return <Navigate to="/admin" replace />;

  const onSubmit = (data: FormData) => dispatch(loginAdmin(data));

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-construction-pattern opacity-20" />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm mb-8">
          <ArrowLeft size={16} /> Back to Site
        </Link>

        <div className="bg-secondary/80 backdrop-blur border border-white/10 p-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-accent flex items-center justify-center font-display font-bold text-white text-2xl">R</div>
            <div>
              <p className="font-display font-bold text-white text-lg">REAL Admin</p>
              <p className="text-white/40 text-xs">Construction Management Portal</p>
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold text-white mb-2">Sign In</h2>
          <p className="text-white/50 text-sm mb-8">Enter your credentials to access the admin panel.</p>

          {/* Demo credentials hint */}
          <div className="bg-accent/10 border border-accent/30 px-4 py-3 mb-6 text-xs text-accent">
            Demo: admin@real.rw / admin123
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="email" {...register('email')} placeholder="admin@real.rw"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors text-sm" />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={showPwd ? 'text' : 'password'} {...register('password')} placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors text-sm" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {error && <p className="text-red-400 text-sm bg-red-900/20 px-4 py-3">{error}</p>}

            <button type="submit" disabled={isLoading}
              className="w-full bg-accent hover:bg-orange-600 text-white font-semibold py-3 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {isLoading ? (
                <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Signing in…</>
              ) : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
