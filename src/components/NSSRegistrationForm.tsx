import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ArrowLeft, User, Upload, Camera, FileImage, Plus, X, GraduationCap, CheckCircle } from 'lucide-react';
import { NSSUser, EventPhoto } from '../App';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Navbar from './Navbar';

interface NSSRegistrationFormProps {
  onSubmit: (user: NSSUser) => void;
  existingRollNumbers: string[];
  onBack: () => void;
}

export default function NSSRegistrationForm({ onSubmit, existingRollNumbers, onBack }: NSSRegistrationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    branch: '',
    password: '',
    confirmPassword: ''
  });
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [eventPhotos, setEventPhotos] = useState<EventPhoto[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'event') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === 'profile') {
          setProfilePhoto(result);
        } else {
          const newEventPhoto: EventPhoto = {
            id: `event_${Date.now()}`,
            photo: result,
            title: '',
            description: ''
          };
          setEventPhotos(prev => [...prev, newEventPhoto]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const updateEventPhoto = (id: string, field: 'title' | 'description', value: string) => {
    setEventPhotos(prev => prev.map(photo => 
      photo.id === id ? { ...photo, [field]: value } : photo
    ));
  };

  const removeEventPhoto = (id: string) => {
    setEventPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
    if (existingRollNumbers.includes(formData.rollNumber)) newErrors.rollNumber = 'Roll number already exists';
    if (!formData.branch.trim()) newErrors.branch = 'Branch is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!profilePhoto) newErrors.profilePhoto = 'Profile photo is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateStep2()) return;
    
    const qrCode = `NSS-${formData.rollNumber}-${Date.now()}`;
    
    const user: NSSUser = {
      id: `user_${Date.now()}`,
      fullName: formData.fullName,
      rollNumber: formData.rollNumber,
      branch: formData.branch,
      password: formData.password,
      profilePhoto,
      eventPhotos,
      qrCode,
      timestamp: Date.now(),
      isApproved: false,
      joinDate: new Date().toISOString().split('T')[0],
      achievements: [],
      certificates: [],
      eventHistory: []
    };
    
    onSubmit(user);
    toast.success('Registration successful! Please wait for admin approval.');
  };

  const nextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Navbar */}
      <Navbar 
        showBackButton 
        onBack={onBack} 
        title="Registration"
      />
      
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-orange-50">
        <div className="absolute inset-0 opacity-20">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-green-400 to-orange-400"
              style={{
                width: Math.random() * 60 + 20,
                height: Math.random() * 60 + 20,
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{
                y: [0, -15, 0],
                x: [0, 8, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: Math.random() * 5 + 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Side - College Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:block sticky top-32"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                <div className="relative h-64">
                  <ImageWithFallback
                    src="https://i0.wp.com/cmrithyderabad.edu.in/wp-content/uploads/2023/01/Screenshot-17-1024x501-1-1-1.webp?fit=780%2C382&ssl=1"
                    alt="CMRIT College Campus"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h2 className="text-2xl font-bold mb-2">Join NSS at CMRIT</h2>
                    <p className="text-sm opacity-90">CMR Institute of Technology, Hyderabad</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Start Your NSS Journey</h3>
                      <p className="text-sm text-gray-600">Create your digital portfolio</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Digital portfolio with QR verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      <span>Track your community service activities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Build skills through meaningful service</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Registration Form */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent mb-2">
                    NSS Registration
                  </h1>
                  <p className="text-gray-600">Join the National Service Scheme at CMRIT</p>
                </div>

                {/* Progress indicator */}
                <div className="flex justify-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step >= 1 ? 'bg-gradient-to-r from-green-500 to-orange-500 text-white shadow-lg' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
                    </div>
                    <div className={`w-16 h-1 rounded-full transition-all duration-300 ${
                      step >= 2 ? 'bg-gradient-to-r from-green-500 to-orange-500' : 'bg-gray-200'
                    }`} />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step >= 2 ? 'bg-gradient-to-r from-green-500 to-orange-500 text-white shadow-lg' : 'bg-gray-200 text-gray-600'
                    }`}>
                      2
                    </div>
                  </div>
                </div>

                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          placeholder="Enter your full name"
                          className="mt-1"
                        />
                        {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName}</span>}
                      </div>

                      <div>
                        <Label>Roll Number</Label>
                        <Input
                          value={formData.rollNumber}
                          onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                          placeholder="Enter your roll number"
                          className="mt-1"
                        />
                        {errors.rollNumber && <span className="text-red-500 text-sm">{errors.rollNumber}</span>}
                      </div>
                    </div>

                    <div>
                      <Label>Branch</Label>
                      <Input
                        value={formData.branch}
                        onChange={(e) => setFormData({...formData, branch: e.target.value})}
                        placeholder="e.g., Computer Science Engineering"
                        className="mt-1"
                      />
                      {errors.branch && <span className="text-red-500 text-sm">{errors.branch}</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Password</Label>
                        <Input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          placeholder="Create a password"
                          className="mt-1"
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                      </div>

                      <div>
                        <Label>Confirm Password</Label>
                        <Input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          placeholder="Confirm your password"
                          className="mt-1"
                        />
                        {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword}</span>}
                      </div>
                    </div>

                    <Button 
                      onClick={nextStep}
                      className="w-full bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600 text-white py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Continue to Step 2
                    </Button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Button
                        onClick={() => setStep(1)}
                        variant="ghost"
                        className="p-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <h3 className="text-xl font-bold text-gray-800">Upload Photos</h3>
                    </div>

                    {/* Profile Photo */}
                    <div>
                      <Label>Profile Photo *</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-green-400 transition-colors">
                        {profilePhoto ? (
                          <div className="relative inline-block">
                            <img src={profilePhoto} alt="Profile" className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg" />
                            <Button
                              onClick={() => setProfilePhoto('')}
                              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 p-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">Upload your profile photo</p>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'profile')}
                              className="hidden"
                              id="profile-upload"
                            />
                            <Label htmlFor="profile-upload" className="cursor-pointer bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-colors">
                              Choose Photo
                            </Label>
                          </>
                        )}
                      </div>
                      {errors.profilePhoto && <span className="text-red-500 text-sm">{errors.profilePhoto}</span>}
                    </div>

                    {/* Event Photos */}
                    <div>
                      <Label>Event Photos (Optional)</Label>
                      <p className="text-sm text-gray-600 mb-2">Add photos from NSS events you've participated in</p>
                      
                      <div className="space-y-4">
                        {eventPhotos.map((eventPhoto) => (
                          <div key={eventPhoto.id} className="border border-gray-200 rounded-2xl p-4">
                            <div className="flex gap-4 items-start">
                              <img src={eventPhoto.photo} alt="Event" className="w-20 h-20 rounded-xl object-cover" />
                              <div className="flex-1 space-y-2">
                                <Input
                                  placeholder="Event title"
                                  value={eventPhoto.title}
                                  onChange={(e) => updateEventPhoto(eventPhoto.id, 'title', e.target.value)}
                                />
                                <Textarea
                                  placeholder="Event description"
                                  value={eventPhoto.description}
                                  onChange={(e) => updateEventPhoto(eventPhoto.id, 'description', e.target.value)}
                                  rows={2}
                                />
                              </div>
                              <Button
                                onClick={() => removeEventPhoto(eventPhoto.id)}
                                variant="outline"
                                className="text-red-500 border-red-200 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:border-orange-400 transition-colors">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'event')}
                            className="hidden"
                            id="event-upload"
                          />
                          <Label htmlFor="event-upload" className="cursor-pointer flex items-center justify-center gap-2 text-gray-600 hover:text-orange-600 transition-colors">
                            <Plus className="w-5 h-5" />
                            Add Event Photo
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        onClick={() => setStep(1)}
                        variant="outline"
                        className="flex-1 py-3 rounded-2xl"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleSubmit}
                        className="flex-1 bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600 text-white py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        Complete Registration
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}