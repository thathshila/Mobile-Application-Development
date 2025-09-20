// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   Alert,
//   ScrollView,
//   Image,
// } from "react-native";
// import { BookService } from "@/service/bookService";
// import { Book } from "@/types/book";
// import { auth } from "@/firebase";
// import { router } from "expo-router";

// interface EnhancedBook extends Book {
//   coverImage?: string;
//   description?: string;
// }

//  export default function BooksScreen() {
//   const userId = auth.currentUser?.uid ?? "guest";
//   const [books, setBooks] = useState<EnhancedBook[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadBooks = async () => {
//     try {
//       setLoading(true);
//       const data = await BookService.getBooksByUser(userId);
//       setBooks(data);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to load books");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadBooks();
//   }, []);

//   const renderBookItem = ({ item }: { item: EnhancedBook }) => (
//     <View className="bg-white rounded-2xl p-4 mb-4 shadow">
//       <View className="flex-row mb-3">
//         {item.coverImage ? (
//           <Image source={{ uri: item.coverImage }} className="w-16 h-20 rounded-lg mr-3" />
//         ) : (
//           <View className="w-16 h-20 bg-purple-100 rounded-lg mr-3 items-center justify-center">
//             <Text className="text-2xl">📚</Text>
//           </View>
//         )}

//         <View className="flex-1">
//           <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={2}>
//             {item.title}
//           </Text>
//           <Text className="text-purple-600 font-semibold text-sm mb-1" numberOfLines={1}>
//             by {item.author}
//           </Text>
//           {item.genre && (
//             <View className="self-start bg-purple-100 rounded-xl px-2 py-0.5 mb-1">
//               <Text className="text-purple-600 text-xs">{item.genre}</Text>
//             </View>
//           )}
//           {item.description && (
//             <Text className="text-gray-500 text-xs" numberOfLines={2}>
//               {item.description}
//             </Text>
//           )}
//         </View>
//       </View>

//       <View className="flex-row space-x-3">
//         <TouchableOpacity
//           className="flex-2 bg-purple-600 py-3 rounded-lg items-center"
//           onPress={() => {
//             Alert.alert(
//               item.title,
//               `Author: ${item.author}\n${item.genre ? `Genre: ${item.genre}\n` : ''}${item.description ? `\nDescription: ${item.description}` : ''}`,
//               [{ text: "OK" }]
//             );
//           }}
//         >
//           <Text className="text-white font-semibold">👁️ View Details</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           className="flex-1 bg-red-500 py-3 rounded-lg items-center"
//           onPress={() => {/* handle delete */}}
//         >
//           <Text className="text-white font-semibold">🗑️ Delete</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-purple-50">
//         <Text className="text-purple-600 text-lg">📚 Loading your books...</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-purple-50">
//     {/* ✅ Custom Header */}
//     <View className="bg-purple-600 pt-14 pb-5 px-5 flex-row items-center justify-between">
//       <Text className="text-white text-2xl font-bold">📚 My Library</Text>

//       {/* Optional arrow / menu */}
//       <TouchableOpacity onPress={() => router.push("/add-book")}>
//         <Text className="text-white text-xl">➕</Text>
//       </TouchableOpacity>
//     </View>
    
//       {books.length === 0 ? (
//         <ScrollView contentContainerStyle={{ padding: 20 }}>
//           {/* header here */}
//           <View className="items-center bg-white rounded-2xl mt-5 py-14">
//             <Text className="text-6xl mb-4">📚</Text>
//             <Text className="text-lg font-semibold text-gray-600 mb-2">No books in your collection</Text>
//             <Text className="text-sm text-gray-400 text-center px-5">
//               Your book collection will appear here once you add some books.
//             </Text>
//           </View>
//         </ScrollView>
//       ) : (
//         <FlatList
//           data={books}
//           keyExtractor={(item) => item.id!}
//           renderItem={renderBookItem}
//           contentContainerStyle={{ padding: 20 }}
//         />
//       )}
//     </View>
//   );
// }



// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   Alert,
//   ScrollView,
//   Image,
//   StatusBar,
// } from "react-native";
// import { BookService } from "@/service/bookService";
// import { Book } from "@/types/book";
// import { auth } from "@/firebase";
// import { router } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";

// interface EnhancedBook extends Book {
//   coverImage?: string;
//   description?: string;
// }

// export default function BooksScreen() {
//   const userId = auth.currentUser?.uid ?? "guest";
//   const [books, setBooks] = useState<EnhancedBook[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadBooks = async () => {
//     try {
//       setLoading(true);
//       const data = await BookService.getBooksByUser(userId);
//       setBooks(data);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to load books");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadBooks();
//   }, []);

//   const handleDeleteBook = async (id: string, title: string) => {
//     Alert.alert(
//       "Delete Book",
//       `Are you sure you want to remove "${title}" from your library?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await BookService.deleteBook(id);
//               loadBooks();
//               Alert.alert("Success", "Book removed from your library");
//             } catch (err) {
//               console.error(err);
//               Alert.alert("Error", "Failed to delete book");
//             }
//           },
//         },
//       ]
//     );
//   };

//   const renderBookItem = ({ item }: { item: EnhancedBook }) => (
//     <View className="bg-white rounded-2xl p-5 mb-4 shadow-lg border border-purple-100">
//       <View className="flex-row mb-4">
//         {item.coverImage ? (
//           <View className="relative">
//             <Image 
//               source={{ uri: item.coverImage }} 
//               className="w-20 h-28 rounded-xl mr-4 shadow-md" 
//             />
//             <View className="absolute inset-0 rounded-xl border border-purple-200" />
//           </View>
//         ) : (
//           <View className="w-20 h-28 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl mr-4 items-center justify-center shadow-md border border-purple-200">
//             <Ionicons name="book" size={32} color="#8B5CF6" />
//           </View>
//         )}

//         <View className="flex-1">
//           <Text className="text-lg font-bold text-gray-900 mb-2 leading-6" numberOfLines={2}>
//             {item.title}
//           </Text>
//           <Text className="text-purple-700 font-semibold text-base mb-2" numberOfLines={1}>
//             by {item.author}
//           </Text>
          
//           {item.genre && (
//             <View className="self-start bg-purple-50 border border-purple-200 rounded-full px-3 py-1 mb-2">
//               <Text className="text-purple-700 text-sm font-medium">{item.genre}</Text>
//             </View>
//           )}
          
//           {item.description && (
//             <Text className="text-gray-600 text-sm leading-5 mt-1" numberOfLines={3}>
//               {item.description}
//             </Text>
//           )}
//         </View>
//       </View>

//       <View className="flex-row space-x-3 pt-3 border-t border-gray-100">
//         <TouchableOpacity
//           className="flex-2 bg-purple-600 py-3 px-4 rounded-xl items-center shadow-sm"
//           onPress={() => {
//             Alert.alert(
//               item.title,
//               `Author: ${item.author}\n${item.genre ? `Genre: ${item.genre}\n` : ''}${item.description ? `\nDescription: ${item.description}` : ''}${item.notes ? `\n\nNotes: ${item.notes}` : ''}`,
//               [{ text: "Close" }]
//             );
//           }}
//           activeOpacity={0.8}
//         >
//           <View className="flex-row items-center">
//             <Ionicons name="eye" size={18} color="white" />
//             <Text className="text-white font-semibold ml-2">View Details</Text>
//           </View>
//         </TouchableOpacity>
        
//         <TouchableOpacity
//           className="flex-1 bg-red-500 py-3 px-4 rounded-xl items-center shadow-sm"
//           onPress={() => handleDeleteBook(item.id!, item.title)}
//           activeOpacity={0.8}
//         >
//           <View className="flex-row items-center">
//             <Ionicons name="trash" size={18} color="white" />
//             <Text className="text-white font-semibold ml-1">Delete</Text>
//           </View>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View className="flex-1 bg-gradient-to-b from-purple-50 to-white">
//         <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
//         <View className="bg-purple-600 pt-14 pb-6 px-5">
//           <Text className="text-white text-2xl font-bold text-center">My Library</Text>
//         </View>
//         <View className="flex-1 justify-center items-center px-8">
//           <View className="bg-white rounded-2xl p-8 shadow-lg items-center">
//             <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mb-4">
//               <Ionicons name="library" size={32} color="#8B5CF6" />
//             </View>
//             <Text className="text-purple-600 text-lg font-semibold">Loading your library...</Text>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gradient-to-b from-purple-50 to-white">
//       <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
      
//       {/* Professional Header */}
//       <View className="bg-gradient-to-r from-purple-600 to-purple-700 pt-14 pb-6 px-5 shadow-lg">
//         <View className="flex-row items-center justify-between">
//           <TouchableOpacity onPress={() => router.back()}>
//             <Ionicons name="arrow-back" size={28} color="white" />
//           </TouchableOpacity>
          
//           <View className="flex-1 items-center">
//             <Text className="text-white text-2xl font-bold">My Library</Text>
//             <Text className="text-purple-200 text-sm font-medium mt-1">
//               {books.length} {books.length === 1 ? 'book' : 'books'} in collection
//             </Text>
//           </View>

//           <TouchableOpacity 
//             onPress={() => router.push("/add-book")}
//             className="bg-white/20 rounded-full p-2"
//           >
//             <Ionicons name="add" size={24} color="white" />
//           </TouchableOpacity>
//         </View>
//       </View>
      
//       {books.length === 0 ? (
//         <ScrollView 
//           contentContainerStyle={{ 
//             flex: 1, 
//             justifyContent: 'center',
//             padding: 24 
//           }}
//           showsVerticalScrollIndicator={false}
//         >
//           <View className="items-center bg-white rounded-3xl py-16 px-8 shadow-lg border border-purple-100">
//             <View className="w-24 h-24 bg-purple-100 rounded-full items-center justify-center mb-6">
//               <Ionicons name="library-outline" size={48} color="#8B5CF6" />
//             </View>
//             <Text className="text-2xl font-bold text-gray-800 mb-3 text-center">
//               Start Building Your Library
//             </Text>
//             <Text className="text-gray-500 text-center text-base leading-6 mb-8 max-w-xs">
//               Your personal book collection will appear here. Add your first book to get started!
//             </Text>
//             <TouchableOpacity
//               onPress={() => router.push("/add-book")}
//               className="bg-purple-600 py-4 px-8 rounded-xl shadow-sm"
//               activeOpacity={0.8}
//             >
//               <View className="flex-row items-center">
//                 <Ionicons name="add" size={20} color="white" />
//                 <Text className="text-white font-semibold text-base ml-2">Add Your First Book</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       ) : (
//         <FlatList
//           data={books}
//           keyExtractor={(item) => item.id!}
//           renderItem={renderBookItem}
//           contentContainerStyle={{ 
//             padding: 20,
//             paddingTop: 24 
//           }}
//           showsVerticalScrollIndicator={false}
//           ListFooterComponent={
//             <TouchableOpacity
//               onPress={() => router.push("/add-book")}
//               className="bg-purple-100 border-2 border-dashed border-purple-300 rounded-2xl py-8 items-center mt-4"
//               activeOpacity={0.7}
//             >
//               <View className="w-12 h-12 bg-purple-600 rounded-full items-center justify-center mb-3">
//                 <Ionicons name="add" size={24} color="white" />
//               </View>
//               <Text className="text-purple-700 font-semibold text-base">Add Another Book</Text>
//               <Text className="text-purple-500 text-sm mt-1">Expand your collection</Text>
//             </TouchableOpacity>
//           }
//         />
//       )}
//     </View>
//   );
// }


// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   Alert,
//   ScrollView,
//   Image,
//   StatusBar,
// } from "react-native";
// import { BookService } from "@/service/bookService";
// import { Book } from "@/types/book";
// import { auth } from "@/firebase";
// import { router } from "expo-router";

// interface EnhancedBook extends Book {
//   coverImage?: string;
//   description?: string;
// }

// export default function BooksScreen() {
//   const userId = auth.currentUser?.uid ?? "guest";
//   const [books, setBooks] = useState<EnhancedBook[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadBooks = async () => {
//     try {
//       setLoading(true);
//       const data = await BookService.getBooksByUser(userId);
//       setBooks(data);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to load books");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadBooks();
//   }, []);

//   const renderBookItem = ({ item }: { item: EnhancedBook }) => (
//     <View style={{
//       backgroundColor: 'white',
//       borderRadius: 16,
//       padding: 20,
//       marginBottom: 16,
//       shadowColor: '#8B5CF6',
//       shadowOffset: { width: 0, height: 4 },
//       shadowOpacity: 0.08,
//       shadowRadius: 12,
//       elevation: 4,
//       borderWidth: 1,
//       borderColor: '#F3E8FF'
//     }}>
//       <View className="flex-row mb-4">
//         {item.coverImage ? (
//           <View style={{ position: 'relative' }}>
//             <Image 
//               source={{ uri: item.coverImage }} 
//               style={{
//                 width: 72,
//                 height: 96,
//                 borderRadius: 12,
//                 marginRight: 16,
//                 shadowColor: '#8B5CF6',
//                 shadowOffset: { width: 0, height: 2 },
//                 shadowOpacity: 0.15,
//                 shadowRadius: 6
//               }}
//             />
//             <View style={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               right: 16,
//               bottom: 0,
//               borderRadius: 12,
//               borderWidth: 1,
//               borderColor: '#E9D5FF'
//             }} />
//           </View>
//         ) : (
//           <View style={{
//             width: 72,
//             height: 96,
//             backgroundColor: '#F3E8FF',
//             borderRadius: 12,
//             marginRight: 16,
//             alignItems: 'center',
//             justifyContent: 'center',
//             borderWidth: 1.5,
//             borderColor: '#E9D5FF',
//             shadowColor: '#8B5CF6',
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.1,
//             shadowRadius: 6
//           }}>
//             <Text style={{ fontSize: 32 }}>📚</Text>
//           </View>
//         )}

//         <View className="flex-1">
//           <Text style={{
//             fontSize: 18,
//             fontWeight: '700',
//             color: '#1F2937',
//             marginBottom: 6,
//             lineHeight: 24
//           }} numberOfLines={2}>
//             {item.title}
//           </Text>
//           <Text style={{
//             fontSize: 15,
//             fontWeight: '600',
//             color: '#7C3AED',
//             marginBottom: 8
//           }} numberOfLines={1}>
//             by {item.author}
//           </Text>
//           {item.genre && (
//             <View style={{
//               alignSelf: 'flex-start',
//               backgroundColor: '#F3E8FF',
//               borderRadius: 20,
//               paddingHorizontal: 12,
//               paddingVertical: 4,
//               marginBottom: 6,
//               borderWidth: 1,
//               borderColor: '#E9D5FF'
//             }}>
//               <Text style={{
//                 color: '#7C3AED',
//                 fontSize: 13,
//                 fontWeight: '500'
//               }}>{item.genre}</Text>
//             </View>
//           )}
//           {item.description && (
//             <Text style={{
//               color: '#6B7280',
//               fontSize: 14,
//               lineHeight: 20
//             }} numberOfLines={2}>
//               {item.description}
//             </Text>
//           )}
//         </View>
//       </View>

//       <View className="flex-row space-x-3" style={{ paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
//         <TouchableOpacity
//           style={{
//             flex: 2,
//             backgroundColor: '#7C3AED',
//             paddingVertical: 14,
//             borderRadius: 12,
//             alignItems: 'center',
//             shadowColor: '#7C3AED',
//             shadowOffset: { width: 0, height: 3 },
//             shadowOpacity: 0.25,
//             shadowRadius: 6,
//             elevation: 4
//           }}
//           onPress={() => {
//             Alert.alert(
//               item.title,
//               `Author: ${item.author}\n${item.genre ? `Genre: ${item.genre}\n` : ''}${item.description ? `\nDescription: ${item.description}` : ''}`,
//               [{ text: "OK" }]
//             );
//           }}
//           activeOpacity={0.85}
//         >
//           <Text style={{
//             color: 'white',
//             fontWeight: '600',
//             fontSize: 15
//           }}>👁️ View Details</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={{
//             flex: 1,
//             backgroundColor: '#EF4444',
//             paddingVertical: 14,
//             borderRadius: 12,
//             alignItems: 'center',
//             shadowColor: '#EF4444',
//             shadowOffset: { width: 0, height: 3 },
//             shadowOpacity: 0.25,
//             shadowRadius: 6,
//             elevation: 4
//           }}
//           onPress={() => {/* handle delete */}}
//           activeOpacity={0.85}
//         >
//           <Text style={{
//             color: 'white',
//             fontWeight: '600',
//             fontSize: 15
//           }}>🗑️ Delete</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={{
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F9FAFB',
//       }}>
//         <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
//         <View style={{
//           backgroundColor: 'white',
//           borderRadius: 20,
//           padding: 32,
//           alignItems: 'center',
//           shadowColor: '#8B5CF6',
//           shadowOffset: { width: 0, height: 8 },
//           shadowOpacity: 0.15,
//           shadowRadius: 20,
//           elevation: 10,
//           borderWidth: 1,
//           borderColor: '#F3E8FF'
//         }}>
//           <View style={{
//             width: 64,
//             height: 64,
//             backgroundColor: '#F3E8FF',
//             borderRadius: 32,
//             alignItems: 'center',
//             justifyContent: 'center',
//             marginBottom: 16,
//             borderWidth: 2,
//             borderColor: '#E9D5FF'
//           }}>
//             <Text style={{ fontSize: 28 }}>📚</Text>
//           </View>
//           <Text style={{
//             color: '#7C3AED',
//             fontSize: 20,
//             fontWeight: '700'
//           }}>Loading your books...</Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={{
//       flex: 1,
//       backgroundColor: '#F9FAFB',
//     }}>
//       <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
      
//       {/* Custom Header */}
//       <View style={{
//         backgroundColor: '#7C3AED',
//         paddingTop: 56,
//         paddingBottom: 24,
//         paddingHorizontal: 20,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         shadowColor: '#7C3AED',
//         shadowOffset: { width: 0, height: 6 },
//         shadowOpacity: 0.3,
//         shadowRadius: 15,
//         elevation: 10
//       }}>
//         <View style={{ flex: 1 }}>
//           <Text style={{
//             color: 'white',
//             fontSize: 28,
//             fontWeight: '800',
//             marginBottom: 4
//           }}>📚 My Library</Text>
//           <Text style={{
//             color: '#E9D5FF',
//             fontSize: 14,
//             fontWeight: '500'
//           }}>
//             {loading ? 'Loading...' : `${books.length} ${books.length === 1 ? 'book' : 'books'} in collection`}
//           </Text>
//         </View>

//         <TouchableOpacity 
//           onPress={() => router.push("/add-book")}
//           style={{
//             backgroundColor: 'rgba(255, 255, 255, 0.2)',
//             borderRadius: 20,
//             padding: 12,
//             borderWidth: 1,
//             borderColor: 'rgba(255, 255, 255, 0.3)'
//           }}
//           activeOpacity={0.7}
//         >
//           <Text style={{
//             color: 'white',
//             fontSize: 24,
//             fontWeight: 'bold'
//           }}>➕</Text>
//         </TouchableOpacity>
//       </View>
      
//       {books.length === 0 ? (
//         <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 32 }}>
//           <View style={{
//             alignItems: 'center',
//             backgroundColor: 'white',
//             borderRadius: 24,
//             marginTop: 20,
//             paddingVertical: 64,
//             paddingHorizontal: 32,
//             shadowColor: '#8B5CF6',
//             shadowOffset: { width: 0, height: 8 },
//             shadowOpacity: 0.12,
//             shadowRadius: 20,
//             elevation: 8,
//             borderWidth: 1,
//             borderColor: '#F3E8FF'
//           }}>
//             <View style={{
//               width: 96,
//               height: 96,
//               backgroundColor: '#F3E8FF',
//               borderRadius: 48,
//               alignItems: 'center',
//               justifyContent: 'center',
//               marginBottom: 24,
//               borderWidth: 3,
//               borderColor: '#E9D5FF'
//             }}>
//               <Text style={{ fontSize: 48 }}>📚</Text>
//             </View>
//             <Text style={{
//               fontSize: 24,
//               fontWeight: '700',
//               color: '#1F2937',
//               marginBottom: 12,
//               textAlign: 'center'
//             }}>No books in your collection</Text>
//             <Text style={{
//               fontSize: 16,
//               color: '#6B7280',
//               textAlign: 'center',
//               paddingHorizontal: 20,
//               lineHeight: 24,
//               marginBottom: 32
//             }}>
//               Your book collection will appear here once you add some books.
//             </Text>
//             <TouchableOpacity
//               onPress={() => router.push("/add-book")}
//               style={{
//                 backgroundColor: '#7C3AED',
//                 paddingVertical: 16,
//                 paddingHorizontal: 32,
//                 borderRadius: 16,
//                 shadowColor: '#7C3AED',
//                 shadowOffset: { width: 0, height: 4 },
//                 shadowOpacity: 0.3,
//                 shadowRadius: 10,
//                 elevation: 6
//               }}
//               activeOpacity={0.85}
//             >
//               <Text style={{
//                 color: 'white',
//                 fontSize: 18,
//                 fontWeight: '700'
//               }}>➕ Add Your First Book</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       ) : (
//         <FlatList
//           data={books}
//           keyExtractor={(item) => item.id!}
//           renderItem={renderBookItem}
//           contentContainerStyle={{ 
//             padding: 20,
//             paddingTop: 24
//           }}
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </View>
//   );
// }



// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   Alert,
//   ScrollView,
//   Image,
//   StatusBar,
// } from "react-native";
// import { BookService } from "@/service/bookService";
// import { Book } from "@/types/book";
// import { auth } from "@/firebase";
// import { router } from "expo-router";

// interface EnhancedBook extends Book {
//   coverImage?: string;
//   description?: string;
// }

// export default function LibraryScreen() {
//   const userId = auth.currentUser?.uid ?? "guest";
//   const [books, setBooks] = useState<EnhancedBook[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadBooks = async () => {
//     try {
//       setLoading(true);
//       const data = await BookService.getBooksByUser(userId);
//       setBooks(data);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to load books");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadBooks();
//   }, []);

//   /** ⬇️ delete logic added here */
//   const handleDelete = (id: string, title: string) => {
//     Alert.alert(
//       "Delete Book",
//       `Are you sure you want to delete “${title}”?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await BookService.deleteBook(id);
//               // reload books after deletion
//               loadBooks();
//               Alert.alert("Deleted", "Book deleted successfully");
//             } catch (err) {
//               console.error(err);
//               Alert.alert("Error", "Failed to delete book");
//             }
//           },
//         },
//       ]
//     );
//   };

//   const renderBookItem = ({ item }: { item: EnhancedBook }) => (
//     <View
//       style={{
//         backgroundColor: "white",
//         borderRadius: 16,
//         padding: 20,
//         marginBottom: 16,
//         shadowColor: "#8B5CF6",
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.08,
//         shadowRadius: 12,
//         elevation: 4,
//         borderWidth: 1,
//         borderColor: "#F3E8FF",
//       }}
//     >
//       <View style={{ flexDirection: "row", marginBottom: 16 }}>
//         {item.coverImage ? (
//           <Image
//             source={{ uri: item.coverImage }}
//             style={{
//               width: 72,
//               height: 96,
//               borderRadius: 12,
//               marginRight: 16,
//             }}
//           />
//         ) : (
//           <View
//             style={{
//               width: 72,
//               height: 96,
//               backgroundColor: "#F3E8FF",
//               borderRadius: 12,
//               marginRight: 16,
//               alignItems: "center",
//               justifyContent: "center",
//               borderWidth: 1.5,
//               borderColor: "#E9D5FF",
//             }}
//           >
//             <Text style={{ fontSize: 32 }}>📚</Text>
//           </View>
//         )}

//         <View style={{ flex: 1 }}>
//           <Text
//             style={{
//               fontSize: 18,
//               fontWeight: "700",
//               color: "#1F2937",
//               marginBottom: 6,
//             }}
//             numberOfLines={2}
//           >
//             {item.title}
//           </Text>
//           <Text
//             style={{
//               fontSize: 15,
//               fontWeight: "600",
//               color: "#7C3AED",
//               marginBottom: 8,
//             }}
//             numberOfLines={1}
//           >
//             by {item.author}
//           </Text>
//           {item.genre && (
//             <View
//               style={{
//                 alignSelf: "flex-start",
//                 backgroundColor: "#F3E8FF",
//                 borderRadius: 20,
//                 paddingHorizontal: 12,
//                 paddingVertical: 4,
//                 marginBottom: 6,
//                 borderWidth: 1,
//                 borderColor: "#E9D5FF",
//               }}
//             >
//               <Text
//                 style={{
//                   color: "#7C3AED",
//                   fontSize: 13,
//                   fontWeight: "500",
//                 }}
//               >
//                 {item.genre}
//               </Text>
//             </View>
//           )}
//           {item.description && (
//             <Text
//               style={{ color: "#6B7280", fontSize: 14, lineHeight: 20 }}
//               numberOfLines={2}
//             >
//               {item.description}
//             </Text>
//           )}
//         </View>
//       </View>

//       <View
//         style={{
//           flexDirection: "row",
//           paddingTop: 16,
//           borderTopWidth: 1,
//           borderTopColor: "#F3F4F6",
//         }}
//       >
//         <TouchableOpacity
//           style={{
//             flex: 2,
//             backgroundColor: "#7C3AED",
//             paddingVertical: 14,
//             borderRadius: 12,
//             alignItems: "center",
//             marginRight: 12,
//           }}
//           onPress={() => {
//             Alert.alert(
//               item.title,
//               `Author: ${item.author}\n${
//                 item.genre ? `Genre: ${item.genre}\n` : ""
//               }${
//                 item.description
//                   ? `\nDescription: ${item.description}`
//                   : ""
//               }`,
//               [{ text: "OK" }]
//             );
//           }}
//           activeOpacity={0.85}
//         >
//           <Text
//             style={{
//               color: "white",
//               fontWeight: "600",
//               fontSize: 15,
//             }}
//           >
//             👁️ View Details
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={{
//             flex: 1,
//             backgroundColor: "#EF4444",
//             paddingVertical: 14,
//             borderRadius: 12,
//             alignItems: "center",
//           }}
//           onPress={() => handleDelete(item.id!, item.title)}
//           activeOpacity={0.85}
//         >
//           <Text
//             style={{
//               color: "white",
//               fontWeight: "600",
//               fontSize: 15,
//             }}
//           >
//             🗑️ Delete
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

// if (loading) {
//   return (
//     <View
//       className="flex-1 justify-center items-center bg-violet-100"
//     >
//       <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
//       <Text className="mt-3 text-violet-800">Loading your books...</Text>
//     </View>
//   );
// }


//   return (
//     <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
//       <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />

//       {/* Header */}
//       <View
//         style={{
//           backgroundColor: "#7C3AED",
//           paddingTop: 56,
//           paddingBottom: 24,
//           paddingHorizontal: 20,
//           flexDirection: "row",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <View style={{ flex: 1 }}>
//           <Text
//             style={{
//               color: "white",
//               fontSize: 28,
//               fontWeight: "800",
//               marginBottom: 4,
//             }}
//           >
//             📚 My Library
//           </Text>
//           <Text
//             style={{
//               color: "#E9D5FF",
//               fontSize: 14,
//               fontWeight: "500",
//             }}
//           >
//             {books.length} {books.length === 1 ? "book" : "books"} in collection
//           </Text>
//         </View>

//         <TouchableOpacity
//           onPress={() => router.push("/add-book")}
//           style={{
//             backgroundColor: "rgba(255, 255, 255, 0.2)",
//             borderRadius: 20,
//             padding: 12,
//             borderWidth: 1,
//             borderColor: "rgba(255, 255, 255, 0.3)",
//           }}
//         >
//           <Text
//             style={{ color: "white", fontSize: 24, fontWeight: "bold" }}
//           >
//             ➕
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={books}
//         keyExtractor={(item) => item.id!}
//         renderItem={renderBookItem}
//         contentContainerStyle={{ padding: 20, paddingTop: 24 }}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// }



import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  Image,
  StatusBar,
  TextInput,
} from "react-native";
import { BookService } from "@/service/bookService";
import { Book } from "@/types/book";
import { auth } from "@/firebase";
import { router } from "expo-router";

interface EnhancedBook extends Book {
  coverImage?: string;
  description?: string;
}

export default function LibraryScreen() {
  const userId = auth.currentUser?.uid ?? "guest";
  const [books, setBooks] = useState<EnhancedBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<EnhancedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await BookService.getBooksByUser(userId);
      setBooks(data);
      setFilteredBooks(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  // Filter books based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.genre && book.genre.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredBooks(filtered);
    }
  }, [searchQuery, books]);

  useEffect(() => {
    loadBooks();
  }, []);

  /** ⬇️ delete logic added here */
  const handleDelete = (id: string, title: string) => {
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
              // reload books after deletion
              loadBooks();
              Alert.alert("Deleted", "Book deleted successfully");
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to delete book");
            }
          },
        },
      ]
    );
  };

  const renderBookItem = ({ item }: { item: EnhancedBook }) => (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#8B5CF6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#F3E8FF",
      }}
    >
      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        {item.coverImage ? (
          <Image
            source={{ uri: item.coverImage }}
            style={{
              width: 72,
              height: 96,
              borderRadius: 12,
              marginRight: 16,
            }}
          />
        ) : (
          <View
            style={{
              width: 72,
              height: 96,
              backgroundColor: "#F3E8FF",
              borderRadius: 12,
              marginRight: 16,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1.5,
              borderColor: "#E9D5FF",
            }}
          >
            <Text style={{ fontSize: 32 }}>📚</Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: 6,
            }}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
              color: "#7C3AED",
              marginBottom: 8,
            }}
            numberOfLines={1}
          >
            by {item.author}
          </Text>
          {item.genre && (
            <View
              style={{
                alignSelf: "flex-start",
                backgroundColor: "#F3E8FF",
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 4,
                marginBottom: 6,
                borderWidth: 1,
                borderColor: "#E9D5FF",
              }}
            >
              <Text
                style={{
                  color: "#7C3AED",
                  fontSize: 13,
                  fontWeight: "500",
                }}
              >
                {item.genre}
              </Text>
            </View>
          )}
          {item.description && (
            <Text
              style={{ color: "#6B7280", fontSize: 14, lineHeight: 20 }}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",
        }}
      >
        <TouchableOpacity
          style={{
            flex: 2,
            backgroundColor: "#7C3AED",
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
            marginRight: 12,
          }}
          onPress={() => {
            Alert.alert(
              item.title,
              `Author: ${item.author}\n${
                item.genre ? `Genre: ${item.genre}\n` : ""
              }${
                item.description
                  ? `\nDescription: ${item.description}`
                  : ""
              }`,
              [{ text: "OK" }]
            );
          }}
          activeOpacity={0.85}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "600",
              fontSize: 15,
            }}
          >
            👁️ View Details
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#EF4444",
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
          }}
          onPress={() => handleDelete(item.id!, item.title)}
          activeOpacity={0.85}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "600",
              fontSize: 15,
            }}
          >
            🗑️ Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F3E8FF",
        }}
      >
        <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
        <Text style={{ marginTop: 12, color: "#7C3AED", fontSize: 16 }}>
          Loading your books...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#7C3AED",
          paddingTop: 56,
          paddingBottom: 24,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "800",
              marginBottom: 4,
            }}
          >
            📚 My Library
          </Text>
          <Text
            style={{
              color: "#E9D5FF",
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} 
            {searchQuery ? " found" : " in collection"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/add-book")}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: 20,
            padding: 12,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.3)",
          }}
        >
          <Text
            style={{ color: "white", fontSize: 24, fontWeight: "bold" }}
          >
            ➕
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View
        style={{
          backgroundColor: "white",
          marginHorizontal: 20,
          marginTop: 16,
          marginBottom: 8,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#8B5CF6",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
          borderWidth: 1,
          borderColor: searchQuery ? "#8B5CF6" : "#E9D5FF",
        }}
      >
        <Text style={{ fontSize: 18, marginRight: 12, color: "#8B5CF6" }}>
          🔍
        </Text>
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            color: "#1F2937",
            paddingVertical: 4,
          }}
          placeholder="Search by title, author, or genre..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={{
              padding: 4,
              borderRadius: 12,
              backgroundColor: "#F3E8FF",
            }}
          >
            <Text style={{ fontSize: 14, color: "#8B5CF6" }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* No Results Message */}
      {filteredBooks.length === 0 && searchQuery.length > 0 && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 40,
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ fontSize: 40, marginBottom: 12 }}>📖</Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#7C3AED",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            No books found
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            Try searching with different keywords or check your spelling
          </Text>
        </View>
      )}

      {/* Books List */}
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id!}
        renderItem={renderBookItem}
        contentContainerStyle={{ 
          padding: 20, 
          paddingTop: 16,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}