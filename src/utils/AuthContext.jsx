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
      adminId: userData.role === 'mentor' ? userData.adminId : null,
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
      adminId: newUser.adminId,
      isAuthenticated: true
    };
    setUser(sessionUser);
    localStorage.setItem('user', JSON.stringify(sessionUser));
    return sessionUser;
  };

  const login = (identifier, password, role, name = '') => {
    if (role === 'superadmin') {
      const sessionUser = {
        id: identifier,
        email: `${identifier}@saams.com`,
        role: 'superadmin',
        name: name || 'System Creator',
        photo: null,
        bio: 'Master System Administrator',
        dob: '1990-01-01',
        mobileNo: '+1 (555) 000-0000',
        createdAt: new Date().toISOString(),
        isAuthenticated: true
      };
      setUser(sessionUser);
      localStorage.setItem('user', JSON.stringify(sessionUser));
      return sessionUser;
    }

    if (role === 'admin') {
      // In the future this will check the DB for the admin.
      // For now, allow dynamically logged in admin (created by superadmin) or fallback.
      const foundAdmin = usersDB.find(u => (u.email === identifier || u.id === identifier) && u.role === 'admin');

      let sessionUser;
      if (foundAdmin) {
        if (foundAdmin.password !== password) {
          throw new Error('Incorrect password');
        }
        sessionUser = { ...foundAdmin, isAuthenticated: true };
      } else {
        // Fallback or demo admin
        sessionUser = {
          id: identifier,
          email: `${identifier}@saams.com`,
          role: 'admin',
          name: name || 'Admin',
          photo: null,
          bio: 'University Administrator',
          dob: '1990-01-01',
          mobileNo: '+1 (555) 999-9999',
          createdAt: new Date().toISOString(),
          isAuthenticated: true,
          mustChangePassword: false, // Default admin doesn't need to change
        };
      }
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

  const createUniversityAdmin = (adminData) => {
    // Check if ID already exists
    if (usersDB.some(u => u.id === adminData.id)) {
      throw new Error('An Admin with this ID already exists');
    }

    const newAdmin = {
      ...adminData,
      role: 'admin',
      photo: null,
      bio: 'University Administrator',
      createdAt: new Date().toISOString(),
      mustChangePassword: true,
    };

    const newDB = [...usersDB, newAdmin];
    setUsersDB(newDB);
    localStorage.setItem('saams_users_db', JSON.stringify(newDB));
    return newAdmin;
  };

  const deleteUniversityAdmin = (adminId) => {
    // Only allow deletion if the user exists and is an admin
    const adminToDelete = usersDB.find(u => u.id === adminId && u.role === 'admin');
    if (!adminToDelete) {
      throw new Error('Admin not found');
    }

    const newDB = usersDB.filter(u => u.id !== adminId);
    setUsersDB(newDB);
    localStorage.setItem('saams_users_db', JSON.stringify(newDB));
  };

  return (
    <AuthContext.Provider value={{ user, usersDB, login, logout, registerUser, updateUser, createUniversityAdmin, deleteUniversityAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
