import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Calendar, MapPin, Users } from 'lucide-react';
// Complete CMRIT logo with authentic design
const CmritLogo = () => (
  <svg width="200" height="150" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
    {/* Flower petals */}
    {/* Top petal (orange) */}
    <ellipse cx="400" cy="120" rx="25" ry="60" fill="#FF6B35"/>
    
    {/* Top-left petal (green) */}
    <ellipse cx="340" cy="160" rx="25" ry="60" fill="#8BC34A" transform="rotate(-72 340 160)"/>
    
    {/* Top-right petal (green) */}
    <ellipse cx="460" cy="160" rx="25" ry="60" fill="#8BC34A" transform="rotate(72 460 160)"/>
    
    {/* Bottom-left petal (orange) */}
    <ellipse cx="340" cy="240" rx="25" ry="60" fill="#FF6B35" transform="rotate(-144 340 240)"/>
    
    {/* Bottom-right petal (orange) */}
    <ellipse cx="460" cy="240" rx="25" ry="60" fill="#FF6B35" transform="rotate(144 460 240)"/>
    
    {/* Center circle (green) */}
    <circle cx="400" cy="200" r="12" fill="#8BC34A"/>
    
    {/* CMR Text */}
    <text x="400" y="320" fontFamily="Arial, sans-serif" fontSize="80" fontWeight="bold" textAnchor="middle" fill="#1B365D">CMR</text>
    
    {/* Institute of Technology */}
    <text x="400" y="360" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="normal" textAnchor="middle" fill="#1B365D">INSTITUTE OF TECHNOLOGY</text>
    
    {/* Divider line */}
    <line x1="250" y1="380" x2="550" y2="380" stroke="#FF6B35" strokeWidth="2"/>
    
    {/* Explore to Invent */}
    <text x="400" y="410" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="normal" textAnchor="middle" fill="#1B365D" letterSpacing="6px">EXPLORE TO INVENT</text>
  </svg>
);

interface LandingPageProps {
  onRegister: () => void;
  registrationCount: number;
}

export default function LandingPage({ onRegister, registrationCount }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-8 text-center bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-6"
          >
            <div className="mx-auto mb-4">
              <CmritLogo />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-800 to-red-600 bg-clip-text text-transparent"
          >
            CMRIT ORIENTATION PROGRAMME
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="space-y-4 mb-8"
          >
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>CMR Central Auditorium</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>Orientation Programme 2025</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span>{registrationCount} Registered</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Button
              onClick={onRegister}
              size="lg"
              className="bg-gradient-to-r from-blue-800 to-red-600 hover:from-blue-900 hover:to-red-700 text-white px-8 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Register for Party
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-6 text-gray-500 text-sm"
          >
            Join us for an exciting orientation programme and celebration
          </motion.p>
        </Card>
      </motion.div>

      {/* Copyright Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="mt-8 text-center"
      >
        <p className="text-xs text-gray-400">
          © All copyrights belong to Pateel Pavan
        </p>
      </motion.div>
    </div>
  );
}