import { supabaseService } from './supabaseService';
import type { NSSUser, Achievement, Certificate, EventHistory, Suggestion, AdminEvent, EventRegistration } from '../App';

// Data adapter to bridge existing App.tsx interface with Supabase
export class DataAdapter {
  // Convert Supabase user to NSSUser format
  private static convertSupabaseUserToNSSUser(supabaseUser: any): NSSUser {
    return {
      id: supabaseUser.id,
      fullName: supabaseUser.full_name,
      rollNumber: supabaseUser.roll_number,
      branch: supabaseUser.branch,
      password: supabaseUser.password,
      profilePhoto: supabaseUser.profile_photo || '',
      eventPhotos: [], // Will be loaded separately
      qrCode: supabaseUser.qr_code,
      timestamp: new Date(supabaseUser.created_at).getTime(),
      isApproved: supabaseUser.is_approved,
      isRejected: supabaseUser.is_rejected,
      approvedBy: supabaseUser.approved_by,
      approvedAt: supabaseUser.approved_at ? new Date(supabaseUser.approved_at).getTime() : undefined,
      rejectedBy: supabaseUser.rejected_by,
      rejectedAt: supabaseUser.rejected_at ? new Date(supabaseUser.rejected_at).getTime() : undefined,
      rejectionReason: supabaseUser.rejection_reason,
      joinDate: supabaseUser.join_date,
      endDate: supabaseUser.end_date,
      achievements: [], // Will be loaded separately
      certificates: [], // Will be loaded separately
      eventHistory: [], // Will be loaded separately
    };
  }

  // Convert NSSUser to Supabase user format
  private static convertNSSUserToSupabaseUser(nssUser: NSSUser) {
    return {
      full_name: nssUser.fullName,
      roll_number: nssUser.rollNumber,
      branch: nssUser.branch,
      password: nssUser.password,
      profile_photo: nssUser.profilePhoto,
      qr_code: nssUser.qrCode,
      is_approved: nssUser.isApproved,
      is_rejected: nssUser.isRejected,
      approved_by: nssUser.approvedBy,
      approved_at: nssUser.approvedAt ? new Date(nssUser.approvedAt).toISOString() : null,
      rejected_by: nssUser.rejectedBy,
      rejected_at: nssUser.rejectedAt ? new Date(nssUser.rejectedAt).toISOString() : null,
      rejection_reason: nssUser.rejectionReason,
      join_date: nssUser.joinDate,
      end_date: nssUser.endDate,
    };
  }

  // Convert Supabase achievement to Achievement format
  private static convertSupabaseAchievementToAchievement(supabaseAchievement: any): Achievement {
    return {
      id: supabaseAchievement.id,
      title: supabaseAchievement.title,
      description: supabaseAchievement.description,
      level: supabaseAchievement.level,
      date: supabaseAchievement.achievement_date,
      photo: supabaseAchievement.photo_url || '',
      isVerified: supabaseAchievement.is_verified,
      verifiedBy: supabaseAchievement.verified_by,
      verifiedAt: supabaseAchievement.verified_at ? new Date(supabaseAchievement.verified_at).getTime() : undefined,
    };
  }

  // Convert Achievement to Supabase achievement format
  private static convertAchievementToSupabaseAchievement(achievement: Achievement, userId: string) {
    return {
      user_id: userId,
      title: achievement.title,
      description: achievement.description,
      level: achievement.level,
      achievement_date: achievement.date,
      photo_url: achievement.photo,
      is_verified: achievement.isVerified,
      verified_by: achievement.verifiedBy,
      verified_at: achievement.verifiedAt ? new Date(achievement.verifiedAt).toISOString() : null,
    };
  }

  // Convert Supabase certificate to Certificate format
  private static convertSupabaseCertificateToCertificate(supabaseCertificate: any): Certificate {
    return {
      id: supabaseCertificate.id,
      title: supabaseCertificate.title,
      description: supabaseCertificate.description,
      fileUrl: supabaseCertificate.file_url,
      uploadDate: supabaseCertificate.upload_date,
      isVerified: supabaseCertificate.is_verified,
      verifiedBy: supabaseCertificate.verified_by,
      verifiedAt: supabaseCertificate.verified_at ? new Date(supabaseCertificate.verified_at).getTime() : undefined,
    };
  }

  // Convert Supabase suggestion to Suggestion format
  private static convertSupabaseSuggestionToSuggestion(supabaseSuggestion: any): Suggestion {
    return {
      id: supabaseSuggestion.id,
      userId: supabaseSuggestion.user_id,
      userName: supabaseSuggestion.user_name,
      userRollNumber: supabaseSuggestion.user_roll_number,
      title: supabaseSuggestion.title,
      description: supabaseSuggestion.description,
      category: supabaseSuggestion.category,
      status: supabaseSuggestion.status,
      timestamp: new Date(supabaseSuggestion.created_at).getTime(),
      reviewedBy: supabaseSuggestion.reviewed_by,
      reviewedAt: supabaseSuggestion.reviewed_at ? new Date(supabaseSuggestion.reviewed_at).getTime() : undefined,
      response: supabaseSuggestion.response,
    };
  }

  // Convert Suggestion to Supabase suggestion format
  private static convertSuggestionToSupabaseSuggestion(suggestion: Suggestion) {
    return {
      user_id: suggestion.userId,
      user_name: suggestion.userName,
      user_roll_number: suggestion.userRollNumber,
      title: suggestion.title,
      description: suggestion.description,
      category: suggestion.category,
      status: suggestion.status,
      reviewed_by: suggestion.reviewedBy,
      reviewed_at: suggestion.reviewedAt ? new Date(suggestion.reviewedAt).toISOString() : null,
      response: suggestion.response,
    };
  }

  // User operations
  static async getAllUsers(): Promise<NSSUser[]> {
    try {
      const supabaseUsers = await supabaseService.user.getAll();
      const users: NSSUser[] = [];

      for (const supabaseUser of supabaseUsers) {
        const nssUser = this.convertSupabaseUserToNSSUser(supabaseUser);
        
        // Load related data
        const [achievements, certificates, eventHistory] = await Promise.all([
          this.getUserAchievements(supabaseUser.id),
          this.getUserCertificates(supabaseUser.id),
          this.getUserEventHistory(supabaseUser.id),
        ]);

        nssUser.achievements = achievements;
        nssUser.certificates = certificates;
        nssUser.eventHistory = eventHistory;
        
        users.push(nssUser);
      }

      return users;
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  static async getUserById(id: string): Promise<NSSUser | null> {
    try {
      const supabaseUser = await supabaseService.user.getById(id);
      if (!supabaseUser) return null;

      const nssUser = this.convertSupabaseUserToNSSUser(supabaseUser);
      
      // Load related data
      const [achievements, certificates, eventHistory] = await Promise.all([
        this.getUserAchievements(supabaseUser.id),
        this.getUserCertificates(supabaseUser.id),
        this.getUserEventHistory(supabaseUser.id),
      ]);

      nssUser.achievements = achievements;
      nssUser.certificates = certificates;
      nssUser.eventHistory = eventHistory;

      return nssUser;
    } catch (error) {
      console.error('Error loading user:', error);
      return null;
    }
  }

  static async getUserByRollNumber(rollNumber: string): Promise<NSSUser | null> {
    try {
      const supabaseUser = await supabaseService.user.getByRollNumber(rollNumber);
      if (!supabaseUser) return null;

      const nssUser = this.convertSupabaseUserToNSSUser(supabaseUser);
      
      // Load related data
      const [achievements, certificates, eventHistory] = await Promise.all([
        this.getUserAchievements(supabaseUser.id),
        this.getUserCertificates(supabaseUser.id),
        this.getUserEventHistory(supabaseUser.id),
      ]);

      nssUser.achievements = achievements;
      nssUser.certificates = certificates;
      nssUser.eventHistory = eventHistory;

      return nssUser;
    } catch (error) {
      console.error('Error loading user by roll number:', error);
      return null;
    }
  }

  static async createUser(user: NSSUser): Promise<NSSUser> {
    try {
      const supabaseUserData = this.convertNSSUserToSupabaseUser(user);
      const createdUser = await supabaseService.user.create(supabaseUserData);
      return this.convertSupabaseUserToNSSUser(createdUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateUser(user: NSSUser): Promise<NSSUser> {
    try {
      const supabaseUserData = this.convertNSSUserToSupabaseUser(user);
      const updatedUser = await supabaseService.user.update(user.id, supabaseUserData);
      return this.convertSupabaseUserToNSSUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async approveUser(userId: string, approvedBy: string = 'admin'): Promise<void> {
    try {
      await supabaseService.user.approve(userId, approvedBy);
    } catch (error) {
      console.error('Error approving user:', error);
      throw error;
    }
  }

  static async rejectUser(userId: string, rejectedBy: string = 'admin', reason?: string): Promise<void> {
    try {
      await supabaseService.user.reject(userId, rejectedBy, reason);
    } catch (error) {
      console.error('Error rejecting user:', error);
      throw error;
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      await supabaseService.user.delete(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Achievement operations
  static async getUserAchievements(userId: string): Promise<Achievement[]> {
    try {
      const supabaseAchievements = await supabaseService.achievement.getByUserId(userId);
      return supabaseAchievements.map(achievement => 
        this.convertSupabaseAchievementToAchievement(achievement)
      );
    } catch (error) {
      console.error('Error loading user achievements:', error);
      return [];
    }
  }

  static async createAchievement(userId: string, achievement: Achievement): Promise<void> {
    try {
      const supabaseAchievementData = this.convertAchievementToSupabaseAchievement(achievement, userId);
      await supabaseService.achievement.create(supabaseAchievementData);
    } catch (error) {
      console.error('Error creating achievement:', error);
      throw error;
    }
  }

  static async updateAchievement(userId: string, achievementId: string, achievement: Achievement): Promise<void> {
    try {
      const supabaseAchievementData = this.convertAchievementToSupabaseAchievement(achievement, userId);
      await supabaseService.achievement.update(achievementId, supabaseAchievementData);
    } catch (error) {
      console.error('Error updating achievement:', error);
      throw error;
    }
  }

  static async deleteAchievement(userId: string, achievementId: string): Promise<void> {
    try {
      await supabaseService.achievement.delete(achievementId);
    } catch (error) {
      console.error('Error deleting achievement:', error);
      throw error;
    }
  }

  // Certificate operations
  static async getUserCertificates(userId: string): Promise<Certificate[]> {
    try {
      const supabaseCertificates = await supabaseService.certificate.getByUserId(userId);
      return supabaseCertificates.map(certificate => 
        this.convertSupabaseCertificateToCertificate(certificate)
      );
    } catch (error) {
      console.error('Error loading user certificates:', error);
      return [];
    }
  }

  // Event operations
  static async getAllEvents(): Promise<AdminEvent[]> {
    try {
      const supabaseEvents = await supabaseService.event.getAll();
      const events: AdminEvent[] = [];

      for (const supabaseEvent of supabaseEvents) {
        const registrations = await this.getEventRegistrations(supabaseEvent.id);
        
        const event: AdminEvent = {
          id: supabaseEvent.id,
          title: supabaseEvent.title,
          description: supabaseEvent.description,
          date: supabaseEvent.event_date,
          startDate: supabaseEvent.start_date,
          endDate: supabaseEvent.end_date,
          registrations: registrations,
          timestamp: new Date(supabaseEvent.created_at).getTime(),
        };

        events.push(event);
      }

      return events;
    } catch (error) {
      console.error('Error loading events:', error);
      return [];
    }
  }

  static async createEvent(event: AdminEvent): Promise<void> {
    try {
      await supabaseService.event.create({
        title: event.title,
        description: event.description,
        event_date: event.date,
        start_date: event.startDate,
        end_date: event.endDate,
        created_by: 'admin',
      });
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Event registration operations
  static async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    try {
      const supabaseRegistrations = await supabaseService.eventRegistration.getByEventId(eventId);
      return supabaseRegistrations.map(registration => ({
        userId: registration.user_id,
        userRollNumber: registration.user_roll_number,
        userName: registration.user_name,
        registeredAt: new Date(registration.registered_at).getTime(),
        isApproved: registration.is_approved,
        approvedBy: registration.approved_by,
        approvedAt: registration.approved_at ? new Date(registration.approved_at).getTime() : undefined,
      }));
    } catch (error) {
      console.error('Error loading event registrations:', error);
      return [];
    }
  }

  static async getUserEventHistory(userId: string): Promise<EventHistory[]> {
    try {
      const supabaseRegistrations = await supabaseService.eventRegistration.getByUserId(userId);
      return supabaseRegistrations.map(registration => ({
        eventId: registration.event_id,
        eventTitle: registration.events?.title || 'Unknown Event',
        startDate: registration.events?.start_date || '',
        endDate: registration.events?.end_date || '',
        status: registration.is_approved ? 'attended' : 'registered',
        registrationDate: new Date(registration.registered_at).toISOString().split('T')[0],
        attendanceDate: registration.attendance_date ? new Date(registration.attendance_date).toISOString().split('T')[0] : undefined,
        completionDate: registration.attendance_status === 'completed' ? new Date(registration.attendance_date || registration.registered_at).toISOString().split('T')[0] : undefined,
      }));
    } catch (error) {
      console.error('Error loading user event history:', error);
      return [];
    }
  }

  static async registerForEvent(eventId: string, user: NSSUser): Promise<void> {
    try {
      // Check if already registered
      const existingRegistration = await supabaseService.eventRegistration.checkRegistration(eventId, user.id);
      if (existingRegistration) {
        throw new Error('User is already registered for this event');
      }

      await supabaseService.eventRegistration.create({
        event_id: eventId,
        user_id: user.id,
        user_roll_number: user.rollNumber,
        user_name: user.fullName,
      });
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  }

  static async approveEventRegistration(eventId: string, userId: string): Promise<void> {
    try {
      // First get the registration ID
      const registration = await supabaseService.eventRegistration.checkRegistration(eventId, userId);
      if (!registration) {
        throw new Error('Registration not found');
      }

      await supabaseService.eventRegistration.approve(registration.id, 'admin');
    } catch (error) {
      console.error('Error approving event registration:', error);
      throw error;
    }
  }

  // Suggestion operations
  static async getAllSuggestions(): Promise<Suggestion[]> {
    try {
      const supabaseSuggestions = await supabaseService.suggestion.getAll();
      return supabaseSuggestions.map(suggestion => 
        this.convertSupabaseSuggestionToSuggestion(suggestion)
      );
    } catch (error) {
      console.error('Error loading suggestions:', error);
      return [];
    }
  }

  static async createSuggestion(suggestion: Suggestion): Promise<void> {
    try {
      const supabaseSuggestionData = this.convertSuggestionToSupabaseSuggestion(suggestion);
      await supabaseService.suggestion.create(supabaseSuggestionData);
    } catch (error) {
      console.error('Error creating suggestion:', error);
      throw error;
    }
  }

  static async updateSuggestion(suggestion: Suggestion): Promise<void> {
    try {
      const supabaseSuggestionData = this.convertSuggestionToSupabaseSuggestion(suggestion);
      await supabaseService.suggestion.updateStatus(
        suggestion.id,
        suggestion.status,
        suggestion.reviewedBy || 'admin',
        suggestion.response
      );
    } catch (error) {
      console.error('Error updating suggestion:', error);
      throw error;
    }
  }

  // Statistics operations
  static async getUserStats() {
    try {
      return await supabaseService.statistics.getUserStats();
    } catch (error) {
      console.error('Error loading user stats:', error);
      return { total_users: 0, approved_users: 0, pending_users: 0, rejected_users: 0 };
    }
  }

  static async getAchievementStats() {
    try {
      return await supabaseService.statistics.getAchievementStats();
    } catch (error) {
      console.error('Error loading achievement stats:', error);
      return {};
    }
  }

  static async getEventStats() {
    try {
      return await supabaseService.statistics.getEventStats();
    } catch (error) {
      console.error('Error loading event stats:', error);
      return { total_events: 0, upcoming_events: 0, past_events: 0 };
    }
  }

  static async getSuggestionStats() {
    try {
      return await supabaseService.statistics.getSuggestionStats();
    } catch (error) {
      console.error('Error loading suggestion stats:', error);
      return {};
    }
  }
}

