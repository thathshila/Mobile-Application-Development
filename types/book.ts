import { Timestamp } from "firebase/firestore"

export interface Book {
  id?: string 
  title: string
  author: string
  genre: string
  notes: string
  userId: string
  createdAt: Timestamp
}
