
// import React, { useEffect, useState } from "react";

// // Mock services and types for demo
// const BookService = {
//   getBooksByUser: async (userId:any) => {
//     // Mock implementation with sample data
//     return [
//       {
//         id: "1",
//         title: "The Midnight Library",
//         author: "Matt Haig",
//         genre: "Fiction",
//         readingStatus: "currently-reading" as ReadingStatus,
//         rating: 4,
//         review: "A thought-provoking exploration of life's infinite possibilities",
//         tags: ["philosophical", "inspiring", "emotional"],
//         description: "A philosophical novel about life choices"
//       },
//       {
//         id: "2", 
//         title: "Atomic Habits",
//         author: "James Clear",
//         genre: "Self-Help",
//         readingStatus: "finished" as ReadingStatus,
//         rating: 5,
//         review: "Life-changing approach to building habits",
//         tags: ["life-changing", "educational", "practical"],
//         description: "Building good habits and breaking bad ones"
//       },
//       {
//         id: "3",
//         title: "Dune",
//         author: "Frank Herbert", 
//         genre: "Sci-Fi",
//         readingStatus: "want-to-read" as ReadingStatus,
//         rating: 0,
//         tags: [],
//         description: "Epic science fiction saga"
//       }
//     ];
//   },

//   updateBook: async (id:any, data:any) => {
//     console.log('Updating book:', id, data);
//     return { id, ...data };
//   },
//   deleteBook: async (id:any) => {
//     console.log('Deleting book:', id);
//     return true;
//   }
// };

// const auth = {
//   currentUser: { uid: "demo-user", email: "reader@example.com" }
// };

// type ReadingStatus = "want-to-read" | "currently-reading" | "finished";

// interface EnhancedBook {
//   id: string;
//   title: string;
//   author: string;
//   genre?: string;
//   coverImage?: string;
//   description?: string;
//   rating?: number;
//   review?: string;
//   tags?: string[];
//   readingStatus?: ReadingStatus;
//   dateStarted?: string;
//   dateFinished?: string;
// }

// const READING_STATUS_OPTIONS = [
//   { value: "want-to-read", label: "📚 Want to Read", color: "bg-purple-500", shortLabel: "📚" },
//   { value: "currently-reading", label: "📖 Currently Reading", color: "bg-cyan-500", shortLabel: "📖" },
//   { value: "finished", label: "✅ Finished", color: "bg-green-500", shortLabel: "✅" }
// ];

// export default function BooksListScreen() {
//   const userId = auth.currentUser?.uid ?? "guest";
//   const [books, setBooks] = useState<EnhancedBook[]>([]);
//   const [filteredBooks, setFilteredBooks] = useState<EnhancedBook[]>([]);
//   const [activeFilter, setActiveFilter] = useState<ReadingStatus | "all">("all");
//   const [searchQuery, setSearchQuery] = useState("");
  
//   // Review Modal States
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [selectedBookForReview, setSelectedBookForReview] = useState<EnhancedBook | null>(null);
//   const [rating, setRating] = useState<number>(0);
//   const [review, setReview] = useState("");
//   const [selectedTags, setSelectedTags] = useState<string[]>([]);

//   const PREDEFINED_TAGS = [
//     "inspiring", "boring", "emotional", "funny", "dark", "romantic", 
//     "thriller", "educational", "life-changing", "page-turner", "slow-paced",
//     "thought-provoking", "heartwarming", "intense", "relaxing", "nostalgic"
//   ];

//   const loadBooks = async () => {
//     try {
//       const data = await BookService.getBooksByUser(userId);
//       setBooks(data);
//       filterBooks(data, activeFilter, searchQuery);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const filterBooks = (bookList: EnhancedBook[], filter: ReadingStatus | "all", search: string) => {
//     let filtered = bookList;
    
//     // Filter by status
//     if (filter !== "all") {
//       filtered = filtered.filter(book => book.readingStatus === filter);
//     }
    
//     // Filter by search query
//     if (search.trim()) {
//       const query = search.toLowerCase();
//       filtered = filtered.filter(book => 
//         book.title.toLowerCase().includes(query) ||
//         book.author.toLowerCase().includes(query) ||
//         (book.genre && book.genre.toLowerCase().includes(query)) ||
//         (book.tags && book.tags.some(tag => tag.toLowerCase().includes(query)))
//       );
//     }
    
//     setFilteredBooks(filtered);
//   };

//   useEffect(() => {
//     loadBooks();
//   }, []);

//   useEffect(() => {
//     filterBooks(books, activeFilter, searchQuery);
//   }, [books, activeFilter, searchQuery]);

//   const handleQuickStatusChange = async (bookId: string, newStatus: ReadingStatus) => {
//     try {
//       const updateData: any = { readingStatus: newStatus };
      
//       if (newStatus === "currently-reading") {
//         updateData.dateStarted = new Date().toISOString();
//       } else if (newStatus === "finished") {
//         updateData.dateFinished = new Date().toISOString();
//       }
      
//       await BookService.updateBook(bookId, updateData);
//       loadBooks();
      
//       const statusLabel = READING_STATUS_OPTIONS.find(s => s.value === newStatus)?.label || newStatus;
//       alert(`Book marked as ${statusLabel}`);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update status");
//     }
//   };

//   const handleDelete = async (id: string, title: string) => {
//     if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
//       try {
//         await BookService.deleteBook(id);
//         loadBooks();
//       } catch (err) {
//         console.error(err);
//         alert("Failed to delete book");
//       }
//     }
//   };

//   const openReviewModal = (book: EnhancedBook) => {
//     setSelectedBookForReview(book);
//     setRating(book.rating || 0);
//     setReview(book.review || "");
//     setSelectedTags(book.tags || []);
//     setShowReviewModal(true);
//   };

//   const saveReview = async () => {
//     if (!selectedBookForReview) return;
    
//     try {
//       await BookService.updateBook(selectedBookForReview.id!, {
//         rating,
//         review,
//         tags: selectedTags
//       });
      
//       setShowReviewModal(false);
//       setSelectedBookForReview(null);
//       loadBooks();
//       alert("Your review has been saved successfully");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save review");
//     }
//   };

//   const renderStars = (currentRating: number, onPress?: (rating: number) => void, size: string = "text-sm") => {
//     return (
//       <div className="flex">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <button
//             key={star}
//             onClick={() => onPress && onPress(star)}
//             disabled={!onPress}
//             className={`${size} mr-0.5 ${onPress ? 'cursor-pointer hover:scale-110' : ''}`}
//           >
//             {star <= currentRating ? "⭐" : "☆"}
//           </button>
//         ))}
//       </div>
//     );
//   };

//   const toggleTag = (tag: string) => {
//     setSelectedTags(prev => 
//       prev.includes(tag) 
//         ? prev.filter(t => t !== tag)
//         : [...prev, tag]
//     );
//   };

//   const getStatusInfo = (status?: ReadingStatus) => {
//     return READING_STATUS_OPTIONS.find(option => option.value === status) || READING_STATUS_OPTIONS[0];
//   };

//   const getBookStats = () => {
//     const stats = {
//       total: books.length,
//       wantToRead: books.filter(book => book.readingStatus === "want-to-read").length,
//       currentlyReading: books.filter(book => book.readingStatus === "currently-reading").length,
//       finished: books.filter(book => book.readingStatus === "finished").length,
//       avgRating: books.filter(book => book.rating && book.rating > 0).reduce((sum, book) => sum + (book.rating || 0), 0) / books.filter(book => book.rating && book.rating > 0).length || 0
//     };
//     return stats;
//   };

//   const renderBookItem = (item: EnhancedBook) => {
//     const statusInfo = getStatusInfo(item.readingStatus);
    
//     return (
//       <div key={item.id} className="bg-white rounded-2xl p-4 mb-4 shadow-lg border border-purple-100">
//         {/* Book Header */}
//         <div className="mb-3">
//           <div className="flex">
//             {item.coverImage ? (
//               <img src={item.coverImage} alt={item.title} className="w-15 h-20 rounded-lg mr-3 object-cover" />
//             ) : (
//               <div className="w-15 h-20 rounded-lg mr-3 bg-purple-100 flex items-center justify-center">
//                 <span className="text-xl">📚</span>
//               </div>
//             )}
            
//             <div className="flex-1">
//               <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
//                 {item.title}
//               </h3>
//               <p className="text-purple-600 font-semibold mb-1 truncate">
//                 by {item.author}
//               </p>
//               {item.genre && (
//                 <p className="text-purple-500 font-medium text-sm mb-1.5 truncate">
//                   {item.genre}
//                 </p>
//               )}
              
//               <div className={`inline-block px-2 py-1 rounded-xl text-xs font-semibold text-white mb-1.5 ${statusInfo.color}`}>
//                 {statusInfo.label}
//               </div>
              
//               {item.rating && item.rating > 0 && (
//                 <div className="flex items-center">
//                   {renderStars(item.rating)}
//                   <span className="ml-2 text-xs text-gray-600 font-medium">({item.rating}/5)</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Tags */}
//         {item.tags && item.tags.length > 0 && (
//           <div className="mb-3">
//             <div className="flex flex-wrap gap-1.5">
//               {item.tags.map(tag => (
//                 <span key={tag} className="bg-purple-50 text-purple-600 px-2 py-1 rounded-xl text-xs font-medium border border-purple-200">
//                   {tag}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Review Preview */}
//         {item.review && (
//           <div className="bg-purple-25 p-3 rounded-lg mb-3 border-l-4 border-purple-400">
//             <p className="text-sm text-gray-600 italic line-clamp-2">
//               "{item.review}"
//             </p>
//           </div>
//         )}

//         {/* Quick Status Actions */}
//         <div className="flex gap-2 mb-3">
//           {READING_STATUS_OPTIONS.map((status) => (
//             <button
//               key={status.value}
//               className={`flex-1 py-2 rounded-lg text-white font-semibold text-sm transition-all ${status.color} ${
//                 item.readingStatus === status.value ? 'opacity-100 scale-105' : 'opacity-70 hover:opacity-90'
//               }`}
//               onClick={() => handleQuickStatusChange(item.id!, status.value as ReadingStatus)}
//             >
//               {status.shortLabel}
//             </button>
//           ))}
//         </div>
        
//         {/* Action Buttons */}
//         <div className="flex gap-2">
//           <button
//             className="flex-2 bg-purple-500 hover:bg-purple-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
//             onClick={() => openReviewModal(item)}
//           >
//             ⭐ Review
//           </button>
          
//           <button
//             className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
//             onClick={() => console.log('Edit book:', item.id)}
//           >
//             ✏️ Edit
//           </button>
          
//           <button
//             className="bg-red-500 hover:bg-red-600 text-white py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors"
//             onClick={() => handleDelete(item.id!, item.title)}
//           >
//             🗑️
//           </button>
//         </div>
//       </div>
//     );
//   };

//   const stats = getBookStats();

//   return (
//     <div className="min-h-screen bg-purple-50 pb-8">
//       {/* Header */}
//       <div className="flex justify-between items-center px-5 pt-5 mb-5">
//         <h1 className="text-3xl font-bold text-purple-800">📖 My Library</h1>
//         <button
//           className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-bold transition-colors"
//           onClick={() => console.log('Add book')}
//         >
//           ➕ Add Book
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div className="flex overflow-x-auto px-5 mb-5 gap-3 pb-2">
//         <div className="bg-white rounded-xl p-4 min-w-20 text-center shadow-sm border border-purple-100">
//           <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
//           <div className="text-xs text-gray-600 mt-1">Total Books</div>
//         </div>
//         <div className="bg-white rounded-xl p-4 min-w-20 text-center shadow-sm border border-purple-100">
//           <div className="text-2xl font-bold text-purple-600">{stats.currentlyReading}</div>
//           <div className="text-xs text-gray-600 mt-1">Currently Reading</div>
//         </div>
//         <div className="bg-white rounded-xl p-4 min-w-20 text-center shadow-sm border border-purple-100">
//           <div className="text-2xl font-bold text-purple-600">{stats.finished}</div>
//           <div className="text-xs text-gray-600 mt-1">Finished</div>
//         </div>
//         <div className="bg-white rounded-xl p-4 min-w-20 text-center shadow-sm border border-purple-100">
//           <div className="text-2xl font-bold text-purple-600">{stats.avgRating.toFixed(1)}</div>
//           <div className="text-xs text-gray-600 mt-1">Avg Rating</div>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="px-5 mb-5">
//         <input
//           className="w-full bg-white border-2 border-purple-200 rounded-xl p-4 text-base text-gray-700 placeholder-purple-400 focus:outline-none focus:border-purple-500"
//           placeholder="Search books, authors, genres, tags..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       {/* Filter Tabs */}
//       <div className="px-5 mb-5">
//         <div className="flex overflow-x-auto pb-2 gap-2">
//           <button
//             className={`px-4 py-2 rounded-full border-2 whitespace-nowrap font-semibold text-sm transition-all ${
//               activeFilter === "all" 
//                 ? 'bg-purple-600 border-purple-600 text-white' 
//                 : 'bg-white border-purple-200 text-purple-600 hover:bg-purple-50'
//             }`}
//             onClick={() => setActiveFilter("all")}
//           >
//             All ({books.length})
//           </button>
          
//           {READING_STATUS_OPTIONS.map((status) => {
//             const count = books.filter(book => book.readingStatus === status.value).length;
//             return (
//               <button
//                 key={status.value}
//                 className={`px-4 py-2 rounded-full border-2 whitespace-nowrap font-semibold text-sm transition-all ${
//                   activeFilter === status.value 
//                     ? `${status.color} border-purple-600 text-white` 
//                     : 'bg-white border-purple-200 text-purple-600 hover:bg-purple-50'
//                 }`}
//                 onClick={() => setActiveFilter(status.value as ReadingStatus)}
//               >
//                 {status.shortLabel} {status.label.split(' ').slice(1).join(' ')} ({count})
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Books List */}
//       <div className="px-5">
//         {filteredBooks.length === 0 ? (
//           <div className="flex flex-col items-center py-16 px-10">
//             <div className="text-6xl mb-4">
//               {searchQuery ? "🔍" : activeFilter === "all" ? "📚" : getStatusInfo(activeFilter as ReadingStatus).shortLabel}
//             </div>
//             <h3 className="text-xl font-semibold text-gray-600 mb-2 text-center">
//               {searchQuery 
//                 ? `No books found for "${searchQuery}"`
//                 : activeFilter === "all" 
//                   ? "No books in your library yet" 
//                   : `No books in ${activeFilter.replace('-', ' ')} list`
//               }
//             </h3>
//             <p className="text-base text-gray-500 text-center mb-6">
//               {searchQuery 
//                 ? "Try a different search term"
//                 : "Add some books to get started!"
//               }
//             </p>
//             {!searchQuery && (
//               <button
//                 className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-3xl font-bold transition-colors"
//                 onClick={() => console.log('Add first book')}
//               >
//                 ➕ Add Your First Book
//               </button>
//             )}
//           </div>
//         ) : (
//           <div>
//             {filteredBooks.map(renderBookItem)}
//           </div>
//         )}
//       </div>

//       {/* Review Modal */}
//       {showReviewModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
//             <h2 className="text-xl font-bold text-purple-600 mb-5 text-center">
//               Review: {selectedBookForReview?.title}
//             </h2>
            
//             <div className="text-center mb-5">
//               <p className="text-base font-semibold text-purple-600 mb-2">Rating</p>
//               {renderStars(rating, setRating, "text-2xl")}
//             </div>

//             <textarea
//               className="w-full border-2 border-purple-200 rounded-xl p-4 text-base text-gray-700 placeholder-purple-400 focus:outline-none focus:border-purple-500 h-30 resize-none mb-5"
//               placeholder="Write your review..."
//               value={review}
//               onChange={(e) => setReview(e.target.value)}
//             />

//             <div className="mb-5">
//               <p className="text-base font-semibold text-purple-600 mb-3">Tags</p>
//               <div className="max-h-30 overflow-y-auto">
//                 <div className="flex flex-wrap gap-2">
//                   {PREDEFINED_TAGS.map(tag => (
//                     <button
//                       key={tag}
//                       className={`px-3 py-1.5 rounded-2xl border-2 text-sm font-medium transition-all ${
//                         selectedTags.includes(tag) 
//                           ? 'bg-purple-600 border-purple-600 text-white' 
//                           : 'bg-white border-purple-200 text-purple-600 hover:bg-purple-50'
//                       }`}
//                       onClick={() => toggleTag(tag)}
//                     >
//                       {tag}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-600 py-3 rounded-xl font-bold transition-colors"
//                 onClick={() => setShowReviewModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold transition-colors"
//                 onClick={saveReview}
//               >
//                 Save Review
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

// Mock services and types for demo
const BookService = {
  getBooksByUser: async (userId: any) => {
    // Mock implementation with sample data
    return [
      {
        id: "1",
        title: "The Midnight Library",
        author: "Matt Haig",
        genre: "Fiction",
        readingStatus: "currently-reading" as ReadingStatus,
        rating: 4,
        description: "A philosophical novel about life choices"
      },
      {
        id: "2", 
        title: "Atomic Habits",
        author: "James Clear",
        genre: "Self-Help",
        readingStatus: "finished" as ReadingStatus,
        rating: 5,
        description: "Building good habits and breaking bad ones"
      },
      {
        id: "3",
        title: "Dune",
        author: "Frank Herbert", 
        genre: "Sci-Fi",
        readingStatus: "want-to-read" as ReadingStatus,
        rating: 0,
        description: "Epic science fiction saga"
      }
    ];
  }
};

const auth = {
  currentUser: { uid: "demo-user", email: "reader@example.com" }
};

type ReadingStatus = "want-to-read" | "currently-reading" | "finished";

interface EnhancedBook {
  id: string;
  title: string;
  author: string;
  genre?: string;
  coverImage?: string;
  description?: string;
  rating?: number;
  review?: string;
  tags?: string[];
  readingStatus?: ReadingStatus;
  dateStarted?: string;
  dateFinished?: string;
}

export default function ForYouScreen() {
  const userId = auth.currentUser?.uid ?? "guest";
  const [books, setBooks] = useState<EnhancedBook[]>([]);
  const [currentlyReading, setCurrentlyReading] = useState<EnhancedBook[]>([]);
  const [recentlyFinished, setRecentlyFinished] = useState<EnhancedBook[]>([]);
  const [wantToRead, setWantToRead] = useState<EnhancedBook[]>([]);

  const loadBooks = async () => {
    try {
      const data = await BookService.getBooksByUser(userId);
      setBooks(data);
      
      // Filter books by status
      setCurrentlyReading(data.filter(book => book.readingStatus === "currently-reading"));
      setRecentlyFinished(data.filter(book => book.readingStatus === "finished").slice(0, 5));
      setWantToRead(data.filter(book => book.readingStatus === "want-to-read").slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getReadingStats = () => {
    const totalBooks = books.length;
    const finishedBooks = books.filter(book => book.readingStatus === "finished").length;
    const currentlyReadingCount = books.filter(book => book.readingStatus === "currently-reading").length;
    const averageRating = books
      .filter(book => book.rating && book.rating > 0)
      .reduce((sum, book) => sum + (book.rating || 0), 0) / 
      books.filter(book => book.rating && book.rating > 0).length || 0;

    return { totalBooks, finishedBooks, currentlyReadingCount, averageRating };
  };

  const renderStars = (rating: number) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <Text key={star} className="text-xs mr-0.5">
            {star <= rating ? "⭐" : "☆"}
          </Text>
        ))}
      </View>
    );
  };

  const renderBookCard = (book: EnhancedBook, isLarge: boolean = false) => (
    <TouchableOpacity 
      key={book.id}
      className={`bg-white rounded-xl p-3 shadow-md border border-purple-100 ${
        isLarge ? 'w-40 mr-5' : 'w-30 mr-4'
      }`}
      onPress={() => console.log('Navigate to book details:', book.id)}
    >
      {book.coverImage ? (
        <View className={`w-full rounded-lg mb-2 bg-purple-100 items-center justify-center ${
          isLarge ? 'h-40' : 'h-30'
        }`}>
          <Text className={isLarge ? 'text-4xl' : 'text-2xl'}>📚</Text>
        </View>
      ) : (
        <View className={`w-full rounded-lg mb-2 bg-purple-100 items-center justify-center ${
          isLarge ? 'h-40' : 'h-30'
        }`}>
          <Text className={isLarge ? 'text-4xl' : 'text-2xl'}>📚</Text>
        </View>
      )}
      <View className={isLarge ? 'pt-1' : ''}>
        <Text className={`font-bold text-gray-800 mb-1 ${
          isLarge ? 'text-base' : 'text-sm'
        }`} numberOfLines={2}>
          {book.title}
        </Text>
        <Text className={`text-purple-600 font-medium mb-1.5 ${
          isLarge ? 'text-sm' : 'text-xs'
        }`} numberOfLines={1}>
          {book.author}
        </Text>
        
        {book.rating && book.rating > 0 && (
          <View className="flex-row justify-start">
            {renderStars(book.rating)}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSection = (title: string, data: EnhancedBook[], viewAllAction?: () => void) => {
    if (data.length === 0) return null;

    return (
      <View className="mb-8">
        <View className="flex-row justify-between items-center px-5 mb-4">
          <Text className="text-2xl font-bold text-gray-700">{title}</Text>
          {viewAllAction && (
            <TouchableOpacity onPress={viewAllAction}>
              <Text className="text-base text-purple-600 font-semibold">View All</Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView horizontal className="pl-5" showsHorizontalScrollIndicator={false}>
          <View className="flex-row pb-2">
            {data.map((item, index) => renderBookCard(item, index === 0 && title === "Continue Reading"))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const stats = getReadingStats();

  return (
    <ScrollView className="flex-1 bg-purple-50">
      {/* Header */}
      <View className="pt-12 px-5 mb-5">
        <Text className="text-3xl font-bold text-purple-800">{getGreeting()}!</Text>
        <Text className="text-gray-500 text-base mt-1">{auth.currentUser?.email || "Reader"}</Text>
      </View>

      {/* Reading Stats */}
      <View className="flex-row px-5 mb-5 gap-3">
        <View className="flex-1 bg-white rounded-xl p-4 items-center shadow-sm border border-purple-100">
          <Text className="text-2xl font-bold text-purple-600">{stats.totalBooks}</Text>
          <Text className="text-xs text-gray-600 mt-1 text-center">Total Books</Text>
        </View>
        <View className="flex-1 bg-white rounded-xl p-4 items-center shadow-sm border border-purple-100">
          <Text className="text-2xl font-bold text-purple-600">{stats.finishedBooks}</Text>
          <Text className="text-xs text-gray-600 mt-1 text-center">Finished</Text>
        </View>
        <View className="flex-1 bg-white rounded-xl p-4 items-center shadow-sm border border-purple-100">
          <Text className="text-2xl font-bold text-purple-600">{stats.currentlyReadingCount}</Text>
          <Text className="text-xs text-gray-600 mt-1 text-center">Reading</Text>
        </View>
        <View className="flex-1 bg-white rounded-xl p-4 items-center shadow-sm border border-purple-100">
          <Text className="text-2xl font-bold text-purple-600">{stats.averageRating.toFixed(1)}</Text>
          <Text className="text-xs text-gray-600 mt-1 text-center">Avg Rating</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="flex-row px-5 mb-8 gap-3">
        <TouchableOpacity 
          className="flex-1 bg-purple-600 rounded-2xl p-5 items-center shadow-lg"
          onPress={() => console.log('Navigate to library')}
        >
          <Text className="text-2xl mb-2">➕</Text>
          <Text className="text-base font-bold text-white">Add Book</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="flex-1 bg-purple-600 rounded-2xl p-5 items-center shadow-lg"
          onPress={() => console.log('Navigate to explore')}
        >
          <Text className="text-2xl mb-2">🔍</Text>
          <Text className="text-base font-bold text-white">Explore</Text>
        </TouchableOpacity>
      </View>

      {/* Continue Reading */}
      {renderSection("Continue Reading", currentlyReading, () => console.log('Navigate to library'))}

      {/* Recently Finished */}
      {renderSection("Recently Finished", recentlyFinished, () => console.log('Navigate to library'))}

      {/* Want to Read */}
      {renderSection("Want to Read", wantToRead, () => console.log('Navigate to library'))}

      {/* Empty State */}
      {books.length === 0 && (
        <View className="items-center px-10 py-16">
          <Text className="text-8xl mb-5">📚</Text>
          <Text className="text-2xl font-bold text-gray-700 mb-3 text-center">
            Welcome to Your Reading Journey!
          </Text>
          <Text className="text-base text-gray-600 text-center leading-6 mb-8">
            Start building your personal library by adding your first book.
          </Text>
          <TouchableOpacity 
            className="bg-purple-600 px-8 py-4 rounded-3xl"
            onPress={() => console.log('Navigate to add book')}
          >
            <Text className="text-white text-lg font-bold">Add Your First Book</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}