import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase"; 
import { Book } from "@/types/book"; 

const booksRef = collection(db, "books");

export const BookService = {
  
addBook: async (book: Omit<Book, "id" | "createdAt">) => {
  const docRef = await addDoc(booksRef, {
    ...book,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id };
},


  getBooksByUser: async (userId: string): Promise<Book[]> => {
    const q = query(booksRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Book),
    }));
  },

  updateBook: async (id: string, data: Partial<Book>) => {
    const bookDoc = doc(db, "books", id);
    await updateDoc(bookDoc, data);
  },

 
  deleteBook: async (id: string) => {
    const bookDoc = doc(db, "books", id);
    await deleteDoc(bookDoc);
  },
};
