
import { Timestamp } from "firebase/firestore";

export interface DailyReadingVibe {
  id: string; // Unique ID combining userId and date
  emoji: string;
  note: string;
  date: string; // Format: YYYY-MM-DD
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}