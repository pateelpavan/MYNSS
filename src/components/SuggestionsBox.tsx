import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { MessageSquare, Send, X } from 'lucide-react';
import { Suggestion } from '../App';
import { toast } from 'sonner';

interface SuggestionsBoxProps {
  user: {
    id: string;
    fullName: string;
    rollNumber: string;
  };
  onSaveSuggestion: (suggestion: Suggestion) => void;
}

export default function SuggestionsBox({ user, onSaveSuggestion }: SuggestionsBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general' as 'general' | 'event' | 'system' | 'achievement'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    const suggestion: Suggestion = {
      id: `suggestion_${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      userRollNumber: user.rollNumber,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: 'pending',
      timestamp: Date.now()
    };

    try {
      onSaveSuggestion(suggestion);
      setFormData({ title: '', description: '', category: 'general' });
      setIsOpen(false);
      toast.success('Suggestion submitted successfully! Thank you for your feedback.');
    } catch (error) {
      toast.error('Failed to submit suggestion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Modal Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-6 bg-white/95 backdrop-blur-lg shadow-2xl border-0 relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50" />
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200/20 rounded-full -translate-x-16 -translate-y-16 animate-pulse" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-200/20 rounded-full translate-x-12 translate-y-12 animate-pulse" />
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Suggestions & Feedback
                      </h2>
                      <p className="text-sm text-gray-600">Help us improve NSS</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="suggestionTitle">Title *</Label>
                    <Input
                      id="suggestionTitle"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Brief title for your suggestion"
                      className="border-2 border-blue-200 focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="suggestionCategory">Category</Label>
                    <select
                      id="suggestionCategory"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'general' | 'event' | 'system' | 'achievement' }))}
                      className="w-full p-2 border-2 border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="general">General</option>
                      <option value="event">Event Related</option>
                      <option value="system">System/Technical</option>
                      <option value="achievement">Achievement/Certificate</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="suggestionDescription">Description *</Label>
                    <Textarea
                      id="suggestionDescription"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your suggestion or feedback in detail..."
                      rows={4}
                      className="border-2 border-blue-200 focus:border-blue-400"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Submit Suggestion
                        </div>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="px-6 border-2 border-gray-300 hover:border-gray-400"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Your feedback helps us improve the NSS experience for everyone. 
                    We appreciate your input! 💙
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
