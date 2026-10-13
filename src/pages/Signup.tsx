import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';

export default function Signup() {
  const navigate = useNavigate();

  // Registration Fields
  const [fullName, setFullName] = useState('');
  const [npiLicense, setNpiLicense] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('general');
  const [practiceName, setPracticeName] = useState('Smile Clinic Dental Practice');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const [mockEmailOtp, setMockEmailOtp] = useState('519342');
  const [mockMobileOtp, setMockMobileOtp] = useState('883109');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(45);

  // Dynamic clinic logo from localStorage if configured
  const savedLogo = localStorage.getItem('dental_clinic_logo');

  // Password criteria verification
  const isMin8Chars = password.length >= 8;
  const isRecommended12 = password.length >= 12;
  const hasCapital = /[A-Z]/.test(password);
  const numberCount = (password.match(/\d/g) || []).length;
  const hasMin2Numbers = numberCount >= 2;
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const isPasswordValid = isMin8Chars && hasCapital && hasMin2Numbers && hasSpecial;

  // Initial Form Submit -> Open Dual OTP Modal
  const handleInitiateSignup = (e: FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!isPasswordValid) {
      setSignupError(
        'Password does not meet all security criteria: 8-12+ characters, 1 uppercase, 2 numbers, and 1 special symbol.'
      );
      return;
    }

    if (!passwordsMatch) {
      setSignupError('Passwords do not match. Please ensure both passwords match.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setSignupError('Please provide a valid 10-digit mobile phone number for OTP verification.');
      return;
    }

    if (!agreedTerms) {
      setSignupError('Please agree to the Clinical Terms of Service and HIPAA Protocol.');
      return;
    }

    // Generate fresh 6-digit mock codes
    const newEmailCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newMobileCode = Math.floor(100000 + Math.random() * 900000).toString();
    setMockEmailOtp(newEmailCode);
    setMockMobileOtp(newMobileCode);
    setEmailOtp('');
    setMobileOtp('');
    setOtpError(null);
    setShowOtpModal(true);
    setResendCountdown(60);
  };

  const handleAutoFillOtp = () => {
    setEmailOtp(mockEmailOtp);
    setMobileOtp(mockMobileOtp);
    setOtpError(null);
  };

  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    if (emailOtp.trim() !== mockEmailOtp) {
      setOtpError('Invalid Email OTP code. Please check the code or click Auto-fill.');
      return;
    }

    if (mobileOtp.trim() !== mockMobileOtp) {
      setOtpError('Invalid Mobile SMS OTP code. Please check the code or click Auto-fill.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      // Store doctor in localStorage
      const existing = JSON.parse(localStorage.getItem('smileclinic_registered_doctors') || '[]');
      const newDoctor = {
        name: fullName,
        license: npiLicense,
        email: email.trim(),
        phone: phone.trim(),
        specialization,
        practiceName,
        password,
        registeredAt: new Date().toISOString(),
      };
      existing.push(newDoctor);
      localStorage.setItem('smileclinic_registered_doctors', JSON.stringify(existing));

      sessionStorage.setItem('smileclinic_doctor_auth', 'true');
      sessionStorage.setItem('doctor_email', newDoctor.email);
      sessionStorage.setItem('doctor_name', newDoctor.name);

      setIsVerifying(false);
      setShowOtpModal(false);
      navigate('/dashboard');
    }, 600);
  };

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
                <span>HIPAA Compliant Security &amp; Encryption</span>
              </div>
              <div className="flex items-center gap-3 text-on-primary text-sm">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-primary-fixed shrink-0">
                  <span className="material-symbols-outlined text-[16px]">sms</span>
                </div>
                <span>Dual Email &amp; Mobile Phone OTP Verification</span>
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

      {/* Right Panel - Form */}
      <motion.div 
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.08 }}
        className="w-full lg:w-1/2 h-full flex flex-col justify-between p-6 sm:p-8 xl:p-10 bg-surface overflow-y-auto"
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
          <div className="mb-3 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mb-1">Doctor Registration</h1>
            <p className="text-xs sm:text-sm text-on-surface-variant">Create your clinical account with verified email &amp; mobile OTP.</p>
          </div>

          {signupError && (
            <div className="mb-3 p-3 bg-error/10 border border-error/20 rounded-xl text-error text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
              <span>{signupError}</span>
            </div>
          )}

          <form className="space-y-3" onSubmit={handleInitiateSignup}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface-variant">Full Name *</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                    person
                  </span>
                  <input 
                    className="w-full pl-9 pr-3.5 py-2 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all font-medium" 
                    placeholder="Dr. Priya Patel" 
                    required 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface-variant">Medical License / NPI *</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                    badge
                  </span>
                  <input 
                    className="w-full pl-9 pr-3.5 py-2 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all font-medium font-mono" 
                    placeholder="NPI-9834210" 
                    required 
                    type="text"
                    value={npiLicense}
                    onChange={(e) => setNpiLicense(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface-variant">Professional Email *</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                    mail
                  </span>
                  <input 
                    className="w-full pl-9 pr-3.5 py-2 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all font-medium" 
                    placeholder="doctor@smileclinic.com" 
                    required 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface-variant">Mobile Phone (For SMS OTP) *</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                    phone_iphone
                  </span>
                  <input 
                    className="w-full pl-9 pr-3.5 py-2 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all font-medium" 
                    placeholder="+1 (555) 349-8821" 
                    required 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface-variant">Specialization</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                    medical_services
                  </span>
                  <select 
                    value={specialization} 
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all appearance-none cursor-pointer font-medium" 
                  >
                    <option value="general">General Dentistry</option>
                    <option value="orthodontics">Orthodontics</option>
                    <option value="endodontics">Endodontics</option>
                    <option value="periodontics">Periodontics</option>
                    <option value="pediatric">Pediatric Dentistry</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 text-[18px] text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface-variant">Practice Name</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                    domain
                  </span>
                  <input 
                    className="w-full pl-9 pr-3.5 py-2 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all font-medium" 
                    placeholder="Smile Clinic Practice" 
                    required 
                    type="text"
                    value={practiceName}
                    onChange={(e) => setPracticeName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Password and Confirm Password with Eye Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface-variant">Password (8-12+ chars) *</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                    lock
                  </span>
                  <input 
                    className="w-full pl-9 pr-10 py-2 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all font-medium" 
                    placeholder="e.g. Doctor@Smile2026#" 
                    required 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-outline hover:text-on-surface transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface-variant">Confirm Password *</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                    lock_reset
                  </span>
                  <input 
                    className="w-full pl-9 pr-10 py-2 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all font-medium" 
                    placeholder="Re-enter password" 
                    required 
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-outline hover:text-on-surface transition-colors cursor-pointer"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Password Criteria Checklist */}
            <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high text-[11px] space-y-1">
              <span className="font-bold text-on-surface-variant uppercase text-[10px] block">
                Required Security Criteria:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <div className={`flex items-center gap-1.5 ${isMin8Chars ? 'text-emerald-600 font-bold' : 'text-outline'}`}>
                  <span className="material-symbols-outlined text-[16px]">
                    {isMin8Chars ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>Min. 8–12 Characters ({password.length}/12)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasCapital ? 'text-emerald-600 font-bold' : 'text-outline'}`}>
                  <span className="material-symbols-outlined text-[16px]">
                    {hasCapital ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>1+ Capital Letter (A-Z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasMin2Numbers ? 'text-emerald-600 font-bold' : 'text-outline'}`}>
                  <span className="material-symbols-outlined text-[16px]">
                    {hasMin2Numbers ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>2+ Numbers (Found {numberCount})</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-600 font-bold' : 'text-outline'}`}>
                  <span className="material-symbols-outlined text-[16px]">
                    {hasSpecial ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>1+ Special Symbol (!@#$%...)</span>
                </div>
                <div className={`flex items-center gap-1.5 sm:col-span-2 ${passwordsMatch ? 'text-emerald-600 font-bold' : 'text-outline'}`}>
                  <span className="material-symbols-outlined text-[16px]">
                    {passwordsMatch ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>
                    {passwordsMatch
                      ? 'Passwords Match Perfectly'
                      : confirmPassword.length > 0
                      ? 'Passwords Do Not Match'
                      : 'Confirm Password Required'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start pt-1">
              <div className="flex items-center h-4 mt-0.5">
                <input 
                  className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary bg-surface-container-low cursor-pointer" 
                  id="terms" 
                  required 
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                />
              </div>
              <div className="ml-2.5 text-xs">
                <label className="text-on-surface-variant cursor-pointer" htmlFor="terms">
                  I agree to the <span className="text-primary hover:underline font-semibold">Clinical Terms of Service</span> and consent to dual Email &amp; Mobile OTP verification.
                </label>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }} 
              whileTap={{ scale: 0.99 }} 
              className="w-full py-2.5 sm:py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-primary-container transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 mt-2 cursor-pointer" 
              type="submit"
            >
              <span>Verify &amp; Create Account (Email &amp; Mobile OTP)</span>
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </motion.button>
          </form>

          {/* Footer Back to Login */}
          <div className="text-center pt-4">
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Already have a credentialed doctor account?{' '}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-primary font-bold hover:underline cursor-pointer ml-0.5"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        <div className="pt-2 text-center text-outline text-[11px]">
          <span>Protected by HIPAA Cloud Security Protocol • v2.4</span>
        </div>
      </motion.div>

      {/* DUAL OTP VERIFICATION MODAL */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-surface rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-surface-container-high relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-surface-container-high">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">verified_user</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-on-surface">Doctor Credential Verification</h3>
                    <p className="text-xs text-on-surface-variant">Verify both Email &amp; Mobile SMS passcodes</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="p-1 rounded-lg hover:bg-surface-container-high text-outline hover:text-on-surface transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Demo Notification Banner with One-Click Autofill */}
              <div className="my-4 p-3.5 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <span className="material-symbols-outlined text-[16px] text-amber-500">auto_awesome</span>
                    <span>Simulated Clinical Dispatch (Demo)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    className="text-xs font-bold text-primary bg-surface px-2.5 py-1 rounded-lg border border-primary/30 hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    Auto-Fill Both Codes
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-surface p-2 rounded-lg border border-surface-container-high">
                    <span className="text-[10px] uppercase block text-outline font-sans font-semibold">
                      Email Code ({email.slice(0, 14)}...)
                    </span>
                    <span className="text-sm font-bold text-on-surface">{mockEmailOtp}</span>
                  </div>
                  <div className="bg-surface p-2 rounded-lg border border-surface-container-high">
                    <span className="text-[10px] uppercase block text-outline font-sans font-semibold">
                      Mobile SMS ({phone.slice(-4)})
                    </span>
                    <span className="text-sm font-bold text-on-surface">{mockMobileOtp}</span>
                  </div>
                </div>
              </div>

              {otpError && (
                <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-xl text-error text-xs flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                  <span>{otpError}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {/* 1. Email OTP Field */}
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    1. Email 6-Digit Verification Code *
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                      mail
                    </span>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 519342"
                      className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low rounded-xl text-sm text-on-surface font-mono tracking-widest border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* 2. Mobile OTP Field */}
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    2. Mobile SMS 6-Digit Passcode *
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                      phone_iphone
                    </span>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={mobileOtp}
                      onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 883109"
                      className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low rounded-xl text-sm text-on-surface font-mono tracking-widest border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      const newEmailCode = Math.floor(100000 + Math.random() * 900000).toString();
                      const newMobileCode = Math.floor(100000 + Math.random() * 900000).toString();
                      setMockEmailOtp(newEmailCode);
                      setMockMobileOtp(newMobileCode);
                      setResendCountdown(60);
                    }}
                    className="text-xs font-semibold text-outline hover:text-on-surface flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    <span>Resend Codes ({resendCountdown}s)</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowOtpModal(false)}
                      className="px-4 py-2 text-xs font-bold text-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="px-5 py-2 text-xs font-bold text-on-primary bg-primary hover:bg-primary-container rounded-xl shadow-md shadow-primary/20 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">check</span>
                          <span>Verify &amp; Activate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
