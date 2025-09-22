// import { Timestamp } from "firebase/firestore"

// export interface Book {
//   id?: string 
//   title: string
//   author: string
//   genre: string
//   notes: string
//   userId: string
//   createdAt: Timestamp
// }

// Update your Book type definition in @/types/book.ts to include these fields:

export interface Book {
  id?: string;
  title: string;
  author: string;
  genre?: string;
  description?: string;
  coverImage?: string;
  notes?: string;
  readingStatus?: "want-to-read" | "currently-reading" | "finished";
  userId: string;
  
  // Add these new fields for the enhanced functionality:
  rating?: number;        // 1-5 star rating
  review?: string;        // User's written review
  tags?: string[];        // Array of tags
  dateStarted?: string;   // ISO date string when started reading
  dateFinished?: string;  // ISO date string when finished reading
  dateAdded?: string;     // ISO date string when added to library
}