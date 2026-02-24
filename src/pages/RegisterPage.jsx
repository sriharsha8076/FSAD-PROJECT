import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FormInput, Button } from '../components';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../components/Toast';
import { Mail, Lock, User, Key, Calendar, Phone, Hash } from 'lucide-react';
import { generateStudentId, generateMentorId, previewStudentId, previewMentorId } from '../utils/idGenerator';
import styles from './Auth.module.css';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    mobileNo: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [selectedRole, setSelectedRole] = useState('student');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [previewId, setPreviewId] = useState('');

  // Update live preview ID
  useEffect(() => {
    const fullName = `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`.trim();
    if (selectedRole === 'student') {
      setPreviewId(previewStudentId());
    } else if (selectedRole === 'mentor') {
      setPreviewId(previewMentorId(fullName));
    }
  }, [selectedRole, formData.firstName, formData.middleName, formData.lastName]);

  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const { addToast } = useToast();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required';
    if (!formData.mobileNo) newErrors.mobileNo = 'Mobile Number is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      const fullName = `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`.trim();

      const user = registerUser({
        ...formData,
        name: fullName,
        role: selectedRole
      });

      addToast(`Registration successful! Your ID is: ${user.id}`, 'success');
      navigate(`/${selectedRole === 'admin' ? 'admin' : selectedRole}/dashboard`);
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
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
            <User size={32} color="white" />
          </motion.div>
          <h1 className={styles.title}>Join SAAMS</h1>
          <p className={styles.subtitle}>Create your account and start today</p>
        </div>

        {/* Role Selection */}
        <div className={styles.roleSelection}>
          <label className={styles.roleLabel}>Account Type</label>
          <div className={styles.roleGrid}>
            {['student', 'mentor'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`${styles.roleButton} ${selectedRole === role ? styles.roleButtonActive : ''}`}
              >
                {role === 'student' ? '👨‍🎓 Student' : '👨‍🏫 Mentor'}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
            ℹ️ Your Unique ID is auto-assigned continuously and locked upon registration.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className={styles.form}>
          <FormInput
            id="previewId"
            label="Unique ID (Auto-Generated)"
            type="text"
            value={previewId}
            disabled={true}
            icon={Hash}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormInput
              id="firstName"
              label="First Name"
              type="text"
              placeholder="John"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              error={errors.firstName}
              icon={User}
            />
            <FormInput
              id="middleName"
              label="Middle Name"
              type="text"
              placeholder="Middle (Opt)"
              name="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
              error={errors.middleName}
              icon={User}
            />
          </div>
          <FormInput
            id="lastName"
            label="Last Name"
            type="text"
            placeholder="Doe"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            error={errors.lastName}
            icon={User}
          />
          <FormInput
            id="dob"
            label="Date of Birth"
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            error={errors.dob}
            icon={Calendar}
          />
          <FormInput
            id="mobileNo"
            label="Mobile Number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleInputChange}
            error={errors.mobileNo}
            icon={Phone}
          />
          <FormInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            icon={Mail}
          />

          <FormInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            icon={Lock}
          />
          <FormInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            icon={Key}
          />

          {/* Terms Agreement */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleCheckboxChange}
                style={{ cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
              <label htmlFor="agreeToTerms" style={{ fontSize: '0.875rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>
            {errors.agreeToTerms && (
              <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '4px' }}>{errors.agreeToTerms}</p>
            )}
          </div>

          <Button type="submit" variant="primary" disabled={isLoading} style={{ width: '100%' }}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        {/* Divider */}
        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerText}>Already have an account?</span>
        </div>

        {/* Login Link */}
        <Button onClick={() => navigate('/login')} variant="secondary" style={{ width: '100%' }}>
          Sign In
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
