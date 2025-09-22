
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/firebase';
import { DailyReadingVibe } from '../types/vibe';

export const VibeService = {
  getTodayDate: (): string => new Date().toISOString().split('T')[0],

  saveTodayVibe: async (emoji: string, note: string, userId: string) => {
    const today = VibeService.getTodayDate();
    const vibeId = `${userId}_${today}`;
    const vibeDoc = doc(db, 'dailyReadingVibes', vibeId);
    const existingDoc = await getDoc(vibeDoc);

    if (existingDoc.exists()) {
      await updateDoc(vibeDoc, { emoji, note, updatedAt: serverTimestamp() });
    } else {
      await setDoc(vibeDoc, {
        id: vibeId,
        emoji,
        note,
        date: today,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return { id: vibeId };
  },

  getTodayVibe: async (userId: string): Promise<DailyReadingVibe | null> => {
    const today = VibeService.getTodayDate();
    const vibeId = `${userId}_${today}`;
    const vibeDoc = doc(db, 'dailyReadingVibes', vibeId);
    const docSnap = await getDoc(vibeDoc);
    
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      emoji: data.emoji,
      note: data.note,
      date: data.date,
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    } as DailyReadingVibe;
  },

  getVibesByUser: async (userId: string): Promise<DailyReadingVibe[]> => {
    const q = query(collection(db, 'dailyReadingVibes'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        emoji: data.emoji,
        note: data.note,
        date: data.date,
        userId: data.userId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      } as DailyReadingVibe;
    });
  },

  updateTodayEmoji: async (emoji: string, userId: string) => {
    const today = VibeService.getTodayDate();
    const vibeId = `${userId}_${today}`;
    const vibeDoc = doc(db, 'dailyReadingVibes', vibeId);
    const existingDoc = await getDoc(vibeDoc);
    
    if (existingDoc.exists()) {
      await updateDoc(vibeDoc, { emoji, updatedAt: serverTimestamp() });
    } else {
      await VibeService.saveTodayVibe(emoji, '', userId);
    }
  },

  updateTodayNote: async (note: string, userId: string) => {
    const today = VibeService.getTodayDate();
    const vibeId = `${userId}_${today}`;
    const vibeDoc = doc(db, 'dailyReadingVibes', vibeId);
    const existingDoc = await getDoc(vibeDoc);
    
    if (existingDoc.exists()) {
      await updateDoc(vibeDoc, { note, updatedAt: serverTimestamp() });
    } else {
      await VibeService.saveTodayVibe('📚', note, userId);
    }
  },

  deleteVibe: async (id: string) => {
    const vibeDoc = doc(db, 'dailyReadingVibes', id);
    await deleteDoc(vibeDoc);
  },
};