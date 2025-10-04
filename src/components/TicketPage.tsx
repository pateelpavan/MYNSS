import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, Download, QrCode, MapPin, Calendar, User, Phone, GraduationCap, Users, Mail } from 'lucide-react';
import { Registration } from '../App';
import QRCode from 'qrcode';
// CMRIT Logo Component for Ticket
const CMRITTicketLogo = () => (
  <svg width="60" height="60" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    {/* Flower petals */}
    <ellipse cx="100" cy="40" rx="12" ry="25" fill="#FF6B35"/>
    <ellipse cx="70" cy="55" rx="12" ry="25" fill="#8BC34A" transform="rotate(-72 70 55)"/>
    <ellipse cx="130" cy="55" rx="12" ry="25" fill="#8BC34A" transform="rotate(72 130 55)"/>
    <ellipse cx="70" cy="145" rx="12" ry="25" fill="#FF6B35" transform="rotate(-144 70 145)"/>
    <ellipse cx="130" cy="145" rx="12" ry="25" fill="#FF6B35" transform="rotate(144 130 145)"/>
    <circle cx="100" cy="100" r="6" fill="#8BC34A"/>
    <text x="100" y="140" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle" fill="#1B365D">CMR</text>
  </svg>
);

interface TicketPageProps {
  registration: Registration;
  onBack: () => void;
}

export default function TicketPage({ registration, onBack }: TicketPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrCodeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateQRCode();
  }, [registration]);

  const generateQRCode = async () => {
    if (!qrCodeRef.current) return;

    const qrData = `CMRIT Registration
ID: ${registration.id}
Name: ${registration.name}
Email: ${registration.email}
Mobile: ${registration.mobile}
Branch: ${registration.branch}
Section: ${registration.section}
Family Members: ${registration.familyMembers}`;

    try {
      await QRCode.toCanvas(qrCodeRef.current, qrData, {
        width: 100,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadTicket = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 550;

    // Load images
    const backgroundImg = new Image();
    const logoImg = new Image();
    
    backgroundImg.crossOrigin = 'anonymous';
    logoImg.crossOrigin = 'anonymous';

    const drawTicket = () => {
      // Clear canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw watermark background - Enhanced visibility
      ctx.globalAlpha = 0.15;
      const aspectRatio = backgroundImg.height / backgroundImg.width;
      const watermarkWidth = canvas.width * 0.8;
      const watermarkHeight = watermarkWidth * aspectRatio;
      const watermarkX = (canvas.width - watermarkWidth) / 2;
      const watermarkY = (canvas.height - watermarkHeight) / 2;
      ctx.drawImage(backgroundImg, watermarkX, watermarkY, watermarkWidth, watermarkHeight);
      ctx.globalAlpha = 1;

      // Gradient background overlay
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.05)');
      gradient.addColorStop(1, 'rgba(249, 115, 22, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header
      ctx.fillStyle = '#1e40af';
      ctx.fillRect(0, 0, canvas.width, 80);

      // Logo
      ctx.drawImage(logoImg, 20, 15, 50, 50);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('CMRIT ORIENTATION PROGRAMME', 90, 35);
      ctx.font = '16px Arial';
      ctx.fillText('CMR Central Auditorium', 90, 55);

      // Content
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 20px Arial';
      ctx.fillText('Registration Ticket', 50, 130);

      ctx.font = '16px Arial';
      const details = [
        `Ticket ID: ${registration.id}`,
        `Name: ${registration.name}`,
        `Email: ${registration.email}`,
        `Year: ${registration.year}`,
        `Mobile: ${registration.mobile}`,
        `Branch: ${registration.branch}`,
        `Section: ${registration.section}`,
        `Family Members: ${registration.familyMembers}`,
        `Date: ${new Date(registration.timestamp).toLocaleDateString()}`
      ];

      details.forEach((detail, index) => {
        ctx.fillText(detail, 50, 170 + (index * 25));
      });

      // QR Code
      if (qrCodeRef.current) {
        ctx.drawImage(qrCodeRef.current, 600, 180, 150, 150);
        ctx.fillStyle = '#666666';
        ctx.font = '12px Arial';
        ctx.fillText('Scan for verification', 620, 350);
      }

      // Footer
      ctx.fillStyle = '#1e40af';
      ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText('Please bring this ticket to the event', 50, canvas.height - 50);
      ctx.fillText('CMRIT - Explore to Invent', 50, canvas.height - 30);
      
      // Copyright notice on ticket
      ctx.font = '10px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText('© All copyrights belong to Pateel Pavan', canvas.width - 250, canvas.height - 10);
    };

    // Load images and draw
    let imagesLoaded = 0;
    const totalImages = 2;

    const onImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        drawTicket();
        
        // Download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `CMRIT_Ticket_${registration.id}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        });
      }
    };

    backgroundImg.onload = onImageLoad;
    logoImg.onload = onImageLoad;
    
    // Use placeholder images or remove image dependencies
    backgroundImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+';
    logoImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxlbGxpcHNlIGN4PSIxMDAiIGN5PSI0MCIgcng9IjEyIiByeT0iMjUiIGZpbGw9IiNGRjZCMzUiLz48ZWxsaXBzZSBjeD0iNzAiIGN5PSI1NSIgcng9IjEyIiByeT0iMjUiIGZpbGw9IiM4QkMzNEEiIHRyYW5zZm9ybT0icm90YXRlKC03MiA3MCA1NSkiLz48ZWxsaXBzZSBjeD0iMTMwIiBjeT0iNTUiIHJ4PSIxMiIgcnk9IjI1IiBmaWxsPSIjOEJDMzRBIiB0cmFuc2Zvcm09InJvdGF0ZSg3MiAxMzAgNTUpIi8+PGVsbGlwc2UgY3g9IjcwIiBjeT0iMTQ1IiByeD0iMTIiIHJ5PSIyNSIgZmlsbD0iI0ZGNkIzNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE0NCA3MCAxNDUpIi8+PGVsbGlwc2UgY3g9IjEzMCIgY3k9IjE0NSIgcng9IjEyIiByeT0iMjUiIGZpbGw9IiNGRjZCMzUiIHRyYW5zZm9ybT0icm90YXRlKDE0NCAxMzAgMTQ1KSIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNiIgZmlsbD0iIzhCQzM0QSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMUIzNjVEIj5DTVI8L3RleHQ+PC9zdmc+';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl border-0 relative overflow-hidden">
          {/* Background watermark for the card */}
          <div 
            className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+)' }}
          />
          
          <div className="relative z-10">
            <Button
              onClick={onBack}
              variant="ghost"
              className="mb-4 p-0 h-auto hover:bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <QrCode className="w-8 h-8 text-green-600" />
                <h2 className="text-2xl font-bold text-green-600">Registration Successful!</h2>
              </div>
              <p className="text-gray-600">Your ticket has been generated successfully</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold mb-4 text-center">CMRIT ORIENTATION PROGRAMME</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span><strong>Name:</strong> {registration.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span><strong>Email:</strong> {registration.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span><strong>Year:</strong> {registration.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span><strong>Mobile:</strong> {registration.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span><strong>Family Members:</strong> {registration.familyMembers}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div><strong>Branch:</strong> {registration.branch}</div>
                  <div><strong>Section:</strong> {registration.section}</div>
                  <div><strong>Ticket ID:</strong> {registration.id}</div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span><strong>Venue:</strong> CMR Central Auditorium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span><strong>Date:</strong> {new Date(registration.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="bg-white p-2 rounded-lg shadow">
                  <canvas ref={qrCodeRef} className="block" />
                  <p className="text-center text-sm text-gray-600 mt-1">Scan for verification</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Button
                onClick={downloadTicket}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Ticket
              </Button>
            </motion.div>

            <p className="text-center text-sm text-gray-500 mt-4">
              Please bring this ticket to the event venue
            </p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-6 text-center"
      >
        <p className="text-xs text-gray-400">
          © All copyrights belong to Pateel Pavan
        </p>
      </motion.div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}