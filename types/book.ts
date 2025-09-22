

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
  
  
  rating?: number;       
  review?: string;        
  tags?: string[];        
  dateStarted?: string;   
  dateFinished?: string;  
  dateAdded?: string;     
}