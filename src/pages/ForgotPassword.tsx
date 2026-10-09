import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';

type ResetStep = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Multi-step states
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('dr.sharma@dentalclinicpro.net');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // OTP state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendSeconds, setResendSeconds] = useState(45);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Dynamic clinic logo from localStorage if configured
  const savedLogo = localStorage.getItem('dental_clinic_logo');

  // Resend countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (step === 'otp' && resendSeconds > 0) {
      timer = setInterval(() => {
        setResendSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendSeconds]);

  // Step 1: Submit Email
  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSendingCode(true);
    setTimeout(() => {
      setIsSendingCode(false);
      setStep('otp');
      setResendSeconds(45);
      // Auto-focus first digit on step change
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }, 600);
  };

  // OTP input handling
  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleaned;
    setOtpDigits(newDigits);
    setOtpError(null);

    // Auto-advance
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i];
    }
    setOtpDigits(newDigits);
    if (pasteData.length === 6) {
      inputRefs.current[5]?.focus();
    } else {
      inputRefs.current[pasteData.length]?.focus();
    }
  };

  const handleAutoFillDemoOtp = () => {
    setOtpDigits(['4', '8', '2', '9', '1', '0']);
    setOtpError(null);
    inputRefs.current[5]?.focus();
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      setOtpError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setIsVerifyingOtp(true);
    setTimeout(() => {
      setIsVerifyingOtp(false);
      setStep('password');
    }, 550);
  };

  const handleResendOtp = () => {
    if (resendSeconds > 0) return;
    setResendSeconds(45);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError(null);
    inputRefs.current[0]?.focus();
  };

  // Password validation checks
  const hasMinLength = newPassword.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isPasswordValid = hasMinLength && hasNumberOrSymbol && hasUpperCase && passwordsMatch;

  // Step 3: Save Password
  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!hasMinLength) {
      setPasswordError('Password must contain at least 8 characters.');
      return;
    }
    if (!hasUpperCase) {
      setPasswordError('Password must contain at least one uppercase letter.');
      return;
    }
    if (!hasNumberOrSymbol) {
      setPasswordError('Password must contain at least one number or special symbol.');
      return;
    }
    if (!passwordsMatch) {
      setPasswordError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSavingPassword(true);
    setTimeout(() => {
      setIsSavingPassword(false);
      setStep('success');
    }, 650);
  };

  return (
    <div className="w-full h-screen max-h-screen overflow-hidden bg-surface flex flex-col lg:flex-row relative">
      {/* LEFT PANEL - Multi-Step Password Recovery Form */}
      <motion.div 
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full lg:w-1/2 h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-surface overflow-y-auto lg:overflow-hidden"
      >
        {/* Top Header */}
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
              <span className="text-base font-bold text-primary block leading-tight">Dental Clinic Pro</span>
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Account Recovery</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Sign In
          </button>
        </div>

        {/* Center Content with Step Animations */}
        <div className="w-full max-w-md mx-auto my-auto py-3">
          {/* Step Progress Indicators */}
          {step !== 'success' && (
            <div className="mb-6 flex items-center justify-between max-w-xs mx-auto">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === 'email' 
                    ? 'bg-primary text-white shadow-xs' 
                    : 'bg-emerald-500 text-white'
                }`}>
                  {step !== 'email' ? '✓' : '1'}
                </span>
                <span className="text-xs font-bold text-on-surface">Email</span>
              </div>
              <div className={`h-0.5 w-10 transition-colors ${step === 'email' ? 'bg-surface-container-high' : 'bg-emerald-500'}`}></div>

              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === 'otp' 
                    ? 'bg-primary text-white shadow-xs' 
                    : step === 'password'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  {step === 'password' ? '✓' : '2'}
                </span>
                <span className="text-xs font-bold text-on-surface">OTP Code</span>
              </div>
              <div className={`h-0.5 w-10 transition-colors ${step === 'password' ? 'bg-emerald-500' : 'bg-surface-container-high'}`}></div>

              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === 'password' 
                    ? 'bg-primary text-white shadow-xs' 
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  3
                </span>
                <span className="text-xs font-bold text-on-surface">Reset</span>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: Enter Doctor Email */}
            {step === 'email' && (
              <motion.div
                key="step-email"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.22 }}
              >
                <div className="mb-5 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mb-1.5">
                    Reset Doctor Password
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant">
                    Enter your verified clinical email address to receive a secure 6-digit OTP code.
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleEmailSubmit}>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-on-surface-variant" htmlFor="reset-email">
                      Professional Email Address
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-outline pointer-events-none">
                        mail
                      </span>
                      <input
                        id="reset-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="doctor@dentalclinicpro.net"
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Fast demo email pill */}
                  <div className="pt-0.5">
                    <button
                      type="button"
                      onClick={() => setEmail('dr.sharma@dentalclinicpro.net')}
                      className="text-xs text-primary font-medium hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                      Fill demo email: dr.sharma@dentalclinicpro.net
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={isSendingCode}
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 mt-3"
                  >
                    {isSendingCode ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Dispatching Security OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Send 6-Digit Verification Code</span>
                        <span className="material-symbols-outlined text-[18px]">send</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: Enter 6-Digit OTP */}
            {step === 'otp' && (
              <motion.div
                key="step-otp"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.22 }}
              >
                <div className="mb-5 text-center sm:text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                      Enter 6-Digit OTP
                    </h1>
                    <button
                      type="button"
                      onClick={() => setStep('email')}
                      className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                    >
                      Change Email
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant">
                    Security code sent to <strong className="text-on-surface font-semibold">{email}</strong>.
                  </p>
                </div>

                {/* Quick Auto-Fill Demo OTP helper */}
                <button
                  type="button"
                  onClick={handleAutoFillDemoOtp}
                  className="w-full mb-4 py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">mark_email_read</span>
                    <span className="text-xs text-on-surface">
                      Demo Code: <strong className="font-mono font-bold text-emerald-700 tracking-wider">482910</strong>
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 underline">1-Click Insert</span>
                </button>

                <form className="space-y-5" onSubmit={handleVerifyOtp}>
                  {/* 6 Digit Input Boxes */}
                  <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { inputRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className={`w-11 sm:w-13 h-12 sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl bg-surface-container-low border transition-all focus:outline-none ${
                          digit 
                            ? 'border-primary text-primary bg-primary/5 ring-1 ring-primary' 
                            : 'border-surface-container-high text-on-surface'
                        }`}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <div className="text-xs font-semibold text-error flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">error</span>
                      {otpError}
                    </div>
                  )}

                  {/* Countdown Timer & Resend */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-on-surface-variant">Didn't receive the code?</span>
                    {resendSeconds > 0 ? (
                      <span className="text-outline font-medium">
                        Resend in <strong className="text-on-surface font-semibold">{resendSeconds}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-primary font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">refresh</span>
                        Resend Code
                      </button>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={isVerifyingOtp}
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Verifying Security Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Continue</span>
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* STEP 3: Create New Password */}
            {step === 'password' && (
              <motion.div
                key="step-password"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.22 }}
              >
                <div className="mb-4 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mb-1">
                    Create New Password
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant">
                    Set a HIPAA-compliant password to protect clinical charts and patient records.
                  </p>
                </div>

                <form className="space-y-3.5" onSubmit={handlePasswordSubmit}>
                  {/* New Password */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-on-surface-variant" htmlFor="new-password">
                      New Password
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-outline pointer-events-none">
                        lock
                      </span>
                      <input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-11 pr-11 py-2.5 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 text-outline hover:text-on-surface transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showNewPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-on-surface-variant" htmlFor="confirm-password">
                      Confirm New Password
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-outline pointer-events-none">
                        lock_reset
                      </span>
                      <input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-11 pr-11 py-2.5 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 text-outline hover:text-on-surface transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showConfirmPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Requirements Checklist */}
                  <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/80 space-y-1.5 text-xs">
                    <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Password Requirements:</div>
                    <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 font-semibold' : 'text-outline'}`}>
                      <span className="material-symbols-outlined text-[16px]">{hasMinLength ? 'check_circle' : 'radio_button_unchecked'}</span>
                      <span>At least 8 characters long</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasUpperCase ? 'text-emerald-600 font-semibold' : 'text-outline'}`}>
                      <span className="material-symbols-outlined text-[16px]">{hasUpperCase ? 'check_circle' : 'radio_button_unchecked'}</span>
                      <span>At least one uppercase letter (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasNumberOrSymbol ? 'text-emerald-600 font-semibold' : 'text-outline'}`}>
                      <span className="material-symbols-outlined text-[16px]">{hasNumberOrSymbol ? 'check_circle' : 'radio_button_unchecked'}</span>
                      <span>At least one number or special symbol</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-600 font-semibold' : 'text-outline'}`}>
                      <span className="material-symbols-outlined text-[16px]">{passwordsMatch ? 'check_circle' : 'radio_button_unchecked'}</span>
                      <span>Passwords match exactly</span>
                    </div>
                  </div>

                  {passwordError && (
                    <div className="text-xs font-semibold text-error flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">error</span>
                      {passwordError}
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={isSavingPassword || !isPasswordValid}
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isSavingPassword ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Saving Secure Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Update Password & Save</span>
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* STEP 4: Success Confirmation */}
            {step === 'success' && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-4 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-on-surface">Password Reset Complete!</h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                    Your password for <strong className="text-on-surface">{email}</strong> has been updated securely. You can now log into your clinical portal.
                  </p>
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high text-xs text-on-surface-variant flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">lock</span>
                  <span>HIPAA Audit Trail Token: #PW-RESET-94021</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate('/')}
                  className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign In with New Password</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
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
            256-Bit Cryptographic OTP
          </span>
          <span>•</span>
          <span className="font-medium">15-Min Expiry</span>
        </div>
      </motion.div>

      {/* RIGHT PANEL - Informational & HIPAA Governance (Transferred to Right with Smooth Animation) */}
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
              <span className="text-xl font-bold tracking-tight block leading-tight">Dental Clinic Pro</span>
              <span className="text-[11px] text-primary-fixed font-medium uppercase tracking-wider">Security & Governance</span>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-primary-fixed border border-white/15">
            HIPAA Security Rule §164.312
          </span>
        </div>

        {/* Center Security Guidance */}
        <div className="relative z-10 max-w-lg my-auto py-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-primary-fixed text-xs font-bold mb-4 border border-white/15 backdrop-blur-sm">
              <span className="material-symbols-outlined text-[16px] text-emerald-400">shield_lock</span>
              Protected Health Information (PHI) Safe
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-on-primary mb-4 leading-tight">
              Cryptographic Recovery, <br />
              <span className="text-primary-fixed">Strictly Compliant.</span>
            </h2>
            
            <p className="text-sm lg:text-base text-primary-fixed-dim mb-7 leading-relaxed font-light">
              Doctor credential reset processes are audited in compliance with federal healthcare standards. Each one-time passcode is generated ephemerally and cryptographically bound to your NPI license.
            </p>

            {/* Security Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-7">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary-fixed text-[20px] mt-0.5">pin</span>
                <div>
                  <div className="text-xs font-bold text-on-primary">6-Digit Ephemeral OTP</div>
                  <div className="text-[11px] text-primary-fixed-dim">Single-use 15-minute token</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary-fixed text-[20px] mt-0.5">history_edu</span>
                <div>
                  <div className="text-xs font-bold text-on-primary">Audit Log Tracking</div>
                  <div className="text-[11px] text-primary-fixed-dim">Timestamped HIPAA audit entry</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary-fixed text-[20px] mt-0.5">password</span>
                <div>
                  <div className="text-xs font-bold text-on-primary">Argon2 Password Hashing</div>
                  <div className="text-[11px] text-primary-fixed-dim">Irreversible cryptographic salt</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary-fixed text-[20px] mt-0.5">phonelink_lock</span>
                <div>
                  <div className="text-xs font-bold text-on-primary">Session Revocation</div>
                  <div className="text-[11px] text-primary-fixed-dim">Terminates older idle logins</div>
                </div>
              </div>
            </div>

            {/* Clinical Support Callout */}
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-primary-fixed shrink-0">
                  <span className="material-symbols-outlined text-[20px]">support_agent</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-on-primary leading-tight">Need Urgent Assistance?</div>
                  <div className="text-[10px] text-primary-fixed-dim font-medium">Clinic IT Support Desk: +1 (555) 382-9900 Ext. 4</div>
                </div>
              </div>

              <span className="text-[11px] font-bold text-primary-fixed bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                24/7 On-Call
              </span>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-primary-fixed-dim text-xs">
          <span>© 2026 Dental Clinic Pro Inc.</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Zero-Trust Architecture
          </span>
        </div>
      </motion.div>
    </div>
  );
}
