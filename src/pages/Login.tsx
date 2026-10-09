import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('dr.sharma@dentalclinicpro.net');
  const [password, setPassword] = useState('DentalPro@2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic clinic logo from localStorage if configured
  const savedLogo = localStorage.getItem('dental_clinic_logo');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 450);
  };

  const handleQuickDemoFill = () => {
    setEmail('dr.sharma@dentalclinicpro.net');
    setPassword('DentalPro@2026');
  };

  return (
    <div className="w-full h-screen max-h-screen overflow-hidden bg-surface flex flex-col lg:flex-row relative">
      {/* LEFT PANEL - Doctor Sign In Form */}
      <motion.div 
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full lg:w-1/2 h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-surface overflow-y-auto lg:overflow-hidden"
      >
        {/* Top Brand Marker (Visible on mobile/tablet) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs overflow-hidden">
              {savedLogo ? (
                <img src={savedLogo} alt="Clinic Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <span className="material-symbols-outlined text-[24px] text-primary">dentistry</span>
              )}
            </div>
            <div>
              <span className="text-base font-bold text-primary block leading-tight">Smile Clinic</span>
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Doctor Portal</span>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            HIPAA Protected
          </span>
        </div>

        {/* Center Form Card */}
        <div className="w-full max-w-md mx-auto my-auto py-4">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mb-1.5">
              Welcome Back, Doctor
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Sign in to manage patient records, operatory charts, and treatment plans.
            </p>
          </div>

          {/* Quick Demo Credentials Pill */}
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="w-full mb-5 py-1.5 px-3 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
              <span className="text-xs text-on-surface font-medium">
                Demo Account: <strong className="text-primary font-bold">Dr. Sarah Sharma, DDS</strong>
              </span>
            </div>
            <span className="text-[11px] font-semibold text-primary group-hover:underline">Auto-fill</span>
          </button>

          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Doctor Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-on-surface-variant" htmlFor="doctor-email">
                Professional Email Address
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-outline pointer-events-none">
                  mail
                </span>
                <input
                  id="doctor-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@dentalclinicpro.net"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary transition-all font-medium"
                />
              </div>
            </div>

            {/* Doctor Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-on-surface-variant" htmlFor="doctor-password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-outline pointer-events-none">
                  lock
                </span>
                <input
                  id="doctor-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-2.5 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-outline hover:text-on-surface transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer" 
                />
                <span className="text-xs font-medium text-on-surface-variant">Remember my terminal</span>
              </label>
              <span className="text-[11px] text-outline font-medium">Session: 30 Days</span>
            </div>

            {/* Sign In Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isLoading}
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Authenticating Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Clinical Portal</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </motion.button>
          </form>

          {/* New Account Link */}
          <div className="text-center pt-5">
            <p className="text-xs sm:text-sm text-on-surface-variant">
              New clinician registration?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-primary font-bold hover:underline cursor-pointer ml-0.5"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className="pt-2 text-center text-outline text-[11px] flex items-center justify-center gap-3">
          <span className="flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[14px] text-emerald-600">verified_user</span>
            HIPAA Compliant
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[14px] text-primary">enhanced_encryption</span>
            256-Bit AES TLS
          </span>
          <span>•</span>
          <span className="font-medium">Tier-4 Encrypted</span>
        </div>
      </motion.div>

      {/* RIGHT PANEL - Informational & Clinical Telemetry (Transferred with Smooth Animation) */}
      <motion.div 
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.08 }}
        className="hidden lg:flex w-1/2 h-full bg-primary relative flex-col justify-between p-10 lg:p-12 xl:p-16 overflow-hidden select-none"
      >
        {/* Decorative Blurred Glow Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-fixed/20 blur-3xl"></div>
          <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-secondary-fixed/20 blur-3xl"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-primary-fixed-dim/15 blur-3xl"></div>
        </div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center justify-between text-on-primary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-primary-fixed">dentistry</span>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight block leading-tight">Smile Clinic</span>
              <span className="text-[11px] text-primary-fixed font-medium uppercase tracking-wider">Next-Gen Doctor Suite</span>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-primary-fixed border border-white/15">
            v2.4 Production
          </span>
        </div>

        {/* Center Clinical Message */}
        <div className="relative z-10 max-w-lg my-auto py-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-primary-fixed text-xs font-bold mb-4 border border-white/15 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Operatory Telemetry Ready
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-on-primary mb-4 leading-tight">
              Precision Care, <br />
              <span className="text-primary-fixed">Elevated Practice.</span>
            </h2>
            
            <p className="text-sm lg:text-base text-primary-fixed-dim mb-7 leading-relaxed font-light">
              Access comprehensive patient charts, real-time appointments, automated clinical telemetry, and HIPAA-secure communication in one unified platform.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-7">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary-fixed text-[20px] mt-0.5">bolt</span>
                <div>
                  <div className="text-xs font-bold text-on-primary">Real-Time Telemetry</div>
                  <div className="text-[11px] text-primary-fixed-dim">Instant operatory sensor sync</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary-fixed text-[20px] mt-0.5">mic</span>
                <div>
                  <div className="text-xs font-bold text-on-primary">AI Voice Charting</div>
                  <div className="text-[11px] text-primary-fixed-dim">Hands-free perio dictation</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary-fixed text-[20px] mt-0.5">security</span>
                <div>
                  <div className="text-xs font-bold text-on-primary">HIPAA Tier 4 Vault</div>
                  <div className="text-[11px] text-primary-fixed-dim">End-to-end encrypted records</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary-fixed text-[20px] mt-0.5">analytics</span>
                <div>
                  <div className="text-xs font-bold text-on-primary">Power BI Insights</div>
                  <div className="text-[11px] text-primary-fixed-dim">Clinical & revenue telemetry</div>
                </div>
              </div>
            </div>

            {/* Active Status Badge */}
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary-fixed/40 shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80" 
                    alt="Dr. Sarah Sharma" 
                    className="w-full h-full object-cover" 
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-primary"></span>
                </div>
                <div>
                  <div className="text-xs font-bold text-on-primary leading-tight">Operatory Room 01</div>
                  <div className="text-[10px] text-primary-fixed-dim font-medium">Dr. Sarah Sharma, DDS • Active Session</div>
                </div>
              </div>

              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-400/30">
                Online
              </span>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-primary-fixed-dim text-xs">
          <span>© 2026 Smile Clinic Inc.</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Cloud Core 99.98% SLA
          </span>
        </div>
      </motion.div>
    </div>
  );
}
