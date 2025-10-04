import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Settings, Plus, Calendar, Users, Eye, Shield, Award, MessageSquare, Trash } from 'lucide-react';
import { AdminEvent, NSSUser, Suggestion, Achievement } from '../App';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface NSSAdminPanelProps {
  onSaveEvent: (event: AdminEvent) => void;
  events: AdminEvent[];
  users: NSSUser[];
  suggestions: Suggestion[];
  onBack: () => void;
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string, reason?: string) => void;
  onApproveEventRegistration: (eventId: string, userId: string) => void;
  onUpdateSuggestion: (suggestion: Suggestion) => void;
  onAddAchievement: (userId: string, achievement: Achievement) => void;
  onUpdateAchievement: (userId: string, achievementId: string, achievement: Achievement) => void;
  onDeleteAchievement: (userId: string, achievementId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export default function NSSAdminPanel({ onSaveEvent, events, users, suggestions, onBack, onApproveUser, onRejectUser, onApproveEventRegistration, onUpdateSuggestion, onAddAchievement, onUpdateAchievement, onDeleteAchievement, onDeleteUser }: NSSAdminPanelProps) {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    startDate: '',
    endDate: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showEventForm, setShowEventForm] = useState(false);
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [achievementForm, setAchievementForm] = useState({
    title: '',
    description: '',
    level: 'national' as 'national' | 'district' | 'state',
    date: '',
    photo: ''
  });
  const [viewUserId, setViewUserId] = useState<string | null>(null);

  const handlePasswordSubmit = () => {
    if (password === 'CMRIT2025') {
      setIsAuthorized(true);
      toast.success('Admin access granted! 🛡️');
    } else {
      toast.error('Invalid admin password');
      setPassword('');
    }
  };

  const validateEventForm = () => {
    const newErrors: Record<string, string> = {};

    if (!eventForm.title.trim()) newErrors.title = 'Event title is required';
    if (!eventForm.description.trim()) newErrors.description = 'Event description is required';
    if (!eventForm.date.trim()) newErrors.date = 'Event date is required';
    if (!eventForm.startDate.trim()) newErrors.startDate = 'Start date is required';
    if (!eventForm.endDate.trim()) newErrors.endDate = 'End date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateEventForm()) {
      const newEvent: AdminEvent = {
        id: `event_${Date.now()}`,
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        startDate: eventForm.startDate,
        endDate: eventForm.endDate,
        registrations: [],
        timestamp: Date.now()
      };

      onSaveEvent(newEvent);
      setEventForm({ title: '', description: '', date: '', startDate: '', endDate: '' });
      setShowEventForm(false);
      toast.success('Event posted successfully! 🎉');
    }
  };

  const handleSubmitAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      toast.error('Please select a user');
      return;
    }

    if (!achievementForm.title.trim() || !achievementForm.description.trim() || !achievementForm.date.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newAchievement: Achievement = {
      id: `achievement_${Date.now()}`,
      title: achievementForm.title,
      description: achievementForm.description,
      level: achievementForm.level,
      date: achievementForm.date,
      photo: achievementForm.photo || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhd2FyZCUyMGNlcnRpZmljYXRlfGVufDF8fHx8MTc1NzA3NDU1NXww&ixlib=rb-4.1.0&q=80&w=1080',
      isVerified: true,
      verifiedBy: 'admin',
      verifiedAt: Date.now()
    };

    onAddAchievement(selectedUser, newAchievement);
    setAchievementForm({ title: '', description: '', level: 'national', date: '', photo: '' });
    setSelectedUser('');
    setShowAchievementForm(false);
    toast.success('Achievement added successfully! 🏆');
  };

  const handleSuggestionStatus = (suggestionId: string, status: 'reviewed' | 'implemented' | 'rejected', response?: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      const updatedSuggestion: Suggestion = {
        ...suggestion,
        status,
        reviewedBy: 'admin',
        reviewedAt: Date.now(),
        response: response || ''
      };
      onUpdateSuggestion(updatedSuggestion);
      toast.success(`Suggestion ${status}!`);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full"
        >
          <Card className="p-8 text-center bg-white/95 backdrop-blur-lg shadow-2xl border-0 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-blue-50/50" />
            <div className="absolute top-0 left-0 w-32 h-32 bg-red-200/20 rounded-full -translate-x-16 -translate-y-16 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-200/20 rounded-full translate-x-12 translate-y-12 animate-pulse" />
            
            <div className="relative z-10">
              <Button
                onClick={onBack}
                variant="ghost"
                className="mb-4 p-0 h-auto hover:bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                className="mb-6"
              >
                <Shield className="w-16 h-16 mx-auto text-red-600 mb-4" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent"
              >
                Admin Access Control
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-gray-600 mb-6 text-sm"
              >
                Authorized Personnel Only
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="adminPassword" className="text-left block mb-2">Admin Password</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                    className="text-center border-2 border-red-200 focus:border-red-400"
                  />
                </div>
                
                <Button
                  onClick={handlePasswordSubmit}
                  className="w-full bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Access Admin Panel
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-gray-400">
            © All copyrights belong to CMRIT NSS Unit
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl w-full"
      >
        <Card className="p-8 bg-white/95 backdrop-blur-lg shadow-2xl border-0 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-blue-50/50" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-red-200/20 to-transparent rounded-full -translate-x-32 -translate-y-32 animate-spin-slow" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-blue-200/20 to-transparent rounded-full translate-x-24 translate-y-24 animate-pulse" />
          
          <div className="relative z-10">
            <Button
              onClick={onBack}
              variant="ghost"
              className="mb-4 p-0 h-auto hover:bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="flex justify-center gap-4 mb-4">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1635784419717-57325b959cc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDTVJJVCUyMGNvbGxlZ2UlMjBsb2dvfGVufDF8fHx8MTc1NzA3NDU1MXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="CMRIT Logo" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-red-300"
                />
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1587653559430-aadd3ac46e3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOU1MlMjB2b2x1bnRlZXIlMjBzZXJ2aWNlJTIwbG9nb3xlbnwxfHx8fDE3NTcwNzQ1NTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="NSS Logo" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-300"
                />
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <Settings className="w-8 h-8 text-red-600" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                  NSS Admin Panel
                </h2>
              </div>
              
              <p className="text-gray-600">Manage NSS events and monitor registrations</p>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
            >
              <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-xl text-center">
                <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-orange-700">{users.length}</h3>
                <p className="text-sm text-orange-600">Total Members</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-xl text-center">
                <Eye className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-green-700">{users.filter(u => u.isApproved).length}</h3>
                <p className="text-sm text-green-600">Approved</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-xl text-center">
                <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-blue-700">{events.length}</h3>
                <p className="text-sm text-blue-600">Posted Events</p>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl text-center">
                <Users className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-yellow-700">{users.filter(u => !u.isApproved && !u.isRejected).length}</h3>
                <p className="text-sm text-yellow-600">Pending</p>
              </div>
              
              <div className="bg-gradient-to-r from-red-100 to-pink-100 p-4 rounded-xl text-center">
                <Users className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-red-700">{users.filter(u => u.isRejected).length}</h3>
                <p className="text-sm text-red-600">Rejected</p>
              </div>
            </motion.div>

            {/* Approval Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
            >
              {/* Pending User Approvals */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-yellow-700">Pending User Approvals</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {users.filter(u => !u.isApproved && !u.isRejected).length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No pending approvals</p>
                    </div>
                  ) : (
                    users.filter(u => !u.isApproved && !u.isRejected).map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 flex items-center gap-3"
                      >
                        <img 
                          src={user.profilePhoto} 
                          alt={user.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-yellow-300"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-yellow-800 text-sm">{user.fullName}</h4>
                          <p className="text-xs text-yellow-600">{user.rollNumber} - {user.branch}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setViewUserId(user.id)}
                            className="text-xs px-2 py-1"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              onApproveUser(user.id);
                              toast.success(`${user.fullName} approved!`);
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1"
                          >
                            ✓
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              const reason = prompt('Enter rejection reason (optional):') || 'No reason provided';
                              onRejectUser(user.id, reason);
                              toast.error(`${user.fullName} rejected`);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1"
                          >
                            ✗
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (confirm(`Permanently delete ${user.fullName}? This cannot be undone.`)) {
                                onDeleteUser(user.id);
                                toast.success(`${user.fullName} deleted permanently`);
                              }
                            }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-2 py-1"
                            title="Delete user"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Event Registrations Pending Approval */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-blue-700">Event Registration Approvals</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {events.filter(e => e.registrations.some(r => !r.isApproved)).length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No pending registrations</p>
                    </div>
                  ) : (
                    events.filter(e => e.registrations.some(r => !r.isApproved)).map((event) => (
                      <div key={event.id} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 text-sm mb-2">{event.title}</h4>
                        {event.registrations.filter(r => !r.isApproved).map((registration) => (
                          <div key={registration.userId} className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-xs text-blue-700">{registration.userName}</p>
                              <p className="text-xs text-blue-600">{registration.userRollNumber}</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                onApproveEventRegistration(event.id, registration.userId);
                                toast.success(`Registration approved for ${registration.userName}!`);
                              }}
                              className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1"
                            >
                              Approve
                            </Button>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Actions */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-green-700">Recent Actions</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {users.filter(u => u.isApproved || u.isRejected)
                    .sort((a, b) => (b.approvedAt || b.rejectedAt || 0) - (a.approvedAt || a.rejectedAt || 0))
                    .slice(0, 6)
                    .map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className={`p-2 rounded-lg border ${user.isApproved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} flex items-center gap-3`}
                    >
                      <img 
                        src={user.profilePhoto} 
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                      <div className="flex-1">
                        <h4 className={`font-semibold text-xs ${user.isApproved ? 'text-green-800' : 'text-red-800'}`}>
                          {user.fullName}
                        </h4>
                        <p className="text-xs text-gray-600">{user.rollNumber}</p>
                        <p className={`text-xs ${user.isApproved ? 'text-green-500' : 'text-red-500'}`}>
                          {user.isApproved ? '✓ Approved' : '✗ Rejected'}
                          {user.isRejected && user.rejectionReason && (
                            <span className="block text-xs text-red-400 truncate">
                              {user.rejectionReason}
                            </span>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Event Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Post New Event */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Event Management</h3>
                  <Button
                    onClick={() => setShowEventForm(!showEventForm)}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Post Event
                  </Button>
                </div>

                {showEventForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl mb-6"
                  >
                    <form onSubmit={handleSubmitEvent} className="space-y-4">
                      <div>
                        <Label htmlFor="eventTitle">Event Title *</Label>
                        <Input
                          id="eventTitle"
                          type="text"
                          value={eventForm.title}
                          onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                          className={errors.title ? 'border-red-500' : ''}
                          placeholder="Enter event title"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                      </div>

                      <div>
                        <Label htmlFor="eventDescription">Event Description *</Label>
                        <Textarea
                          id="eventDescription"
                          value={eventForm.description}
                          onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                          className={errors.description ? 'border-red-500' : ''}
                          placeholder="Describe the event"
                          rows={4}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="eventDate">Event Date *</Label>
                          <Input
                            id="eventDate"
                            type="date"
                            value={eventForm.date}
                            onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                            className={errors.date ? 'border-red-500' : ''}
                          />
                          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                        </div>

                        <div>
                          <Label htmlFor="eventStartDate">Start Date *</Label>
                          <Input
                            id="eventStartDate"
                            type="date"
                            value={eventForm.startDate}
                            onChange={(e) => setEventForm(prev => ({ ...prev, startDate: e.target.value }))}
                            className={errors.startDate ? 'border-red-500' : ''}
                          />
                          {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                        </div>

                        <div>
                          <Label htmlFor="eventEndDate">End Date *</Label>
                          <Input
                            id="eventEndDate"
                            type="date"
                            value={eventForm.endDate}
                            onChange={(e) => setEventForm(prev => ({ ...prev, endDate: e.target.value }))}
                            className={errors.endDate ? 'border-red-500' : ''}
                          />
                          {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                        >
                          Post Event
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowEventForm(false)}
                          className="px-6"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Recent Events */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {events.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No events posted yet</p>
                    </div>
                  ) : (
                    events.slice().reverse().map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500"
                      >
                        <h4 className="font-semibold text-green-700 mb-1">{event.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                          <span>👥 {event.registrations.length} registered ({event.registrations.filter(r => r.isApproved).length} approved)</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* All Members Overview */}
              <div>
                <h3 className="text-xl font-bold mb-4">All NSS Members</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {users.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No members registered yet</p>
                    </div>
                  ) : (
                    users.slice().reverse().map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${user.isApproved ? 'border-green-500' : user.isRejected ? 'border-red-500' : 'border-yellow-500'} flex items-center gap-4`}
                      >
                        <img 
                          src={user.profilePhoto} 
                          alt={user.fullName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-semibold ${user.isApproved ? 'text-green-700' : user.isRejected ? 'text-red-700' : 'text-yellow-700'}`}>
                              {user.fullName}
                            </h4>
                            {user.isApproved ? (
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Approved</span>
                            ) : user.isRejected ? (
                              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Rejected</span>
                            ) : (
                              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">Pending</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{user.rollNumber} - {user.branch}</p>
                          <p className="text-xs text-gray-500">{user.eventPhotos.length} events participated</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setViewUserId(user.id)}
                            title="View user"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (confirm(`Permanently delete ${user.fullName}? This cannot be undone.`)) {
                                onDeleteUser(user.id);
                                toast.success(`${user.fullName} deleted permanently`);
                              }
                            }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                            title="Delete user"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>

            {/* Achievements Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
            >
              {/* Add Achievement */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Achievement Management</h3>
                  <Button
                    onClick={() => setShowAchievementForm(!showAchievementForm)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Achievement
                  </Button>
                </div>

                {showAchievementForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl mb-6"
                  >
                    <form onSubmit={handleSubmitAchievement} className="space-y-4">
                      <div>
                        <Label htmlFor="userSelect">Select User *</Label>
                        <select
                          id="userSelect"
                          value={selectedUser}
                          onChange={(e) => setSelectedUser(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Choose a user...</option>
                          {users.filter(u => u.isApproved).map(user => (
                            <option key={user.id} value={user.id}>
                              {user.fullName} ({user.rollNumber})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="achievementTitle">Achievement Title *</Label>
                        <Input
                          id="achievementTitle"
                          type="text"
                          value={achievementForm.title}
                          onChange={(e) => setAchievementForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter achievement title"
                        />
                      </div>

                      <div>
                        <Label htmlFor="achievementDescription">Description *</Label>
                        <Textarea
                          id="achievementDescription"
                          value={achievementForm.description}
                          onChange={(e) => setAchievementForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe the achievement"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="achievementLevel">Level *</Label>
                          <select
                            id="achievementLevel"
                            value={achievementForm.level}
                            onChange={(e) => setAchievementForm(prev => ({ ...prev, level: e.target.value as 'national' | 'district' | 'state' }))}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="national">National</option>
                            <option value="state">State</option>
                            <option value="district">District</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="achievementDate">Date *</Label>
                          <Input
                            id="achievementDate"
                            type="date"
                            value={achievementForm.date}
                            onChange={(e) => setAchievementForm(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="achievementPhoto">Photo URL (optional)</Label>
                        <Input
                          id="achievementPhoto"
                          type="url"
                          value={achievementForm.photo}
                          onChange={(e) => setAchievementForm(prev => ({ ...prev, photo: e.target.value }))}
                          placeholder="Enter photo URL"
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        >
                          Add Achievement
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowAchievementForm(false)}
                          className="px-6"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Recent Achievements */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {users.flatMap(u => u.achievements).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No achievements added yet</p>
                    </div>
                  ) : (
                    users.flatMap(u => u.achievements.map(a => ({ ...a, userName: u.fullName, userRollNumber: u.rollNumber, userId: u.id })))
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 10)
                      .map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500"
                        >
                          <div className="flex items-center gap-3">
                            <img 
                              src={achievement.photo} 
                              alt={achievement.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-purple-700 mb-1">{achievement.title}</h4>
                              <p className="text-sm text-gray-600 mb-1">{achievement.description}</p>
                              <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>🏆 {achievement.level.toUpperCase()}</span>
                                <span>👤 {achievement.userName} ({achievement.userRollNumber})</span>
                                <span>📅 {new Date(achievement.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (confirm('Delete this achievement?')) {
                                    onDeleteAchievement(achievement.userId, achievement.id);
                                    toast.success('Achievement deleted');
                                  }
                                }}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                  )}
                </div>
              </div>

              {/* Suggestions Management */}
              <div>
                <h3 className="text-xl font-bold mb-4">Suggestions & Feedback</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {suggestions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No suggestions received yet</p>
                    </div>
                  ) : (
                    suggestions.slice().reverse().map((suggestion, index) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${
                          suggestion.status === 'pending' ? 'border-yellow-500' :
                          suggestion.status === 'reviewed' ? 'border-blue-500' :
                          suggestion.status === 'implemented' ? 'border-green-500' : 'border-red-500'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 mb-1">{suggestion.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>👤 {suggestion.userName} ({suggestion.userRollNumber})</span>
                              <span>📅 {new Date(suggestion.timestamp).toLocaleDateString()}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                suggestion.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                suggestion.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                                suggestion.status === 'implemented' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {suggestion.status.toUpperCase()}
                              </span>
                            </div>
                            {suggestion.response && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                <strong>Admin Response:</strong> {suggestion.response}
                              </div>
                            )}
                          </div>
                        </div>
                        {suggestion.status === 'pending' && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              onClick={() => handleSuggestionStatus(suggestion.id, 'reviewed')}
                              className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                            >
                              Review
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                const response = prompt('Enter response (optional):');
                                handleSuggestionStatus(suggestion.id, 'implemented', response || '');
                              }}
                              className="bg-green-500 hover:bg-green-600 text-white text-xs"
                            >
                              Implement
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                const response = prompt('Enter rejection reason:');
                                handleSuggestionStatus(suggestion.id, 'rejected', response || '');
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white text-xs"
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.8 }}
        className="mt-8 text-center"
      >
        <p className="text-xs text-gray-400 animate-pulse">
          &copy; All copyrights belong to CMRIT NSS Unit
        </p>
      </motion.div>
      {viewUserId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setViewUserId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={() => setViewUserId(null)}>✕</button>
            {(() => {
              const u = users.find(x => x.id === viewUserId)!;
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img src={u.profilePhoto} alt={u.fullName} className="w-14 h-14 rounded-full object-cover" />
                    <div>
                      <h3 className="text-lg font-bold">{u.fullName}</h3>
                      <p className="text-sm text-gray-600">{u.rollNumber} • {u.branch}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-gray-500">Status</div>
                      <div className="font-medium">{u.isApproved ? 'Approved' : u.isRejected ? 'Rejected' : 'Pending'}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-gray-500">Events</div>
                      <div className="font-medium">{u.eventPhotos.length}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-gray-500">Achievements</div>
                      <div className="font-medium">{u.achievements.length}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-gray-500">Member Since</div>
                      <div className="font-medium">{new Date(u.timestamp).toLocaleDateString()}</div>
                    </div>
                  </div>
                  {u.isRejected && u.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-sm text-red-700">
                      <strong>Rejection Reason:</strong> {u.rejectionReason}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => { onApproveUser(u.id); toast.success(`${u.fullName} approved!`); setViewUserId(null); }}>Approve</Button>
                    <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={() => { const reason = prompt('Enter rejection reason (optional):') || 'No reason provided'; onRejectUser(u.id, reason); toast.error(`${u.fullName} rejected`); setViewUserId(null); }}>Reject</Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}