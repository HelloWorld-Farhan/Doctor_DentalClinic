import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  // Dynamic clinic logo from localStorage if configured
  const savedLogo = localStorage.getItem('dental_clinic_logo');

  return (
    <div className="w-full h-screen max-h-screen overflow-hidden bg-surface flex flex-col lg:flex-row relative">
      {/* Left Panel - Branding & Info */}
      <motion.div 
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="hidden lg:flex w-1/2 h-full bg-primary relative flex-col justify-between p-8 xl:p-12 overflow-hidden select-none"
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-fixed/20 blur-3xl"></div>
          <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-secondary-fixed/20 blur-3xl"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-primary-fixed-dim/15 blur-3xl"></div>
        </div>

        {/* Top Brand Marker */}
        <div className="relative z-10 flex items-center justify-between text-on-primary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden">
              {savedLogo ? (
                <img src={savedLogo} alt="Clinic Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <span className="material-symbols-outlined text-[24px] text-primary-fixed">dentistry</span>
              )}
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight block leading-tight">Smile Clinic</span>
              <span className="text-[11px] text-primary-fixed font-medium uppercase tracking-wider">Clinician Onboarding</span>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-primary-fixed border border-white/15">
            Verified Facility
          </span>
        </div>

        {/* Center Pitch */}
        <div className="relative z-10 max-w-md my-auto py-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-primary-fixed text-xs font-bold mb-3 border border-white/15 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Join 4,200+ Licensed Dental Specialists
            </div>

            <h2 className="text-3xl xl:text-4xl font-bold text-on-primary mb-3 leading-tight">
              Empower Your <br />
              <span className="text-primary-fixed">Clinical Practice.</span>
            </h2>

            <p className="text-sm xl:text-base text-primary-fixed-dim mb-6 leading-relaxed font-light">
              Join thousands of modern dentists managing patients, appointments, and medical records seamlessly with our AI-driven platform.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-on-primary text-sm">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-primary-fixed shrink-0">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                </div>
                <span>HIPAA Compliant Security & Encryption</span>
              </div>
              <div className="flex items-center gap-3 text-on-primary text-sm">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-primary-fixed shrink-0">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                </div>
                <span>Automated Patient Scheduling & Recalls</span>
              </div>
              <div className="flex items-center gap-3 text-on-primary text-sm">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-primary-fixed shrink-0">
                  <span className="material-symbols-outlined text-[16px]">mic</span>
                </div>
                <span>Advanced AI Voice-to-Text Charting</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-primary-fixed-dim text-xs">
          <span>© 2026 Smile Clinic Inc.</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            HIPAA Tier 4 Certified
          </span>
        </div>
      </motion.div>

      {/* Right Panel - Form (Fits without scrolling on desktop) */}
      <motion.div 
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.08 }}
        className="w-full lg:w-1/2 h-full flex flex-col justify-between p-6 sm:p-8 xl:p-12 bg-surface overflow-y-auto lg:overflow-hidden"
      >
        {/* Top Header on mobile */}
        <div className="flex lg:hidden items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">dentistry</span>
            </div>
            <span className="font-bold text-sm text-primary">Smile Clinic</span>
          </div>
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            className="text-xs text-primary font-semibold hover:underline"
          >
            Sign In
          </button>
        </div>

        <div className="w-full max-w-lg mx-auto my-auto py-2">
          <div className="mb-4 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mb-1">Doctor Registration</h1>
            <p className="text-xs sm:text-sm text-on-surface-variant">Create your clinical account to access your dental workspace.</p>
          </div>

          <form className="space-y-3.5" onSubmit={handleSignup}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface-variant">Full Name</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                    person
                  </span>
                  <input 
                    className="w-full pl-9 pr-3.5 py-2 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all font-medium" 
                    placeholder="Dr. Priya Patel" 
                    required 
                    type="text"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface-variant">Medical License / NPI</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                    badge
                  </span>
                  <input 
                    className="w-full pl-9 pr-3.5 py-2 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all font-medium font-mono" 
                    placeholder="NPI-9834210" 
                    required 
                    type="text"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface-variant">Professional Email</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                    mail
                  </span>
                  <input 
                    className="w-full pl-9 pr-3.5 py-2 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all font-medium" 
                    placeholder="doctor@smileclinic.com" 
                    required 
                    type="email"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface-variant">Specialization</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                    medical_services
                  </span>
                  <select 
                    defaultValue="" 
                    className="w-full pl-9 pr-8 py-2 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all appearance-none cursor-pointer font-medium" 
                    required
                  >
                    <option disabled value="">Select Specialization</option>
                    <option value="orthodontics">Orthodontics</option>
                    <option value="endodontics">Endodontics</option>
                    <option value="periodontics">Periodontics</option>
                    <option value="general">General Dentistry</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 text-[18px] text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-on-surface-variant">Clinic / Practice Name</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                  domain
                </span>
                <input 
                  className="w-full pl-9 pr-3.5 py-2 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all font-medium" 
                  placeholder="Smile Clinic Dental Practice" 
                  required 
                  type="text"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-on-surface-variant">Password</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                  lock
                </span>
                <input 
                  className="w-full pl-9 pr-3.5 py-2 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all font-medium" 
                  placeholder="••••••••••••" 
                  required 
                  type="password"
                />
              </div>
            </div>

            <div className="flex items-start pt-1">
              <div className="flex items-center h-4 mt-0.5">
                <input 
                  className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary bg-surface-container-low cursor-pointer" 
                  id="terms" 
                  required 
                  type="checkbox"
                />
              </div>
              <div className="ml-2.5 text-xs">
                <label className="text-on-surface-variant cursor-pointer" htmlFor="terms">
                  I agree to the <span className="text-primary hover:underline font-semibold">Clinical Terms of Service</span> and <span className="text-primary hover:underline font-semibold">HIPAA Protocol</span>.
                </label>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }} 
              whileTap={{ scale: 0.99 }} 
              className="w-full py-2.5 sm:py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-primary-container transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 mt-2 cursor-pointer" 
              type="submit"
            >
              <span>Create Account</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </motion.button>

            <div className="text-center pt-2">
              <p className="text-xs text-on-surface-variant">
                Already have a clinical account? 
                <button 
                  type="button" 
                  onClick={() => navigate('/')} 
                  className="text-primary font-bold hover:underline ml-1 cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Footer Security Badges */}
        <div className="pt-1 text-center text-outline text-[11px] flex items-center justify-center gap-3">
          <span className="flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[14px] text-emerald-600">verified_user</span>
            HIPAA Compliant
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[14px] text-primary">enhanced_encryption</span>
            256-Bit TLS
          </span>
        </div>
      </motion.div>
    </div>
  );
}
