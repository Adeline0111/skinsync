
export enum SkinType {
  Oily = 'Oily',
  Dry = 'Dry',
  Combination = 'Combination',
  Sensitive = 'Sensitive',
  AcneProne = 'Acne-Prone'
}

export enum SkinConcern {
  Acne = 'Acne',
  Pigmentation = 'Pigmentation',
  DarkSpots = 'Dark Spots',
  Dullness = 'Dullness',
  DarkCircles = 'Dark Circles',
  Wrinkles = 'Wrinkles'
}

export enum SkinGoal {
  ClearSkin = 'Clear Skin',
  Glow = 'Natural Glow',
  ReduceOil = 'Reduce Oil',
  ReduceAcne = 'Reduce Acne',
  AntiAging = 'Anti-Aging'
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age?: number;
  gender?: string;
  skinType?: SkinType;
  concerns: SkinConcern[];
  goal?: SkinGoal;
  photoUrl?: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  type: 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen' | 'other';
  isMorning: boolean;
  isNight: boolean;
  isUsed?: boolean;
}

export interface RoutineLog {
  date: string; // ISO Date YYYY-MM-DD
  morningCompleted: boolean;
  nightCompleted: boolean;
  completedProducts: string[]; // array of product IDs
}

export interface SkinPhoto {
  id: string;
  timestamp: string;
  imageUrl: string;
  note: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
}
