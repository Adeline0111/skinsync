
import { UserProfile, Product, SkinPhoto, RoutineLog } from '../types';
import { STORAGE_KEYS } from '../constants';

/**
 * A service class that simulates a real database. 
 * In a real production app, these would be calls to Supabase, Firebase, or a custom API.
 */
class StorageService {
  private getItem<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  private setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // --- Users ---
  getAllUsers(): UserProfile[] {
    return this.getItem<UserProfile[]>(STORAGE_KEYS.USERS) || [];
  }

  saveUser(user: UserProfile): void {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  getUserById(id: string): UserProfile | null {
    return this.getAllUsers().find(u => u.id === id) || null;
  }

  // --- Routines (Products) ---
  getUserProducts(userId: string): Product[] {
    return this.getItem<Product[]>(`${STORAGE_KEYS.ROUTINES}_${userId}`) || [];
  }

  saveProduct(userId: string, product: Product): void {
    const products = this.getUserProducts(userId);
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) {
      products[index] = product;
    } else {
      products.push(product);
    }
    this.setItem(`${STORAGE_KEYS.ROUTINES}_${userId}`, products);
  }

  deleteProduct(userId: string, productId: string): void {
    const products = this.getUserProducts(userId);
    this.setItem(`${STORAGE_KEYS.ROUTINES}_${userId}`, products.filter(p => p.id !== productId));
  }

  // --- Logs (Routine Completion) ---
  getRoutineLogs(userId: string): RoutineLog[] {
    return this.getItem<RoutineLog[]>(`${STORAGE_KEYS.LOGS}_${userId}`) || [];
  }

  saveRoutineLog(userId: string, log: RoutineLog): void {
    const logs = this.getRoutineLogs(userId);
    const index = logs.findIndex(l => l.date === log.date);
    if (index > -1) {
      logs[index] = log;
    } else {
      logs.push(log);
    }
    this.setItem(`${STORAGE_KEYS.LOGS}_${userId}`, logs);
  }

  // --- Photos ---
  getUserPhotos(userId: string): SkinPhoto[] {
    return this.getItem<SkinPhoto[]>(`${STORAGE_KEYS.PHOTOS}_${userId}`) || [];
  }

  savePhoto(userId: string, photo: SkinPhoto): void {
    const photos = this.getUserPhotos(userId);
    photos.push(photo);
    // Sort by timestamp descending
    photos.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    this.setItem(`${STORAGE_KEYS.PHOTOS}_${userId}`, photos);
  }

  deletePhoto(userId: string, photoId: string): void {
    const photos = this.getUserPhotos(userId);
    this.setItem(`${STORAGE_KEYS.PHOTOS}_${userId}`, photos.filter(p => p.id !== photoId));
  }
}

export const db = new StorageService();
