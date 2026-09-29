import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Leaf,
  ShieldCheck
} from 'lucide-react';
import logoImg from '../../assets/logo.jpeg';
import './UserAuthModal.css';

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  joinedDate: string;
}

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfileData) => void;
  onAdminLoginSuccess?: () => void;
  initialMode?: 'login' | 'register';
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onAdminLoginSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Reset errors when switching modes
  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Login handler - STRICT: ONLY Registered Email ID allowed
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    const normalizedEmail = loginEmail.trim().toLowerCase();

    if (!normalizedEmail || !loginPassword.trim()) {
      setErrorMsg('Please enter your registered Email ID and password.');
      return;
    }

    // Strict Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      setErrorMsg('Login is only permitted with a valid Email ID (e.g. name@example.com). Phone numbers are not accepted.');
      return;
    }

    // 1. Specific Admin Credentials Verification
    // Email: earthora@gmail.com | Password: Earthora2026
    if (normalizedEmail === 'earthora@gmail.com') {
      if (loginPassword === 'Earthora2026' || loginPassword === 'earthora2026') {
        setIsLoading(true);
        setSuccessMsg('Admin credentials verified! Launching Admin Dashboard...');

        const adminSession: UserProfileData = {
          id: 'ADMIN-ROOT',
          name: 'Earthora Admin',
          email: 'earthora@gmail.com',
          phone: '+91 98765 43210',
          joinedDate: new Date().toISOString().slice(0, 10)
        };

        if (rememberMe) {
          localStorage.setItem('earthora_current_user', JSON.stringify(adminSession));
        }

        setTimeout(() => {
          setIsLoading(false);
          onLoginSuccess(adminSession);
          if (onAdminLoginSuccess) {
            onAdminLoginSuccess();
          }
          onClose();
        }, 700);
        return;
      } else {
        setErrorMsg('Incorrect password for Administrator account.');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      // Check registered users from localStorage
      const savedUsersJson = localStorage.getItem('earthora_registered_users');
      const registeredUsers = savedUsersJson ? JSON.parse(savedUsersJson) : [];
      
      const foundUser = registeredUsers.find(
        (u: any) => u.email && u.email.trim().toLowerCase() === normalizedEmail
      );

      if (!foundUser) {
        setErrorMsg('No registered account found with this Email ID. Please enter the exact email used during registration, or click Create Account.');
        setIsLoading(false);
        return;
      }

      if (foundUser.password !== loginPassword) {
        setErrorMsg('Incorrect password. Please verify your password and try again.');
        setIsLoading(false);
        return;
      }

      const userSession: UserProfileData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
        joinedDate: foundUser.joinedDate
      };

      if (rememberMe) {
        localStorage.setItem('earthora_current_user', JSON.stringify(userSession));
      }

      setSuccessMsg(`Welcome back, ${foundUser.name.split(' ')[0]}!`);
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(userSession);
        onClose();
      }, 700);
    }, 600);
  };

  // Register handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const nameTrimmed = regName.trim();
    const emailTrimmed = regEmail.trim();
    const phoneDigits = regPhone.replace(/\D/g, '');

    // 1. Name validation
    if (!nameTrimmed) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (nameTrimmed.length < 2) {
      setErrorMsg('Full name must be at least 2 characters long.');
      return;
    }

    // 2. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrimmed) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(emailTrimmed)) {
      setErrorMsg('Please enter a valid email address (e.g. name@gmail.com).');
      return;
    }
    if (emailTrimmed.toLowerCase() === 'earthora@gmail.com') {
      setErrorMsg('This email is reserved for Earthora Administrator access. Please sign in directly.');
      return;
    }

    // 3. Mobile Number validation (Mandatory 10 digits)
    if (!phoneDigits) {
      setErrorMsg('Mobile number is required.');
      return;
    }
    if (phoneDigits.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      setErrorMsg('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    // 4. Password validation
    if (!regPassword || regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const savedUsersJson = localStorage.getItem('earthora_registered_users');
      const registeredUsers = savedUsersJson ? JSON.parse(savedUsersJson) : [];

      const existing = registeredUsers.find(
        (u: any) => u.email.toLowerCase() === regEmail.trim().toLowerCase()
      );

      if (existing) {
        setErrorMsg('An account with this email already exists. Please Sign In.');
        setIsLoading(false);
        return;
      }

      const newUser: UserProfileData = {
        id: `USER-${Date.now().toString().slice(-5)}`,
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        joinedDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
      };

      registeredUsers.push({ ...newUser, password: regPassword });
      localStorage.setItem('earthora_registered_users', JSON.stringify(registeredUsers));
      localStorage.setItem('earthora_current_user', JSON.stringify(newUser));

      setSuccessMsg('Account created successfully! Welcome to Earthora.');
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(newUser);
        onClose();
      }, 700);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-overlay-backdrop" onClick={onClose}>
      <motion.div 
        className="auth-modal-window"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="auth-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Left Visual Brand Pillar (Desktop) */}
        <div className="auth-brand-pillar">
          <div className="auth-pillar-header">
            <img src={logoImg} alt="EarthOra" className="auth-pillar-logo" />
            <div className="auth-pillar-badge">
              <Leaf size={14} className="pillar-leaf" />
              <span>Ayurvedic Wellness Circle</span>
            </div>
          </div>

          <div className="auth-pillar-body">
            <h3 className="auth-pillar-headline">
              Elevate your daily self-care ritual.
            </h3>
            <p className="auth-pillar-sub">
              Sign in to manage orders, unlock member-only benefits, and experience personalized botanical wellness recommendations.
            </p>

            <div className="auth-pillar-perks">
              <div className="pillar-perk-item">
                <CheckCircle2 size={16} className="perk-check" />
                <span>Complimentary Express Shipping on all orders</span>
              </div>
              <div className="pillar-perk-item">
                <CheckCircle2 size={16} className="perk-check" />
                <span>Save addresses & instant 1-click checkout</span>
              </div>
              <div className="pillar-perk-item">
                <CheckCircle2 size={16} className="perk-check" />
                <span>Personalized Ayurvedic skincare consultation</span>
              </div>
            </div>
          </div>

          <div className="auth-pillar-footer">
            <ShieldCheck size={16} className="text-olive" />
            <span>100% Secure & Encrypted Wellness Account</span>
          </div>
        </div>

        {/* Right Interactive Sliding Form Area */}
        <div className="auth-form-container">
          
          {/* Animated Toggle Switcher */}
          <div className="auth-mode-switcher">
            <button 
              type="button"
              className={`mode-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => handleSwitchMode('login')}
            >
              Sign In
              {mode === 'login' && (
                <motion.div 
                  className="active-pill-indicator" 
                  layoutId="auth-active-indicator"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
            <button 
              type="button"
              className={`mode-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => handleSwitchMode('register')}
            >
              Create Account
              {mode === 'register' && (
                <motion.div 
                  className="active-pill-indicator" 
                  layoutId="auth-active-indicator"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <motion.div 
              className="auth-alert error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errorMsg}
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              className="auth-alert success"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Sparkles size={16} />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* Sliding Forms with AnimatePresence */}
          <div className="auth-sliding-viewport">
            <AnimatePresence mode="wait" initial={false}>
              {mode === 'login' ? (
                /* LOGIN FORM */
                <motion.form 
                  key="login-form"
                  className="auth-form"
                  onSubmit={handleLoginSubmit}
                  initial={{ opacity: 0, x: -35 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 35 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="auth-form-header">
                    <h2 className="auth-form-title">Welcome back</h2>
                    <p className="auth-form-desc">Enter your credentials to access your Earthora profile.</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="login-email">Email Address</label>
                    <div className="input-with-icon">
                      <Mail size={18} className="field-icon" />
                      <input 
                        id="login-email"
                        type="email" 
                        className="auth-input"
                        placeholder="Enter Your Email id"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="label-with-action">
                      <label className="form-label" htmlFor="login-password">Password</label>
                      <button 
                        type="button" 
                        className="forgot-link" 
                        onClick={() => alert("Please contact support@earthora.com to reset your credentials.")}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="input-with-icon">
                      <Lock size={18} className="field-icon" />
                      <input 
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        className="auth-input"
                        placeholder="Enter Your Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                      />
                      <button 
                        type="button" 
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-meta-row">
                    <label className="checkbox-wrap">
                      <input 
                        type="checkbox" 
                        checked={rememberMe} 
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span>Keep me signed in</span>
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    className="auth-submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="btn-loading-spinner" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <div className="form-switch-prompt">
                    <span>New to Earthora?</span>{' '}
                    <button 
                      type="button" 
                      className="link-switch"
                      onClick={() => handleSwitchMode('register')}
                    >
                      Create an account
                    </button>
                  </div>
                </motion.form>
              ) : (
                /* REGISTRATION FORM */
                <motion.form 
                  key="register-form"
                  className="auth-form"
                  onSubmit={handleRegisterSubmit}
                  initial={{ opacity: 0, x: 35 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -35 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="auth-form-header">
                    <h2 className="auth-form-title">Join Earthora</h2>
                    <p className="auth-form-desc">Create your profile for personalized wellness rituals and express checkout.</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-name">
                      Full Name <span className="required-star">*</span>
                    </label>
                    <div className="input-with-icon">
                      <User size={18} className="field-icon" />
                      <input 
                        id="reg-name"
                        type="text" 
                        className="auth-input"
                        placeholder="Enter Your Name"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-email">
                      Email Address <span className="required-star">*</span>
                    </label>
                    <div className="input-with-icon">
                      <Mail size={18} className="field-icon" />
                      <input 
                        id="reg-email"
                        type="email" 
                        className="auth-input"
                        placeholder="Enter Your Email id"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-phone">
                      Mobile Number <span className="required-star">*</span>
                    </label>
                    <div className="input-with-icon">
                      <Phone size={18} className="field-icon" />
                      <input 
                        id="reg-phone"
                        type="tel" 
                        className="auth-input"
                        placeholder="Enter Your Phone Number"
                        value={regPhone}
                        maxLength={10}
                        onChange={(e) => {
                          const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setRegPhone(onlyDigits);
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-password">
                      Create Password <span className="required-star">*</span>
                    </label>
                    <div className="input-with-icon">
                      <Lock size={18} className="field-icon" />
                      <input 
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        className="auth-input"
                        placeholder="Enter Your Password (Min 6 characters)"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button" 
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="auth-submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="btn-loading-spinner" />
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <div className="form-switch-prompt">
                    <span>Already have an account?</span>{' '}
                    <button 
                      type="button" 
                      className="link-switch"
                      onClick={() => handleSwitchMode('login')}
                    >
                      Sign In
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
