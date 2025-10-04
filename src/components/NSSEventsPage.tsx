import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, Calendar, Users, LogOut, User, Plus, Camera, X } from 'lucide-react';
import { AdminEvent, NSSUser, EventPhoto, Suggestion } from '../App';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';
import SuggestionsBox from './SuggestionsBox';

interface NSSEventsPageProps {
  user: NSSUser;
  events: AdminEvent[];
  onBack: () => void;
  onUpdateProfile: (user: NSSUser) => void;
  onLogout: () => void;
  onRegisterForEvent: (eventId: string, user: NSSUser) => void;
  onSaveSuggestion: (suggestion: Suggestion) => void;
}

export default function NSSEventsPage({ user, events, onBack, onUpdateProfile, onLogout, onRegisterForEvent, onSaveSuggestion }: NSSEventsPageProps) {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newEventPhotos, setNewEventPhotos] = useState<EventPhoto[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const newEventPhoto: EventPhoto = {
          id: `event_${Date.now()}`,
          photo: result,
          title: '',
          description: ''
        };
        setNewEventPhotos(prev => [...prev, newEventPhoto]);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateEventPhoto = (id: string, field: 'title' | 'description', value: string) => {
    setNewEventPhotos(prev => prev.map(photo => 
      photo.id === id ? { ...photo, [field]: value } : photo
    ));
  };

  const removeEventPhoto = (id: string) => {
    setNewEventPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const handleUpdateProfile = () => {
    const validPhotos = newEventPhotos.filter(photo => photo.title.trim() && photo.description.trim());
    
    if (validPhotos.length === 0) {
      toast.error('Please add at least one event photo with title and description');
      return;
    }

    const updatedUser: NSSUser = {
      ...user,
      eventPhotos: [...user.eventPhotos, ...validPhotos]
    };

    onUpdateProfile(updatedUser);
    setNewEventPhotos([]);
    setShowUpdateForm(false);
    toast.success('Portfolio updated successfully! 🎉');
  };

  const handleEventRegistration = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const isAlreadyRegistered = event.registrations.some(r => r.userId === user.id);
    if (isAlreadyRegistered) {
      toast.error('You are already registered for this event');
      return;
    }

    onRegisterForEvent(eventId, user);
    toast.success('Registration submitted! Waiting for admin approval. 📝');
  };

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
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 to-green-50/80" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-orange-200/20 to-transparent rounded-full -translate-x-32 -translate-y-32 animate-spin-slow" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-green-200/20 to-transparent rounded-full translate-x-24 translate-y-24 animate-pulse" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <Button
                onClick={onBack}
                variant="ghost"
                className="p-0 h-auto hover:bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              
              <Button
                onClick={onLogout}
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="flex justify-center gap-4 mb-4">
                <img 
                  src={user.profilePhoto} 
                  alt={user.fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-green-300"
                />
              </div>
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent mb-2">
                Welcome, {user.fullName}!
              </h2>
              <p className="text-gray-600">NSS Events & Portfolio Management</p>
            </motion.div>

            {/* User Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
              <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-xl text-center">
                <User className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <h3 className="font-bold text-orange-700">{user.rollNumber}</h3>
                <p className="text-sm text-orange-600">{user.branch}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-xl text-center">
                <Camera className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <h3 className="font-bold text-green-700">{user.eventPhotos.length}</h3>
                <p className="text-sm text-green-600">Events Participated</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-xl text-center">
                <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <h3 className="font-bold text-blue-700">{events.length}</h3>
                <p className="text-sm text-blue-600">Available Events</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Available Events */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Available Events</h3>
                  <Button
                    onClick={() => setShowUpdateForm(!showUpdateForm)}
                    className="bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Update Portfolio
                  </Button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {events.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No events available currently</p>
                    </div>
                  ) : (
                    events.slice().reverse().map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                        className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-blue-700 mb-1">{event.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                              <span>👥 {event.registrations.length} registered</span>
                            </div>
                            
                            {/* Registration Status */}
                            {(() => {
                              const userRegistration = event.registrations.find(r => r.userId === user.id);
                              if (userRegistration) {
                                return (
                                  <div className="mt-2">
                                    {userRegistration.isApproved ? (
                                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                        ✓ Approved
                                      </span>
                                    ) : (
                                      <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                                        ⏳ Pending Approval
                                      </span>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                          
                          {(() => {
                            const userRegistration = event.registrations.find(r => r.userId === user.id);
                            if (userRegistration) {
                              return (
                                <Button
                                  size="sm"
                                  disabled
                                  variant="outline"
                                  className="text-gray-500"
                                >
                                  {userRegistration.isApproved ? 'Registered' : 'Pending'}
                                </Button>
                              );
                            }
                            return (
                              <Button
                                onClick={() => handleEventRegistration(event.id)}
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                              >
                                Register
                              </Button>
                            );
                          })()}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Portfolio Update Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <h3 className="text-xl font-bold mb-4">Portfolio Management</h3>
                
                {showUpdateForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-r from-orange-50 to-green-50 p-6 rounded-xl mb-6"
                  >
                    <h4 className="font-semibold mb-4">Add New Event Photos</h4>
                    
                    {newEventPhotos.map((photo, index) => (
                      <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-4 rounded-lg mb-4 relative"
                      >
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 w-8 h-8 p-0 rounded-full"
                          onClick={() => removeEventPhoto(photo.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                          <div>
                            <img 
                              src={photo.photo} 
                              alt={`Event ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border-2 border-orange-200"
                            />
                          </div>
                          
                          <div className="md:col-span-2 space-y-3">
                            <div>
                              <Label htmlFor={`title_${index}`}>Event Title *</Label>
                              <Input
                                id={`title_${index}`}
                                type="text"
                                value={photo.title}
                                onChange={(e) => updateEventPhoto(photo.id, 'title', e.target.value)}
                                placeholder="Enter event title"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`desc_${index}`}>Description *</Label>
                              <Textarea
                                id={`desc_${index}`}
                                value={photo.description}
                                onChange={(e) => updateEventPhoto(photo.id, 'description', e.target.value)}
                                placeholder="Describe your role in this event"
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <div className="text-center mb-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="event-upload"
                      />
                      <Label 
                        htmlFor="event-upload"
                        className="cursor-pointer bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors inline-flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Event Photo
                      </Label>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleUpdateProfile}
                        className="flex-1 bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600 text-white"
                        disabled={newEventPhotos.length === 0}
                      >
                        Update Portfolio
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowUpdateForm(false);
                          setNewEventPhotos([]);
                        }}
                        className="px-6"
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Current Portfolio Preview */}
                <div>
                  <h4 className="font-semibold mb-3">Your Current Events</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {user.eventPhotos.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        <Camera className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No events in your portfolio yet</p>
                      </div>
                    ) : (
                      user.eventPhotos.map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-3"
                        >
                          <img 
                            src={event.photo} 
                            alt={event.title}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{event.title}</h5>
                            <p className="text-xs text-gray-600 line-clamp-1">{event.description}</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-8 text-center"
      >
        <p className="text-xs text-gray-400 animate-pulse">
          © All copyrights belong to CMRIT NSS Unit
        </p>
      </motion.div>

      {/* Suggestions Box */}
      <SuggestionsBox 
        user={user} 
        onSaveSuggestion={onSaveSuggestion} 
      />
    </div>
  );
}