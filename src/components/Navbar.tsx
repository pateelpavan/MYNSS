import React from 'react';
import { motion } from 'motion/react';

// NSS Logo Component
const NSSLogo = () => (
 <img src="https://www.vupune.ac.in/images/nss-logo.png" alt="NSS Logo" width={48} height={48} />
);

// CMRIT Logo Component
// cspell:ignore CMRIT
const CMRITLogo = () => (
 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr_iDKA9DXGdShzcH4PvKCcwg43ebAJI3JwQ&s" alt="CMRIT Logo" width={48} height={48} />
);

interface NavbarProps {
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
  rightContent?: React.ReactNode;
}

export default function Navbar({ showBackButton, onBack, title, rightContent }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-red-200 shadow-lg"
    >
      <div className="w-full px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left Side - NSS Logo */}
          <motion.div 
            className="flex items-center gap-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {showBackButton && onBack && (
              <motion.button
                onClick={onBack}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <NSSLogo />
              </div>
              <div className="hidden sm:block">
                <h2 className="text-lg font-bold text-gray-800">National Service Scheme</h2>
                <p className="text-sm text-gray-600">CMRIT Unit</p>
              </div>
            </div>
          </motion.div>

          {/* Center - Title */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="hidden md:flex items-center gap-4">
              <div className="text-center">
                {title && (
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-800 to-red-600 bg-clip-text text-transparent">
                    {title}
                  </h1>
                )}
                <p className="text-sm text-gray-600 font-medium">CMR Institute of Technology, Hyderabad</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - CMRIT Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="hidden sm:block text-right">
              <h2 className="text-lg font-bold text-gray-800">CMRIT</h2>
              <p className="text-sm text-gray-600">Hyderabad</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <CMRITLogo />
            </div>
            {rightContent && (
              <div className="ml-3">
                {rightContent}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}