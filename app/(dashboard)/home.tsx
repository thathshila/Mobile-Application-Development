

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
//         description: "A philosophical novel about life choices"
//       },
//       {
//         id: "2", 
//         title: "Atomic Habits",
//         author: "James Clear",
//         genre: "Self-Help",
//         readingStatus: "finished" as ReadingStatus,
//         rating: 5,
//         description: "Building good habits and breaking bad ones"
//       },
//       {
//         id: "3",
//         title: "Dune",
//         author: "Frank Herbert", 
//         genre: "Sci-Fi",
//         readingStatus: "want-to-read" as ReadingStatus,
//         rating: 0,
//         description: "Epic science fiction saga"
//       }
//     ];
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

// export default function ForYouScreen() {
//   const userId = auth.currentUser?.uid ?? "guest";
//   const [books, setBooks] = useState<EnhancedBook[]>([]);
//   const [currentlyReading, setCurrentlyReading] = useState<EnhancedBook[]>([]);
//   const [recentlyFinished, setRecentlyFinished] = useState<EnhancedBook[]>([]);
//   const [wantToRead, setWantToRead] = useState<EnhancedBook[]>([]);

//   const loadBooks = async () => {
//     try {
//       const data = await BookService.getBooksByUser(userId);
//       setBooks(data);
      
//       // Filter books by status
//       setCurrentlyReading(data.filter(book => book.readingStatus === "currently-reading"));
//       setRecentlyFinished(data.filter(book => book.readingStatus === "finished").slice(0, 5));
//       setWantToRead(data.filter(book => book.readingStatus === "want-to-read").slice(0, 5));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     loadBooks();
//   }, []);

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return "Good Morning";
//     if (hour < 17) return "Good Afternoon";
//     return "Good Evening";
//   };

//   const getReadingStats = () => {
//     const totalBooks = books.length;
//     const finishedBooks = books.filter(book => book.readingStatus === "finished").length;
//     const currentlyReadingCount = books.filter(book => book.readingStatus === "currently-reading").length;
//     const averageRating = books
//       .filter(book => book.rating && book.rating > 0)
//       .reduce((sum, book) => sum + (book.rating || 0), 0) / 
//       books.filter(book => book.rating && book.rating > 0).length || 0;

//     return { totalBooks, finishedBooks, currentlyReadingCount, averageRating };
//   };

//   const renderStars = (rating: number) => {
//     return (
//       <div className="flex">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <span key={star} className="text-xs mr-0.5">
//             {star <= rating ? "⭐" : "☆"}
//           </span>
//         ))}
//       </div>
//     );
//   };

//   const renderBookCard = (book: EnhancedBook, isLarge: boolean = false) => (
//     <button 
//       key={book.id}
//       className={`bg-white rounded-xl p-3 shadow-md border border-purple-100 transition-transform hover:scale-105 ${
//         isLarge ? 'w-40 mr-5' : 'w-30 mr-4'
//       }`}
//       onClick={() => console.log('Navigate to book details:', book.id)}
//     >
//       {book.coverImage ? (
//         <img 
//           src={book.coverImage} 
//           alt={book.title} 
//           className={`w-full rounded-lg mb-2 object-cover ${isLarge ? 'h-40' : 'h-30'}`}
//         />
//       ) : (
//         <div className={`w-full rounded-lg mb-2 bg-purple-100 flex items-center justify-center ${
//           isLarge ? 'h-40' : 'h-30'
//         }`}>
//           <span className={isLarge ? 'text-4xl' : 'text-2xl'}>📚</span>
//         </div>
//       )}
//       <div className={isLarge ? 'pt-1' : ''}>
//         <h3 className={`font-bold text-gray-800 mb-1 line-clamp-2 leading-tight ${
//           isLarge ? 'text-base' : 'text-sm'
//         }`}>
//           {book.title}
//         </h3>
//         <p className={`text-purple-600 font-medium mb-1.5 truncate ${
//           isLarge ? 'text-sm' : 'text-xs'
//         }`}>
//           {book.author}
//         </p>
        
//         {book.rating && book.rating > 0 && (
//           <div className="flex justify-start">
//             {renderStars(book.rating)}
//           </div>
//         )}
//       </div>
//     </button>
//   );

//   const renderSection = (title: string, data: EnhancedBook[], viewAllAction?: () => void) => {
//     if (data.length === 0) return null;

//     return (
//       <div className="mb-8">
//         <div className="flex justify-between items-center px-5 mb-4">
//           <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
//           {viewAllAction && (
//             <button onClick={viewAllAction} className="text-base text-purple-600 font-semibold">
//               View All
//             </button>
//           )}
//         </div>
//         <div className="flex overflow-x-auto pl-5 pb-2">
//           {data.map((item, index) => renderBookCard(item, index === 0 && title === "Continue Reading"))}
//         </div>
//       </div>
//     );
//   };

//   const stats = getReadingStats();

//   return (
//     <div className="min-h-screen bg-purple-50">
//       {/* Header */}
//       <div className="pt-12 px-5 mb-5">
//         <h1 className="text-3xl font-bold text-purple-800">{getGreeting()}!</h1>
//         <p className="text-gray-500 text-base mt-1">{auth.currentUser?.email || "Reader"}</p>
//       </div>

//       {/* Reading Stats */}
//       <div className="flex px-5 mb-5 gap-3">
//         <div className="flex-1 bg-white rounded-xl p-4 text-center shadow-sm border border-purple-100">
//           <div className="text-2xl font-bold text-purple-600">{stats.totalBooks}</div>
//           <div className="text-xs text-gray-600 mt-1">Total Books</div>
//         </div>
//         <div className="flex-1 bg-white rounded-xl p-4 text-center shadow-sm border border-purple-100">
//           <div className="text-2xl font-bold text-purple-600">{stats.finishedBooks}</div>
//           <div className="text-xs text-gray-600 mt-1">Finished</div>
//         </div>
//         <div className="flex-1 bg-white rounded-xl p-4 text-center shadow-sm border border-purple-100">
//           <div className="text-2xl font-bold text-purple-600">{stats.currentlyReadingCount}</div>
//           <div className="text-xs text-gray-600 mt-1">Reading</div>
//         </div>
//         <div className="flex-1 bg-white rounded-xl p-4 text-center shadow-sm border border-purple-100">
//           <div className="text-2xl font-bold text-purple-600">{stats.averageRating.toFixed(1)}</div>
//           <div className="text-xs text-gray-600 mt-1">Avg Rating</div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="flex px-5 mb-8 gap-3">
//         <button 
//           className="flex-1 bg-purple-600 rounded-2xl p-5 text-center shadow-lg text-white transition-all hover:bg-purple-700 active:scale-95"
//           onClick={() => console.log('Navigate to library')}
//         >
//           <div className="text-2xl mb-2">➕</div>
//           <div className="text-base font-bold">Add Book</div>
//         </button>
//         <button 
//           className="flex-1 bg-purple-600 rounded-2xl p-5 text-center shadow-lg text-white transition-all hover:bg-purple-700 active:scale-95"
//           onClick={() => console.log('Navigate to explore')}
//         >
//           <div className="text-2xl mb-2">🔍</div>
//           <div className="text-base font-bold">Explore</div>
//         </button>
//       </div>

//       {/* Continue Reading */}
//       {renderSection("Continue Reading", currentlyReading, () => console.log('Navigate to library'))}

//       {/* Recently Finished */}
//       {renderSection("Recently Finished", recentlyFinished, () => console.log('Navigate to library'))}

//       {/* Want to Read */}
//       {renderSection("Want to Read", wantToRead, () => console.log('Navigate to library'))}

//       {/* Empty State */}
//       {books.length === 0 && (
//         <div className="flex flex-col items-center px-10 py-16">
//           <div className="text-8xl mb-5">📚</div>
//           <h2 className="text-2xl font-bold text-gray-700 mb-3 text-center">
//             Welcome to Your Reading Journey!
//           </h2>
//           <p className="text-base text-gray-600 text-center leading-6 mb-8">
//             Start building your personal library by adding your first book.
//           </p>
//           <button 
//             className="bg-purple-600 text-white px-8 py-4 rounded-3xl text-lg font-bold hover:bg-purple-700 transition-colors"
//             onClick={() => console.log('Navigate to add book')}
//           >
//             Add Your First Book
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';

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
        review: "A thought-provoking exploration of life's infinite possibilities",
        tags: ["philosophical", "inspiring", "emotional"],
        description: "A philosophical novel about life choices"
      },
      {
        id: "2", 
        title: "Atomic Habits",
        author: "James Clear",
        genre: "Self-Help",
        readingStatus: "finished" as ReadingStatus,
        rating: 5,
        review: "Life-changing approach to building habits",
        tags: ["life-changing", "educational", "practical"],
        description: "Building good habits and breaking bad ones"
      },
      {
        id: "3",
        title: "Dune",
        author: "Frank Herbert", 
        genre: "Sci-Fi",
        readingStatus: "want-to-read" as ReadingStatus,
        rating: 0,
        tags: [],
        description: "Epic science fiction saga"
      }
    ];
  },

  updateBook: async (id: any, data: any) => {
    console.log('Updating book:', id, data);
    return { id, ...data };
  },
  deleteBook: async (id: any) => {
    console.log('Deleting book:', id);
    return true;
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

const READING_STATUS_OPTIONS = [
  { value: "want-to-read", label: "📚 Want to Read", color: "bg-purple-500", shortLabel: "📚" },
  { value: "currently-reading", label: "📖 Currently Reading", color: "bg-cyan-500", shortLabel: "📖" },
  { value: "finished", label: "✅ Finished", color: "bg-green-500", shortLabel: "✅" }
];

export default function BooksListScreen() {
  const userId = auth.currentUser?.uid ?? "guest";
  const [books, setBooks] = useState<EnhancedBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<EnhancedBook[]>([]);
  const [activeFilter, setActiveFilter] = useState<ReadingStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Review Modal States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookForReview, setSelectedBookForReview] = useState<EnhancedBook | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const PREDEFINED_TAGS = [
    "inspiring", "boring", "emotional", "funny", "dark", "romantic", 
    "thriller", "educational", "life-changing", "page-turner", "slow-paced",
    "thought-provoking", "heartwarming", "intense", "relaxing", "nostalgic"
  ];

  const loadBooks = async () => {
    try {
      const data = await BookService.getBooksByUser(userId);
      setBooks(data);
      filterBooks(data, activeFilter, searchQuery);
    } catch (err) {
      console.error(err);
    }
  };

  const filterBooks = (bookList: EnhancedBook[], filter: ReadingStatus | "all", search: string) => {
    let filtered = bookList;
    
    // Filter by status
    if (filter !== "all") {
      filtered = filtered.filter(book => book.readingStatus === filter);
    }
    
    // Filter by search query
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        (book.genre && book.genre.toLowerCase().includes(query)) ||
        (book.tags && book.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    setFilteredBooks(filtered);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    filterBooks(books, activeFilter, searchQuery);
  }, [books, activeFilter, searchQuery]);

  const handleQuickStatusChange = async (bookId: string, newStatus: ReadingStatus) => {
    try {
      const updateData: any = { readingStatus: newStatus };
      
      if (newStatus === "currently-reading") {
        updateData.dateStarted = new Date().toISOString();
      } else if (newStatus === "finished") {
        updateData.dateFinished = new Date().toISOString();
      }
      
      await BookService.updateBook(bookId, updateData);
      loadBooks();
      
      const statusLabel = READING_STATUS_OPTIONS.find(s => s.value === newStatus)?.label || newStatus;
      Alert.alert("Success", `Book marked as ${statusLabel}`);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update status");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    Alert.alert(
      "Delete Book",
      `Are you sure you want to delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await BookService.deleteBook(id);
              loadBooks();
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to delete book");
            }
          }
        }
      ]
    );
  };

  const openReviewModal = (book: EnhancedBook) => {
    setSelectedBookForReview(book);
    setRating(book.rating || 0);
    setReview(book.review || "");
    setSelectedTags(book.tags || []);
    setShowReviewModal(true);
  };

  const saveReview = async () => {
    if (!selectedBookForReview) return;
    
    try {
      await BookService.updateBook(selectedBookForReview.id!, {
        rating,
        review,
        tags: selectedTags
      });
      
      setShowReviewModal(false);
      setSelectedBookForReview(null);
      loadBooks();
      Alert.alert("Success", "Your review has been saved successfully");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save review");
    }
  };

  const renderStars = (currentRating: number, onPress?: (rating: number) => void, size: string = "text-sm") => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onPress && onPress(star)}
            disabled={!onPress}
          >
            <Text className={`${size} mr-0.5`}>
              {star <= currentRating ? "⭐" : "☆"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getStatusInfo = (status?: ReadingStatus) => {
    return READING_STATUS_OPTIONS.find(option => option.value === status) || READING_STATUS_OPTIONS[0];
  };

  const getBookStats = () => {
    const stats = {
      total: books.length,
      wantToRead: books.filter(book => book.readingStatus === "want-to-read").length,
      currentlyReading: books.filter(book => book.readingStatus === "currently-reading").length,
      finished: books.filter(book => book.readingStatus === "finished").length,
      avgRating: books.filter(book => book.rating && book.rating > 0).reduce((sum, book) => sum + (book.rating || 0), 0) / books.filter(book => book.rating && book.rating > 0).length || 0
    };
    return stats;
  };

  const renderBookItem = (item: EnhancedBook) => {
    const statusInfo = getStatusInfo(item.readingStatus);
    
    return (
      <View key={item.id} className="bg-white rounded-2xl p-4 mb-4 shadow-lg border border-purple-100">
        {/* Book Header */}
        <View className="mb-3">
          <View className="flex-row">
            {item.coverImage ? (
              <View className="w-15 h-20 rounded-lg mr-3 bg-purple-100 items-center justify-center">
                <Text className="text-xl">📚</Text>
              </View>
            ) : (
              <View className="w-15 h-20 rounded-lg mr-3 bg-purple-100 items-center justify-center">
                <Text className="text-xl">📚</Text>
              </View>
            )}
            
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800 mb-1" numberOfLines={2}>
                {item.title}
              </Text>
              <Text className="text-purple-600 font-semibold mb-1" numberOfLines={1}>
                by {item.author}
              </Text>
              {item.genre && (
                <Text className="text-purple-500 font-medium text-sm mb-1.5" numberOfLines={1}>
                  {item.genre}
                </Text>
              )}
              
              <View className={`self-start px-2 py-1 rounded-xl mb-1.5 ${statusInfo.color}`}>
                <Text className="text-xs font-semibold text-white">
                  {statusInfo.label}
                </Text>
              </View>
              
              {item.rating && item.rating > 0 && (
                <View className="flex-row items-center">
                  {renderStars(item.rating)}
                  <Text className="ml-2 text-xs text-gray-600 font-medium">({item.rating}/5)</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <View className="mb-3">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-1.5">
                {item.tags.map(tag => (
                  <View key={tag} className="bg-purple-50 px-2 py-1 rounded-xl border border-purple-200">
                    <Text className="text-purple-600 text-xs font-medium">{tag}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Review Preview */}
        {item.review && (
          <View className="bg-purple-25 p-3 rounded-lg mb-3 border-l-4 border-purple-400">
            <Text className="text-sm text-gray-600 italic" numberOfLines={2}>
              "{item.review}"
            </Text>
          </View>
        )}

        {/* Quick Status Actions */}
        <View className="flex-row gap-2 mb-3">
          {READING_STATUS_OPTIONS.map((status) => (
            <TouchableOpacity
              key={status.value}
              className={`flex-1 py-2 rounded-lg items-center ${status.color} ${
                item.readingStatus === status.value ? 'opacity-100' : 'opacity-70'
              }`}
              onPress={() => handleQuickStatusChange(item.id!, status.value as ReadingStatus)}
            >
              <Text className="text-white font-semibold text-sm">
                {status.shortLabel}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Action Buttons */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="flex-2 bg-purple-500 py-2.5 rounded-lg items-center"
            onPress={() => openReviewModal(item)}
          >
            <Text className="text-white text-sm font-semibold">⭐ Review</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 bg-cyan-500 py-2.5 rounded-lg items-center"
            onPress={() => console.log('Edit book:', item.id)}
          >
            <Text className="text-white text-sm font-semibold">✏️ Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-red-500 py-2.5 px-3 rounded-lg items-center"
            onPress={() => handleDelete(item.id!, item.title)}
          >
            <Text className="text-white text-sm font-semibold">🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const stats = getBookStats();

  return (
    <ScrollView className="flex-1 bg-purple-50">
      <View className="pb-8">
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 pt-5 mb-5">
          <Text className="text-3xl font-bold text-purple-800">📖 My Library</Text>
          <TouchableOpacity
            className="bg-purple-600 px-4 py-2 rounded-full"
            onPress={() => console.log('Add book')}
          >
            <Text className="text-white font-bold">➕ Add Book</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <ScrollView horizontal className="px-5 mb-5" showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3 pb-2">
            <View className="bg-white rounded-xl p-4 min-w-20 items-center shadow-sm border border-purple-100">
              <Text className="text-2xl font-bold text-purple-600">{stats.total}</Text>
              <Text className="text-xs text-gray-600 mt-1 text-center">Total Books</Text>
            </View>
            <View className="bg-white rounded-xl p-4 min-w-20 items-center shadow-sm border border-purple-100">
              <Text className="text-2xl font-bold text-purple-600">{stats.currentlyReading}</Text>
              <Text className="text-xs text-gray-600 mt-1 text-center">Currently Reading</Text>
            </View>
            <View className="bg-white rounded-xl p-4 min-w-20 items-center shadow-sm border border-purple-100">
              <Text className="text-2xl font-bold text-purple-600">{stats.finished}</Text>
              <Text className="text-xs text-gray-600 mt-1 text-center">Finished</Text>
            </View>
            <View className="bg-white rounded-xl p-4 min-w-20 items-center shadow-sm border border-purple-100">
              <Text className="text-2xl font-bold text-purple-600">{stats.avgRating.toFixed(1)}</Text>
              <Text className="text-xs text-gray-600 mt-1 text-center">Avg Rating</Text>
            </View>
          </View>
        </ScrollView>

        {/* Search Bar */}
        <View className="px-5 mb-5">
          <TextInput
            className="w-full bg-white border-2 border-purple-200 rounded-xl p-4 text-base text-gray-700"
            placeholder="Search books, authors, genres, tags..."
            placeholderTextColor="#a855f7"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Tabs */}
        <View className="px-5 mb-5">
          <ScrollView horizontal className="pb-2" showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              <TouchableOpacity
                className={`px-4 py-2 rounded-full border-2 ${
                  activeFilter === "all" 
                    ? 'bg-purple-600 border-purple-600' 
                    : 'bg-white border-purple-200'
                }`}
                onPress={() => setActiveFilter("all")}
              >
                <Text className={`font-semibold text-sm ${
                  activeFilter === "all" ? 'text-white' : 'text-purple-600'
                }`}>
                  All ({books.length})
                </Text>
              </TouchableOpacity>
              
              {READING_STATUS_OPTIONS.map((status) => {
                const count = books.filter(book => book.readingStatus === status.value).length;
                return (
                  <TouchableOpacity
                    key={status.value}
                    className={`px-4 py-2 rounded-full border-2 ${
                      activeFilter === status.value 
                        ? `${status.color} border-purple-600` 
                        : 'bg-white border-purple-200'
                    }`}
                    onPress={() => setActiveFilter(status.value as ReadingStatus)}
                  >
                    <Text className={`font-semibold text-sm ${
                      activeFilter === status.value ? 'text-white' : 'text-purple-600'
                    }`}>
                      {status.shortLabel} {status.label.split(' ').slice(1).join(' ')} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Books List */}
        <View className="px-5">
          {filteredBooks.length === 0 ? (
            <View className="items-center py-16 px-10">
              <Text className="text-6xl mb-4">
                {searchQuery ? "🔍" : activeFilter === "all" ? "📚" : getStatusInfo(activeFilter as ReadingStatus).shortLabel}
              </Text>
              <Text className="text-xl font-semibold text-gray-600 mb-2 text-center">
                {searchQuery 
                  ? `No books found for "${searchQuery}"`
                  : activeFilter === "all" 
                    ? "No books in your library yet" 
                    : `No books in ${activeFilter.replace('-', ' ')} list`
                }
              </Text>
              <Text className="text-base text-gray-500 text-center mb-6">
                {searchQuery 
                  ? "Try a different search term"
                  : "Add some books to get started!"
                }
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  className="bg-purple-600 px-6 py-3 rounded-3xl"
                  onPress={() => console.log('Add first book')}
                >
                  <Text className="text-white font-bold">➕ Add Your First Book</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View>
              {filteredBooks.map(renderBookItem)}
            </View>
          )}
        </View>

        {/* Review Modal */}
        <Modal
          visible={showReviewModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowReviewModal(false)}
        >
          <View className="flex-1 bg-black/50 items-center justify-center p-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh]">
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-xl font-bold text-purple-600 mb-5 text-center">
                  Review: {selectedBookForReview?.title}
                </Text>
                
                <View className="items-center mb-5">
                  <Text className="text-base font-semibold text-purple-600 mb-2">Rating</Text>
                  {renderStars(rating, setRating, "text-2xl")}
                </View>

                <TextInput
                  className="w-full border-2 border-purple-200 rounded-xl p-4 text-base text-gray-700 mb-5"
                  placeholder="Write your review..."
                  placeholderTextColor="#a855f7"
                  value={review}
                  onChangeText={setReview}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <View className="mb-5">
                  <Text className="text-base font-semibold text-purple-600 mb-3">Tags</Text>
                  <ScrollView className="max-h-30" showsVerticalScrollIndicator={false}>
                    <View className="flex-row flex-wrap gap-2">
                      {PREDEFINED_TAGS.map(tag => (
                        <TouchableOpacity
                          key={tag}
                          className={`px-3 py-1.5 rounded-2xl border-2 ${
                            selectedTags.includes(tag) 
                              ? 'bg-purple-600 border-purple-600' 
                              : 'bg-white border-purple-200'
                          }`}
                          onPress={() => toggleTag(tag)}
                        >
                          <Text className={`text-sm font-medium ${
                            selectedTags.includes(tag) ? 'text-white' : 'text-purple-600'
                          }`}>
                            {tag}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className="flex-1 bg-gray-200 py-3 rounded-xl items-center"
                    onPress={() => setShowReviewModal(false)}
                  >
                    <Text className="text-gray-600 font-bold">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-purple-600 py-3 rounded-xl items-center"
                    onPress={saveReview}
                  >
                    <Text className="text-white font-bold">Save Review</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}