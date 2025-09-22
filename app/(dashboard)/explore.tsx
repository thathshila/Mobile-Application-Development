




// import React, { useState, useEffect } from "react";
// import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';

// // Mock services and types for demo
// const BookService = {
//   getBooksByUser: async (userId: any) => {
//     // Mock implementation
//     return [];
//   },
//   addBook: async (bookData: any) => {
//     console.log('Adding book:', bookData);
//     return { id: Date.now().toString(), ...bookData };
//   }
// };

// const auth = {
//   currentUser: { uid: "demo-user", email: "reader@example.com" }
// };

// type ReadingStatus = "want-to-read" | "currently-reading" | "finished";

// interface ExploreBook {
//   id: string;
//   title: string;
//   author: string;
//   genre?: string;
//   description?: string;
//   coverImage?: string;
//   rating?: number;
//   publicRating?: number;
//   isInLibrary?: boolean;
//   readingStatus?: ReadingStatus;
// }

// const POPULAR_GENRES = [
//   "Fiction", "Non-Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", 
//   "Biography", "History", "Self-Help", "Business", "Horror", "Thriller"
// ];

// const SAMPLE_BOOKS: ExploreBook[] = [
//   {
//     id: "sample1",
//     title: "The Midnight Library",
//     author: "Matt Haig",
//     genre: "Fiction",
//     description: "Between life and death there is a library, and within that library, the shelves go on forever.",
//     publicRating: 4.2,
//   },
//   {
//     id: "sample2",
//     title: "Atomic Habits",
//     author: "James Clear",
//     genre: "Self-Help",
//     description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
//     publicRating: 4.7,
//   },
//   {
//     id: "sample3",
//     title: "Project Hail Mary",
//     author: "Andy Weir",
//     genre: "Sci-Fi",
//     description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller.",
//     publicRating: 4.5,
//   },
//   {
//     id: "sample4",
//     title: "The Seven Husbands of Evelyn Hugo",
//     author: "Taylor Jenkins Reid",
//     genre: "Fiction",
//     description: "A reclusive Hollywood icon finally tells her story to a young journalist.",
//     publicRating: 4.6,
//   },
//   {
//     id: "sample5",
//     title: "Educated",
//     author: "Tara Westover",
//     genre: "Biography",
//     description: "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge.",
//     publicRating: 4.4,
//   }
// ];

// export default function ExploreScreen() {
//   const userId = auth.currentUser?.uid ?? "guest";
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
//   const [exploreBooks, setExploreBooks] = useState<ExploreBook[]>(SAMPLE_BOOKS);
//   const [filteredBooks, setFilteredBooks] = useState<ExploreBook[]>(SAMPLE_BOOKS);
//   const [myBooks, setMyBooks] = useState<any[]>([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [selectedBook, setSelectedBook] = useState<ExploreBook | null>(null);
//   const [selectedStatus, setSelectedStatus] = useState<ReadingStatus>("want-to-read");

//   const READING_STATUS_OPTIONS = [
//     { value: "want-to-read", label: "Want to Read", color: "bg-purple-500", icon: "📚" },
//     { value: "currently-reading", label: "Currently Reading", color: "bg-cyan-500", icon: "📖" },
//     { value: "finished", label: "Finished", color: "bg-green-500", icon: "✅" }
//   ];

//   const loadMyBooks = async () => {
//     try {
//       const data = await BookService.getBooksByUser(userId);
//       setMyBooks(data);
//       updateExploreBooks(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateExploreBooks = (userBooks: any[]) => {
//     const updatedBooks = exploreBooks.map(book => ({
//       ...book,
//       isInLibrary: userBooks.some(userBook => 
//         userBook.title.toLowerCase() === book.title.toLowerCase() && 
//         userBook.author.toLowerCase() === book.author.toLowerCase()
//       )
//     }));
//     setExploreBooks(updatedBooks);
//     filterBooks(updatedBooks, searchQuery, selectedGenre);
//   };

//   const filterBooks = (books: ExploreBook[], query: string, genre: string | null) => {
//     let filtered = books;

//     if (genre) {
//       filtered = filtered.filter(book => book.genre === genre);
//     }

//     if (query.trim()) {
//       const searchTerm = query.toLowerCase();
//       filtered = filtered.filter(book =>
//         book.title.toLowerCase().includes(searchTerm) ||
//         book.author.toLowerCase().includes(searchTerm) ||
//         (book.genre && book.genre.toLowerCase().includes(searchTerm))
//       );
//     }

//     setFilteredBooks(filtered);
//   };

//   useEffect(() => {
//     loadMyBooks();
//   }, []);

//   useEffect(() => {
//     filterBooks(exploreBooks, searchQuery, selectedGenre);
//   }, [searchQuery, selectedGenre]);

//   const handleAddToLibrary = (book: ExploreBook) => {
//     setSelectedBook(book);
//     setShowAddModal(true);
//   };

//   const confirmAddBook = async () => {
//     if (!selectedBook) return;

//     try {
//       const bookData = {
//         title: selectedBook.title,
//         author: selectedBook.author,
//         genre: selectedBook.genre || "",
//         description: selectedBook.description || "",
//         notes: "",
//         readingStatus: selectedStatus,
//         userId
//       };

//       await BookService.addBook(bookData);
//       setShowAddModal(false);
//       setSelectedBook(null);
//       Alert.alert("Success", `"${selectedBook.title}" has been added to your library!`);
//       loadMyBooks(); // Refresh to update isInLibrary status
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to add book to library");
//     }
//   };

//   const renderStars = (rating: number) => {
//     return (
//       <View className="flex-row">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Text key={star} className="text-sm mr-0.5">
//             {star <= rating ? "⭐" : "☆"}
//           </Text>
//         ))}
//       </View>
//     );
//   };

//   const renderGenreChip = (genre: string) => (
//     <TouchableOpacity
//       key={genre}
//       className={`px-4 py-2 rounded-full border-2 mr-2 ${
//         selectedGenre === genre 
//           ? 'bg-purple-600 border-purple-600' 
//           : 'bg-white border-purple-200'
//       }`}
//       onPress={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
//     >
//       <Text className={`font-semibold text-sm ${
//         selectedGenre === genre ? 'text-white' : 'text-purple-600'
//       }`}>
//         {genre}
//       </Text>
//     </TouchableOpacity>
//   );

//   const renderBookItem = (item: ExploreBook) => (
//     <View key={item.id} className="bg-white rounded-2xl p-4 mb-4 shadow-lg border border-purple-100">
//       <View className="flex-row mb-3">
//         {item.coverImage ? (
//           <View className="w-20 h-30 rounded-lg mr-4 bg-purple-100 items-center justify-center">
//             <Text className="text-2xl">📚</Text>
//           </View>
//         ) : (
//           <View className="w-20 h-30 rounded-lg mr-4 bg-purple-100 items-center justify-center">
//             <Text className="text-2xl">📚</Text>
//           </View>
//         )}
        
//         <View className="flex-1">
//           <Text className="text-lg font-bold text-gray-800 mb-1" numberOfLines={2}>
//             {item.title}
//           </Text>
//           <Text className="text-purple-600 font-semibold mb-1" numberOfLines={1}>
//             by {item.author}
//           </Text>
//           {item.genre && (
//             <Text className="text-purple-500 font-medium text-sm mb-2" numberOfLines={1}>
//               {item.genre}
//             </Text>
//           )}
          
//           {item.publicRating && (
//             <View className="flex-row items-center mb-2">
//               {renderStars(item.publicRating)}
//               <Text className="ml-2 text-sm text-gray-600 font-medium">({item.publicRating}/5)</Text>
//             </View>
//           )}
          
//           {item.description && (
//             <Text className="text-gray-600 text-sm leading-5" numberOfLines={3}>
//               {item.description}
//             </Text>
//           )}
//         </View>
//       </View>
      
//       <View className="flex-row justify-end">
//         {item.isInLibrary ? (
//           <View className="bg-green-500 px-4 py-2 rounded-full">
//             <Text className="text-white text-sm font-bold">✓ In Library</Text>
//           </View>
//         ) : (
//           <TouchableOpacity
//             className="bg-purple-600 px-5 py-2 rounded-full"
//             onPress={() => handleAddToLibrary(item)}
//           >
//             <Text className="text-white text-sm font-bold">+ Add to Library</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView className="flex-1 bg-purple-50">
//       <View className="pb-8">
//         {/* Header */}
//         <View className="pt-12 px-5 mb-5">
//           <Text className="text-3xl font-bold text-purple-800">🔍 Explore Books</Text>
//           <Text className="text-gray-500 text-base mt-1">Discover your next great read</Text>
//         </View>

//         {/* Search Bar */}
//         <View className="px-5 mb-5">
//           <TextInput
//             className="w-full bg-white border-2 border-purple-200 rounded-xl p-4 text-base text-gray-700"
//             placeholder="Search books, authors..."
//             placeholderTextColor="#a855f7"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>

//         {/* Genre Filter */}
//         <View className="mb-5">
//           <Text className="text-lg font-bold text-gray-700 px-5 mb-3">Genres</Text>
//           <ScrollView horizontal className="pl-5" showsHorizontalScrollIndicator={false}>
//             <View className="flex-row pb-2">
//               {POPULAR_GENRES.map(renderGenreChip)}
//             </View>
//           </ScrollView>
//         </View>

//         {/* Results Count */}
//         <View className="flex-row justify-between items-center px-5 mb-4">
//           <Text className="text-base text-gray-600 font-medium">
//             {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
//             {selectedGenre && ` in ${selectedGenre}`}
//           </Text>
//           {selectedGenre && (
//             <TouchableOpacity onPress={() => setSelectedGenre(null)}>
//               <Text className="text-sm text-purple-600 font-semibold">Clear Filter</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Books List */}
//         <View className="px-5">
//           {filteredBooks.length === 0 ? (
//             <View className="items-center justify-center py-16 px-10">
//               <Text className="text-6xl mb-4">🔍</Text>
//               <Text className="text-xl font-semibold text-gray-600 mb-2 text-center">No books found</Text>
//               <Text className="text-base text-gray-500 text-center">
//                 Try adjusting your search or filters
//               </Text>
//             </View>
//           ) : (
//             <View>
//               {filteredBooks.map(renderBookItem)}
//             </View>
//           )}
//         </View>

//         {/* Add to Library Modal */}
//         <Modal
//           visible={showAddModal}
//           transparent={true}
//           animationType="fade"
//           onRequestClose={() => setShowAddModal(false)}
//         >
//           <View className="flex-1 bg-black/50 items-center justify-center p-4">
//             <View className="bg-white rounded-2xl p-6 w-full max-w-md">
//               <Text className="text-2xl font-bold text-purple-600 mb-4 text-center">Add to Library</Text>
              
//               {selectedBook && (
//                 <View className="items-center mb-5 pb-4 border-b border-gray-200">
//                   <Text className="text-lg font-bold text-gray-800 mb-1">{selectedBook.title}</Text>
//                   <Text className="text-base text-purple-600 font-medium">by {selectedBook.author}</Text>
//                 </View>
//               )}
              
//               <Text className="text-base font-semibold text-gray-700 mb-3">Choose reading status:</Text>
              
//               {READING_STATUS_OPTIONS.map((option) => (
//                 <TouchableOpacity
//                   key={option.value}
//                   className={`w-full flex-row items-center p-4 rounded-xl border-2 mb-2 ${
//                     selectedStatus === option.value 
//                       ? `${option.color} border-purple-600` 
//                       : 'border-gray-200 bg-white'
//                   }`}
//                   onPress={() => setSelectedStatus(option.value as ReadingStatus)}
//                 >
//                   <Text className="text-xl mr-3">{option.icon}</Text>
//                   <Text className={`text-base font-medium ${
//                     selectedStatus === option.value ? 'text-white' : 'text-gray-700'
//                   }`}>
//                     {option.label}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
              
//               <View className="flex-row gap-3 mt-5">
//                 <TouchableOpacity
//                   className="flex-1 bg-gray-200 py-3 rounded-xl items-center"
//                   onPress={() => setShowAddModal(false)}
//                 >
//                   <Text className="text-gray-600 text-base font-bold">Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   className="flex-1 bg-purple-600 py-3 rounded-xl items-center"
//                   onPress={confirmAddBook}
//                 >
//                   <Text className="text-white text-base font-bold">Add Book</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </ScrollView>
//   );
// }




// import React, { useState, useEffect } from "react";
// import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
// import { router } from "expo-router";

// // Mock services and types for demo
// const BookService = {
//   getBooksByUser: async (userId: any) => {
//     // Mock implementation
//     return [];
//   },
//   addBook: async (bookData: any) => {
//     console.log('Adding book:', bookData);
//     return { id: Date.now().toString(), ...bookData };
//   }
// };

// const auth = {
//   currentUser: { uid: "demo-user", email: "reader@example.com" }
// };

// type ReadingStatus = "want-to-read" | "currently-reading" | "finished";

// interface ExploreBook {
//   id: string;
//   title: string;
//   author: string;
//   genre?: string;
//   description?: string;
//   coverImage?: string;
//   rating?: number;
//   publicRating?: number;
//   isInLibrary?: boolean;
//   readingStatus?: ReadingStatus;
// }

// const POPULAR_GENRES = [
//   "Fiction", "Non-Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", 
//   "Biography", "History", "Self-Help", "Business", "Horror", "Thriller"
// ];

// const SAMPLE_BOOKS: ExploreBook[] = [
//   {
//     id: "sample1",
//     title: "The Midnight Library",
//     author: "Matt Haig",
//     genre: "Fiction",
//     description: "Between life and death there is a library, and within that library, the shelves go on forever.",
//     publicRating: 4.2,
//   },
//   {
//     id: "sample2",
//     title: "Atomic Habits",
//     author: "James Clear",
//     genre: "Self-Help",
//     description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
//     publicRating: 4.7,
//   },
//   {
//     id: "sample3",
//     title: "Project Hail Mary",
//     author: "Andy Weir",
//     genre: "Sci-Fi",
//     description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller.",
//     publicRating: 4.5,
//   },
//   {
//     id: "sample4",
//     title: "The Seven Husbands of Evelyn Hugo",
//     author: "Taylor Jenkins Reid",
//     genre: "Fiction",
//     description: "A reclusive Hollywood icon finally tells her story to a young journalist.",
//     publicRating: 4.6,
//   },
//   {
//     id: "sample5",
//     title: "Educated",
//     author: "Tara Westover",
//     genre: "Biography",
//     description: "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge.",
//     publicRating: 4.4,
//   }
// ];

// export default function ExploreScreen() {
//   const userId = auth.currentUser?.uid ?? "guest";
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
//   const [exploreBooks, setExploreBooks] = useState<ExploreBook[]>(SAMPLE_BOOKS);
//   const [filteredBooks, setFilteredBooks] = useState<ExploreBook[]>(SAMPLE_BOOKS);
//   const [myBooks, setMyBooks] = useState<any[]>([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [selectedBook, setSelectedBook] = useState<ExploreBook | null>(null);
//   const [selectedStatus, setSelectedStatus] = useState<ReadingStatus>("want-to-read");

//   const READING_STATUS_OPTIONS = [
//     { value: "want-to-read", label: "Want to Read", color: "bg-purple-500", icon: "📚" },
//     { value: "currently-reading", label: "Currently Reading", color: "bg-cyan-500", icon: "📖" },
//     { value: "finished", label: "Finished", color: "bg-green-500", icon: "✅" }
//   ];

//   const loadMyBooks = async () => {
//     try {
//       const data = await BookService.getBooksByUser(userId);
//       setMyBooks(data);
//       updateExploreBooks(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateExploreBooks = (userBooks: any[]) => {
//     const updatedBooks = exploreBooks.map(book => ({
//       ...book,
//       isInLibrary: userBooks.some(userBook => 
//         userBook.title.toLowerCase() === book.title.toLowerCase() && 
//         userBook.author.toLowerCase() === book.author.toLowerCase()
//       )
//     }));
//     setExploreBooks(updatedBooks);
//     filterBooks(updatedBooks, searchQuery, selectedGenre);
//   };

//   const filterBooks = (books: ExploreBook[], query: string, genre: string | null) => {
//     let filtered = books;

//     if (genre) {
//       filtered = filtered.filter(book => book.genre === genre);
//     }

//     if (query.trim()) {
//       const searchTerm = query.toLowerCase();
//       filtered = filtered.filter(book =>
//         book.title.toLowerCase().includes(searchTerm) ||
//         book.author.toLowerCase().includes(searchTerm) ||
//         (book.genre && book.genre.toLowerCase().includes(searchTerm))
//       );
//     }

//     setFilteredBooks(filtered);
//   };

//   useEffect(() => {
//     loadMyBooks();
//   }, []);

//   useEffect(() => {
//     filterBooks(exploreBooks, searchQuery, selectedGenre);
//   }, [searchQuery, selectedGenre]);

//   const handleAddToLibrary = (book: ExploreBook) => {
//     setSelectedBook(book);
//     setShowAddModal(true);
//   };

//   const confirmAddBook = async () => {
//     if (!selectedBook) return;

//     try {
//       const bookData = {
//         title: selectedBook.title,
//         author: selectedBook.author,
//         genre: selectedBook.genre || "",
//         description: selectedBook.description || "",
//         notes: "",
//         readingStatus: selectedStatus,
//         userId
//       };

//       await BookService.addBook(bookData);
//       setShowAddModal(false);
//       setSelectedBook(null);
//       Alert.alert("Success", `"${selectedBook.title}" has been added to your library!`);
//       loadMyBooks(); // Refresh to update isInLibrary status
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to add book to library");
//     }
//   };

//   const renderStars = (rating: number) => {
//     return (
//       <View className="flex-row">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Text key={star} className="text-sm mr-0.5">
//             {star <= rating ? "⭐" : "☆"}
//           </Text>
//         ))}
//       </View>
//     );
//   };

//   const renderGenreChip = (genre: string) => (
//     <TouchableOpacity
//       key={genre}
//       className={`px-4 py-2 rounded-full border-2 mr-2 ${
//         selectedGenre === genre 
//           ? 'bg-purple-600 border-purple-600' 
//           : 'bg-white border-purple-200'
//       }`}
//       onPress={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
//     >
//       <Text className={`font-semibold text-sm ${
//         selectedGenre === genre ? 'text-white' : 'text-purple-600'
//       }`}>
//         {genre}
//       </Text>
//     </TouchableOpacity>
//   );

//   const renderBookItem = (item: ExploreBook) => (
//     <View key={item.id} className="bg-white rounded-2xl p-4 mb-4 shadow-lg border border-purple-100">
//       <View className="flex-row mb-3">
//         {item.coverImage ? (
//           <View className="w-20 h-30 rounded-lg mr-4 bg-purple-100 items-center justify-center">
//             <Text className="text-2xl">📚</Text>
//           </View>
//         ) : (
//           <View className="w-20 h-30 rounded-lg mr-4 bg-purple-100 items-center justify-center">
//             <Text className="text-2xl">📚</Text>
//           </View>
//         )}
        
//         <View className="flex-1">
//           <Text className="text-lg font-bold text-gray-800 mb-1" numberOfLines={2}>
//             {item.title}
//           </Text>
//           <Text className="text-purple-600 font-semibold mb-1" numberOfLines={1}>
//             by {item.author}
//           </Text>
//           {item.genre && (
//             <Text className="text-purple-500 font-medium text-sm mb-2" numberOfLines={1}>
//               {item.genre}
//             </Text>
//           )}
          
//           {item.publicRating && (
//             <View className="flex-row items-center mb-2">
//               {renderStars(item.publicRating)}
//               <Text className="ml-2 text-sm text-gray-600 font-medium">({item.publicRating}/5)</Text>
//             </View>
//           )}
          
//           {item.description && (
//             <Text className="text-gray-600 text-sm leading-5" numberOfLines={3}>
//               {item.description}
//             </Text>
//           )}
//         </View>
//       </View>
      
//       <View className="flex-row justify-end">
//         {item.isInLibrary ? (
//           <View className="bg-green-500 px-4 py-2 rounded-full">
//             <Text className="text-white text-sm font-bold">✓ In Library</Text>
//           </View>
//         ) : (
//           <TouchableOpacity
//             className="bg-purple-600 px-5 py-2 rounded-full"
//             onPress={() => handleAddToLibrary(item)}
//           >
//             <Text className="text-white text-sm font-bold">+ Add to Library</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView className="flex-1 bg-purple-50">
//       <View className="pb-8">
//         {/* Header */}
//         <View className="pt-12 px-5 mb-5">
//           <Text className="text-3xl font-bold text-purple-800">🔍 Explore Books</Text>
//           <Text className="text-gray-500 text-base mt-1">Discover your next great read</Text>
//         </View>

//         {/* Search Bar */}
//         <View className="px-5 mb-5">
//           <TextInput
//             className="w-full bg-white border-2 border-purple-200 rounded-xl p-4 text-base text-gray-700"
//             placeholder="Search books, authors..."
//             placeholderTextColor="#a855f7"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>

//         {/* Genre Filter */}
//         <View className="mb-5">
//           <Text className="text-lg font-bold text-gray-700 px-5 mb-3">Genres</Text>
//           <ScrollView horizontal className="pl-5" showsHorizontalScrollIndicator={false}>
//             <View className="flex-row pb-2">
//               {POPULAR_GENRES.map(renderGenreChip)}
//             </View>
//           </ScrollView>
//         </View>

//         {/* Results Count */}
//         <View className="flex-row justify-between items-center px-5 mb-4">
//           <Text className="text-base text-gray-600 font-medium">
//             {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
//             {selectedGenre && ` in ${selectedGenre}`}
//           </Text>
//           {selectedGenre && (
//             <TouchableOpacity onPress={() => setSelectedGenre(null)}>
//               <Text className="text-sm text-purple-600 font-semibold">Clear Filter</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Books List */}
//         <View className="px-5">
//           {filteredBooks.length === 0 ? (
//             <View className="items-center justify-center py-16 px-10">
//               <Text className="text-6xl mb-4">{"🔍"}</Text>
//               <Text className="text-xl font-semibold text-gray-600 mb-2 text-center">No books found</Text>
//               <Text className="text-base text-gray-500 text-center">
//                 Try adjusting your search or filters
//               </Text>
//             </View>
//           ) : (
//             <View>
//               {filteredBooks.map(renderBookItem)}
//             </View>
//           )}
//         </View>

//         {/* Add to Library Modal */}
//         <Modal
//           visible={showAddModal}
//           transparent={true}
//           animationType="fade"
//           onRequestClose={() => setShowAddModal(false)}
//         >
//           <View className="flex-1 bg-black/50 items-center justify-center p-4">
//             <View className="bg-white rounded-2xl p-6 w-full max-w-md">
//               <Text className="text-2xl font-bold text-purple-600 mb-4 text-center">Add to Library</Text>
              
//               {selectedBook && (
//                 <View className="items-center mb-5 pb-4 border-b border-gray-200">
//                   <Text className="text-lg font-bold text-gray-800 mb-1">{selectedBook.title}</Text>
//                   <Text className="text-base text-purple-600 font-medium">by {selectedBook.author}</Text>
//                 </View>
//               )}
              
//               <Text className="text-base font-semibold text-gray-700 mb-3">Choose reading status:</Text>
              
//               {READING_STATUS_OPTIONS.map((option) => (
//                 <TouchableOpacity
//                   key={option.value}
//                   className={`w-full flex-row items-center p-4 rounded-xl border-2 mb-2 ${
//                     selectedStatus === option.value 
//                       ? `${option.color} border-purple-600` 
//                       : 'border-gray-200 bg-white'
//                   }`}
//                   onPress={() => setSelectedStatus(option.value as ReadingStatus)}
//                 >
//                   <Text className="text-xl mr-3">{option.icon}</Text>
//                   <Text className={`text-base font-medium ${
//                     selectedStatus === option.value ? 'text-white' : 'text-gray-700'
//                   }`}>
//                     {option.label}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
              
//               <View className="flex-row gap-3 mt-5">
//                 <TouchableOpacity
//                   className="flex-1 bg-gray-200 py-3 rounded-xl items-center"
//                   onPress={() => setShowAddModal(false)}
//                 >
//                   <Text className="text-gray-600 text-base font-bold">Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   className="flex-1 bg-purple-600 py-3 rounded-xl items-center"
//                   onPress={confirmAddBook}
//                 >
//                   <Text className="text-white text-base font-bold">Add Book</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </ScrollView>
//   );
// }


// import React, { useState, useEffect } from "react";
// import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
// import { router } from "expo-router";

// // Mock services and types for demo
// const BookService = {
//   getBooksByUser: async (userId: any) => {
//     // Mock implementation
//     return [];
//   },
//   addBook: async (bookData: any) => {
//     console.log('Adding book:', bookData);
//     return { id: Date.now().toString(), ...bookData };
//   }
// };

// const auth = {
//   currentUser: { uid: "demo-user", email: "reader@example.com" }
// };

// type ReadingStatus = "want-to-read" | "currently-reading" | "finished";

// interface ExploreBook {
//   id: string;
//   title: string;
//   author: string;
//   genre?: string;
//   description?: string;
//   coverImage?: string;
//   rating?: number;
//   publicRating?: number;
//   isInLibrary?: boolean;
//   readingStatus?: ReadingStatus;
// }

// const POPULAR_GENRES = [
//   "Fiction", "Non-Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", 
//   "Biography", "History", "Self-Help", "Business", "Horror", "Thriller"
// ];

// const SAMPLE_BOOKS: ExploreBook[] = [
//   {
//     id: "sample1",
//     title: "The Midnight Library",
//     author: "Matt Haig",
//     genre: "Fiction",
//     description: "Between life and death there is a library, and within that library, the shelves go on forever.",
//     publicRating: 4.2,
//   },
//   {
//     id: "sample2",
//     title: "Atomic Habits",
//     author: "James Clear",
//     genre: "Self-Help",
//     description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
//     publicRating: 4.7,
//   },
//   {
//     id: "sample3",
//     title: "Project Hail Mary",
//     author: "Andy Weir",
//     genre: "Sci-Fi",
//     description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller.",
//     publicRating: 4.5,
//   },
//   {
//     id: "sample4",
//     title: "The Seven Husbands of Evelyn Hugo",
//     author: "Taylor Jenkins Reid",
//     genre: "Fiction",
//     description: "A reclusive Hollywood icon finally tells her story to a young journalist.",
//     publicRating: 4.6,
//   },
//   {
//     id: "sample5",
//     title: "Educated",
//     author: "Tara Westover",
//     genre: "Biography",
//     description: "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge.",
//     publicRating: 4.4,
//   }
// ];

// export default function ExploreScreen() {
//   const userId = auth.currentUser?.uid ?? "guest";
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
//   const [exploreBooks, setExploreBooks] = useState<ExploreBook[]>(SAMPLE_BOOKS);
//   const [filteredBooks, setFilteredBooks] = useState<ExploreBook[]>(SAMPLE_BOOKS);
//   const [myBooks, setMyBooks] = useState<any[]>([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [selectedBook, setSelectedBook] = useState<ExploreBook | null>(null);
//   const [selectedStatus, setSelectedStatus] = useState<ReadingStatus>("want-to-read");

//   const READING_STATUS_OPTIONS = [
//     { value: "want-to-read", label: "Want to Read", color: "bg-purple-500", icon: "📚" },
//     { value: "currently-reading", label: "Currently Reading", color: "bg-cyan-500", icon: "📖" },
//     { value: "finished", label: "Finished", color: "bg-green-500", icon: "✅" }
//   ];

//   const loadMyBooks = async () => {
//     try {
//       const data = await BookService.getBooksByUser(userId);
//       setMyBooks(data);
//       updateExploreBooks(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateExploreBooks = (userBooks: any[]) => {
//     const updatedBooks = exploreBooks.map(book => ({
//       ...book,
//       isInLibrary: userBooks.some(userBook => 
//         userBook.title.toLowerCase() === book.title.toLowerCase() && 
//         userBook.author.toLowerCase() === book.author.toLowerCase()
//       )
//     }));
//     setExploreBooks(updatedBooks);
//     filterBooks(updatedBooks, searchQuery, selectedGenre);
//   };

//   const filterBooks = (books: ExploreBook[], query: string, genre: string | null) => {
//     let filtered = books;

//     if (genre) {
//       filtered = filtered.filter(book => book.genre === genre);
//     }

//     if (query.trim()) {
//       const searchTerm = query.toLowerCase();
//       filtered = filtered.filter(book =>
//         book.title.toLowerCase().includes(searchTerm) ||
//         book.author.toLowerCase().includes(searchTerm) ||
//         (book.genre && book.genre.toLowerCase().includes(searchTerm))
//       );
//     }

//     setFilteredBooks(filtered);
//   };

//   useEffect(() => {
//     loadMyBooks();
//   }, []);

//   useEffect(() => {
//     filterBooks(exploreBooks, searchQuery, selectedGenre);
//   }, [searchQuery, selectedGenre]);

//   const handleAddToLibrary = (book: ExploreBook) => {
//     setSelectedBook(book);
//     setShowAddModal(true);
//   };

//   const confirmAddBook = async () => {
//     if (!selectedBook) return;

//     try {
//       const bookData = {
//         title: selectedBook.title,
//         author: selectedBook.author,
//         genre: selectedBook.genre || "",
//         description: selectedBook.description || "",
//         notes: "",
//         readingStatus: selectedStatus,
//         userId
//       };

//       await BookService.addBook(bookData);
//       setShowAddModal(false);
//       setSelectedBook(null);
//       Alert.alert("Success", `"${selectedBook.title}" has been added to your library!`);
//       loadMyBooks(); // Refresh to update isInLibrary status
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to add book to library");
//     }
//   };

//   const renderStars = (rating: number) => {
//     return (
//       <View className="flex-row">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Text key={star} className="text-sm mr-0.5">
//             {star <= rating ? "⭐" : "☆"}
//           </Text>
//         ))}
//       </View>
//     );
//   };

//   const renderGenreChip = (genre: string) => (
//     <TouchableOpacity
//       key={genre}
//       className={`px-4 py-2 rounded-full border-2 mr-2 ${
//         selectedGenre === genre 
//           ? 'bg-purple-600 border-purple-600' 
//           : 'bg-white border-purple-200'
//       }`}
//       onPress={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
//     >
//       <Text className={`font-semibold text-sm ${
//         selectedGenre === genre ? 'text-white' : 'text-purple-600'
//       }`}>
//         {genre}
//       </Text>
//     </TouchableOpacity>
//   );

//   const renderBookItem = (item: ExploreBook) => (
//     <View key={item.id} className="bg-white rounded-2xl p-4 mb-4 shadow-lg border border-purple-100">
//       <View className="flex-row mb-3">
//         {item.coverImage ? (
//           <View className="w-20 h-30 rounded-lg mr-4 bg-purple-100 items-center justify-center">
//             <Text className="text-2xl">{"📚"}</Text>
//           </View>
//         ) : (
//           <View className="w-20 h-30 rounded-lg mr-4 bg-purple-100 items-center justify-center">
//             <Text className="text-2xl">{"📚"}</Text>
//           </View>
//         )}
        
//         <View className="flex-1">
//           <Text className="text-lg font-bold text-gray-800 mb-1" numberOfLines={2}>
//             {item.title}
//           </Text>
//           <Text className="text-purple-600 font-semibold mb-1" numberOfLines={1}>
//             by {item.author}
//           </Text>
//           {item.genre && (
//             <Text className="text-purple-500 font-medium text-sm mb-2" numberOfLines={1}>
//               {item.genre}
//             </Text>
//           )}
          
//           {item.publicRating && (
//             <View className="flex-row items-center mb-2">
//               {renderStars(item.publicRating)}
//               <Text className="ml-2 text-sm text-gray-600 font-medium">({item.publicRating}/5)</Text>
//             </View>
//           )}
          
//           {item.description && (
//             <Text className="text-gray-600 text-sm leading-5" numberOfLines={3}>
//               {item.description}
//             </Text>
//           )}
//         </View>
//       </View>
      
//       <View className="flex-row justify-end">
//         {item.isInLibrary ? (
//           <View className="bg-green-500 px-4 py-2 rounded-full">
//             <Text className="text-white text-sm font-bold">✓ In Library</Text>
//           </View>
//         ) : (
//           <TouchableOpacity
//             className="bg-purple-600 px-5 py-2 rounded-full"
//             onPress={() => handleAddToLibrary(item)}
//           >
//             <Text className="text-white text-sm font-bold">+ Add to Library</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView className="flex-1 bg-purple-50">
//       <View className="pb-8">
//         {/* Header */}
//         <View className="pt-12 px-5 mb-5">
//           <Text className="text-3xl font-bold text-purple-800">{"🔍"} Explore Books</Text>
//           <Text className="text-gray-500 text-base mt-1">Discover your next great read</Text>
//         </View>

//         {/* Search Bar */}
//         <View className="px-5 mb-5">
//           <TextInput
//             className="w-full bg-white border-2 border-purple-200 rounded-xl p-4 text-base text-gray-700"
//             placeholder="Search books, authors..."
//             placeholderTextColor="#a855f7"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>

//         {/* Genre Filter */}
//         <View className="mb-5">
//           <Text className="text-lg font-bold text-gray-700 px-5 mb-3">Genres</Text>
//           <ScrollView horizontal className="pl-5" showsHorizontalScrollIndicator={false}>
//             <View className="flex-row pb-2">
//               {POPULAR_GENRES.map(renderGenreChip)}
//             </View>
//           </ScrollView>
//         </View>

//         {/* Results Count */}
//         <View className="flex-row justify-between items-center px-5 mb-4">
//           <Text className="text-base text-gray-600 font-medium">
//             {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
//             {selectedGenre && ` in ${selectedGenre}`}
//           </Text>
//           {selectedGenre && (
//             <TouchableOpacity onPress={() => setSelectedGenre(null)}>
//               <Text className="text-sm text-purple-600 font-semibold">Clear Filter</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Books List */}
//         <View className="px-5">
//           {filteredBooks.length === 0 ? (
//             <View className="items-center justify-center py-16 px-10">
//               <Text className="text-6xl mb-4">{"🔍"}</Text>
//               <Text className="text-xl font-semibold text-gray-600 mb-2 text-center">No books found</Text>
//               <Text className="text-base text-gray-500 text-center">
//                 Try adjusting your search or filters
//               </Text>
//             </View>
//           ) : (
//             <View>
//               {filteredBooks.map(renderBookItem)}
//             </View>
//           )}
//         </View>

//         {/* Add to Library Modal */}
//         <Modal
//           visible={showAddModal}
//           transparent={true}
//           animationType="fade"
//           onRequestClose={() => setShowAddModal(false)}
//         >
//           <View className="flex-1 bg-black/50 items-center justify-center p-4">
//             <View className="bg-white rounded-2xl p-6 w-full max-w-md">
//               <Text className="text-2xl font-bold text-purple-600 mb-4 text-center">Add to Library</Text>
              
//               {selectedBook && (
//                 <View className="items-center mb-5 pb-4 border-b border-gray-200">
//                   <Text className="text-lg font-bold text-gray-800 mb-1">{selectedBook.title}</Text>
//                   <Text className="text-base text-purple-600 font-medium">by {selectedBook.author}</Text>
//                 </View>
//               )}
              
//               <Text className="text-base font-semibold text-gray-700 mb-3">Choose reading status:</Text>
              
//               {READING_STATUS_OPTIONS.map((option) => (
//                 <TouchableOpacity
//                   key={option.value}
//                   className={`w-full flex-row items-center p-4 rounded-xl border-2 mb-2 ${
//                     selectedStatus === option.value 
//                       ? `${option.color} border-purple-600` 
//                       : 'border-gray-200 bg-white'
//                   }`}
//                   onPress={() => setSelectedStatus(option.value as ReadingStatus)}
//                 >
//                   <Text className="text-xl mr-3">{option.icon}</Text>
//                   <Text className={`text-base font-medium ${
//                     selectedStatus === option.value ? 'text-white' : 'text-gray-700'
//                   }`}>
//                     {option.label}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
              
//               <View className="flex-row gap-3 mt-5">
//                 <TouchableOpacity
//                   className="flex-1 bg-gray-200 py-3 rounded-xl items-center"
//                   onPress={() => setShowAddModal(false)}
//                 >
//                   <Text className="text-gray-600 text-base font-bold">Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   className="flex-1 bg-purple-600 py-3 rounded-xl items-center"
//                   onPress={confirmAddBook}
//                 >
//                   <Text className="text-white text-base font-bold">Add Book</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </ScrollView>
//   );
// }



// import React, { useState, useEffect } from "react";
// import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
// import { router } from "expo-router";
// import { BookService } from "@/service/bookService";
// import { auth } from "@/firebase";

// type ReadingStatus = "want-to-read" | "currently-reading" | "finished";

// interface ExploreBook {
//   id: string;
//   title: string;
//   author: string;
//   genre?: string;
//   description?: string;
//   coverImage?: string;
//   rating?: number;
//   publicRating?: number;
//   isInLibrary?: boolean;
//   readingStatus?: ReadingStatus;
// }

// const POPULAR_GENRES = [
//   "Fiction", "Non-Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", 
//   "Biography", "History", "Self-Help", "Business", "Horror", "Thriller"
// ];

// const SAMPLE_BOOKS: ExploreBook[] = [
//   {
//     id: "sample1",
//     title: "The Midnight Library",
//     author: "Matt Haig",
//     genre: "Fiction",
//     description: "Between life and death there is a library, and within that library, the shelves go on forever.",
//     publicRating: 4.2,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg",
//   },
//   {
//     id: "sample2",
//     title: "Atomic Habits",
//     author: "James Clear",
//     genre: "Self-Help",
//     description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
//     publicRating: 4.7,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",
//   },
//   {
//     id: "sample3",
//     title: "Project Hail Mary",
//     author: "Andy Weir",
//     genre: "Sci-Fi",
//     description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller.",
//     publicRating: 4.5,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/81q1wHL6CfL.jpg",
//   },
//   {
//     id: "sample4",
//     title: "The Seven Husbands of Evelyn Hugo",
//     author: "Taylor Jenkins Reid",
//     genre: "Fiction",
//     description: "A reclusive Hollywood icon finally tells her story to a young journalist.",
//     publicRating: 4.6,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/71D3zVJ8cFL.jpg",
//   },
//   {
//     id: "sample5",
//     title: "Educated",
//     author: "Tara Westover",
//     genre: "Biography",
//     description: "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge.",
//     publicRating: 4.4,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/91uwocAMtSL.jpg",
//   },
//   {
//     id: "sample6",
//     title: "The Lean Startup",
//     author: "Eric Ries",
//     genre: "Business",
//     description: "How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses.",
//     publicRating: 4.3,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/81-QB7nDh4L.jpg",
//   },
//   {
//     id: "sample7",
//     title: "It Ends With Us",
//     author: "Colleen Hoover",
//     genre: "Romance",
//     description: "A heart-wrenching story about love and resilience.",
//     publicRating: 4.6,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/81s0B6NYXML.jpg",
//   },
//   {
//     id: "sample8",
//     title: "The Silent Patient",
//     author: "Alex Michaelides",
//     genre: "Mystery",
//     description: "A shocking psychological thriller of a woman's act of violence against her husband.",
//     publicRating: 4.4,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/71oFB+0eVfL.jpg",
//   },
//   {
//     id: "sample9",
//     title: "Dune",
//     author: "Frank Herbert",
//     genre: "Fantasy",
//     description: "Science fiction epic set on the desert planet Arrakis.",
//     publicRating: 4.5,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/91rU2Y9gl3L.jpg",
//   },
//   {
//     id: "sample10",
//     title: "Sapiens: A Brief History of Humankind",
//     author: "Yuval Noah Harari",
//     genre: "History",
//     description: "A narrative of humanity’s creation and evolution.",
//     publicRating: 4.6,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/713jIoMO3UL.jpg",
//   },
//   {
//     id: "sample11",
//     title: "Thinking, Fast and Slow",
//     author: "Daniel Kahneman",
//     genre: "Non-Fiction",
//     description: "Kahneman takes us on a groundbreaking tour of the mind.",
//     publicRating: 4.4,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/71FZ+HjHqxL.jpg",
//   },
//   {
//     id: "sample12",
//     title: "The Shining",
//     author: "Stephen King",
//     genre: "Horror",
//     description: "A classic horror novel set in an isolated hotel.",
//     publicRating: 4.5,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/81MZxR6pEQL.jpg",
//   },
//   {
//     id: "sample13",
//     title: "Gone Girl",
//     author: "Gillian Flynn",
//     genre: "Thriller",
//     description: "A dark thriller about a marriage gone terribly wrong.",
//     publicRating: 4.3,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/81zIrW6PZUL.jpg",
//   },
// ];


// export default function ExploreScreen() {
//   const userId = auth.currentUser?.uid ?? "guest";
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
//   const [exploreBooks, setExploreBooks] = useState<ExploreBook[]>(SAMPLE_BOOKS);
//   const [filteredBooks, setFilteredBooks] = useState<ExploreBook[]>(SAMPLE_BOOKS);
//   const [myBooks, setMyBooks] = useState<any[]>([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [selectedBook, setSelectedBook] = useState<ExploreBook | null>(null);
//   const [selectedStatus, setSelectedStatus] = useState<ReadingStatus>("want-to-read");
//   const [loading, setLoading] = useState(false);

//   const READING_STATUS_OPTIONS = [
//     { value: "want-to-read", label: "Want to Read", color: "bg-purple-500", icon: "📚" },
//     { value: "currently-reading", label: "Currently Reading", color: "bg-cyan-500", icon: "📖" },
//     { value: "finished", label: "Finished", color: "bg-green-500", icon: "✅" }
//   ];

//   const loadMyBooks = async () => {
//     try {
//       const data = await BookService.getBooksByUser(userId);
//       setMyBooks(data);
//       updateExploreBooks(data);
//     } catch (err) {
//       console.error("Error loading user books:", err);
//     }
//   };

//   const updateExploreBooks = (userBooks: any[]) => {
//     const updatedBooks = exploreBooks.map(book => ({
//       ...book,
//       isInLibrary: userBooks.some(userBook => 
//         userBook.title.toLowerCase() === book.title.toLowerCase() && 
//         userBook.author.toLowerCase() === book.author.toLowerCase()
//       )
//     }));
//     setExploreBooks(updatedBooks);
//     filterBooks(updatedBooks, searchQuery, selectedGenre);
//   };

//   const filterBooks = (books: ExploreBook[], query: string, genre: string | null) => {
//     let filtered = books;

//     if (genre) {
//       filtered = filtered.filter(book => book.genre === genre);
//     }

//     if (query.trim()) {
//       const searchTerm = query.toLowerCase();
//       filtered = filtered.filter(book =>
//         book.title.toLowerCase().includes(searchTerm) ||
//         book.author.toLowerCase().includes(searchTerm) ||
//         (book.genre && book.genre.toLowerCase().includes(searchTerm))
//       );
//     }

//     setFilteredBooks(filtered);
//   };

//   useEffect(() => {
//     loadMyBooks();
//   }, []);

//   useEffect(() => {
//     filterBooks(exploreBooks, searchQuery, selectedGenre);
//   }, [searchQuery, selectedGenre]);

//   const handleAddToLibrary = (book: ExploreBook) => {
//     setSelectedBook(book);
//     setShowAddModal(true);
//   };

//   const confirmAddBook = async () => {
//     if (!selectedBook || !userId || userId === "guest") {
//       Alert.alert("Error", "Please log in to add books to your library");
//       return;
//     }

//     try {
//       setLoading(true);
//       const bookData = {
//         title: selectedBook.title,
//         author: selectedBook.author,
//         genre: selectedBook.genre || "",
//         description: selectedBook.description || "",
//         notes: "",
//         readingStatus: selectedStatus,
//         userId,
//         rating: 0,
//         review: "",
//         tags: []
//       };

//       const result = await BookService.addBook(bookData);
//       console.log("Book added successfully:", result);
      
//       setShowAddModal(false);
//       setSelectedBook(null);
//       Alert.alert("Success", `"${selectedBook.title}" has been added to your library!`);
      
//       // Refresh to update isInLibrary status
//       await loadMyBooks();
//     } catch (err) {
//       console.error("Error adding book:", err);
//       Alert.alert("Error", "Failed to add book to library. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderStars = (rating: number) => {
//     return (
//       <View className="flex-row">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Text key={star} className="text-sm mr-0.5">
//             {star <= rating ? "⭐" : "☆"}
//           </Text>
//         ))}
//       </View>
//     );
//   };

//   const renderGenreChip = (genre: string) => (
//     <TouchableOpacity
//       key={genre}
//       className={`px-4 py-2 rounded-full border-2 mr-2 ${
//         selectedGenre === genre 
//           ? 'bg-purple-600 border-purple-600' 
//           : 'bg-white border-purple-200'
//       }`}
//       onPress={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
//     >
//       <Text className={`font-semibold text-sm ${
//         selectedGenre === genre ? 'text-white' : 'text-purple-600'
//       }`}>
//         {genre}
//       </Text>
//     </TouchableOpacity>
//   );

  
//   const renderBookItem = (item: ExploreBook) => (
//     <View key={item.id} className="bg-white rounded-2xl p-4 mb-4 shadow-lg border border-purple-100">
//       <View className="flex-row mb-3">
//         <View className="w-20 h-30 rounded-lg mr-4 bg-purple-100 items-center justify-center">
//           <Text className="text-2xl">📚</Text>
//         </View>
        
//         <View className="flex-1">
//           <Text className="text-lg font-bold text-gray-800 mb-1" numberOfLines={2}>
//             {item.title}
//           </Text>
//           <Text className="text-purple-600 font-semibold mb-1" numberOfLines={1}>
//             <Text>by </Text>
//             <Text>{item.author}</Text>
//           </Text>
//           {item.genre && (
//             <Text className="text-purple-500 font-medium text-sm mb-2" numberOfLines={1}>
//               {item.genre}
//             </Text>
//           )}
          
//           {item.publicRating && (
//             <View className="flex-row items-center mb-2">
//               {renderStars(item.publicRating)}
//               <Text className="ml-2 text-sm text-gray-600 font-medium">
//                 <Text>(</Text>
//                 <Text>{item.publicRating}</Text>
//                 <Text>/5)</Text>
//               </Text>
//             </View>
//           )}
          
//           {item.description && (
//             <Text className="text-gray-600 text-sm leading-5" numberOfLines={3}>
//               {item.description}
//             </Text>
//           )}
//         </View>
//       </View>
      
//       <View className="flex-row justify-end">
//         {item.isInLibrary ? (
//           <View className="bg-green-500 px-4 py-2 rounded-full">
//             <Text className="text-white text-sm font-bold">
//               <Text>✓ </Text>
//               <Text>In Library</Text>
//             </Text>
//           </View>
//         ) : (
//           <TouchableOpacity
//             className="bg-purple-600 px-5 py-2 rounded-full"
//             onPress={() => handleAddToLibrary(item)}
//             disabled={loading}
//           >
//             <Text className="text-white text-sm font-bold">
//               <Text>+ </Text>
//               <Text>Add to Library</Text>
//             </Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView className="flex-1 bg-purple-50">
//       <View className="pb-8">
//         {/* Header */}
//         <View className="pt-12 px-5 mb-5">
//           <Text className="text-3xl font-bold text-purple-800">
//             <Text>🔍 </Text>
//             <Text>Explore Books</Text>
//           </Text>
//           <Text className="text-gray-500 text-base mt-1">Discover your next great read</Text>
//         </View>

//         {/* Search Bar */}
//         <View className="px-5 mb-5">
//           <TextInput
//             className="w-full bg-white border-2 border-purple-200 rounded-xl p-4 text-base text-gray-700"
//             placeholder="Search books, authors..."
//             placeholderTextColor="#a855f7"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>

//         {/* Genre Filter */}
//         <View className="mb-5">
//           <Text className="text-lg font-bold text-gray-700 px-5 mb-3">Genres</Text>
//           <ScrollView horizontal className="pl-5" showsHorizontalScrollIndicator={false}>
//             <View className="flex-row pb-2">
//               {POPULAR_GENRES.map(renderGenreChip)}
//             </View>
//           </ScrollView>
//         </View>

//         {/* Results Count */}
//         <View className="flex-row justify-between items-center px-5 mb-4">
//           <Text className="text-base text-gray-600 font-medium">
//             <Text>{filteredBooks.length}</Text>
//             <Text> book</Text>
//             <Text>{filteredBooks.length !== 1 ? 's' : ''}</Text>
//             <Text> found</Text>
//             {selectedGenre && (
//               <Text>
//                 <Text> in </Text>
//                 <Text>{selectedGenre}</Text>
//               </Text>
//             )}
//           </Text>
//           {selectedGenre && (
//             <TouchableOpacity onPress={() => setSelectedGenre(null)}>
//               <Text className="text-sm text-purple-600 font-semibold">Clear Filter</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Books List */}
//         <View className="px-5">
//           {filteredBooks.length === 0 ? (
//             <View className="items-center justify-center py-16 px-10">
//               <Text className="text-6xl mb-4">🔍</Text>
//               <Text className="text-xl font-semibold text-gray-600 mb-2 text-center">No books found</Text>
//               <Text className="text-base text-gray-500 text-center">
//                 Try adjusting your search or filters
//               </Text>
//             </View>
//           ) : (
//             <View>
//               {filteredBooks.map(renderBookItem)}
//             </View>
//           )}
//         </View>

//         {/* Add to Library Modal */}
//         <Modal
//           visible={showAddModal}
//           transparent={true}
//           animationType="fade"
//           onRequestClose={() => setShowAddModal(false)}
//         >
//           <View className="flex-1 bg-black/50 items-center justify-center p-4">
//             <View className="bg-white rounded-2xl p-6 w-full max-w-md">
//               <Text className="text-2xl font-bold text-purple-600 mb-4 text-center">Add to Library</Text>
              
//               {selectedBook && (
//                 <View className="items-center mb-5 pb-4 border-b border-gray-200">
//                   <Text className="text-lg font-bold text-gray-800 mb-1">{selectedBook.title}</Text>
//                   <Text className="text-base text-purple-600 font-medium">
//                     <Text>by </Text>
//                     <Text>{selectedBook.author}</Text>
//                   </Text>
//                 </View>
//               )}
              
//               <Text className="text-base font-semibold text-gray-700 mb-3">Choose reading status:</Text>
              
//               {READING_STATUS_OPTIONS.map((option) => (
//                 <TouchableOpacity
//                   key={option.value}
//                   className={`w-full flex-row items-center p-4 rounded-xl border-2 mb-2 ${
//                     selectedStatus === option.value 
//                       ? `${option.color} border-purple-600` 
//                       : 'border-gray-200 bg-white'
//                   }`}
//                   onPress={() => setSelectedStatus(option.value as ReadingStatus)}
//                   disabled={loading}
//                 >
//                   <Text className="text-xl mr-3">{option.icon}</Text>
//                   <Text className={`text-base font-medium ${
//                     selectedStatus === option.value ? 'text-white' : 'text-gray-700'
//                   }`}>
//                     {option.label}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
              
//               <View className="flex-row gap-3 mt-5">
//                 <TouchableOpacity
//                   className="flex-1 bg-gray-200 py-3 rounded-xl items-center"
//                   onPress={() => setShowAddModal(false)}
//                   disabled={loading}
//                 >
//                   <Text className="text-gray-600 text-base font-bold">Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   className={`flex-1 py-3 rounded-xl items-center ${loading ? 'bg-purple-400' : 'bg-purple-600'}`}
//                   onPress={confirmAddBook}
//                   disabled={loading}
//                 >
//                   <Text className="text-white text-base font-bold">
//                     {loading ? 'Adding...' : 'Add Book'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </ScrollView>
//   );
// }











// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   Alert,
//   Image, // 👈 added here
// } from "react-native";
// import { router } from "expo-router";
// import { BookService } from "@/service/bookService";
// import { auth } from "@/firebase";

// type ReadingStatus = "want-to-read" | "currently-reading" | "finished";

// interface ExploreBook {
//   id: string;
//   title: string;
//   author: string;
//   genre?: string;
//   description?: string;
//   coverImage?: string;
//   rating?: number;
//   publicRating?: number;
//   isInLibrary?: boolean;
//   readingStatus?: ReadingStatus;
// }

// const POPULAR_GENRES = [
//   "Fiction", "Non-Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy",
//   "Biography", "History", "Self-Help", "Business", "Horror", "Thriller"
// ];

// const SAMPLE_BOOKS: ExploreBook[] = [
//   {
//     id: "sample1",
//     title: "The Midnight Library",
//     author: "Matt Haig",
//     genre: "Fiction",
//     description: "Between life and death there is a library, and within that library, the shelves go on forever.",
//     publicRating: 4.2,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg",
//   },
//   {
//     id: "sample2",
//     title: "Atomic Habits",
//     author: "James Clear",
//     genre: "Self-Help",
//     description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
//     publicRating: 4.7,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",
//   },
//   {
//     id: "sample3",
//     title: "Project Hail Mary",
//     author: "Andy Weir",
//     genre: "Sci-Fi",
//     description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller.",
//     publicRating: 4.5,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/81q1wHL6CfL.jpg",
//   },
//   {
//     id: "sample4",
//     title: "The Seven Husbands of Evelyn Hugo",
//     author: "Taylor Jenkins Reid",
//     genre: "Fiction",
//     description: "A reclusive Hollywood icon finally tells her story to a young journalist.",
//     publicRating: 4.6,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/71D3zVJ8cFL.jpg",
//   },
//   {
//     id: "sample5",
//     title: "Educated",
//     author: "Tara Westover",
//     genre: "Biography",
//     description: "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge.",
//     publicRating: 4.4,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/91uwocAMtSL.jpg",
//   },
//   {
//     id: "sample6",
//     title: "The Lean Startup",
//     author: "Eric Ries",
//     genre: "Business",
//     description: "How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses.",
//     publicRating: 4.3,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/81-QB7nDh4L.jpg",
//   },
//   {
//     id: "sample7",
//     title: "It Ends With Us",
//     author: "Colleen Hoover",
//     genre: "Romance",
//     description: "A heart-wrenching story about love and resilience.",
//     publicRating: 4.6,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/81s0B6NYXML.jpg",
//   },
//   {
//     id: "sample8",
//     title: "The Silent Patient",
//     author: "Alex Michaelides",
//     genre: "Mystery",
//     description: "A shocking psychological thriller of a woman's act of violence against her husband.",
//     publicRating: 4.4,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/71oFB+0eVfL.jpg",
//   },
//   {
//     id: "sample9",
//     title: "Dune",
//     author: "Frank Herbert",
//     genre: "Fantasy",
//     description: "Science fiction epic set on the desert planet Arrakis.",
//     publicRating: 4.5,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/91rU2Y9gl3L.jpg",
//   },
//   {
//     id: "sample10",
//     title: "Sapiens: A Brief History of Humankind",
//     author: "Yuval Noah Harari",
//     genre: "History",
//     description: "A narrative of humanity’s creation and evolution.",
//     publicRating: 4.6,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/713jIoMO3UL.jpg",
//   },
//   {
//     id: "sample11",
//     title: "Thinking, Fast and Slow",
//     author: "Daniel Kahneman",
//     genre: "Non-Fiction",
//     description: "Kahneman takes us on a groundbreaking tour of the mind.",
//     publicRating: 4.4,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/71FZ+HjHqxL.jpg",
//   },
//   {
//     id: "sample12",
//     title: "The Shining",
//     author: "Stephen King",
//     genre: "Horror",
//     description: "A classic horror novel set in an isolated hotel.",
//     publicRating: 4.5,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/81MZxR6pEQL.jpg",
//   },
//   {
//     id: "sample13",
//     title: "Gone Girl",
//     author: "Gillian Flynn",
//     genre: "Thriller",
//     description: "A dark thriller about a marriage gone terribly wrong.",
//     publicRating: 4.3,
//     coverImage: "https://images-na.ssl-images-amazon.com/images/I/81zIrW6PZUL.jpg",
//   },
// ];



// export default function ExploreScreen() {
//   const userId = auth.currentUser?.uid ?? "guest";
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
//   const [exploreBooks, setExploreBooks] = useState<ExploreBook[]>(SAMPLE_BOOKS);
//   const [filteredBooks, setFilteredBooks] = useState<ExploreBook[]>(SAMPLE_BOOKS);
//   const [myBooks, setMyBooks] = useState<any[]>([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [selectedBook, setSelectedBook] = useState<ExploreBook | null>(null);
//   const [selectedStatus, setSelectedStatus] = useState<ReadingStatus>("want-to-read");
//   const [loading, setLoading] = useState(false);

//   const READING_STATUS_OPTIONS = [
//     { value: "want-to-read", label: "Want to Read", color: "bg-purple-500", icon: "📚" },
//     { value: "currently-reading", label: "Currently Reading", color: "bg-cyan-500", icon: "📖" },
//     { value: "finished", label: "Finished", color: "bg-green-500", icon: "✅" }
//   ];

//   const loadMyBooks = async () => {
//     try {
//       const data = await BookService.getBooksByUser(userId);
//       setMyBooks(data);
//       updateExploreBooks(data);
//     } catch (err) {
//       console.error("Error loading user books:", err);
//     }
//   };

//   const updateExploreBooks = (userBooks: any[]) => {
//     const updatedBooks = exploreBooks.map(book => ({
//       ...book,
//       isInLibrary: userBooks.some(userBook =>
//         userBook.title.toLowerCase() === book.title.toLowerCase() &&
//         userBook.author.toLowerCase() === book.author.toLowerCase()
//       )
//     }));
//     setExploreBooks(updatedBooks);
//     filterBooks(updatedBooks, searchQuery, selectedGenre);
//   };

//   const filterBooks = (books: ExploreBook[], query: string, genre: string | null) => {
//     let filtered = books;
//     if (genre) {
//       filtered = filtered.filter(book => book.genre === genre);
//     }
//     if (query.trim()) {
//       const searchTerm = query.toLowerCase();
//       filtered = filtered.filter(book =>
//         book.title.toLowerCase().includes(searchTerm) ||
//         book.author.toLowerCase().includes(searchTerm) ||
//         (book.genre && book.genre.toLowerCase().includes(searchTerm))
//       );
//     }
//     setFilteredBooks(filtered);
//   };

//   useEffect(() => { loadMyBooks(); }, []);
//   useEffect(() => { filterBooks(exploreBooks, searchQuery, selectedGenre); }, [searchQuery, selectedGenre]);

//   const handleAddToLibrary = (book: ExploreBook) => {
//     setSelectedBook(book);
//     setShowAddModal(true);
//   };

//   const confirmAddBook = async () => {
//     if (!selectedBook || !userId || userId === "guest") {
//       Alert.alert("Error", "Please log in to add books to your library");
//       return;
//     }
//     try {
//       setLoading(true);
//       const bookData = {
//         title: selectedBook.title,
//         author: selectedBook.author,
//         genre: selectedBook.genre || "",
//         description: selectedBook.description || "",
//         notes: "",
//         readingStatus: selectedStatus,
//         userId,
//         rating: 0,
//         review: "",
//         tags: []
//       };
//       await BookService.addBook(bookData);
//       setShowAddModal(false);
//       setSelectedBook(null);
//       Alert.alert("Success", `"${selectedBook.title}" has been added to your library!`);
//       await loadMyBooks();
//     } catch (err) {
//       console.error("Error adding book:", err);
//       Alert.alert("Error", "Failed to add book to library. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderStars = (rating: number) => (
//     <View className="flex-row">
//       {[1, 2, 3, 4, 5].map(star => (
//         <Text key={star} className="text-sm mr-0.5">
//           {star <= rating ? "⭐" : "☆"}
//         </Text>
//       ))}
//     </View>
//   );

//   const renderGenreChip = (genre: string) => (
//     <TouchableOpacity
//       key={genre}
//       className={`px-4 py-2 rounded-full border-2 mr-2 ${
//         selectedGenre === genre ? 'bg-purple-600 border-purple-600' : 'bg-white border-purple-200'
//       }`}
//       onPress={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
//     >
//       <Text className={`font-semibold text-sm ${
//         selectedGenre === genre ? 'text-white' : 'text-purple-600'
//       }`}>
//         {genre}
//       </Text>
//     </TouchableOpacity>
//   );

//   const renderBookItem = (item: ExploreBook) => (
//     <View key={item.id} className="bg-white rounded-2xl p-4 mb-4 shadow-lg border border-purple-100">
//       <View className="flex-row mb-3">
//         <View className="w-20 h-30 rounded-lg mr-4 bg-purple-100 items-center justify-center overflow-hidden">
//           {item.coverImage ? (
//             <Image
//               source={{ uri: item.coverImage }}
//               style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
//             />
//           ) : (
//             <Text className="text-2xl">📚</Text>
//           )}
//         </View>

//         <View className="flex-1">
//           <Text className="text-lg font-bold text-gray-800 mb-1" numberOfLines={2}>{item.title}</Text>
//           <Text className="text-purple-600 font-semibold mb-1" numberOfLines={1}>
//             by {item.author}
//           </Text>
//           {item.genre && (
//             <Text className="text-purple-500 font-medium text-sm mb-2" numberOfLines={1}>
//               {item.genre}
//             </Text>
//           )}
//           {item.publicRating && (
//             <View className="flex-row items-center mb-2">
//               {renderStars(item.publicRating)}
//               <Text className="ml-2 text-sm text-gray-600 font-medium">
//                 ({item.publicRating}/5)
//               </Text>
//             </View>
//           )}
//           {item.description && (
//             <Text className="text-gray-600 text-sm leading-5" numberOfLines={3}>
//               {item.description}
//             </Text>
//           )}
//         </View>
//       </View>

//       <View className="flex-row justify-end">
//         {item.isInLibrary ? (
//           <View className="bg-green-500 px-4 py-2 rounded-full">
//             <Text className="text-white text-sm font-bold">✓ In Library</Text>
//           </View>
//         ) : (
//           <TouchableOpacity
//             className="bg-purple-600 px-5 py-2 rounded-full"
//             onPress={() => handleAddToLibrary(item)}
//             disabled={loading}
//           >
//             <Text className="text-white text-sm font-bold">+ Add to Library</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView className="flex-1 bg-purple-50">
//       <View className="pb-8">
//         {/* Header */}
//         <View className="pt-12 px-5 mb-5">
//           <Text className="text-3xl font-bold text-purple-800">🔍 Explore Books</Text>
//           <Text className="text-gray-500 text-base mt-1">Discover your next great read</Text>
//         </View>

//         {/* Search Bar */}
//         <View className="px-5 mb-5">
//           <TextInput
//             className="w-full bg-white border-2 border-purple-200 rounded-xl p-4 text-base text-gray-700"
//             placeholder="Search books, authors..."
//             placeholderTextColor="#a855f7"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>

//         {/* Genre Filter */}
//         <View className="mb-5">
//           <Text className="text-lg font-bold text-gray-700 px-5 mb-3">Genres</Text>
//           <ScrollView horizontal className="pl-5" showsHorizontalScrollIndicator={false}>
//             <View className="flex-row pb-2">
//               {POPULAR_GENRES.map(renderGenreChip)}
//             </View>
//           </ScrollView>
//         </View>

//         {/* Results Count */}
//         <View className="flex-row justify-between items-center px-5 mb-4">
//           <Text className="text-base text-gray-600 font-medium">
//             {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
//             {selectedGenre && ` in ${selectedGenre}`}
//           </Text>
//           {selectedGenre && (
//             <TouchableOpacity onPress={() => setSelectedGenre(null)}>
//               <Text className="text-sm text-purple-600 font-semibold">Clear Filter</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Books List */}
//         <View className="px-5">
//           {filteredBooks.length === 0 ? (
//             <View className="items-center justify-center py-16 px-10">
//               <Text className="text-6xl mb-4">🔍</Text>
//               <Text className="text-xl font-semibold text-gray-600 mb-2 text-center">No books found</Text>
//               <Text className="text-base text-gray-500 text-center">
//                 Try adjusting your search or filters
//               </Text>
//             </View>
//           ) : (
//             <View>{filteredBooks.map(renderBookItem)}</View>
//           )}
//         </View>

//         {/* Add to Library Modal */}
//         <Modal
//           visible={showAddModal}
//           transparent={true}
//           animationType="fade"
//           onRequestClose={() => setShowAddModal(false)}
//         >
//           <View className="flex-1 bg-black/50 items-center justify-center p-4">
//             <View className="bg-white rounded-2xl p-6 w-full max-w-md">
//               <Text className="text-2xl font-bold text-purple-600 mb-4 text-center">Add to Library</Text>
//               {selectedBook && (
//                 <View className="items-center mb-5 pb-4 border-b border-gray-200">
//                   <Text className="text-lg font-bold text-gray-800 mb-1">{selectedBook.title}</Text>
//                   <Text className="text-base text-purple-600 font-medium">by {selectedBook.author}</Text>
//                 </View>
//               )}
//               <Text className="text-base font-semibold text-gray-700 mb-3">Choose reading status:</Text>
//               {READING_STATUS_OPTIONS.map(option => (
//                 <TouchableOpacity
//                   key={option.value}
//                   className={`w-full flex-row items-center p-4 rounded-xl border-2 mb-2 ${
//                     selectedStatus === option.value ? `${option.color} border-purple-600` : 'border-gray-200 bg-white'
//                   }`}
//                   onPress={() => setSelectedStatus(option.value as ReadingStatus)}
//                   disabled={loading}
//                 >
//                   <Text className="text-xl mr-3">{option.icon}</Text>
//                   <Text className={`text-base font-medium ${
//                     selectedStatus === option.value ? 'text-white' : 'text-gray-700'
//                   }`}>
//                     {option.label}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//               <View className="flex-row gap-3 mt-5">
//                 <TouchableOpacity
//                   className="flex-1 bg-gray-200 py-3 rounded-xl items-center"
//                   onPress={() => setShowAddModal(false)}
//                   disabled={loading}
//                 >
//                   <Text className="text-gray-600 text-base font-bold">Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   className={`flex-1 py-3 rounded-xl items-center ${loading ? 'bg-purple-400' : 'bg-purple-600'}`}
//                   onPress={confirmAddBook}
//                   disabled={loading}
//                 >
//                   <Text className="text-white text-base font-bold">{loading ? 'Adding...' : 'Add Book'}</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </ScrollView>
//   );
// }



import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import { BookService } from "@/service/bookService";
import { auth } from "@/firebase";

type ReadingStatus = "want-to-read" | "currently-reading" | "finished";

interface ExploreBook {
  id: string;
  title: string;
  author: string;
  genre?: string;
  description?: string;
  coverImage?: string;
  rating?: number;
  publicRating?: number;
  isInLibrary?: boolean;
  readingStatus?: ReadingStatus;
}

const POPULAR_GENRES = [
  "Fiction", "Non-Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy",
  "Biography", "History", "Self-Help", "Business", "Horror", "Thriller"
];

const SAMPLE_BOOKS: ExploreBook[] = [
  {
    id: "sample1",
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fiction",
    description: "Between life and death there is a library, and within that library, the shelves go on forever.",
    publicRating: 4.2,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg",
  },
  {
    id: "sample2",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    publicRating: 4.7,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",
  },
  {
    id: "sample3",
    title: "Project Hail Mary",
    author: "Andy Weir",
    genre: "Sci-Fi",
    description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller.",
    publicRating: 4.5,
    coverImage: "https://unseenlibrary.com/wp-content/uploads/2021/02/project-hail-mary-cover.jpg",
  },
  {
    id: "sample4",
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    genre: "Fiction",
    description: "A reclusive Hollywood icon finally tells her story to a young journalist.",
    publicRating: 4.6,
    coverImage: "https://img1.od-cdn.com/ImageType-400/0439-1/%7B42631B71-955C-447D-B942-23CD63C897F6%7DIMG400.JPG",
  },
  {
    id: "sample5",
    title: "Educated",
    author: "Tara Westover",
    genre: "Biography",
    description: "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge.",
    publicRating: 4.4,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/91uwocAMtSL.jpg",
  },
  {
    id: "sample6",
    title: "The Lean Startup",
    author: "Eric Ries",
    genre: "Business",
    description: "How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses.",
    publicRating: 4.3,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/81-QB7nDh4L.jpg",
  },
  {
    id: "sample7",
    title: "It Ends With Us",
    author: "Colleen Hoover",
    genre: "Romance",
    description: "A heart-wrenching story about love and resilience.",
    publicRating: 4.6,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/81s0B6NYXML.jpg",
  },
  {
    id: "sample8",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genre: "Mystery",
    description: "A shocking psychological thriller of a woman's act of violence against her husband.",
    publicRating: 4.4,
    coverImage: "https://img1.od-cdn.com/ImageType-400/2390-1/%7B1B06F42D-2233-4600-B207-7D298AA61772%7DIMG400.JPG",
  },
  {
    id: "sample9",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Fantasy",
    description: "Science fiction epic set on the desert planet Arrakis.",
    publicRating: 4.5,
    coverImage: "https://images.fathomevents.com/image/upload/w_2000,dpr_2,f_auto,q_auto/v1703794610/Events/2024/1898/Dune_1000x1480_FE_Website.jpg.jpg",
  },
  {
    id: "sample10",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: "History",
    description: "A narrative of humanity’s creation and evolution.",
    publicRating: 4.6,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/713jIoMO3UL.jpg",
  },
  {
    id: "sample11",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    genre: "Non-Fiction",
    description: "Kahneman takes us on a groundbreaking tour of the mind.",
    publicRating: 4.4,
    coverImage: "https://jumpbooks.lk/wp-content/uploads/2018/12/Thinking-Fast-and-Slow.jpg",
  },
  {
    id: "sample12",
    title: "The Shining",
    author: "Stephen King",
    genre: "Horror",
    description: "A classic horror novel set in an isolated hotel.",
    publicRating: 4.5,
    coverImage: "https://img1.od-cdn.com/ImageType-400/0111-1/%7B8667DB9C-8D77-4118-9605-02E6EE0DC4A9%7DIMG400.JPG",
  },
  {
    id: "sample13",
    title: "Gone Girl",
    author: "Gillian Flynn",
    genre: "Thriller",
    description: "A dark thriller about a marriage gone terribly wrong.",
    publicRating: 4.3,
    coverImage: "https://miro.medium.com/1*im40tPqX4THFY1rMXfFQPw.jpeg",
  },
];

export default function ExploreScreen() {
  const userId = auth.currentUser?.uid ?? "guest";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [exploreBooks, setExploreBooks] = useState<ExploreBook[]>(SAMPLE_BOOKS);
  const [filteredBooks, setFilteredBooks] = useState<ExploreBook[]>(SAMPLE_BOOKS);
  const [myBooks, setMyBooks] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<ExploreBook | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ReadingStatus>("want-to-read");
  const [loading, setLoading] = useState(false);

  const READING_STATUS_OPTIONS = [
    { value: "want-to-read", label: "Want to Read", color: "#7C3AED", icon: "📚" },
    { value: "currently-reading", label: "Currently Reading", color: "#06B6D4", icon: "📖" },
    { value: "finished", label: "Finished", color: "#10B981", icon: "✅" }
  ];

  const loadMyBooks = async () => {
    try {
      const data = await BookService.getBooksByUser(userId);
      setMyBooks(data);
      updateExploreBooks(data);
    } catch (err) {
      console.error("Error loading user books:", err);
    }
  };

  const updateExploreBooks = (userBooks: any[]) => {
    const updatedBooks = exploreBooks.map(book => ({
      ...book,
      isInLibrary: userBooks.some(userBook =>
        userBook.title.toLowerCase() === book.title.toLowerCase() &&
        userBook.author.toLowerCase() === book.author.toLowerCase()
      )
    }));
    setExploreBooks(updatedBooks);
    filterBooks(updatedBooks, searchQuery, selectedGenre);
  };

  const filterBooks = (books: ExploreBook[], query: string, genre: string | null) => {
    let filtered = books;
    if (genre) {
      filtered = filtered.filter(book => book.genre === genre);
    }
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        (book.genre && book.genre.toLowerCase().includes(searchTerm))
      );
    }
    setFilteredBooks(filtered);
  };

  useEffect(() => { loadMyBooks(); }, []);
  useEffect(() => { filterBooks(exploreBooks, searchQuery, selectedGenre); }, [searchQuery, selectedGenre]);

  const handleAddToLibrary = (book: ExploreBook) => {
    setSelectedBook(book);
    setShowAddModal(true);
  };

  const confirmAddBook = async () => {
  if (!selectedBook || !userId || userId === "guest") {
    Alert.alert("Error", "Please log in to add books to your library");
    return;
  }
  try {
    setLoading(true);
    const bookData = {
      title: selectedBook.title,
      author: selectedBook.author,
      genre: selectedBook.genre || "",
      description: selectedBook.description || "",
      coverImage: selectedBook.coverImage || "", // Add this line
      notes: "",
      readingStatus: selectedStatus,
      userId,
      rating: 0,
      review: "",
      tags: []
    };
    await BookService.addBook(bookData);
    setShowAddModal(false);
    setSelectedBook(null);
    Alert.alert("Success", `"${selectedBook.title}" has been added to your library!`);
    await loadMyBooks();
  } catch (err) {
    console.error("Error adding book:", err);
    Alert.alert("Error", "Failed to add book to library. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const renderStars = (rating: number) => (
    <View style={{ flexDirection: "row" }}>
      {[1, 2, 3, 4, 5].map(star => (
        <Text key={star} style={{ fontSize: 12, marginRight: 2 }}>
          {star <= rating ? "⭐" : "☆"}
        </Text>
      ))}
    </View>
  );

  const renderGenreChip = (genre: string) => (
    <TouchableOpacity
      key={genre}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: selectedGenre === genre ? "#7C3AED" : "#DDD6FE",
        backgroundColor: selectedGenre === genre ? "#7C3AED" : "#FFF",
        marginRight: 8,
      }}
      onPress={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
    >
      <Text style={{
        fontSize: 12,
        fontWeight: "600",
        color: selectedGenre === genre ? "#FFF" : "#7C3AED"
      }}>{genre}</Text>
    </TouchableOpacity>
  );

  const renderBookItem = (item: ExploreBook) => (
    <View key={item.id} style={styles.bookCard}>
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        <View style={styles.bookImageWrapper}>
          {item.coverImage ? (
            <Image
              source={{ uri: item.coverImage }}
              style={styles.bookImage}
            />
          ) : (
            <Text style={{ fontSize: 24 }}>📚</Text>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>by {item.author}</Text>
          {item.genre && <Text style={styles.bookGenre}>{item.genre}</Text>}
          {item.publicRating && (
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
              {renderStars(item.publicRating)}
              <Text style={{ marginLeft: 6, fontSize: 12, color: "#4B5563" }}>
                ({item.publicRating}/5)
              </Text>
            </View>
          )}
          {item.description && <Text style={styles.bookDescription} numberOfLines={3}>{item.description}</Text>}
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        {item.isInLibrary ? (
          <View style={[styles.libraryBadge, { backgroundColor: "#10B981" }]}>
            <Text style={styles.libraryBadgeText}>✓ In Library</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: "#7C3AED" }]}
            onPress={() => handleAddToLibrary(item)}
            disabled={loading}
          >
            <Text style={styles.addButtonText}>+ Add to Library</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F5F3FF", paddingBottom: 32 }}>
      <View style={{ paddingTop: 48, paddingHorizontal: 20, marginBottom: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#7C3AED" }}>🔍 Explore Books</Text>
        <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>Discover your next great read</Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search books, authors..."
          placeholderTextColor="#A855F7"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#374151", paddingHorizontal: 20, marginBottom: 8 }}>Genres</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
          <View style={{ flexDirection: "row", paddingBottom: 4 }}>
            {POPULAR_GENRES.map(renderGenreChip)}
          </View>
        </ScrollView>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 16 }}>
        <Text style={{ fontSize: 14, color: "#4B5563" }}>
          {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found{selectedGenre ? ` in ${selectedGenre}` : ''}
        </Text>
        {selectedGenre && (
          <TouchableOpacity onPress={() => setSelectedGenre(null)}>
            <Text style={{ fontSize: 12, color: "#7C3AED", fontWeight: "600" }}>Clear Filter</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        {filteredBooks.length === 0 ? (
          <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 64 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🔍</Text>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#4B5563", textAlign: "center" }}>No books found</Text>
            <Text style={{ fontSize: 14, color: "#6B7280", textAlign: "center" }}>Try adjusting your search or filters</Text>
          </View>
        ) : (
          filteredBooks.map(renderBookItem)
        )}
      </View>

      {/* Add to Library Modal */}
      <Modal visible={showAddModal} transparent animationType="fade" onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add to Library</Text>

            {selectedBook && (
              <View style={styles.modalBookInfo}>
                <Text style={styles.modalBookTitle}>{selectedBook.title}</Text>
                <Text style={styles.modalBookAuthor}>by {selectedBook.author}</Text>
              </View>
            )}

            <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 }}>Choose reading status:</Text>
            {READING_STATUS_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusButton,
                  {
                    backgroundColor: selectedStatus === option.value ? option.color : "#FFF",
                    borderColor: selectedStatus === option.value ? option.color : "#D1D5DB",
                  }
                ]}
                onPress={() => setSelectedStatus(option.value as ReadingStatus)}
                disabled={loading}
              >
                <Text style={{
                  fontSize: 16,
                  marginRight: 8
                }}>{option.icon}</Text>
                <Text style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: selectedStatus === option.value ? "#FFF" : "#374151"
                }}>{option.label}</Text>
              </TouchableOpacity>
            ))}

            <View style={{ flexDirection: "row", marginTop: 16 }}>
              <TouchableOpacity
                style={[styles.modalActionButton, { backgroundColor: "#E5E7EB" }]}
                onPress={() => setShowAddModal(false)}
                disabled={loading}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#4B5563" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalActionButton, { backgroundColor: loading ? "#C084FC" : "#7C3AED" }]}
                onPress={confirmAddBook}
                disabled={loading}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#FFF" }}>{loading ? "Adding..." : "Add Book"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#DDD6FE",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#374151",
  },
  bookCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  bookImageWrapper: {
    width: 80,
    height: 120,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  bookImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bookTitle: { fontSize: 16, fontWeight: "bold", color: "#111827", marginBottom: 2 },
  bookAuthor: { fontSize: 12, fontWeight: "600", color: "#7C3AED", marginBottom: 2 },
  bookGenre: { fontSize: 12, fontWeight: "500", color: "#A78BFA", marginBottom: 4 },
  bookDescription: { fontSize: 12, color: "#4B5563", lineHeight: 16 },
  libraryBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  libraryBadgeText: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  addButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addButtonText: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", padding: 16 },
  modalContent: { backgroundColor: "#FFF", borderRadius: 20, padding: 20, width: "100%", maxWidth: 360 },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#7C3AED", textAlign: "center", marginBottom: 16 },
  modalBookInfo: { alignItems: "center", marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  modalBookTitle: { fontSize: 16, fontWeight: "bold", color: "#111827", marginBottom: 2 },
  modalBookAuthor: { fontSize: 14, fontWeight: "500", color: "#7C3AED" },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 8,
  },
  modalActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
});
