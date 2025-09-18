// // vibeService.ts
// import {
//   addDoc,
//   collection,
//   deleteDoc,
//   doc,
//   getDocs,
//   getDoc,
//   query,
//   updateDoc,
//   where,
//   serverTimestamp,
//   setDoc,
// } from "firebase/firestore";
// import { db } from "@/firebase";
// import { DailyReadingVibe } from "../types/vibe"; // your DailyReadingVibe interface

// const vibesRef = collection(db, "dailyReadingVibes");

// export const VibeService = {
//   // Get today's date in YYYY-MM-DD format
//   getTodayDate: (): string => {
//     return new Date().toISOString().split('T')[0];
//   },

//   // CREATE or UPDATE today's vibe
//   saveTodayVibe: async (emoji: string, note: string, userId: string) => {
//     const today = VibeService.getTodayDate();
//     const vibeId = `${userId}_${today}`; // Unique ID combining user and date
//     const vibeDoc = doc(db, "dailyReadingVibes", vibeId);
    
//     // Check if document exists
//     const existingDoc = await getDoc(vibeDoc);
    
//     if (existingDoc.exists()) {
//       // Update existing vibe
//       await updateDoc(vibeDoc, {
//         emoji,
//         note,
//         updatedAt: serverTimestamp(),
//       });
//     } else {
//       // Create new vibe
//       await setDoc(vibeDoc, {
//         id: vibeId,
//         emoji,
//         note,
//         date: today,
//         userId,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });
//     }
//     return { id: vibeId };
//   },

//   // READ today's vibe
//   getTodayVibe: async (userId: string): Promise<DailyReadingVibe | null> => {
//     const today = VibeService.getTodayDate();
//     const vibeId = `${userId}_${today}`;
//     const vibeDoc = doc(db, "dailyReadingVibes", vibeId);
//     const docSnap = await getDoc(vibeDoc);

//     if (docSnap.exists()) {
//       return docSnap.data() as DailyReadingVibe;
//     }
//     return null;
//   },

//   // READ all vibes by user
//   getVibesByUser: async (userId: string): Promise<DailyReadingVibe[]> => {
//     const q = query(vibesRef, where("userId", "==", userId));
//     const snapshot = await getDocs(q);
//     return snapshot.docs.map((docSnap) => ({
//       id: docSnap.id,
//       ...(docSnap.data() as DailyReadingVibe),
//     }));
//   },

//   // UPDATE only emoji for today
//   updateTodayEmoji: async (emoji: string, userId: string) => {
//     const today = VibeService.getTodayDate();
//     const vibeId = `${userId}_${today}`;
//     const vibeDoc = doc(db, "dailyReadingVibes", vibeId);
    
//     const existingDoc = await getDoc(vibeDoc);
    
//     if (existingDoc.exists()) {
//       await updateDoc(vibeDoc, {
//         emoji,
//         updatedAt: serverTimestamp(),
//       });
//     } else {
//       // Create new vibe with emoji and empty note
//       await VibeService.saveTodayVibe(emoji, '', userId);
//     }
//   },

//   // UPDATE only note for today
//   updateTodayNote: async (note: string, userId: string) => {
//     const today = VibeService.getTodayDate();
//     const vibeId = `${userId}_${today}`;
//     const vibeDoc = doc(db, "dailyReadingVibes", vibeId);
    
//     const existingDoc = await getDoc(vibeDoc);
    
//     if (existingDoc.exists()) {
//       await updateDoc(vibeDoc, {
//         note,
//         updatedAt: serverTimestamp(),
//       });
//     } else {
//       // Create new vibe with note and default emoji
//       await VibeService.saveTodayVibe('📚', note, userId);
//     }
//   },

//   // DELETE a specific vibe
//   deleteVibe: async (id: string) => {
//     const vibeDoc = doc(db, "dailyReadingVibes", id);
//     await deleteDoc(vibeDoc);
//   },
// };


// import {
//   addDoc,
//   collection,
//   deleteDoc,
//   doc,
//   getDocs,
//   getDoc,
//   query,
//   updateDoc,
//   where,
//   serverTimestamp,
//   setDoc,
// } from 'firebase/firestore';
// import { db } from '@/firebase';
// import { DailyReadingVibe } from '../types/vibe';

// const vibesRef = collection(db, 'dailyReadingVibes');

// export const VibeService = {
//   getTodayDate: (): string => new Date().toISOString().split('T')[0],

//   saveTodayVibe: async (emoji: string, note: string, userId: string) => {
//     const today = VibeService.getTodayDate();
//     const vibeId = `${userId}_${today}`;
//     const vibeDoc = doc(db, 'dailyReadingVibes', vibeId);
//     const existingDoc = await getDoc(vibeDoc);

//     if (existingDoc.exists()) {
//       await updateDoc(vibeDoc, { emoji, note, updatedAt: serverTimestamp() });
//     } else {
//       await setDoc(vibeDoc, {
//         id: vibeId,
//         emoji,
//         note,
//         date: today,
//         userId,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });
//     }
//     return { id: vibeId };
//   },

//   getTodayVibe: async (userId: string): Promise<DailyReadingVibe | null> => {
//     const today = VibeService.getTodayDate();
//     const vibeId = `${userId}_${today}`;
//     const vibeDoc = doc(db, 'dailyReadingVibes', vibeId);
//     const docSnap = await getDoc(vibeDoc);
//     return docSnap.exists() ? (docSnap.data() as DailyReadingVibe) : null;
//   },

//   getVibesByUser: async (userId: string): Promise<DailyReadingVibe[]> => {
//     const q = query(vibesRef, where('userId', '==', userId));
//     const snapshot = await getDocs(q);
//     return snapshot.docs.map((docSnap) => ({
//       id: docSnap.id,
//       ...(docSnap.data() as DailyReadingVibe),
//     }));
//   },

//   updateTodayEmoji: async (emoji: string, userId: string) => {
//     const today = VibeService.getTodayDate();
//     const vibeId = `${userId}_${today}`;
//     const vibeDoc = doc(db, 'dailyReadingVibes', vibeId);
//     const existingDoc = await getDoc(vibeDoc);
//     if (existingDoc.exists()) {
//       await updateDoc(vibeDoc, { emoji, updatedAt: serverTimestamp() });
//     } else {
//       await VibeService.saveTodayVibe(emoji, '', userId);
//     }
//   },

//   updateTodayNote: async (note: string, userId: string) => {
//     const today = VibeService.getTodayDate();
//     const vibeId = `${userId}_${today}`;
//     const vibeDoc = doc(db, 'dailyReadingVibes', vibeId);
//     const existingDoc = await getDoc(vibeDoc);
//     if (existingDoc.exists()) {
//       await updateDoc(vibeDoc, { note, updatedAt: serverTimestamp() });
//     } else {
//       await VibeService.saveTodayVibe('📚', note, userId);
//     }
//   },

//   deleteVibe: async (id: string) => {
//     const vibeDoc = doc(db, 'dailyReadingVibes', id);
//     await deleteDoc(vibeDoc);
//   },
// };


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