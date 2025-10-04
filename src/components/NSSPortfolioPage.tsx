import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { ArrowLeft, Download, QrCode, User, GraduationCap, Eye, Calendar, LogOut, Settings, Star, Award, Heart, CheckCircle, Clock, XCircle, Upload, FileText, Trophy, MessageSquare } from 'lucide-react';
import { NSSUser, Suggestion } from '../App';
import QRCode from 'qrcode';
import Navbar from './Navbar';
import SuggestionsBox from './SuggestionsBox';

interface NSSPortfolioPageProps {
  user: NSSUser;
  onBack: () => void;
  onUpdate: (user: NSSUser) => void;
  onDisplayPortfolio: (user: NSSUser) => void;
  onGoToEvents?: () => void;
  onLogout?: () => void;
  onSaveSuggestion: (suggestion: Suggestion) => void;
}

export default function NSSPortfolioPage({ user, onBack, onUpdate, onDisplayPortfolio, onGoToEvents, onLogout, onSaveSuggestion }: NSSPortfolioPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && user.qrCode && user.isApproved) {
      const publicPayload = {
        id: user.id,
        fullName: user.fullName,
        rollNumber: user.rollNumber,
        branch: user.branch,
        timestamp: user.timestamp,
        isApproved: user.isApproved
      };
      const u = btoa(encodeURIComponent(JSON.stringify(publicPayload)));
      const deepLink = `${window.location.origin}/?qr=${encodeURIComponent(user.qrCode)}&u=${u}`;
      QRCode.toCanvas(canvasRef.current, deepLink, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    }
  }, [user.qrCode, user.isApproved]);

  const downloadQRCode = () => {
    if (canvasRef.current && user.isApproved) {
      const link = document.createElement('a');
      link.download = `${user.rollNumber}-qr-code.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const getStatusInfo = () => {
    if (user.isRejected) {
      return {
        icon: XCircle,
        text: "Rejected",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        reason: user.rejectionReason
      };
    } else if (user.isApproved) {
      return {
        icon: CheckCircle,
        text: "Approved",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      };
    } else {
      return {
        icon: Clock,
        text: "Pending Approval",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200"
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Navbar */}
      <Navbar 
        showBackButton 
        onBack={onBack} 
        title="My Portfolio"
        rightContent={
          onLogout && (
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          )
        }
      />
      
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="absolute inset-0 opacity-20">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-purple-400 to-blue-400"
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
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Welcome, {user.fullName.split(' ')[0]}!
            </h1>
            <p className="text-xl text-gray-600">Your NSS Journey Dashboard</p>
          </motion.div>

          {/* Status Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2 rounded-3xl p-6 mb-8 text-center`}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <statusInfo.icon className={`w-8 h-8 ${statusInfo.color}`} />
              <span className={`text-2xl font-bold ${statusInfo.color}`}>
                Account Status: {statusInfo.text}
              </span>
            </div>
            {statusInfo.reason && (
              <p className="text-red-600 mt-2">
                <strong>Reason:</strong> {statusInfo.reason}
              </p>
            )}
            {user.isApproved && user.approvedAt && (
              <p className="text-green-600 text-sm">
                Approved on {new Date(user.approvedAt).toLocaleDateString()}
              </p>
            )}
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* College Banner */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden mb-6">
                <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-6 text-white">
                    <h3 className="text-lg font-bold">CMR Institute of Technology</h3>
                    <p className="text-sm opacity-90">National Service Scheme Unit - Hyderabad</p>
                  </div>
                </div>
              </div>

              {/* Profile Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Profile Photo */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative"
                  >
                    <img
                      src={user.profilePhoto}
                      alt={user.fullName}
                      className="w-32 h-32 rounded-3xl object-cover shadow-xl border-4 border-white"
                    />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  </motion.div>

                  {/* Profile Details */}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{user.fullName}</h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <User className="w-5 h-5 text-purple-600" />
                        <span className="text-lg text-gray-700">{user.rollNumber}</span>
                      </div>
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                        <span className="text-lg text-gray-700">{user.branch}</span>
                      </div>
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-600">
                          Member since {new Date(user.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button
                    onClick={() => onDisplayPortfolio(user)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Portfolio
                  </Button>
                  
                  {onGoToEvents && (
                    <Button
                      onClick={onGoToEvents}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Browse Events
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => {/* Update functionality */}}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>
                </div>
              </div>

              {/* Event Photos */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Event Participation</h3>
                </div>

                {user.eventPhotos.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No events participated yet</p>
                    <p className="text-gray-400 text-sm mt-2">Join events to start building your portfolio!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.eventPhotos.map((eventPhoto, index) => (
                      <motion.div
                        key={eventPhoto.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 shadow-lg border border-gray-100"
                      >
                        <img
                          src={eventPhoto.photo}
                          alt={eventPhoto.title}
                          className="w-full h-48 object-cover rounded-xl mb-4 shadow-md"
                        />
                        <h4 className="font-bold text-gray-800 mb-2">{eventPhoto.title}</h4>
                        <p className="text-gray-600 text-sm line-clamp-3">{eventPhoto.description}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Achievements Section */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Achievements</h3>
                </div>

                {user.achievements.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No achievements yet</p>
                    <p className="text-gray-400 text-sm mt-2">Achievements will be added by admin</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.achievements.slice(0, 4).map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 shadow-lg border border-yellow-100"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={achievement.photo}
                            alt={achievement.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h4 className="font-bold text-gray-800">{achievement.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              achievement.level === 'national' ? 'bg-red-100 text-red-700' :
                              achievement.level === 'state' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {achievement.level.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{achievement.description}</p>
                        <p className="text-xs text-gray-500">📅 {new Date(achievement.date).toLocaleDateString()}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Certificates Section */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Certificates & Documents</h3>
                </div>

                {user.certificates.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No certificates uploaded yet</p>
                    <p className="text-gray-400 text-sm mt-2">Upload your certificates and achievements</p>
                    <Button className="mt-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Certificate
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.certificates.map((certificate, index) => (
                      <motion.div
                        key={certificate.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-4 shadow-lg border border-green-100"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800">{certificate.title}</h4>
                            <p className="text-xs text-gray-500">📅 {new Date(certificate.uploadDate).toLocaleDateString()}</p>
                          </div>
                          {certificate.isVerified && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{certificate.description}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-green-300 text-green-600 hover:bg-green-50"
                          onClick={() => window.open(certificate.fileUrl, '_blank')}
                        >
                          View Certificate
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Event History Section */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Event History</h3>
                </div>

                {user.eventHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No event history yet</p>
                    <p className="text-gray-400 text-sm mt-2">Register for events to see your history</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user.eventHistory.map((event, index) => (
                      <motion.div
                        key={event.eventId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 shadow-lg border border-purple-100"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-800">{event.eventTitle}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            event.status === 'completed' ? 'bg-green-100 text-green-700' :
                            event.status === 'attended' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {event.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Start:</span> {new Date(event.startDate).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">End:</span> {new Date(event.endDate).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Registered:</span> {new Date(event.registrationDate).toLocaleDateString()}
                          </div>
                          {event.attendanceDate && (
                            <div>
                              <span className="font-medium">Attended:</span> {new Date(event.attendanceDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right Column - QR Code or Approval Status */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-6"
            >
              {user.isApproved ? (
                /* QR Code Card - Only shown when approved */
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 text-center sticky top-32">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <QrCode className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Your QR Code</h3>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 mb-6"
                  >
                    <canvas
                      ref={canvasRef}
                      className="mx-auto"
                    />
                  </motion.div>

                  <p className="text-gray-600 text-sm mb-6">
                    Scan this QR code to verify your NSS membership and access your digital portfolio.
                  </p>

                  <Button
                    onClick={downloadQRCode}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-2xl py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>

                  {/* Portfolio Stats */}
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4">
                      <div className="text-2xl font-bold text-blue-600">{user.eventPhotos.length}</div>
                      <div className="text-sm text-blue-600">Events</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.floor((Date.now() - user.timestamp) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-sm text-green-600">Days Active</div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Pending Approval Card - Shown when not approved */
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 text-center sticky top-32">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Awaiting Approval</h3>
                  </div>

                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 mb-6 border-2 border-orange-200"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-orange-700 font-medium">QR Code Pending</p>
                  </motion.div>

                  <p className="text-gray-600 text-sm mb-6">
                    Your QR code will be generated once an admin approves your registration. Please wait for approval.
                  </p>

                  <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-4 mb-6">
                    <p className="text-orange-700 text-sm font-medium">
                      📋 Registration submitted successfully!
                    </p>
                    <p className="text-orange-600 text-xs mt-1">
                      You'll receive access to all features once approved.
                    </p>
                  </div>

                  {/* Basic Stats - Available even without approval */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4">
                      <div className="text-2xl font-bold text-gray-500">{user.eventPhotos.length}</div>
                      <div className="text-sm text-gray-500">Events</div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4">
                      <div className="text-2xl font-bold text-gray-500">
                        {Math.floor((Date.now() - user.timestamp) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-sm text-gray-500">Days Registered</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Suggestions Box */}
      <SuggestionsBox 
        user={user} 
        onSaveSuggestion={onSaveSuggestion} 
      />
    </div>
  );
}