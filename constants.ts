
import { SkinType, SkinConcern, SkinGoal } from './types';

export const COLORS = {
  primary: '#c5a059', // Soft Gold
  secondary: '#1a1c23', // Dark Gray
  accent: '#d4af37', // Brighter Gold
  background: '#0f1115', // Deep Black
  surface: '#16181d', // Card Surface
  text: '#e5e7eb',
  muted: '#9ca3af',
  success: '#10b981',
  error: '#ef4444'
};

export const SKIN_TYPES = Object.values(SkinType);
export const SKIN_CONCERNS = Object.values(SkinConcern);
export const SKIN_GOALS = Object.values(SkinGoal);

export const GENDERS = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];

export const STORAGE_KEYS = {
  USERS: 'skinsync_users',
  SESSION: 'skinsync_session',
  ROUTINES: 'skinsync_routines_prefix', // + userID
  PHOTOS: 'skinsync_photos_prefix', // + userID
  LOGS: 'skinsync_logs_prefix' // + userID
};
