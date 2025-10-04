import React, { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import NSSLandingPage from './components/NSSLandingPage';
import NSSRegistrationForm from './components/NSSRegistrationForm';
import NSSPortfolioPage from './components/NSSPortfolioPage';
import NSSLoginPage from './components/NSSLoginPage';
import NSSAdminPanel from './components/NSSAdminPanel';
import NSSEventsPage from './components/NSSEventsPage';
import NSSPortfolioDisplay from './components/NSSPortfolioDisplay';
import NSSForgotPasswordPage from './components/NSSForgotPasswordPage';
import NSSQrScanner from './components/NSSQrScanner';
import { DataAdapter } from './lib/dataAdapter';

export interface NSSUser {
  id: string;
  fullName: string;
  rollNumber: string;
  branch: string;
  password: string;
  profilePhoto: string;
  eventPhotos: EventPhoto[];
  qrCode: string;
  timestamp: number;
  isApproved: boolean;
  isRejected?: boolean;
  approvedBy?: string;
  approvedAt?: number;
  rejectedBy?: string;
  rejectedAt?: number;
  rejectionReason?: string;
  // New fields for volunteer tracking
  joinDate: string;
  endDate?: string;
  achievements: Achievement[];
  certificates: Certificate[];
  eventHistory: EventHistory[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  level: 'national' | 'district' | 'state';
  date: string;
  photo: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: number;
}

export interface Certificate {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  uploadDate: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: number;
}

export interface EventHistory {
  eventId: string;
  eventTitle: string;
  startDate: string;
  endDate: string;
  status: 'registered' | 'attended' | 'completed';
  registrationDate: string;
  attendanceDate?: string;
  completionDate?: string;
}

export interface Suggestion {
  id: string;
  userId: string;
  userName: string;
  userRollNumber: string;
  title: string;
  description: string;
  category: 'general' | 'event' | 'system' | 'achievement';
  status: 'pending' | 'reviewed' | 'implemented' | 'rejected';
  timestamp: number;
  reviewedBy?: string;
  reviewedAt?: number;
  response?: string;
}

export interface EventPhoto {
  id: string;
  photo: string;
  title: string;
  description: string;
}

export interface AdminEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startDate: string;
  endDate: string;
  registrations: EventRegistration[];
  timestamp: number;
}

export interface EventRegistration {
  userId: string;
  userRollNumber: string;
  userName: string;
  registeredAt: number;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: number;
}

export interface Registration {
  id: string;
  name: string;
  email: string;
  mobile: string;
  branch: string;
  section: string;
  year: string;
  familyMembers: number;
  timestamp: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'registration' | 'portfolio' | 'login' | 'admin' | 'events' | 'display' | 'forgot-password' | 'scan'>('landing');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['landing']);
  const [users, setUsers] = useState<NSSUser[]>([]);
  const [adminEvents, setAdminEvents] = useState<AdminEvent[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [currentUser, setCurrentUser] = useState<NSSUser | null>(null);
  const [displayUser, setDisplayUser] = useState<NSSUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Load data from Supabase
    const loadData = async () => {
      try {
        const [usersData, eventsData, suggestionsData] = await Promise.all([
          DataAdapter.getAllUsers(),
          DataAdapter.getAllEvents(),
          DataAdapter.getAllSuggestions(),
        ]);
        
        setUsers(usersData);
        setAdminEvents(eventsData);
        setSuggestions(suggestionsData);
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
        // Fallback to localStorage if Supabase fails
        const savedUsers = localStorage.getItem('nss-users');
        const savedEvents = localStorage.getItem('nss-admin-events');
        const savedSuggestions = localStorage.getItem('nss-suggestions');
        
        if (savedUsers) {
          setUsers(JSON.parse(savedUsers));
        }
        if (savedEvents) {
          setAdminEvents(JSON.parse(savedEvents));
        }
        if (savedSuggestions) {
          setSuggestions(JSON.parse(savedSuggestions));
        }
      }
    };

    loadData();
  }, []);

  // If a QR deep link was opened (e.g., https://site/?qr=...), try to show that user's portfolio.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qr = params.get('qr');
    const u = params.get('u');
    if (qr && users.length > 0) {
      const matched = users.find(u => u.qrCode === qr);
      if (matched) {
        setDisplayUser(matched);
        setCurrentPage('display');
        // Clean the URL so the param doesn't persist
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    } else if (qr && u) {
      // Fallback: try to decode the compact user payload and display a minimal portfolio
      try {
        // Ensure running in browser and use window.atob to avoid SSR/Node issues
        const base64 = typeof window !== 'undefined' && typeof window.atob === 'function' ? window.atob(u) : atob(u);
        const decoded = JSON.parse(decodeURIComponent(base64));
        const minimalUser: NSSUser = {
          id: decoded.id || `guest_${Date.now()}`,
          fullName: decoded.fullName || 'Guest User',
          rollNumber: decoded.rollNumber || 'GUEST',
          branch: decoded.branch || 'N/A',
          password: '',
          profilePhoto: '', // unknown on this device
          eventPhotos: [],
          qrCode: qr,
          timestamp: typeof decoded.timestamp === 'number' ? decoded.timestamp : Date.now(),
          isApproved: !!decoded.isApproved,
          joinDate: new Date().toISOString().split('T')[0],
          achievements: [],
          certificates: [],
          eventHistory: []
        };
        setDisplayUser(minimalUser);
        setCurrentPage('display');
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      } catch (e) {
        // If decoding fails, ignore and keep landing page
      }
    }
  }, [users]);

  const navigateToPage = (page: typeof currentPage) => {
    setNavigationHistory(prev => [...prev, currentPage]);
    setCurrentPage(page);
  };

  const navigateBack = () => {
    if (navigationHistory.length > 0) {
      const previousPage = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setCurrentPage(previousPage as typeof currentPage);
    } else {
      setCurrentPage('landing');
    }
  };

  const saveUser = async (user: NSSUser) => {
    try {
      const userWithDefaults = { 
        ...user, 
        isApproved: false, 
        isRejected: false,
        joinDate: user.joinDate || new Date().toISOString().split('T')[0],
        achievements: user.achievements || [],
        certificates: user.certificates || [],
        eventHistory: user.eventHistory || []
      };
      
      const createdUser = await DataAdapter.createUser(userWithDefaults);
      const updated = [...users, createdUser];
      setUsers(updated);
      setCurrentUser(createdUser);
      navigateToPage('portfolio');
    } catch (error) {
      console.error('Error saving user:', error);
      // Fallback to localStorage
      const userWithDefaults = { 
        ...user, 
        isApproved: false, 
        isRejected: false,
        joinDate: user.joinDate || new Date().toISOString().split('T')[0],
        achievements: user.achievements || [],
        certificates: user.certificates || [],
        eventHistory: user.eventHistory || []
      };
      const updated = [...users, userWithDefaults];
      setUsers(updated);
      localStorage.setItem('nss-users', JSON.stringify(updated));
      setCurrentUser(userWithDefaults);
      navigateToPage('portfolio');
    }
  };

  const updateUser = async (updatedUser: NSSUser) => {
    try {
      await DataAdapter.updateUser(updatedUser);
      const updated = users.map(u => u.id === updatedUser.id ? updatedUser : u);
      setUsers(updated);
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      // Fallback to localStorage
      const updated = users.map(u => u.id === updatedUser.id ? updatedUser : u);
      setUsers(updated);
      localStorage.setItem('nss-users', JSON.stringify(updated));
      setCurrentUser(updatedUser);
    }
  };

  const approveUser = async (userId: string) => {
    try {
      await DataAdapter.approveUser(userId);
      const updated = users.map(u => 
        u.id === userId 
          ? { ...u, isApproved: true, isRejected: false, approvedBy: 'admin', approvedAt: Date.now() }
          : u
      );
      setUsers(updated);
    } catch (error) {
      console.error('Error approving user:', error);
      // Fallback to localStorage
      const updated = users.map(u => 
        u.id === userId 
          ? { ...u, isApproved: true, isRejected: false, approvedBy: 'admin', approvedAt: Date.now() }
          : u
      );
      setUsers(updated);
      localStorage.setItem('nss-users', JSON.stringify(updated));
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await DataAdapter.deleteUser(userId);
      const updated = users.filter(u => u.id !== userId);
      setUsers(updated);
      // Clear current or display user if they were deleted
      if (currentUser?.id === userId) {
        setCurrentUser(null);
        setIsLoggedIn(false);
        setCurrentPage('landing');
        setNavigationHistory(['landing']);
      }
      if (displayUser?.id === userId) {
        setDisplayUser(null);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      // Fallback to localStorage
      const updated = users.filter(u => u.id !== userId);
      setUsers(updated);
      localStorage.setItem('nss-users', JSON.stringify(updated));
      // Clear current or display user if they were deleted
      if (currentUser?.id === userId) {
        setCurrentUser(null);
        setIsLoggedIn(false);
        setCurrentPage('landing');
        setNavigationHistory(['landing']);
      }
      if (displayUser?.id === userId) {
        setDisplayUser(null);
      }
    }
  };

  const rejectUser = async (userId: string, reason?: string) => {
    try {
      await DataAdapter.rejectUser(userId, 'admin', reason);
      const updated = users.map(u => 
        u.id === userId 
          ? { 
              ...u, 
              isApproved: false, 
              isRejected: true, 
              rejectedBy: 'admin', 
              rejectedAt: Date.now(),
              rejectionReason: reason || 'No reason provided'
            }
          : u
      );
      setUsers(updated);
    } catch (error) {
      console.error('Error rejecting user:', error);
      // Fallback to localStorage
      const updated = users.map(u => 
        u.id === userId 
          ? { 
              ...u, 
              isApproved: false, 
              isRejected: true, 
              rejectedBy: 'admin', 
              rejectedAt: Date.now(),
              rejectionReason: reason || 'No reason provided'
            }
          : u
      );
      setUsers(updated);
      localStorage.setItem('nss-users', JSON.stringify(updated));
    }
  };

  const approveEventRegistration = async (eventId: string, userId: string) => {
    try {
      await DataAdapter.approveEventRegistration(eventId, userId);
      const updated = adminEvents.map(event => 
        event.id === eventId 
          ? {
              ...event,
              registrations: event.registrations.map(reg =>
                reg.userId === userId
                  ? { ...reg, isApproved: true, approvedBy: 'admin', approvedAt: Date.now() }
                  : reg
              )
            }
          : event
      );
      setAdminEvents(updated);
    } catch (error) {
      console.error('Error approving event registration:', error);
      // Fallback to localStorage
      const updated = adminEvents.map(event => 
        event.id === eventId 
          ? {
              ...event,
              registrations: event.registrations.map(reg =>
                reg.userId === userId
                  ? { ...reg, isApproved: true, approvedBy: 'admin', approvedAt: Date.now() }
                  : reg
              )
            }
          : event
      );
      setAdminEvents(updated);
      localStorage.setItem('nss-admin-events', JSON.stringify(updated));
    }
  };

  const saveAdminEvent = async (event: AdminEvent) => {
    try {
      const eventWithDefaults = {
        ...event,
        startDate: event.startDate || event.date,
        endDate: event.endDate || event.date
      };
      await DataAdapter.createEvent(eventWithDefaults);
      const updated = [...adminEvents, eventWithDefaults];
      setAdminEvents(updated);
    } catch (error) {
      console.error('Error saving event:', error);
      // Fallback to localStorage
      const eventWithDefaults = {
        ...event,
        startDate: event.startDate || event.date,
        endDate: event.endDate || event.date
      };
      const updated = [...adminEvents, eventWithDefaults];
      setAdminEvents(updated);
      localStorage.setItem('nss-admin-events', JSON.stringify(updated));
    }
  };

  const saveSuggestion = async (suggestion: Suggestion) => {
    try {
      await DataAdapter.createSuggestion(suggestion);
      const updated = [...suggestions, suggestion];
      setSuggestions(updated);
    } catch (error) {
      console.error('Error saving suggestion:', error);
      // Fallback to localStorage
      const updated = [...suggestions, suggestion];
      setSuggestions(updated);
      localStorage.setItem('nss-suggestions', JSON.stringify(updated));
    }
  };

  const updateSuggestion = async (updatedSuggestion: Suggestion) => {
    try {
      await DataAdapter.updateSuggestion(updatedSuggestion);
      const updated = suggestions.map(s => s.id === updatedSuggestion.id ? updatedSuggestion : s);
      setSuggestions(updated);
    } catch (error) {
      console.error('Error updating suggestion:', error);
      // Fallback to localStorage
      const updated = suggestions.map(s => s.id === updatedSuggestion.id ? updatedSuggestion : s);
      setSuggestions(updated);
      localStorage.setItem('nss-suggestions', JSON.stringify(updated));
    }
  };

  const addAchievement = async (userId: string, achievement: Achievement) => {
    try {
      await DataAdapter.createAchievement(userId, achievement);
      const updated = users.map(u => 
        u.id === userId 
          ? { ...u, achievements: [...u.achievements, achievement] }
          : u
      );
      setUsers(updated);
    } catch (error) {
      console.error('Error adding achievement:', error);
      // Fallback to localStorage
      const updated = users.map(u => 
        u.id === userId 
          ? { ...u, achievements: [...u.achievements, achievement] }
          : u
      );
      setUsers(updated);
      localStorage.setItem('nss-users', JSON.stringify(updated));
    }
  };

  const updateAchievement = async (userId: string, achievementId: string, updatedAchievement: Achievement) => {
    try {
      await DataAdapter.updateAchievement(userId, achievementId, updatedAchievement);
      const updated = users.map(u => 
        u.id === userId 
          ? { 
              ...u, 
              achievements: u.achievements.map(a => 
                a.id === achievementId ? updatedAchievement : a
              )
            }
          : u
      );
      setUsers(updated);
    } catch (error) {
      console.error('Error updating achievement:', error);
      // Fallback to localStorage
      const updated = users.map(u => 
        u.id === userId 
          ? { 
              ...u, 
              achievements: u.achievements.map(a => 
                a.id === achievementId ? updatedAchievement : a
              )
            }
          : u
      );
      setUsers(updated);
      localStorage.setItem('nss-users', JSON.stringify(updated));
    }
  };

  const deleteAchievement = async (userId: string, achievementId: string) => {
    try {
      await DataAdapter.deleteAchievement(userId, achievementId);
      const updated = users.map(u =>
        u.id === userId
          ? {
              ...u,
              achievements: u.achievements.filter(a => a.id !== achievementId)
            }
          : u
      );
      setUsers(updated);
    } catch (error) {
      console.error('Error deleting achievement:', error);
      // Fallback to localStorage
      const updated = users.map(u =>
        u.id === userId
          ? {
              ...u,
              achievements: u.achievements.filter(a => a.id !== achievementId)
            }
          : u
      );
      setUsers(updated);
      localStorage.setItem('nss-users', JSON.stringify(updated));
    }
  };

  const registerForEvent = async (eventId: string, user: NSSUser) => {
    try {
      await DataAdapter.registerForEvent(eventId, user);
      
      const registration: EventRegistration = {
        userId: user.id,
        userRollNumber: user.rollNumber,
        userName: user.fullName,
        registeredAt: Date.now(),
        isApproved: false
      };

      const event = adminEvents.find(e => e.id === eventId);
      if (event) {
        const eventHistory: EventHistory = {
          eventId: event.id,
          eventTitle: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
          status: 'registered',
          registrationDate: new Date().toISOString().split('T')[0]
        };

        // Update event registrations
        const updatedEvents = adminEvents.map(event =>
          event.id === eventId
            ? { ...event, registrations: [...event.registrations, registration] }
            : event
        );
        setAdminEvents(updatedEvents);

        // Update user's event history
        const updatedUsers = users.map(u => 
          u.id === user.id 
            ? { ...u, eventHistory: [...u.eventHistory, eventHistory] }
            : u
        );
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      // Fallback to localStorage
      const registration: EventRegistration = {
        userId: user.id,
        userRollNumber: user.rollNumber,
        userName: user.fullName,
        registeredAt: Date.now(),
        isApproved: false
      };

      const event = adminEvents.find(e => e.id === eventId);
      if (event) {
        const eventHistory: EventHistory = {
          eventId: event.id,
          eventTitle: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
          status: 'registered',
          registrationDate: new Date().toISOString().split('T')[0]
        };

        // Update event registrations
        const updatedEvents = adminEvents.map(event =>
          event.id === eventId
            ? { ...event, registrations: [...event.registrations, registration] }
            : event
        );
        setAdminEvents(updatedEvents);
        localStorage.setItem('nss-admin-events', JSON.stringify(updatedEvents));

        // Update user's event history
        const updatedUsers = users.map(u => 
          u.id === user.id 
            ? { ...u, eventHistory: [...u.eventHistory, eventHistory] }
            : u
        );
        setUsers(updatedUsers);
        localStorage.setItem('nss-users', JSON.stringify(updatedUsers));
      }
    }
  };

  const handleLogin = (user: NSSUser) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    navigateToPage('portfolio');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setNavigationHistory(['landing']);
    setCurrentPage('landing');
  };

  const goToRegistration = () => {
    navigateToPage('registration');
  };

  const goToLogin = () => {
    navigateToPage('login');
  };

  const goToAdmin = () => {
    navigateToPage('admin');
  };

  const goToEvents = () => {
    navigateToPage('events');
  };

  const goToLanding = () => {
    setCurrentPage('landing');
    setNavigationHistory(['landing']);
    setCurrentUser(null);
    setDisplayUser(null);
  };

  const goToForgotPassword = () => {
    navigateToPage('forgot-password');
  };

  const goToScan = () => {
    navigateToPage('scan');
  };

  const resetUserPassword = async (userId: string, newPassword: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        const updatedUser = { ...user, password: newPassword };
        await DataAdapter.updateUser(updatedUser);
        const updated = users.map(u =>
          u.id === userId
            ? { ...u, password: newPassword }
            : u
        );
        setUsers(updated);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      // Fallback to localStorage
      const updated = users.map(u =>
        u.id === userId
          ? { ...u, password: newPassword }
          : u
      );
      setUsers(updated);
      localStorage.setItem('nss-users', JSON.stringify(updated));
    }
  };

  const displayPortfolio = (user: NSSUser) => {
    setDisplayUser(user);
    navigateToPage('display');
  };

  return (
    <>
      <div className="min-h-screen w-full overflow-x-hidden">
        {currentPage === 'landing' && (
          <NSSLandingPage 
            onRegister={goToRegistration}
            onLogin={goToLogin}
            onAdmin={goToAdmin}
            userCount={users.length}
            users={users}
            onSaveSuggestion={saveSuggestion}
            onScan={goToScan}
          />
        )}
        {currentPage === 'registration' && (
          <NSSRegistrationForm 
            onSubmit={saveUser}
            existingRollNumbers={users.map(u => u.rollNumber)}
            onBack={navigateBack}
          />
        )}
        {currentPage === 'portfolio' && currentUser && (
          <NSSPortfolioPage 
            user={currentUser}
            onBack={navigateBack}
            onUpdate={updateUser}
            onDisplayPortfolio={displayPortfolio}
            onGoToEvents={goToEvents}
            onLogout={handleLogout}
            onSaveSuggestion={saveSuggestion}
          />
        )}
        {currentPage === 'login' && (
          <NSSLoginPage 
            users={users}
            onLogin={handleLogin}
            onBack={navigateBack}
            onForgotPassword={goToForgotPassword}
          />
        )}
        {currentPage === 'admin' && (
          <NSSAdminPanel 
            onSaveEvent={saveAdminEvent}
            events={adminEvents}
            users={users}
            suggestions={suggestions}
            onBack={navigateBack}
            onApproveUser={approveUser}
            onRejectUser={rejectUser}
            onApproveEventRegistration={approveEventRegistration}
            onUpdateSuggestion={updateSuggestion}
            onAddAchievement={addAchievement}
            onUpdateAchievement={updateAchievement}
            onDeleteAchievement={deleteAchievement}
            onDeleteUser={deleteUser}
          />
        )}
        {currentPage === 'events' && currentUser && (
          <NSSEventsPage 
            user={currentUser}
            events={adminEvents}
            onBack={navigateBack}
            onUpdateProfile={updateUser}
            onLogout={handleLogout}
            onRegisterForEvent={registerForEvent}
            onSaveSuggestion={saveSuggestion}
          />
        )}
        {currentPage === 'forgot-password' && (
          <NSSForgotPasswordPage 
            users={users}
            onBack={navigateBack}
            onResetPassword={resetUserPassword}
          />
        )}
        {currentPage === 'display' && displayUser && (
          <NSSPortfolioDisplay 
            user={displayUser}
            onBack={navigateBack}
          />
        )}
        {currentPage === 'scan' && (
          <NSSQrScanner 
            users={users}
            onBack={navigateBack}
          />
        )}
      </div>
      <Toaster />
    </>
  );
}