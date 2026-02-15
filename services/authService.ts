
import { UserProfile } from '../types';
import { db } from './storageService';
import { STORAGE_KEYS } from '../constants';

class AuthService {
  private currentSession: string | null = null;

  constructor() {
    this.currentSession = localStorage.getItem(STORAGE_KEYS.SESSION);
  }

  signUp(email: string, password: string, name: string): UserProfile {
    const users = db.getAllUsers();
    if (users.find(u => u.email === email)) {
      throw new Error("User already exists.");
    }

    const newUser: UserProfile = {
      id: Math.random().toString(36).substring(7),
      email,
      name,
      concerns: [],
      onboardingCompleted: false,
      createdAt: new Date().toISOString()
    };

    db.saveUser(newUser);
    this.setSession(newUser.id);
    return newUser;
  }

  login(email: string, password: string): UserProfile {
    // Password is 'secret' for simulation in this demo or any string > 6 chars
    if (password.length < 5) throw new Error("Invalid credentials.");

    const users = db.getAllUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error("User not found. Please sign up.");
    }

    this.setSession(user.id);
    return user;
  }

  logout(): void {
    this.currentSession = null;
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  getCurrentUser(): UserProfile | null {
    if (!this.currentSession) return null;
    return db.getUserById(this.currentSession);
  }

  private setSession(userId: string): void {
    this.currentSession = userId;
    localStorage.setItem(STORAGE_KEYS.SESSION, userId);
  }

  resetPassword(email: string): void {
    // Simulate reset link email
    console.log(`Reset link sent to ${email}`);
  }
}

export const auth = new AuthService();
