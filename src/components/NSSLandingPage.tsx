import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Users, UserPlus, LogIn, Settings, Heart, Award, Handshake, BookOpen, Star, Zap, Sparkles, ChevronRight, Trophy, MessageSquare } from 'lucide-react';
import Navbar from './Navbar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { NSSUser, Suggestion } from '../App';
import SuggestionsBox from './SuggestionsBox';

interface NSSLandingPageProps {
  onRegister: () => void;
  onLogin: () => void;
  onAdmin: () => void;
  userCount: number;
  users: NSSUser[];
  onSaveSuggestion: (suggestion: Suggestion) => void;
  onScan?: () => void;
}

export default function NSSLandingPage({ onRegister, onLogin, onAdmin, userCount, users, onSaveSuggestion, onScan }: NSSLandingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      title: "Transform Communities",
      subtitle: "Through Service",
      description: "Join the National Service Scheme at CMRIT and make a lasting impact on society through dedicated community service.",
      bgColor: "from-orange-500 via-red-500 to-pink-500"
    },
    {
      title: "Build Character",
      subtitle: "Develop Leadership",
      description: "Develop essential life skills, leadership qualities, and social awareness through meaningful volunteer work.",
      bgColor: "from-blue-500 via-purple-500 to-indigo-500"
    },
    {
      title: "Create Your Portfolio",
      subtitle: "Showcase Your Impact",
      description: "Document your journey, upload photos, and generate your personalized NSS portfolio with QR code verification.",
      bgColor: "from-green-500 via-teal-500 to-cyan-500"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Get top achievements from all users
  const getTopAchievements = () => {
    const allAchievements = users.flatMap(user => 
      user.achievements.map(achievement => ({
        ...achievement,
        userName: user.fullName,
        userRollNumber: user.rollNumber
      }))
    );
    
    // Sort by level priority (national > state > district) and date
    return allAchievements
      .sort((a, b) => {
        const levelPriority = { national: 3, state: 2, district: 1 };
        const aPriority = levelPriority[a.level];
        const bPriority = levelPriority[b.level];
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, 6); // Show top 6 achievements
  };

  const topAchievements = getTopAchievements();

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Navbar */}
      <Navbar title="NSS Portfolio System" />
      
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-green-50">
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-orange-400 to-red-400"
              style={{
                width: Math.random() * 100 + 20,
                height: Math.random() * 100 + 20,
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* Hero Slider */}
              <div className="relative h-96 flex items-center justify-center">
                {heroSlides.map((slide, index) => (
                  <motion.div
                    key={index}
                    className={`absolute inset-0 flex flex-col justify-center ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                    animate={{ opacity: index === currentSlide ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className={`text-6xl lg:text-8xl font-black bg-gradient-to-r ${slide.bgColor} bg-clip-text text-transparent mb-4`}
                      animate={{ scale: index === currentSlide ? 1 : 0.9 }}
                      transition={{ duration: 0.5 }}
                    >
                      {slide.title}
                    </motion.div>
                    <motion.div
                      className="text-3xl lg:text-4xl font-bold text-gray-700 mb-6"
                      animate={{ y: index === currentSlide ? 0 : 20 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      {slide.subtitle}
                    </motion.div>
                    <motion.p
                      className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                      animate={{ y: index === currentSlide ? 0 : 20 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {slide.description}
                    </motion.p>
                  </motion.div>
                ))}
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center lg:justify-start gap-3 mb-12">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-orange-500 w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex justify-center lg:justify-start gap-8 mb-8"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{userCount}+</div>
                  <div className="text-sm text-gray-600">Active Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">50+</div>
                  <div className="text-sm text-gray-600">Events Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">1000+</div>
                  <div className="text-sm text-gray-600">Lives Impacted</div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start flex-wrap"
              >
                <Button
                  onClick={onRegister}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Join NSS Today
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button
                  onClick={onLogin}
                  variant="outline"
                  className="border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Member Login
                </Button>

                {onScan && (
                  <Button
                    onClick={onScan}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Scan QR
                  </Button>
                )}
              </motion.div>
            </motion.div>

            {/* Right Side - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Main College Image */}
              <div className="relative">
                <motion.div
                  className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white"
                  animate={{ 
                    y: [0, -10, 0],
                    rotateY: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ImageWithFallback
                    src="https://i0.wp.com/cmrithyderabad.edu.in/wp-content/uploads/2023/01/Screenshot-17-1024x501-1-1-1.webp?fit=780%2C382&ssl=1"
                    alt="CMRIT College Campus, Hyderabad"
                    className="w-full h-auto"
                  />
                  {/* College Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="text-white text-xl font-bold mb-1">CMR Institute of Technology</h3>
                    <p className="text-white/90 text-sm">Hyderabad, Telangana</p>
                  </div>
                </motion.div>
                
                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-xl"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                >
                  <Star className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl"
                  animate={{ 
                    rotate: -360,
                    y: [0, -10, 0]
                  }}
                  transition={{ 
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    y: { duration: 3, repeat: Infinity }
                  }}
                >
                  <Heart className="w-6 h-6 text-white" />
                </motion.div>
                
                <motion.div
                  className="absolute top-1/2 -left-8 w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-xl"
                  animate={{ 
                    x: [0, -5, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity
                  }}
                >
                  <Zap className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
                Why Choose NSS CMRIT?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience personal growth while making a meaningful difference in society
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Heart,
                  title: "Community Impact",
                  description: "Make a real difference in the lives of others through meaningful service projects",
                  color: "from-red-500 to-pink-500",
                  bgColor: "from-red-50 to-pink-50"
                },
                {
                  icon: Award,
                  title: "Skill Development",
                  description: "Build leadership, communication, and project management skills",
                  color: "from-yellow-500 to-orange-500",
                  bgColor: "from-yellow-50 to-orange-50"
                },
                {
                  icon: Users,
                  title: "Digital Portfolio",
                  description: "Create and maintain your professional NSS portfolio with QR verification",
                  color: "from-blue-500 to-cyan-500",
                  bgColor: "from-blue-50 to-cyan-50"
                },
                {
                  icon: BookOpen,
                  title: "Personal Growth",
                  description: "Develop character, empathy, and social responsibility",
                  color: "from-green-500 to-emerald-500",
                  bgColor: "from-green-50 to-emerald-50"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -10
                  }}
                  className={`bg-gradient-to-br ${feature.bgColor} p-8 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements Showcase */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-6">
                🏆 Outstanding Achievements
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Celebrating our NSS volunteers' remarkable accomplishments at national, state, and district levels
              </p>
            </motion.div>

            {topAchievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {topAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      y: -10
                    }}
                    className={`bg-gradient-to-br ${
                      achievement.level === 'national' ? 'from-red-50 to-pink-50 border-red-200' :
                      achievement.level === 'state' ? 'from-blue-50 to-cyan-50 border-blue-200' :
                      'from-green-50 to-emerald-50 border-green-200'
                    } p-6 rounded-3xl shadow-xl border-2 backdrop-blur-sm`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={achievement.photo}
                        alt={achievement.title}
                        className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{achievement.title}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          achievement.level === 'national' ? 'bg-red-100 text-red-700' :
                          achievement.level === 'state' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {achievement.level.toUpperCase()} LEVEL
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{achievement.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{achievement.userName}</span>
                      </div>
                      <span>📅 {new Date(achievement.date).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-center py-16"
              >
                <Trophy className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-600 mb-4">No Achievements Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Be the first to achieve something remarkable! Join NSS and start making a difference in your community.
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl p-12 shadow-2xl text-white"
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students who are creating positive change in their communities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onRegister}
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
              <Button
                onClick={onAdmin}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Settings className="w-5 h-5 mr-2" />
                Admin Panel
              </Button>
              <Button
                onClick={() => {/* This will be handled by SuggestionsBox */}}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Give Feedback
              </Button>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Suggestions Box for Feedback */}
      <SuggestionsBox 
        user={{
          id: 'guest',
          fullName: 'Guest User',
          rollNumber: 'GUEST'
        }}
        onSaveSuggestion={onSaveSuggestion} 
      />
    </div>
  );
}