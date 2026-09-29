import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, X } from 'lucide-react';
import logoImg from '../../assets/logo.jpeg';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLoginSuccess();
    } else {
      setError('Please enter your username and password.');
    }
  };

  return (
    <div className="admin-modal-overlay">
      <motion.div 
        className="admin-modal login-modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="admin-modal-header border-none">
          <div className="login-header-brand">
            <img src={logoImg} alt="EarthOra" className="brand-logo-img modal-logo-img" />
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-body margin-top-none">
          {error && <div className="login-error-alert">{error}</div>}

          <div className="form-group">
            <label>Username</label>
            <div className="input-with-icon">
              <User size={16} className="input-icon" />
              <input 
                type="text" 
                className="admin-input icon-padded"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input 
                type="password" 
                className="admin-input icon-padded"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
          </div>

          <div className="login-actions margin-top-md">
            <button type="submit" className="admin-btn-primary full-width font-md flex-center justify-center">
              Sign In to Admin Portal <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
