// types/vibe.ts
import { Timestamp } from "firebase/firestore";

export interface DailyReadingVibe {
  emoji: string;
  note: string;
  date: string; // Format: YYYY-MM-DD
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}