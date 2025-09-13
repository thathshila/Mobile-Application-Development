// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   Dimensions,
// } from "react-native";
// import { BookService } from "@/service/bookService";
// import { Book } from "@/types/book";
// import { auth } from "@/firebase";
// import { useRouter } from "expo-router";

// type ReadingStatus = "want-to-read" | "currently-reading" | "finished";

// interface EnhancedBook extends Book {
//   coverImage?: string;
//   description?: string;
//   rating?: number;
//   review?: string;
//   tags?: string[];
//   readingStatus?: ReadingStatus;
//   dateStarted?: string;
//   dateFinished?: string;
// }

// const { width } = Dimensions.get('window');

// export default function ForYouScreen() {
//   const router = useRouter();
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
//       <View style={styles.starsContainer}>
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Text key={star} style={styles.star}>
//             {star <= rating ? "⭐" : "☆"}
//           </Text>
//         ))}
//       </View>
//     );
//   };

//   const renderBookCard = (book: EnhancedBook, isLarge: boolean = false) => (
//     <TouchableOpacity 
//       style={[styles.bookCard, isLarge && styles.largeBookCard]}
//       onPress={() => router.push(`/books/details/${book.id}`)}
//     >
//       {book.coverImage ? (
//         <Image 
//           source={{ uri: book.coverImage }} 
//           style={[styles.bookCover, isLarge && styles.largeCover]} 
//         />
//       ) : (
//         <View style={[styles.placeholderCover, isLarge && styles.largePlaceholder]}>
//           <Text style={[styles.placeholderText, isLarge && styles.largePlaceholderText]}>📚</Text>
//         </View>
//       )}
//       <View style={[styles.bookInfo, isLarge && styles.largeBookInfo]}>
//         <Text style={[styles.bookTitle, isLarge && styles.largeTitle]} numberOfLines={2}>
//           {book.title}
//         </Text>
//         <Text style={[styles.bookAuthor, isLarge && styles.largeAuthor]} numberOfLines={1}>
//           {book.author}
//         </Text>
//         {book.rating && book.rating > 0 && (
//           <View style={styles.ratingContainer}>
//             {renderStars(book.rating)}
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   );

//   const renderSection = (title: string, data: EnhancedBook[], viewAllAction?: () => void) => {
//     if (data.length === 0) return null;

//     return (
//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>{title}</Text>
//           {viewAllAction && (
//             <TouchableOpacity onPress={viewAllAction}>
//               <Text style={styles.viewAllText}>View All</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//         <FlatList
//           data={data}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           keyExtractor={(item) => item.id!}
//           renderItem={({ item, index }) => renderBookCard(item, index === 0 && title === "Continue Reading")}
//           contentContainerStyle={styles.horizontalList}
//         />
//       </View>
//     );
//   };

//   const stats = getReadingStats();

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.greeting}>{getGreeting()}!</Text>
//         <Text style={styles.username}>{auth.currentUser?.email || "Reader"}</Text>
//       </View>

//       {/* Reading Stats */}
//       <View style={styles.statsContainer}>
//         <View style={styles.statCard}>
//           <Text style={styles.statNumber}>{stats.totalBooks}</Text>
//           <Text style={styles.statLabel}>Total Books</Text>
//         </View>
//         <View style={styles.statCard}>
//           <Text style={styles.statNumber}>{stats.finishedBooks}</Text>
//           <Text style={styles.statLabel}>Finished</Text>
//         </View>
//         <View style={styles.statCard}>
//           <Text style={styles.statNumber}>{stats.currentlyReadingCount}</Text>
//           <Text style={styles.statLabel}>Reading</Text>
//         </View>
//         <View style={styles.statCard}>
//           <Text style={styles.statNumber}>{stats.averageRating.toFixed(1)}</Text>
//           <Text style={styles.statLabel}>Avg Rating</Text>
//         </View>
//       </View>

//       {/* Quick Actions */}
//       <View style={styles.quickActions}>
//         <TouchableOpacity 
//           style={styles.actionButton}
//           onPress={() => router.push('/library')}
//         >
//           <Text style={styles.actionIcon}>➕</Text>
//           <Text style={styles.actionText}>Add Book</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.actionButton}
//           onPress={() => router.push('/explore')}
//         >
//           <Text style={styles.actionIcon}>🔍</Text>
//           <Text style={styles.actionText}>Explore</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Continue Reading */}
//       {renderSection("Continue Reading", currentlyReading, () => router.push('/library'))}

//       {/* Recently Finished */}
//       {renderSection("Recently Finished", recentlyFinished, () => router.push('/library'))}

//       {/* Want to Read */}
//       {renderSection("Want to Read", wantToRead, () => router.push('/library'))}

//       {/* Empty State */}
//       {books.length === 0 && (
//         <View style={styles.emptyState}>
//           <Text style={styles.emptyStateIcon}>📚</Text>
//           <Text style={styles.emptyStateTitle}>Welcome to Your Reading Journey!</Text>
//           <Text style={styles.emptyStateText}>
//             Start building your personal library by adding your first book.
//           </Text>
//           <TouchableOpacity 
//             style={styles.emptyStateButton}
//             onPress={() => router.push('/library')}
//           >
//             <Text style={styles.emptyStateButtonText}>Add Your First Book</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F3E8FF",
//   },
//   header: {
//     padding: 20,
//     paddingTop: 50,
//   },
//   greeting: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#6B21A8",
//   },
//   username: {
//     fontSize: 16,
//     color: "#9CA3AF",
//     marginTop: 4,
//   },
  
//   // Stats
//   statsContainer: {
//     flexDirection: "row",
//     paddingHorizontal: 20,
//     marginBottom: 20,
//     gap: 12,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     padding: 16,
//     alignItems: "center",
//     shadowColor: "#6B21A8",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#7C3AED",
//   },
//   statLabel: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginTop: 4,
//     textAlign: "center",
//   },

//   // Quick Actions
//   quickActions: {
//     flexDirection: "row",
//     paddingHorizontal: 20,
//     marginBottom: 30,
//     gap: 12,
//   },
//   actionButton: {
//     flex: 1,
//     backgroundColor: "#7C3AED",
//     borderRadius: 16,
//     padding: 20,
//     alignItems: "center",
//     shadowColor: "#7C3AED",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   actionIcon: {
//     fontSize: 24,
//     marginBottom: 8,
//   },
//   actionText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },

//   // Sections
//   section: {
//     marginBottom: 30,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#374151",
//   },
//   viewAllText: {
//     fontSize: 16,
//     color: "#7C3AED",
//     fontWeight: "600",
//   },
//   horizontalList: {
//     paddingLeft: 20,
//     paddingRight: 20,
//   },

//   // Book Cards
//   bookCard: {
//     width: 120,
//     marginRight: 16,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     padding: 12,
//     shadowColor: "#6B21A8",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   largeBookCard: {
//     width: 160,
//     marginRight: 20,
//   },
//   bookCover: {
//     width: "100%",
//     height: 120,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   largeCover: {
//     height: 160,
//   },
//   placeholderCover: {
//     width: "100%",
//     height: 120,
//     borderRadius: 8,
//     backgroundColor: "#E9D5FF",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   largePlaceholder: {
//     height: 160,
//   },
//   placeholderText: {
//     fontSize: 32,
//   },
//   largePlaceholderText: {
//     fontSize: 42,
//   },
//   bookInfo: {
//     flex: 1,
//   },
//   largeBookInfo: {
//     paddingTop: 4,
//   },
//   bookTitle: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#1F2937",
//     marginBottom: 4,
//     lineHeight: 18,
//   },
//   largeTitle: {
//     fontSize: 16,
//     lineHeight: 20,
//   },
//   bookAuthor: {
//     fontSize: 12,
//     color: "#7C3AED",
//     fontWeight: "500",
//     marginBottom: 6,
//   },
//   largeAuthor: {
//     fontSize: 14,
//   },
//   ratingContainer: {
//     alignItems: "flex-start",
//   },
//   starsContainer: {
//     flexDirection: "row",
//   },
//   star: {
//     fontSize: 12,
//     marginRight: 2,
//   },

//   // Empty State
//   emptyState: {
//     alignItems: "center",
//     paddingHorizontal: 40,
//     paddingVertical: 60,
//   },
//   emptyStateIcon: {
//     fontSize: 80,
//     marginBottom: 20,
//   },
//   emptyStateTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#374151",
//     marginBottom: 12,
//     textAlign: "center",
//   },
//   emptyStateText: {
//     fontSize: 16,
//     color: "#6B7280",
//     textAlign: "center",
//     lineHeight: 24,
//     marginBottom: 30,
//   },
//   emptyStateButton: {
//     backgroundColor: "#7C3AED",
//     paddingHorizontal: 32,
//     paddingVertical: 16,
//     borderRadius: 24,
//   },
//   emptyStateButtonText: {
//     color: "#FFFFFF",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });


import React, { useEffect, useState } from "react";

// Mock services and types for demo
const BookService = {
  getBooksByUser: async (userId:any) => {
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
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-xs mr-0.5">
            {star <= rating ? "⭐" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  const renderBookCard = (book: EnhancedBook, isLarge: boolean = false) => (
    <button 
      key={book.id}
      className={`bg-white rounded-xl p-3 shadow-md border border-purple-100 transition-transform hover:scale-105 ${
        isLarge ? 'w-40 mr-5' : 'w-30 mr-4'
      }`}
      onClick={() => console.log('Navigate to book details:', book.id)}
    >
      {book.coverImage ? (
        <img 
          src={book.coverImage} 
          alt={book.title} 
          className={`w-full rounded-lg mb-2 object-cover ${isLarge ? 'h-40' : 'h-30'}`}
        />
      ) : (
        <div className={`w-full rounded-lg mb-2 bg-purple-100 flex items-center justify-center ${
          isLarge ? 'h-40' : 'h-30'
        }`}>
          <span className={isLarge ? 'text-4xl' : 'text-2xl'}>📚</span>
        </div>
      )}
      <div className={isLarge ? 'pt-1' : ''}>
        <h3 className={`font-bold text-gray-800 mb-1 line-clamp-2 leading-tight ${
          isLarge ? 'text-base' : 'text-sm'
        }`}>
          {book.title}
        </h3>
        <p className={`text-purple-600 font-medium mb-1.5 truncate ${
          isLarge ? 'text-sm' : 'text-xs'
        }`}>
          {book.author}
        </p>
        
        {book.rating && book.rating > 0 && (
          <div className="flex justify-start">
            {renderStars(book.rating)}
          </div>
        )}
      </div>
    </button>
  );

  const renderSection = (title: string, data: EnhancedBook[], viewAllAction?: () => void) => {
    if (data.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center px-5 mb-4">
          <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
          {viewAllAction && (
            <button onClick={viewAllAction} className="text-base text-purple-600 font-semibold">
              View All
            </button>
          )}
        </div>
        <div className="flex overflow-x-auto pl-5 pb-2">
          {data.map((item, index) => renderBookCard(item, index === 0 && title === "Continue Reading"))}
        </div>
      </div>
    );
  };

  const stats = getReadingStats();

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <div className="pt-12 px-5 mb-5">
        <h1 className="text-3xl font-bold text-purple-800">{getGreeting()}!</h1>
        <p className="text-gray-500 text-base mt-1">{auth.currentUser?.email || "Reader"}</p>
      </div>

      {/* Reading Stats */}
      <div className="flex px-5 mb-5 gap-3">
        <div className="flex-1 bg-white rounded-xl p-4 text-center shadow-sm border border-purple-100">
          <div className="text-2xl font-bold text-purple-600">{stats.totalBooks}</div>
          <div className="text-xs text-gray-600 mt-1">Total Books</div>
        </div>
        <div className="flex-1 bg-white rounded-xl p-4 text-center shadow-sm border border-purple-100">
          <div className="text-2xl font-bold text-purple-600">{stats.finishedBooks}</div>
          <div className="text-xs text-gray-600 mt-1">Finished</div>
        </div>
        <div className="flex-1 bg-white rounded-xl p-4 text-center shadow-sm border border-purple-100">
          <div className="text-2xl font-bold text-purple-600">{stats.currentlyReadingCount}</div>
          <div className="text-xs text-gray-600 mt-1">Reading</div>
        </div>
        <div className="flex-1 bg-white rounded-xl p-4 text-center shadow-sm border border-purple-100">
          <div className="text-2xl font-bold text-purple-600">{stats.averageRating.toFixed(1)}</div>
          <div className="text-xs text-gray-600 mt-1">Avg Rating</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex px-5 mb-8 gap-3">
        <button 
          className="flex-1 bg-purple-600 rounded-2xl p-5 text-center shadow-lg text-white transition-all hover:bg-purple-700 active:scale-95"
          onClick={() => console.log('Navigate to library')}
        >
          <div className="text-2xl mb-2">➕</div>
          <div className="text-base font-bold">Add Book</div>
        </button>
        <button 
          className="flex-1 bg-purple-600 rounded-2xl p-5 text-center shadow-lg text-white transition-all hover:bg-purple-700 active:scale-95"
          onClick={() => console.log('Navigate to explore')}
        >
          <div className="text-2xl mb-2">🔍</div>
          <div className="text-base font-bold">Explore</div>
        </button>
      </div>

      {/* Continue Reading */}
      {renderSection("Continue Reading", currentlyReading, () => console.log('Navigate to library'))}

      {/* Recently Finished */}
      {renderSection("Recently Finished", recentlyFinished, () => console.log('Navigate to library'))}

      {/* Want to Read */}
      {renderSection("Want to Read", wantToRead, () => console.log('Navigate to library'))}

      {/* Empty State */}
      {books.length === 0 && (
        <div className="flex flex-col items-center px-10 py-16">
          <div className="text-8xl mb-5">📚</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-3 text-center">
            Welcome to Your Reading Journey!
          </h2>
          <p className="text-base text-gray-600 text-center leading-6 mb-8">
            Start building your personal library by adding your first book.
          </p>
          <button 
            className="bg-purple-600 text-white px-8 py-4 rounded-3xl text-lg font-bold hover:bg-purple-700 transition-colors"
            onClick={() => console.log('Navigate to add book')}
          >
            Add Your First Book
          </button>
        </div>
      )}
    </div>
  );
}