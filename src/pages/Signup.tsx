import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Panel - Branding & Info */}
      <div className="hidden lg:flex w-1/2 bg-primary relative flex-col justify-between p-12 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-fixed/20 blur-3xl"></div>
          <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-secondary-fixed/20 blur-3xl"></div>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-on-primary">
          <span className="material-symbols-outlined text-4xl">dentistry</span>
          <span className="text-2xl font-bold tracking-tight">Dental Clinic Pro</span>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-headline-lg text-on-primary mb-6 leading-tight">
              Empower Your Clinical Practice.
            </h2>
            <p className="text-lg text-primary-fixed-dim mb-8">
              Join thousands of modern dentists managing patients, appointments, and medical records seamlessly with our AI-driven platform.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-on-primary">
                <span className="material-symbols-outlined text-primary-fixed">check_circle</span>
                <span>HIPAA Compliant Security</span>
              </div>
              <div className="flex items-center gap-3 text-on-primary">
                <span className="material-symbols-outlined text-primary-fixed">check_circle</span>
                <span>Automated Patient Scheduling</span>
              </div>
              <div className="flex items-center gap-3 text-on-primary">
                <span className="material-symbols-outlined text-primary-fixed">check_circle</span>
                <span>Advanced AI Charting</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="relative z-10 text-primary-fixed-dim text-sm">
          © 2026 Dental Clinic Pro. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-surface">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-lg"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-headline-lg text-on-surface mb-2">Doctor Registration</h1>
            <p className="text-on-surface-variant">Create your clinical account to get started.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSignup}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </span>
                  <input className="w-full pl-10 pr-4 py-3 bg-surface-container-low rounded-xl text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Dr. Priya Patel" required type="text"/>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface">Medical License / NPI</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-[20px]">badge</span>
                  </span>
                  <input className="w-full pl-10 pr-4 py-3 bg-surface-container-low rounded-xl text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="NPI-9834210" required type="text"/>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface">Professional Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </span>
                  <input className="w-full pl-10 pr-4 py-3 bg-surface-container-low rounded-xl text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="doctor@clinic.org" required type="email"/>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface">Specialization</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-[20px]">medical_services</span>
                  </span>
                  <select defaultValue="" className="w-full pl-10 pr-10 py-3 bg-surface-container-low rounded-xl text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all appearance-none cursor-pointer" required>
                    <option disabled value="">Select Specialization</option>
                    <option value="orthodontics">Orthodontics</option>
                    <option value="endodontics">Endodontics</option>
                    <option value="periodontics">Periodontics</option>
                    <option value="general">General Dentistry</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-on-surface">Clinic / Practice Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">local_hospital</span>
                </span>
                <input className="w-full pl-10 pr-4 py-3 bg-surface-container-low rounded-xl text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Advanced Dental Care Center" required type="text"/>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-on-surface">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </span>
                <input className="w-full pl-10 pr-4 py-3 bg-surface-container-low rounded-xl text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="••••••••••••" required type="password"/>
              </div>
            </div>

            <div className="flex items-start pt-2">
              <div className="flex items-center h-5">
                <input className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary bg-surface-container-low cursor-pointer" id="terms" required type="checkbox"/>
              </div>
              <div className="ml-3 text-sm">
                <label className="text-on-surface-variant cursor-pointer" htmlFor="terms">
                  I agree to the <a className="text-primary hover:underline font-medium" href="#">Clinical Terms of Service</a> and <a className="text-primary hover:underline font-medium" href="#">HIPAA Protocol</a>.
                </label>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }} 
              whileTap={{ scale: 0.99 }} 
              className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-medium hover:bg-opacity-95 transition-all shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer" 
              type="submit"
            >
              <span>Create Account</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </motion.button>

            <div className="text-center pt-4">
              <p className="text-sm text-on-surface-variant">
                Already have a clinical account? 
                <span onClick={() => navigate('/')} className="text-primary font-semibold hover:underline ml-1 cursor-pointer">Sign In</span>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
