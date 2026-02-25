import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FormInput, Button } from '../components';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../components/Toast';
import { Mail, Lock, User, Key, Calendar, Phone, Hash } from 'lucide-react';
import { generateStudentId, generateMentorId, previewStudentId, previewMentorId } from '../utils/idGenerator';
import styles from './Auth.module.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last Name is required'),
  dob: z.string().min(1, 'Date of Birth is required'),
  mobileNo: z.string().min(10, 'Valid Mobile Number is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  adminId: z.string().optional(),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to terms' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      dob: '',
      mobileNo: '',
      email: '',
      password: '',
      confirmPassword: '',
      adminId: '',
      agreeToTerms: false,
    }
  });

  const [selectedRole, setSelectedRole] = useState('student');
  const [previewId, setPreviewId] = useState('');
  const [customError, setCustomError] = useState('');

  const firstName = watch('firstName');
  const middleName = watch('middleName');
  const lastName = watch('lastName');

  // Update live preview ID
  useEffect(() => {
    const fn = firstName || '';
    const mn = middleName ? middleName + ' ' : '';
    const ln = lastName || '';
    const fullName = `${fn} ${mn}${ln}`.trim();

    if (selectedRole === 'student') {
      setPreviewId(previewStudentId());
    } else if (selectedRole === 'mentor') {
      setPreviewId(previewMentorId(fullName));
    }
  }, [selectedRole, firstName, middleName, lastName]);

  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const { addToast } = useToast();

  const onSubmit = (data) => {
    setCustomError('');

    return new Promise((resolve) => {
      setTimeout(() => {
        const fn = data.firstName;
        const mn = data.middleName ? data.middleName + ' ' : '';
        const ln = data.lastName;
        const fullName = `${fn} ${mn}${ln}`.trim();

        const user = registerUser({
          ...data,
          name: fullName,
          role: selectedRole,
          adminId: selectedRole === 'mentor' ? data.adminId : null
        });

        addToast(`Registration successful! Your ID is: ${user.id}`, 'success');
        navigate(`/${selectedRole === 'admin' ? 'admin' : selectedRole}/dashboard`);
        resolve();
      }, 1000);
    });
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
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <FormInput
            id="previewId"
            label="Unique ID (Auto-Generated)"
            type="text"
            value={previewId}
            disabled={true}
            icon={Hash}
          />

          {selectedRole === 'mentor' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <FormInput
                id="adminId"
                label="University Admin ID (Optional)"
                type="text"
                placeholder="e.g. harsha21 (Leave blank if independent)"
                error={errors.adminId?.message || customError}
                icon={Hash}
                {...register('adminId')}
              />
            </motion.div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormInput
              id="firstName"
              label="First Name"
              type="text"
              placeholder="John"
              error={errors.firstName?.message}
              icon={User}
              {...register('firstName')}
            />
            <FormInput
              id="middleName"
              label="Middle Name"
              type="text"
              placeholder="Middle (Opt)"
              error={errors.middleName?.message}
              icon={User}
              {...register('middleName')}
            />
          </div>
          <FormInput
            id="lastName"
            label="Last Name"
            type="text"
            placeholder="Doe"
            error={errors.lastName?.message}
            icon={User}
            {...register('lastName')}
          />
          <FormInput
            id="dob"
            label="Date of Birth"
            type="date"
            error={errors.dob?.message}
            icon={Calendar}
            {...register('dob')}
          />
          <FormInput
            id="mobileNo"
            label="Mobile Number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            error={errors.mobileNo?.message}
            icon={Phone}
            {...register('mobileNo')}
          />
          <FormInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            error={errors.email?.message}
            icon={Mail}
            {...register('email')}
          />

          <FormInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            icon={Lock}
            {...register('password')}
          />
          <FormInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            icon={Key}
            {...register('confirmPassword')}
          />

          {/* Terms Agreement */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="agreeToTerms"
                {...register('agreeToTerms')}
                style={{ cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
              <label htmlFor="agreeToTerms" style={{ fontSize: '0.875rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>
            {errors.agreeToTerms && (
              <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '4px' }}>{errors.agreeToTerms.message}</p>
            )}
          </div>

          <Button type="submit" variant="primary" disabled={isSubmitting} style={{ width: '100%' }}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
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
