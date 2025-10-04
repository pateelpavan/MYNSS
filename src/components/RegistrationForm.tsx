import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Users, Mail } from 'lucide-react';
import { Registration } from '../App';
import { toast } from 'sonner';

interface RegistrationFormProps {
  onSubmit: (registration: Registration) => void;
  existingMobiles: string[];
  existingEmails: string[];
  onBack: () => void;
}

export default function RegistrationForm({ onSubmit, existingMobiles, existingEmails, onBack }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    uniqueId: '',
    name: '',
    email: '',
    mobile: '',
    branch: '',
    section: '',
    familyMembers: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleUniqueIdSubmit = () => {
    if (formData.uniqueId === 'CMRIT2025') {
      setIsAuthorized(true);
      toast.success('Access granted! Please fill the registration form.');
    } else {
      toast.error('Invalid unique ID. Please contact the organizers.');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'College email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (existingEmails.includes(formData.email)) {
      newErrors.email = 'This email is already registered';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    } else if (existingMobiles.includes(formData.mobile)) {
      newErrors.mobile = 'This mobile number is already registered';
    }
    
    if (!formData.branch.trim()) newErrors.branch = 'Branch is required';
    if (!formData.section) newErrors.section = 'Section is required';
    
    if (!formData.familyMembers.trim()) {
      newErrors.familyMembers = 'Number of family members is required';
    } else {
      const familyCount = parseInt(formData.familyMembers);
      if (isNaN(familyCount) || familyCount < 0) {
        newErrors.familyMembers = 'Please enter a valid number';
      } else if (familyCount > 10) {
        newErrors.familyMembers = 'Maximum 10 family members allowed';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const registration: Registration = {
        id: `CMRIT${Date.now()}`,
        name: formData.name,
        email: formData.email,
        year: '1st',
        mobile: formData.mobile,
        branch: formData.branch,
        section: formData.section,
        familyMembers: parseInt(formData.familyMembers, 10),
        timestamp: Date.now()
      };
      onSubmit(registration);
      toast.success('Registration successful! Your ticket is ready.');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 max-w-md w-full bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <Button
              onClick={onBack}
              variant="ghost"
              className="mb-4 p-0 h-auto hover:bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <h2 className="text-2xl font-bold mb-6 text-center">Access Control</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="uniqueId">Enter Unique ID</Label>
                <Input
                  id="uniqueId"
                  type="text"
                  placeholder="Enter unique ID"
                  value={formData.uniqueId}
                  onChange={(e) => setFormData(prev => ({ ...prev, uniqueId: e.target.value }))}
                  className="mt-1"
                />
              </div>
              
              <Button
                onClick={handleUniqueIdSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Verify Access
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-400">
            © All copyrights belong to Pateel Pavan
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-4 p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Registration Form</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email">College Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="student@cmr.edu.in"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="text"
                value="1st"
                disabled
                className="bg-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                className={errors.mobile ? 'border-red-500' : ''}
              />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>

            <div>
              <Label htmlFor="branch">Branch *</Label>
              <Input
                id="branch"
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                className={errors.branch ? 'border-red-500' : ''}
              />
              {errors.branch && <p className="text-red-500 text-sm mt-1">{errors.branch}</p>}
            </div>

            <div>
              <Label htmlFor="section">Section *</Label>
              <Select onValueChange={(value: string) => setFormData(prev => ({ ...prev, section: value }))}>
                <SelectTrigger className={errors.section ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                  <SelectItem value="E">E</SelectItem>
                </SelectContent>
              </Select>
              {errors.section && <p className="text-red-500 text-sm mt-1">{errors.section}</p>}
            </div>

            <div>
              <Label htmlFor="familyMembers">Family Members * (Max: 10)</Label>
              <Input
                id="familyMembers"
                type="number"
                min="0"
                max="10"
                value={formData.familyMembers}
                onChange={(e) => setFormData(prev => ({ ...prev, familyMembers: e.target.value }))}
                className={errors.familyMembers ? 'border-red-500' : ''}
              />
              {errors.familyMembers && <p className="text-red-500 text-sm mt-1">{errors.familyMembers}</p>}
              <p className="text-xs text-gray-500 mt-1">Enter the number of family members (0-10)</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white"
            >
              Submit Registration
            </Button>
          </form>
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
    </div>
  );
}