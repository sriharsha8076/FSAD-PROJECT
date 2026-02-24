import React, { createContext, useState, useContext } from 'react';
import { generateStudentId, generateMentorId } from './idGenerator';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [usersDB, setUsersDB] = useState(() => {
    const saved = localStorage.getItem('saams_users_db');
    return saved ? JSON.parse(saved) : [];
  });

  const registerUser = (userData) => {
    let generatedId;
    if (userData.role === 'student') {
      generatedId = generateStudentId();
    } else if (userData.role === 'mentor') {
      generatedId = generateMentorId(userData.name);
    }
    const newUser = {
      ...userData,
      id: generatedId,
      photo: null,
      bio: 'Passionate learner and achiever',
      createdAt: new Date().toISOString(),
    };

    const newDB = [...usersDB, newUser];
    setUsersDB(newDB);
    localStorage.setItem('saams_users_db', JSON.stringify(newDB));

    const sessionUser = {
      id: generatedId,
      email: userData.email,
      role: userData.role,
      name: userData.name,
      photo: null,
      bio: 'Passionate learner and achiever',
      dob: userData.dob,
      mobileNo: userData.mobileNo,
      createdAt: newUser.createdAt,
      isAuthenticated: true
    };
    setUser(sessionUser);
    localStorage.setItem('user', JSON.stringify(sessionUser));
    return sessionUser;
  };

  const login = (identifier, password, role, name = '') => {
    if (role === 'admin') {
      const sessionUser = {
        id: identifier,
        email: `${identifier}@saams.com`,
        role: 'admin',
        name: name || 'Admin',
        photo: null,
        bio: 'System Administrator',
        dob: '1990-01-01',
        mobileNo: '+1 (555) 999-9999',
        createdAt: new Date().toISOString(),
        isAuthenticated: true
      };
      setUser(sessionUser);
      localStorage.setItem('user', JSON.stringify(sessionUser));
      return sessionUser;
    }

    const foundUser = usersDB.find(u => u.email === identifier || u.id === identifier);
    if (!foundUser) {
      throw new Error('User not found. Please check your ID or Email.');
    }
    if (foundUser.password !== password) {
      throw new Error('Incorrect password');
    }

    const sessionUser = {
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
      name: foundUser.name,
      photo: foundUser.photo,
      bio: foundUser.bio || 'Passionate learner and achiever',
      dob: foundUser.dob,
      mobileNo: foundUser.mobileNo,
      createdAt: foundUser.createdAt || new Date().toISOString(),
      isAuthenticated: true
    };
    setUser(sessionUser);
    localStorage.setItem('user', JSON.stringify(sessionUser));
    return sessionUser;
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    const newDB = usersDB.map(u => u.id === user.id ? { ...u, ...updates } : u);
    setUsersDB(newDB);
    localStorage.setItem('saams_users_db', JSON.stringify(newDB));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, registerUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
