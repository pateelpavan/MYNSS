import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, User, GraduationCap, Camera, Award, Heart } from 'lucide-react';
import { NSSUser } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface NSSPortfolioDisplayProps {
  user: NSSUser;
  onBack: () => void;
}

export default function NSSPortfolioDisplay({ user, onBack }: NSSPortfolioDisplayProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full"
      >
        <Card className="p-8 bg-white/95 backdrop-blur-lg shadow-2xl border-0 relative overflow-hidden">
          {/* Animated background with NSS theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-red-50/50 to-green-50/80" />
          <div className="absolute top-0 left-0 w-32 h-32 bg-orange-200/20 rounded-full -translate-x-16 -translate-y-16 animate-pulse" />
          <div className="absolute top-20 right-0 w-24 h-24 bg-green-200/20 rounded-full translate-x-12 -translate-y-12 animate-pulse" />
          <div className="absolute bottom-0 left-20 w-40 h-40 bg-red-200/20 rounded-full -translate-x-20 translate-y-20 animate-pulse" />
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-blue-200/20 rounded-full translate-x-14 translate-y-14 animate-pulse" />
          
          <div className="relative z-10">
            <Button
              onClick={onBack}
              variant="ghost"
              className="mb-4 p-0 h-auto hover:bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {/* Header with logos */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-8"
            >
              <div className="flex justify-center gap-6 mb-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
                >
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1635784419717-57325b959cc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDTVJJVCUyMGNvbGxlZ2UlMjBsb2dvfGVufDF8fHx8MTc1NzA3NDU1MXww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="CMRIT Logo" 
                    className="w-16 h-16 rounded-full object-cover border-3 border-orange-400 shadow-xl"
                  />
                </motion.div>
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
                >
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1587653559430-aadd3ac46e3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOU1MlMjB2b2x1bnRlZXIlMjBzZXJ2aWNlJTIwbG9nb3xlbnwxfHx8fDE3NTcwNzQ1NTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="NSS Logo" 
                    className="w-16 h-16 rounded-full object-cover border-3 border-green-400 shadow-xl"
                  />
                </motion.div>
              </div>
              
              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-green-600 bg-clip-text text-transparent mb-2"
              >
                NSS PORTFOLIO
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="text-gray-600 font-medium"
              >
                "Not Me But You" - Service to Society
              </motion.p>
            </motion.div>

            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="bg-gradient-to-r from-orange-100 via-red-100 to-green-100 p-6 rounded-2xl mb-8 relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200/30 rounded-full translate-x-10 -translate-y-10" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-200/30 rounded-full -translate-x-8 translate-y-8" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4, duration: 0.5, type: "spring" }}
                  className="relative"
                >
                  <img 
                    src={user.profilePhoto} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                  />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
                
                <div className="flex-1 text-center md:text-left space-y-3">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6, duration: 0.5 }}
                    className="text-2xl md:text-3xl font-bold text-gray-800"
                  >
                    {user.fullName}
                  </motion.h2>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.8, duration: 0.5 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2 text-gray-700 justify-center md:justify-start">
                      <User className="w-5 h-5 text-orange-600" />
                      <span className="font-medium">Roll Number: {user.rollNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 justify-center md:justify-start">
                      <GraduationCap className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Branch: {user.branch}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 justify-center md:justify-start">
                      <Camera className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Events Participated: {user.eventPhotos.length}</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Events Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Camera className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-800">NSS Events & Activities</h3>
              </div>

              {user.eventPhotos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2, duration: 0.5 }}
                  className="text-center py-12 bg-gray-50 rounded-xl"
                >
                  <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-lg">No events participated yet</p>
                  <p className="text-gray-400 text-sm mt-2">Stay tuned for upcoming NSS activities!</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.eventPhotos.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        delay: 2.2 + index * 0.2, 
                        duration: 0.5,
                        type: "spring",
                        stiffness: 100
                      }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="relative">
                        <img 
                          src={event.photo} 
                          alt={event.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Event #{index + 1}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h4 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.6 }}
              className="mt-12 text-center"
            >
              <div className="bg-gradient-to-r from-orange-500 via-red-500 to-green-500 p-6 rounded-2xl text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10">
                  <div className="flex justify-center items-center gap-2 mb-3">
                    <Heart className="w-6 h-6 text-white animate-pulse" />
                    <span className="text-xl font-bold">CMRIT NSS UNIT</span>
                    <Heart className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.7, duration: 0.8 }}
                    className="text-lg font-medium animate-pulse"
                  >
                    "Service to Society - Not Me But You"
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.9, duration: 0.8 }}
                    className="text-sm mt-2 opacity-90"
                  >
                    Building Character Through Community Service
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0, duration: 0.8 }}
        className="mt-8 text-center"
      >
        <p className="text-xs text-gray-400 animate-pulse">
          © All copyrights belong to CMRIT NSS Unit
        </p>
      </motion.div>
    </div>
  );
}