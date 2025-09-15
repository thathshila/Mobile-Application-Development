




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



import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { router } from "expo-router";
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
  },
  {
    id: "sample2",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    publicRating: 4.7,
  },
  {
    id: "sample3",
    title: "Project Hail Mary",
    author: "Andy Weir",
    genre: "Sci-Fi",
    description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller.",
    publicRating: 4.5,
  },
  {
    id: "sample4",
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    genre: "Fiction",
    description: "A reclusive Hollywood icon finally tells her story to a young journalist.",
    publicRating: 4.6,
  },
  {
    id: "sample5",
    title: "Educated",
    author: "Tara Westover",
    genre: "Biography",
    description: "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge.",
    publicRating: 4.4,
  }
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
    { value: "want-to-read", label: "Want to Read", color: "bg-purple-500", icon: "📚" },
    { value: "currently-reading", label: "Currently Reading", color: "bg-cyan-500", icon: "📖" },
    { value: "finished", label: "Finished", color: "bg-green-500", icon: "✅" }
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

  useEffect(() => {
    loadMyBooks();
  }, []);

  useEffect(() => {
    filterBooks(exploreBooks, searchQuery, selectedGenre);
  }, [searchQuery, selectedGenre]);

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
        notes: "",
        readingStatus: selectedStatus,
        userId,
        rating: 0,
        review: "",
        tags: []
      };

      const result = await BookService.addBook(bookData);
      console.log("Book added successfully:", result);
      
      setShowAddModal(false);
      setSelectedBook(null);
      Alert.alert("Success", `"${selectedBook.title}" has been added to your library!`);
      
      // Refresh to update isInLibrary status
      await loadMyBooks();
    } catch (err) {
      console.error("Error adding book:", err);
      Alert.alert("Error", "Failed to add book to library. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <Text key={star} className="text-sm mr-0.5">
            {star <= rating ? "⭐" : "☆"}
          </Text>
        ))}
      </View>
    );
  };

  const renderGenreChip = (genre: string) => (
    <TouchableOpacity
      key={genre}
      className={`px-4 py-2 rounded-full border-2 mr-2 ${
        selectedGenre === genre 
          ? 'bg-purple-600 border-purple-600' 
          : 'bg-white border-purple-200'
      }`}
      onPress={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
    >
      <Text className={`font-semibold text-sm ${
        selectedGenre === genre ? 'text-white' : 'text-purple-600'
      }`}>
        {genre}
      </Text>
    </TouchableOpacity>
  );

  const renderBookItem = (item: ExploreBook) => (
    <View key={item.id} className="bg-white rounded-2xl p-4 mb-4 shadow-lg border border-purple-100">
      <View className="flex-row mb-3">
        <View className="w-20 h-30 rounded-lg mr-4 bg-purple-100 items-center justify-center">
          <Text className="text-2xl">📚</Text>
        </View>
        
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800 mb-1" numberOfLines={2}>
            {item.title}
          </Text>
          <Text className="text-purple-600 font-semibold mb-1" numberOfLines={1}>
            <Text>by </Text>
            <Text>{item.author}</Text>
          </Text>
          {item.genre && (
            <Text className="text-purple-500 font-medium text-sm mb-2" numberOfLines={1}>
              {item.genre}
            </Text>
          )}
          
          {item.publicRating && (
            <View className="flex-row items-center mb-2">
              {renderStars(item.publicRating)}
              <Text className="ml-2 text-sm text-gray-600 font-medium">
                <Text>(</Text>
                <Text>{item.publicRating}</Text>
                <Text>/5)</Text>
              </Text>
            </View>
          )}
          
          {item.description && (
            <Text className="text-gray-600 text-sm leading-5" numberOfLines={3}>
              {item.description}
            </Text>
          )}
        </View>
      </View>
      
      <View className="flex-row justify-end">
        {item.isInLibrary ? (
          <View className="bg-green-500 px-4 py-2 rounded-full">
            <Text className="text-white text-sm font-bold">
              <Text>✓ </Text>
              <Text>In Library</Text>
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            className="bg-purple-600 px-5 py-2 rounded-full"
            onPress={() => handleAddToLibrary(item)}
            disabled={loading}
          >
            <Text className="text-white text-sm font-bold">
              <Text>+ </Text>
              <Text>Add to Library</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-purple-50">
      <View className="pb-8">
        {/* Header */}
        <View className="pt-12 px-5 mb-5">
          <Text className="text-3xl font-bold text-purple-800">
            <Text>🔍 </Text>
            <Text>Explore Books</Text>
          </Text>
          <Text className="text-gray-500 text-base mt-1">Discover your next great read</Text>
        </View>

        {/* Search Bar */}
        <View className="px-5 mb-5">
          <TextInput
            className="w-full bg-white border-2 border-purple-200 rounded-xl p-4 text-base text-gray-700"
            placeholder="Search books, authors..."
            placeholderTextColor="#a855f7"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Genre Filter */}
        <View className="mb-5">
          <Text className="text-lg font-bold text-gray-700 px-5 mb-3">Genres</Text>
          <ScrollView horizontal className="pl-5" showsHorizontalScrollIndicator={false}>
            <View className="flex-row pb-2">
              {POPULAR_GENRES.map(renderGenreChip)}
            </View>
          </ScrollView>
        </View>

        {/* Results Count */}
        <View className="flex-row justify-between items-center px-5 mb-4">
          <Text className="text-base text-gray-600 font-medium">
            <Text>{filteredBooks.length}</Text>
            <Text> book</Text>
            <Text>{filteredBooks.length !== 1 ? 's' : ''}</Text>
            <Text> found</Text>
            {selectedGenre && (
              <Text>
                <Text> in </Text>
                <Text>{selectedGenre}</Text>
              </Text>
            )}
          </Text>
          {selectedGenre && (
            <TouchableOpacity onPress={() => setSelectedGenre(null)}>
              <Text className="text-sm text-purple-600 font-semibold">Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Books List */}
        <View className="px-5">
          {filteredBooks.length === 0 ? (
            <View className="items-center justify-center py-16 px-10">
              <Text className="text-6xl mb-4">🔍</Text>
              <Text className="text-xl font-semibold text-gray-600 mb-2 text-center">No books found</Text>
              <Text className="text-base text-gray-500 text-center">
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            <View>
              {filteredBooks.map(renderBookItem)}
            </View>
          )}
        </View>

        {/* Add to Library Modal */}
        <Modal
          visible={showAddModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAddModal(false)}
        >
          <View className="flex-1 bg-black/50 items-center justify-center p-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-md">
              <Text className="text-2xl font-bold text-purple-600 mb-4 text-center">Add to Library</Text>
              
              {selectedBook && (
                <View className="items-center mb-5 pb-4 border-b border-gray-200">
                  <Text className="text-lg font-bold text-gray-800 mb-1">{selectedBook.title}</Text>
                  <Text className="text-base text-purple-600 font-medium">
                    <Text>by </Text>
                    <Text>{selectedBook.author}</Text>
                  </Text>
                </View>
              )}
              
              <Text className="text-base font-semibold text-gray-700 mb-3">Choose reading status:</Text>
              
              {READING_STATUS_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className={`w-full flex-row items-center p-4 rounded-xl border-2 mb-2 ${
                    selectedStatus === option.value 
                      ? `${option.color} border-purple-600` 
                      : 'border-gray-200 bg-white'
                  }`}
                  onPress={() => setSelectedStatus(option.value as ReadingStatus)}
                  disabled={loading}
                >
                  <Text className="text-xl mr-3">{option.icon}</Text>
                  <Text className={`text-base font-medium ${
                    selectedStatus === option.value ? 'text-white' : 'text-gray-700'
                  }`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
              
              <View className="flex-row gap-3 mt-5">
                <TouchableOpacity
                  className="flex-1 bg-gray-200 py-3 rounded-xl items-center"
                  onPress={() => setShowAddModal(false)}
                  disabled={loading}
                >
                  <Text className="text-gray-600 text-base font-bold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-xl items-center ${loading ? 'bg-purple-400' : 'bg-purple-600'}`}
                  onPress={confirmAddBook}
                  disabled={loading}
                >
                  <Text className="text-white text-base font-bold">
                    {loading ? 'Adding...' : 'Add Book'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}