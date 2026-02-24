import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FormInput, Button } from '../components';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../components/Toast';
import { Mail, Lock, Key } from 'lucide-react';
import styles from './Auth.module.css';

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState('admin@saams.com');
  const [password, setPassword] = useState('password123');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const validateForm = () => {
    const newErrors = {};
    if (!identifier) newErrors.identifier = 'Email or ID is required';
    if (!password) newErrors.password = 'Password is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const detectRole = (id) => {
    // If it's an email containing "admin"
    if (id.includes('@')) {
      return id.toLowerCase().includes('admin') ? 'admin' : 'student';
    }
    // Student ID: 10 digits (e.g. 2602000015)
    if (/^\d{10}$/.test(id)) return 'student';
    // Mentor ID: 4 digits + 2 letters (e.g. 2602AB)
    if (/^\d{4}[A-Za-z]{2}$/.test(id)) return 'mentor';

    // Default fallback
    return 'student';
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      // Hardcoded Admin Logic
      if (identifier === 'harsha21' && password === 'Harsha@0821') {
        login(identifier, password, 'admin', 'Harsha Admin');
        addToast(`Welcome back, Master Admin!`, 'success');
        navigate(`/admin/dashboard`);
        setIsLoading(false);
        return;
      }

      const dynamicRole = detectRole(identifier);
      if (dynamicRole === 'admin') {
        // Stop other basic admin logins if not harsha21 (for demo strictness)
        addToast('Invalid admin credentials', 'error');
        setIsLoading(false);
        return;
      }

      try {
        login(identifier, password, dynamicRole);
        addToast(`Welcome! Logged in as ${dynamicRole}`, 'success');
        navigate(`/${dynamicRole === 'admin' ? 'admin' : dynamicRole}/dashboard`);
      } catch (error) {
        addToast(error.message, 'error');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.pageWrapper}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={styles.authCard}
      >
        {/* Header */}
        <div className={styles.header}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={styles.iconWrapper}
          >
            <Key size={32} color="white" />
          </motion.div>
          <h1 className={styles.title}>Login to SAAMS</h1>
          <p className={styles.subtitle}>Manage student achievements with ease</p>
        </div>



        {/* Form */}
        <form onSubmit={handleLogin} className={styles.form}>
          <FormInput
            id="identifier"
            label="Email or ID"
            type="text"
            placeholder="your@email.com or ID"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              setErrors((prev) => ({ ...prev, identifier: '' }));
            }}
            error={errors.identifier}
            icon={Mail}
          />
          <FormInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: '' }));
            }}
            error={errors.password}
            icon={Lock}
          />

          <Button type="submit" variant="primary" disabled={isLoading} style={{ width: '100%' }}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className={styles.demoBox}>
          <p className={styles.demoTitle}>📌 Demo Credentials</p>
          <p className={styles.demoText}>Admin ID: harsha21</p>
          <p className={styles.demoText}>Password: Harsha@0821</p>
        </div>

        {/* Divider */}
        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerText}>Don't have an account?</span>
        </div>

        {/* Register Link */}
        <Button onClick={() => navigate('/register')} variant="secondary" style={{ width: '100%' }}>
          Create New Account
        </Button>

        {/* Back to Landing */}
        <div className={styles.backLink}>
          <button onClick={() => navigate('/')} className={styles.backBtn}>
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};
