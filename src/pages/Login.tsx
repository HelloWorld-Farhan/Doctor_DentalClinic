import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full min-h-screen flex items-center justify-center p-space-gutter bg-gradient-to-br from-surface via-surface-container-low to-surface-container relative overflow-hidden"
    >
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-secondary-fixed/30 blur-3xl pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-xl p-space-xl flex flex-col gap-space-lg relative z-10">
        <div className="flex flex-col items-center text-center gap-space-sm">
          <div className="w-16 h-16 rounded-xl bg-surface-container-low text-primary flex items-center justify-center shadow-md mb-space-xs overflow-hidden">
            <span className="material-symbols-outlined text-4xl">dentistry</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Doctor Portal</h1>
          <p className="font-body-md text-on-surface-variant">Sign in to access your clinical dashboard and patient records.</p>
        </div>

        <form className="flex flex-col gap-space-md" onSubmit={handleLogin}>
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-md text-on-surface-variant" htmlFor="doctor-email">Doctor Email</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-space-md text-outline text-[20px]">mail</span>
              <input
                className="w-full pl-12 pr-space-md py-space-md rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body-md"
                id="doctor-email"
                placeholder="doctor@DentalClinic.com"
                required
                type="email"
              />
            </div>
          </div>
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-md text-on-surface-variant" htmlFor="doctor-password">Password</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-space-md text-outline text-[20px]">lock</span>
              <input
                className="w-full pl-12 pr-space-md py-space-md rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body-md"
                id="doctor-password"
                placeholder="••••••••••••"
                required
                type="password"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between py-space-xs">
            <label className="flex items-center gap-space-sm cursor-pointer">
              <input className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer" type="checkbox" />
              <span className="font-body-sm text-on-surface-variant">Remember me</span>
            </label>
            <a className="font-body-sm text-primary hover:underline font-medium" href="#">Forgot password?</a>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-space-md rounded-xl bg-[#007782] text-on-primary font-label-lg shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-space-sm"
            type="submit"
          >
            <span>Sign In</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </motion.button>
        </form>

        <div className="pt-space-sm text-center flex flex-col gap-space-sm">
          <p className="font-body-sm text-on-surface-variant">
            New clinician registration?
            <span onClick={() => navigate('/signup')} className="text-primary font-medium hover:underline ml-space-xs cursor-pointer">Create an account</span>
          </p>
          <div className="flex items-center justify-center gap-space-sm pt-space-xs text-outline text-label-sm uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">verified_user</span>
            <span>HIPAA Compliant Secure Portal</span>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
