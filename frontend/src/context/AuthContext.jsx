import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const defaultUser = {
  id: "user-101",
  name: "Sumit Kumar",
  email: "sumit.kumar@example.com",
  role: "student", // 'student' | 'jobseeker' | 'recruiter'
  headline: "Aspiring Full Stack Engineer | MERN & AI Enthusiast",
  education: "B.Tech CSE, NIT Bengaluru (2025)",
  experienceLevel: "0-1 Years",
  targetRole: "Software Engineer",
  preferredLocation: "Bengaluru, Hybrid / Remote",
  profileCompletion: 85,
  careerReadinessScore: 78,
  atsScore: 82,
  interviewReadiness: 74,
  skillsCount: 10,
  isOnboarded: true,
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('careerai_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem('careerai_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('careerai_user');
    }
  }, [user]);

  const login = (email, password, role = 'student') => {
    const newUser = {
      ...defaultUser,
      email: email || defaultUser.email,
      name: email ? email.split('@')[0] : defaultUser.name,
      role: role
    };
    setUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  const signup = (formData) => {
    const newUser = {
      ...defaultUser,
      id: `user-${Date.now()}`,
      name: formData.fullName || "New User",
      email: formData.email,
      role: formData.role || "student",
      targetRole: formData.targetJobRole || "Full Stack Developer",
      education: formData.currentEducation || "Engineering Student",
      preferredLocation: formData.preferredLocation || "Bengaluru",
      isOnboarded: false
    };
    setUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const switchRole = (newRole) => {
    if (user) {
      setUser((prev) => ({ ...prev, role: newRole }));
    }
  };

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        switchRole,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
