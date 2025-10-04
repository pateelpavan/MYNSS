import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Search, User, Key, CheckCircle, XCircle } from 'lucide-react';
import { NSSUser } from '../App';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface NSSForgotPasswordPageProps {
  users: NSSUser[];
  onBack: () => void;
  onResetPassword: (userId: string, newPassword: string) => void;
}

export default function NSSForgotPasswordPage({ users, onBack, onResetPassword }: NSSForgotPasswordPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [foundUser, setFoundUser] = useState<NSSUser | null>(null);
  const [searchStep, setSearchStep] = useState<'search' | 'found' | 'not-found' | 'confirm' | 'reset'>('search');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter your roll number or name');
      return;
    }

    const user = users.find(u => 
      u.rollNumber.toLowerCase() === searchQuery.toLowerCase() ||
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (user) {
      setFoundUser(user);
      setSearchStep('found');
      toast.success('User found! Here are your details.');
    } else {
      setFoundUser(null);
      setSearchStep('not-found');
      toast.error('No user found with this information');
    }
  };

  const resetSearch = () => {
    setSearchQuery('');
    setFoundUser(null);
    setSearchStep('search');
    setNewPassword('');
    setConfirmPassword('');
  };

  const proceedToConfirm = () => {
    if (!foundUser) return;
    setSearchStep('confirm');
  };

  const handlePasswordReset = () => {
    if (!foundUser) return;
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    onResetPassword(foundUser.id, newPassword);
    toast.success('Password updated successfully!');
    setTimeout(() => {
      onBack();
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <Card className="p-8 bg-white/95 backdrop-blur-lg shadow-2xl border-0 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50" />
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200/20 rounded-full -translate-x-16 -translate-y-16 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-200/20 rounded-full translate-x-12 translate-y-12 animate-pulse" />
          
          <div className="relative z-10">
            <Button
              onClick={onBack}
              variant="ghost"
              className="mb-4 p-0 h-auto hover:bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="text-center mb-6"
            >
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <Key className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Account Recovery
                </h2>
              </div>
              
              <p className="text-gray-600">Find your NSS account details</p>
            </motion.div>

            {searchStep === 'search' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-6"
              >
                <div>
                  <Label htmlFor="search">Roll Number or Full Name</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      type="text"
                      placeholder="Enter your roll number or full name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10 border-2 border-blue-200 focus:border-blue-400"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  size="lg"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Account
                </Button>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 text-center">
                    <strong>Note:</strong> Search using your registered roll number or full name to recover your account details.
                    Contact NSS coordinators if you need further assistance.
                  </p>
                </div>
              </motion.div>
            )}

            {searchStep === 'confirm' && foundUser && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <Key className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold">Confirm Account Ownership</h3>
                  <p className="text-gray-600 mt-1 text-sm">You are about to reset the password for <strong>{foundUser.fullName}</strong> ({foundUser.rollNumber}).</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-700">
                  For security, proceed only if you are the owner of this account.
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="border-gray-300"
                    onClick={() => setSearchStep('found')}
                  >
                    Back
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    onClick={() => setSearchStep('reset')}
                  >
                    I Confirm
                  </Button>
                </div>
              </motion.div>
            )}

            {searchStep === 'reset' && foundUser && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800">Set New Password</h3>
                  <p className="text-sm text-gray-600">Choose a strong password for your account.</p>
                </div>

                <div>
                  <Label htmlFor="newPass">New Password</Label>
                  <Input id="newPass" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" />
                </div>
                <div>
                  <Label htmlFor="confirmPass">Confirm Password</Label>
                  <Input id="confirmPass" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="border-gray-300"
                    onClick={() => setSearchStep('found')}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                    onClick={handlePasswordReset}
                  >
                    Update Password
                  </Button>
                </div>
              </motion.div>
            )}

            {searchStep === 'found' && foundUser && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-600 mb-2">Account Found!</h3>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl space-y-4">
                  <div className="flex items-center justify-center mb-4">
                    <img 
                      src={foundUser.profilePhoto} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover border-3 border-green-400 shadow-lg"
                    />
                  </div>
                  
                  <div className="space-y-3 text-center">
                    <div>
                      <Label className="text-gray-600">Full Name</Label>
                      <p className="font-semibold text-lg">{foundUser.fullName}</p>
                    </div>
                    
                    <div>
                      <Label className="text-gray-600">Roll Number</Label>
                      <p className="font-semibold text-lg">{foundUser.rollNumber}</p>
                    </div>
                    
                    <div>
                      <Label className="text-gray-600">Branch</Label>
                      <p className="font-semibold">{foundUser.branch}</p>
                    </div>

                    <div>
                      <Label className="text-gray-600">Account Status</Label>
                      <div className="flex items-center justify-center gap-2">
                        {foundUser.isApproved ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 font-semibold">Approved</span>
                          </>
                        ) : foundUser.isRejected ? (
                          <>
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-red-600 font-semibold">Rejected</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-orange-500" />
                            <span className="text-orange-600 font-semibold">Pending Approval</span>
                          </>
                        )}
                      </div>
                      {foundUser.isRejected && foundUser.rejectionReason && (
                        <div className="mt-2 text-center">
                          <p className="text-xs text-red-600">
                            <strong>Reason:</strong> {foundUser.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800 text-center">
                    <strong>Security Note:</strong> For password recovery, please contact NSS coordinators with your roll number.
                    Passwords cannot be displayed for security reasons.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={resetSearch}
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                  >
                    Search Again
                  </Button>
                  
                  <Button
                    onClick={proceedToConfirm}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                  >
                    Reset Password
                  </Button>
                </div>
              </motion.div>
            )}

            {searchStep === 'not-found' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 text-center"
              >
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-600 mb-2">Account Not Found</h3>
                
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-sm text-red-800">
                    No account found with the information you provided. Please check your details and try again.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Possible reasons:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 text-left">
                    <li>• You haven't registered for NSS yet</li>
                    <li>• Incorrect roll number or name spelling</li>
                    <li>• Account is still being processed</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={resetSearch}
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                  >
                    Try Again
                  </Button>
                  
                  <Button
                    onClick={onBack}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    Back to Login
                  </Button>
                </div>
              </motion.div>
            )}
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
          © All copyrights belong to CMRIT NSS Unit
        </p>
      </motion.div>
    </div>
  );
}