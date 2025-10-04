import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, Camera, User, GraduationCap, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { NSSUser } from '../App';

// We implement a lightweight scanner using the browser's MediaDevices API plus a simple hidden input fallback
// For robust scanning, you can install a library like '@yudiel/react-qr-scanner'.
// Here we provide a simple manual input fallback so the flow works even without camera permissions.

interface NSSQrScannerProps {
  users: NSSUser[];
  onBack: () => void;
}

export default function NSSQrScanner({ users, onBack }: NSSQrScannerProps) {
  const [scannedText, setScannedText] = useState<string>('');
  const [matchedUser, setMatchedUser] = useState<NSSUser | null>(null);
  const [error, setError] = useState<string>('');

  const tryMatchUser = (text: string) => {
    // 1) Direct match against user.qrCode (generated in NSSRegistration flow)
    let user = users.find(u => u.qrCode && text.trim() === u.qrCode.trim()) || null;

    // 2) If not found, try parse Ticket QR format (multi-line)
    if (!user && text.includes('CMRIT Registration')) {
      const nameLine = text.split('\n').find(l => l.startsWith('Name: '));
      const emailLine = text.split('\n').find(l => l.startsWith('Email: '));
      const rollGuess = text.split('\n').find(l => l.startsWith('ID: '));

      const name = nameLine?.replace('Name: ', '').trim();
      const email = emailLine?.replace('Email: ', '').trim();
      const id = rollGuess?.replace('ID: ', '').trim();

      // Best-effort matching: try email first, then ID, then name
      user = users.find(u => (email && u.id === email) || u.fullName === name || u.id === id) || null;
    }

    if (user) {
      setMatchedUser(user);
      setError('');
    } else {
      setMatchedUser(null);
      setError('No matching user found for this QR.');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedText.trim()) {
      setError('Please enter or scan a QR code value.');
      return;
    }
    tryMatchUser(scannedText);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <Button onClick={onBack} variant="ghost" className="mb-4 p-0 h-auto hover:bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-2 mb-6">
            <Camera className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Scan User QR</h2>
          </div>

          {/* Manual input fallback. Replace with a live camera scanner if desired. */}
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Paste scanned QR text here or type user's QR code"
              value={scannedText}
              onChange={(e) => setScannedText(e.target.value)}
              className="w-full border rounded-md p-2"
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Find User</Button>
          </form>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          {matchedUser && (
            <div className="mt-6 p-4 rounded-xl border bg-white">
              <div className="flex items-center gap-4">
                <img
                  src={matchedUser.profilePhoto}
                  alt={matchedUser.fullName}
                  className="w-20 h-20 rounded-xl object-cover border"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{matchedUser.fullName}</h3>
                  <div className="text-sm text-gray-700 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-600" />
                      <span>{matchedUser.rollNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      <span>{matchedUser.branch}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span>Joined {new Date(matchedUser.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    {matchedUser.isApproved ? (
                      <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs">
                        <CheckCircle className="w-4 h-4" /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-orange-700 bg-orange-100 px-2 py-1 rounded-full text-xs">
                        <XCircle className="w-4 h-4" /> Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
