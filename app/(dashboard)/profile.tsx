// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   Image,
//   Modal,
//   TextInput,
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

// const READING_STATUS_OPTIONS = [
//   { value: "want-to-read", label: "📚 Want to Read", color: "#8B5CF6", shortLabel: "📚" },
//   { value: "currently-reading", label: "📖 Currently Reading", color: "#06B6D4", shortLabel: "📖" },
//   { value: "finished", label: "✅ Finished", color: "#10B981", shortLabel: "✅" }
// ];

// export default function BooksListScreen() {
//   const router = useRouter();
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
//       Alert.alert("Status Updated", `Book marked as ${statusLabel}`);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to update status");
//     }
//   };

//   const handleDelete = async (id: string, title: string) => {
//     Alert.alert(
//       "Delete Book",
//       `Are you sure you want to delete "${title}"?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await BookService.deleteBook(id);
//               loadBooks();
//             } catch (err) {
//               console.error(err);
//               Alert.alert("Error", "Failed to delete book");
//             }
//           }
//         }
//       ]
//     );
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
//       Alert.alert("Review Saved", "Your review has been saved successfully");
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to save review");
//     }
//   };

//   const renderStars = (currentRating: number, onPress?: (rating: number) => void, size: number = 16) => {
//     return (
//       <View style={styles.starsContainer}>
//         {[1, 2, 3, 4, 5].map((star) => (
//           <TouchableOpacity
//             key={star}
//             onPress={() => onPress && onPress(star)}
//             disabled={!onPress}
//           >
//             <Text style={[styles.star, { fontSize: size }]}>
//               {star <= currentRating ? "⭐" : "☆"}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
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

//   const renderBookItem = ({ item }: { item: EnhancedBook }) => {
//     const statusInfo = getStatusInfo(item.readingStatus);
    
//     return (
//       <View style={styles.bookItem}>
//         {/* Book Header */}
//         <View style={styles.bookHeader}>
//           <View style={styles.bookContent}>
//             {item.coverImage ? (
//               <Image source={{ uri: item.coverImage }} style={styles.coverImage} />
//             ) : (
//               <View style={styles.placeholderImage}>
//                 <Text style={styles.placeholderText}>📚</Text>
//               </View>
//             )}
            
//             <View style={styles.bookDetails}>
//               <Text style={styles.bookTitle} numberOfLines={2}>
//                 {item.title}
//               </Text>
//               <Text style={styles.bookAuthor} numberOfLines={1}>
//                 by {item.author}
//               </Text>
//               {item.genre && (
//                 <Text style={styles.bookGenre} numberOfLines={1}>
//                   {item.genre}
//                 </Text>
//               )}
              
//               <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
//                 <Text style={styles.statusText}>{statusInfo.label}</Text>
//               </View>
              
//               {item.rating && item.rating > 0 && (
//                 <View style={styles.ratingContainer}>
//                   {renderStars(item.rating)}
//                   <Text style={styles.ratingText}>({item.rating}/5)</Text>
//                 </View>
//               )}
//             </View>
//           </View>
//         </View>

//         {/* Tags */}
//         {item.tags && item.tags.length > 0 && (
//           <View style={styles.tagsRow}>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {item.tags.map(tag => (
//                 <View key={tag} style={styles.tag}>
//                   <Text style={styles.tagText}>{tag}</Text>
//                 </View>
//               ))}
//             </ScrollView>
//           </View>
//         )}

//         {/* Review Preview */}
//         {item.review && (
//           <View style={styles.reviewPreview}>
//             <Text style={styles.reviewText} numberOfLines={2}>
//               "{item.review}"
//             </Text>
//           </View>
//         )}

//         {/* Quick Status Actions */}
//         <View style={styles.quickActions}>
//           {READING_STATUS_OPTIONS.map((status) => (
//             <TouchableOpacity
//               key={status.value}
//               style={[
//                 styles.quickActionButton,
//                 { backgroundColor: status.color },
//                 item.readingStatus === status.value && styles.activeQuickAction
//               ]}
//               onPress={() => handleQuickStatusChange(item.id!, status.value as ReadingStatus)}
//             >
//               <Text style={styles.quickActionText}>
//                 {status.shortLabel}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
        
//         {/* Action Buttons */}
//         <View style={styles.bookActions}>
//           <TouchableOpacity
//             style={styles.reviewButton}
//             onPress={() => openReviewModal(item)}
//           >
//             <Text style={styles.reviewButtonText}>⭐ Review</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={styles.editButton}
//             onPress={() => router.push(`/books/edit/${item.id}`)}
//           >
//             <Text style={styles.editButtonText}>✏️ Edit</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={styles.deleteButton}
//             onPress={() => handleDelete(item.id!, item.title)}
//           >
//             <Text style={styles.deleteButtonText}>🗑️</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   const stats = getBookStats();

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.heading}>📖 My Library</Text>
//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={() => router.push('/books/add')}
//         >
//           <Text style={styles.addButtonText}>➕ Add Book</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Stats Cards */}
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
//         <View style={styles.statCard}>
//           <Text style={styles.statNumber}>{stats.total}</Text>
//           <Text style={styles.statLabel}>Total Books</Text>
//         </View>
//         <View style={styles.statCard}>
//           <Text style={styles.statNumber}>{stats.currentlyReading}</Text>
//           <Text style={styles.statLabel}>Currently Reading</Text>
//         </View>
//         <View style={styles.statCard}>
//           <Text style={styles.statNumber}>{stats.finished}</Text>
//           <Text style={styles.statLabel}>Finished</Text>
//         </View>
//         <View style={styles.statCard}>
//           <Text style={styles.statNumber}>{stats.avgRating.toFixed(1)}</Text>
//           <Text style={styles.statLabel}>Avg Rating</Text>
//         </View>
//       </ScrollView>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search books, authors, genres, tags..."
//           placeholderTextColor="#A855F7"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>

//       {/* Filter Tabs */}
//       <View style={styles.filterContainer}>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           <TouchableOpacity
//             style={[styles.filterTab, activeFilter === "all" && styles.activeFilterTab]}
//             onPress={() => setActiveFilter("all")}
//           >
//             <Text style={[styles.filterTabText, activeFilter === "all" && styles.activeFilterTabText]}>
//               All ({books.length})
//             </Text>
//           </TouchableOpacity>
          
//           {READING_STATUS_OPTIONS.map((status) => {
//             const count = books.filter(book => book.readingStatus === status.value).length;
//             return (
//               <TouchableOpacity
//                 key={status.value}
//                 style={[
//                   styles.filterTab,
//                   { borderColor: status.color },
//                   activeFilter === status.value && { ...styles.activeFilterTab, backgroundColor: status.color }
//                 ]}
//                 onPress={() => setActiveFilter(status.value as ReadingStatus)}
//               >
//                 <Text style={[
//                   styles.filterTabText,
//                   activeFilter === status.value && styles.activeFilterTabText
//                 ]}>
//                   {status.shortLabel} {status.label.split(' ').slice(1).join(' ')} ({count})
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </ScrollView>
//       </View>

//       {/* Books List */}
//       {filteredBooks.length === 0 ? (
//         <View style={styles.emptyState}>
//           <Text style={styles.emptyStateIcon}>
//             {searchQuery ? "🔍" : activeFilter === "all" ? "📚" : getStatusInfo(activeFilter as ReadingStatus).shortLabel}
//           </Text>
//           <Text style={styles.emptyStateText}>
//             {searchQuery 
//               ? `No books found for "${searchQuery}"`
//               : activeFilter === "all" 
//                 ? "No books in your library yet" 
//                 : `No books in ${activeFilter.replace('-', ' ')} list`
//             }
//           </Text>
//           <Text style={styles.emptyStateSubtext}>
//             {searchQuery 
//               ? "Try a different search term"
//               : "Add some books to get started!"
//             }
//           </Text>
//           {!searchQuery && (
//             <TouchableOpacity
//               style={styles.emptyActionButton}
//               onPress={() => router.push('/books/add')}
//             >
//               <Text style={styles.emptyActionButtonText}>➕ Add Your First Book</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       ) : (
//         <FlatList
//           data={filteredBooks}
//           keyExtractor={(item) => item.id!}
//           renderItem={renderBookItem}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.listContent}
//         />
//       )}

//       {/* Review Modal */}
//       <Modal
//         visible={showReviewModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowReviewModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>
//               Review: {selectedBookForReview?.title}
//             </Text>
            
//             <View style={styles.ratingSection}>
//               <Text style={styles.inputLabel}>Rating</Text>
//               {renderStars(rating, setRating, 28)}
//             </View>

//             <TextInput
//               style={[styles.reviewInput]}
//               placeholder="Write your review..."
//               placeholderTextColor="#A855F7"
//               value={review}
//               onChangeText={setReview}
//               multiline
//               numberOfLines={5}
//             />

//             <View style={styles.tagsSection}>
//               <Text style={styles.inputLabel}>Tags</Text>
//               <ScrollView style={styles.tagsScrollView}>
//                 <View style={styles.tagsGrid}>
//                   {PREDEFINED_TAGS.map(tag => (
//                     <TouchableOpacity
//                       key={tag}
//                       style={[styles.tagOption, selectedTags.includes(tag) && styles.selectedTagOption]}
//                       onPress={() => toggleTag(tag)}
//                     >
//                       <Text style={[styles.tagOptionText, selectedTags.includes(tag) && styles.selectedTagOptionText]}>
//                         {tag}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </ScrollView>
//             </View>

//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.cancelModalButton]}
//                 onPress={() => setShowReviewModal(false)}
//               >
//                 <Text style={styles.cancelModalButtonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalButton}
//                 onPress={saveReview}
//               >
//                 <Text style={styles.modalButtonText}>Save Review</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F3E8FF",
//     paddingTop: 20,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   heading: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#6B21A8",
//   },
//   addButton: {
//     backgroundColor: "#7C3AED",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   addButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },

//   // Stats Cards
//   statsContainer: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   statCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     padding: 16,
//     marginRight: 12,
//     alignItems: "center",
//     minWidth: 80,
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

//   // Search
//   searchContainer: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   searchInput: {
//     backgroundColor: "#FFFFFF",
//     borderWidth: 2,
//     borderColor: "#DDD6FE",
//     borderRadius: 12,
//     padding: 15,
//     fontSize: 16,
//     color: "#374151",
//   },

//   // Filter Tabs
//   filterContainer: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   filterTab: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 2,
//     borderColor: "#DDD6FE",
//     backgroundColor: "#FFFFFF",
//     marginRight: 8,
//   },
//   activeFilterTab: {
//     backgroundColor: "#7C3AED",
//     borderColor: "#7C3AED",
//   },
//   filterTabText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#7C3AED",
//   },
//   activeFilterTabText: {
//     color: "#FFFFFF",
//   },

//   // Books List
//   listContent: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   bookItem: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: "#6B21A8",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   bookHeader: {
//     marginBottom: 12,
//   },
//   bookContent: {
//     flexDirection: "row",
//   },
//   coverImage: {
//     width: 60,
//     height: 80,
//     borderRadius: 8,
//     marginRight: 12,
//   },
//   placeholderImage: {
//     width: 60,
//     height: 80,
//     borderRadius: 8,
//     marginRight: 12,
//     backgroundColor: "#E9D5FF",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   placeholderText: {
//     fontSize: 24,
//   },
//   bookDetails: {
//     flex: 1,
//   },
//   bookTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#1F2937",
//     marginBottom: 4,
//   },
//   bookAuthor: {
//     fontSize: 16,
//     color: "#7C3AED",
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   bookGenre: {
//     fontSize: 14,
//     color: "#A855F7",
//     fontWeight: "500",
//     marginBottom: 6,
//   },
//   statusBadge: {
//     alignSelf: "flex-start",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginBottom: 6,
//   },
//   statusText: {
//     color: "#FFFFFF",
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   ratingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   starsContainer: {
//     flexDirection: "row",
//   },
//   star: {
//     marginRight: 2,
//   },
//   ratingText: {
//     marginLeft: 8,
//     fontSize: 12,
//     color: "#6B7280",
//     fontWeight: "500",
//   },

//   // Tags
//   tagsRow: {
//     marginBottom: 12,
//   },
//   tag: {
//     backgroundColor: "#F3E8FF",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginRight: 6,
//     borderWidth: 1,
//     borderColor: "#DDD6FE",
//   },
//   tagText: {
//     fontSize: 12,
//     color: "#7C3AED",
//     fontWeight: "500",
//   },

//   // Review Preview
//   reviewPreview: {
//     backgroundColor: "#FAF5FF",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: "#A855F7",
//   },
//   reviewText: {
//     fontSize: 14,
//     color: "#4B5563",
//     fontStyle: "italic",
//     lineHeight: 20,
//   },

//   // Quick Actions
//   quickActions: {
//     flexDirection: "row",
//     marginBottom: 12,
//     gap: 8,
//   },
//   quickActionButton: {
//     flex: 1,
//     paddingVertical: 8,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   activeQuickAction: {
//     opacity: 1,
//     transform: [{ scale: 1.05 }],
//   },
//   quickActionText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "600",
//   },

//   // Book Actions
//   bookActions: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   reviewButton: {
//     flex: 2,
//     backgroundColor: "#A855F7",
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   reviewButtonText: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   editButton: {
//     flex: 1,
//     backgroundColor: "#06B6D4",
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   editButtonText: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   deleteButton: {
//     backgroundColor: "#EF4444",
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   deleteButtonText: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "600",
//   },

//   // Empty State
//   emptyState: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 40,
//   },
//   emptyStateIcon: {
//     fontSize: 64,
//     marginBottom: 16,
//   },
//   emptyStateText: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#6B7280",
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   emptyStateSubtext: {
//     fontSize: 16,
//     color: "#9CA3AF",
//     textAlign: "center",
//     marginBottom: 24,
//   },
//   emptyActionButton: {
//     backgroundColor: "#7C3AED",
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 24,
//   },
//   emptyActionButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },

//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 24,
//     width: "90%",
//     maxHeight: "80%",
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#7C3AED",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   ratingSection: {
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#7C3AED",
//     marginBottom: 8,
//   },
//   reviewInput: {
//     borderWidth: 2,
//     borderColor: "#DDD6FE",
//     borderRadius: 12,
//     padding: 15,
//     fontSize: 16,
//     color: "#374151",
//     height: 120,
//     textAlignVertical: "top",
//     marginBottom: 20,
//   },
//   tagsSection: {
//     marginBottom: 20,
//   },
//   tagsScrollView: {
//     maxHeight: 120,
//   },
//   tagsGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   tagOption: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     borderWidth: 2,
//     borderColor: "#DDD6FE",
//     backgroundColor: "#FFFFFF",
//   },
//   selectedTagOption: {
//     backgroundColor: "#7C3AED",
//     borderColor: "#7C3AED",
//   },
//   tagOptionText: {
//     fontSize: 14,
//     color: "#7C3AED",
//     fontWeight: "500",
//   },
//   selectedTagOptionText: {
//     color: "#FFFFFF",
//   },
//   modalButtons: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   modalButton: {
//     flex: 1,
//     backgroundColor: "#7C3AED",
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   modalButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   cancelModalButton: {
//     backgroundColor: "#E5E7EB",
//   },
//   cancelModalButtonText: {
//     color: "#6B7280",
//     fontSize: 16,
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

  updateBook: async (id:any, data:any) => {
    console.log('Updating book:', id, data);
    return { id, ...data };
  },
  deleteBook: async (id:any) => {
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
      alert(`Book marked as ${statusLabel}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await BookService.deleteBook(id);
        loadBooks();
      } catch (err) {
        console.error(err);
        alert("Failed to delete book");
      }
    }
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
      alert("Your review has been saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save review");
    }
  };

  const renderStars = (currentRating: number, onPress?: (rating: number) => void, size: string = "text-sm") => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onPress && onPress(star)}
            disabled={!onPress}
            className={`${size} mr-0.5 ${onPress ? 'cursor-pointer hover:scale-110' : ''}`}
          >
            {star <= currentRating ? "⭐" : "☆"}
          </button>
        ))}
      </div>
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
      <div key={item.id} className="bg-white rounded-2xl p-4 mb-4 shadow-lg border border-purple-100">
        {/* Book Header */}
        <div className="mb-3">
          <div className="flex">
            {item.coverImage ? (
              <img src={item.coverImage} alt={item.title} className="w-15 h-20 rounded-lg mr-3 object-cover" />
            ) : (
              <div className="w-15 h-20 rounded-lg mr-3 bg-purple-100 flex items-center justify-center">
                <span className="text-xl">📚</span>
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-purple-600 font-semibold mb-1 truncate">
                by {item.author}
              </p>
              {item.genre && (
                <p className="text-purple-500 font-medium text-sm mb-1.5 truncate">
                  {item.genre}
                </p>
              )}
              
              <div className={`inline-block px-2 py-1 rounded-xl text-xs font-semibold text-white mb-1.5 ${statusInfo.color}`}>
                {statusInfo.label}
              </div>
              
              {item.rating && item.rating > 0 && (
                <div className="flex items-center">
                  {renderStars(item.rating)}
                  <span className="ml-2 text-xs text-gray-600 font-medium">({item.rating}/5)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map(tag => (
                <span key={tag} className="bg-purple-50 text-purple-600 px-2 py-1 rounded-xl text-xs font-medium border border-purple-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Review Preview */}
        {item.review && (
          <div className="bg-purple-25 p-3 rounded-lg mb-3 border-l-4 border-purple-400">
            <p className="text-sm text-gray-600 italic line-clamp-2">
              "{item.review}"
            </p>
          </div>
        )}

        {/* Quick Status Actions */}
        <div className="flex gap-2 mb-3">
          {READING_STATUS_OPTIONS.map((status) => (
            <button
              key={status.value}
              className={`flex-1 py-2 rounded-lg text-white font-semibold text-sm transition-all ${status.color} ${
                item.readingStatus === status.value ? 'opacity-100 scale-105' : 'opacity-70 hover:opacity-90'
              }`}
              onClick={() => handleQuickStatusChange(item.id!, status.value as ReadingStatus)}
            >
              {status.shortLabel}
            </button>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            className="flex-2 bg-purple-500 hover:bg-purple-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
            onClick={() => openReviewModal(item)}
          >
            ⭐ Review
          </button>
          
          <button
            className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
            onClick={() => console.log('Edit book:', item.id)}
          >
            ✏️ Edit
          </button>
          
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors"
            onClick={() => handleDelete(item.id!, item.title)}
          >
            🗑️
          </button>
        </div>
      </div>
    );
  };

  const stats = getBookStats();

  return (
    <div className="min-h-screen bg-purple-50 pb-8">
      {/* Header */}
      <div className="flex justify-between items-center px-5 pt-5 mb-5">
        <h1 className="text-3xl font-bold text-purple-800">📖 My Library</h1>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-bold transition-colors"
          onClick={() => console.log('Add book')}
        >
          ➕ Add Book
        </button>
      </div>

      {/* Stats Cards */}
      <div className="flex overflow-x-auto px-5 mb-5 gap-3 pb-2">
        <div className="bg-white rounded-xl p-4 min-w-20 text-center shadow-sm border border-purple-100">
          <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
          <div className="text-xs text-gray-600 mt-1">Total Books</div>
        </div>
        <div className="bg-white rounded-xl p-4 min-w-20 text-center shadow-sm border border-purple-100">
          <div className="text-2xl font-bold text-purple-600">{stats.currentlyReading}</div>
          <div className="text-xs text-gray-600 mt-1">Currently Reading</div>
        </div>
        <div className="bg-white rounded-xl p-4 min-w-20 text-center shadow-sm border border-purple-100">
          <div className="text-2xl font-bold text-purple-600">{stats.finished}</div>
          <div className="text-xs text-gray-600 mt-1">Finished</div>
        </div>
        <div className="bg-white rounded-xl p-4 min-w-20 text-center shadow-sm border border-purple-100">
          <div className="text-2xl font-bold text-purple-600">{stats.avgRating.toFixed(1)}</div>
          <div className="text-xs text-gray-600 mt-1">Avg Rating</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-5 mb-5">
        <input
          className="w-full bg-white border-2 border-purple-200 rounded-xl p-4 text-base text-gray-700 placeholder-purple-400 focus:outline-none focus:border-purple-500"
          placeholder="Search books, authors, genres, tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="px-5 mb-5">
        <div className="flex overflow-x-auto pb-2 gap-2">
          <button
            className={`px-4 py-2 rounded-full border-2 whitespace-nowrap font-semibold text-sm transition-all ${
              activeFilter === "all" 
                ? 'bg-purple-600 border-purple-600 text-white' 
                : 'bg-white border-purple-200 text-purple-600 hover:bg-purple-50'
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All ({books.length})
          </button>
          
          {READING_STATUS_OPTIONS.map((status) => {
            const count = books.filter(book => book.readingStatus === status.value).length;
            return (
              <button
                key={status.value}
                className={`px-4 py-2 rounded-full border-2 whitespace-nowrap font-semibold text-sm transition-all ${
                  activeFilter === status.value 
                    ? `${status.color} border-purple-600 text-white` 
                    : 'bg-white border-purple-200 text-purple-600 hover:bg-purple-50'
                }`}
                onClick={() => setActiveFilter(status.value as ReadingStatus)}
              >
                {status.shortLabel} {status.label.split(' ').slice(1).join(' ')} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Books List */}
      <div className="px-5">
        {filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center py-16 px-10">
            <div className="text-6xl mb-4">
              {searchQuery ? "🔍" : activeFilter === "all" ? "📚" : getStatusInfo(activeFilter as ReadingStatus).shortLabel}
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2 text-center">
              {searchQuery 
                ? `No books found for "${searchQuery}"`
                : activeFilter === "all" 
                  ? "No books in your library yet" 
                  : `No books in ${activeFilter.replace('-', ' ')} list`
              }
            </h3>
            <p className="text-base text-gray-500 text-center mb-6">
              {searchQuery 
                ? "Try a different search term"
                : "Add some books to get started!"
              }
            </p>
            {!searchQuery && (
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-3xl font-bold transition-colors"
                onClick={() => console.log('Add first book')}
              >
                ➕ Add Your First Book
              </button>
            )}
          </div>
        ) : (
          <div>
            {filteredBooks.map(renderBookItem)}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-purple-600 mb-5 text-center">
              Review: {selectedBookForReview?.title}
            </h2>
            
            <div className="text-center mb-5">
              <p className="text-base font-semibold text-purple-600 mb-2">Rating</p>
              {renderStars(rating, setRating, "text-2xl")}
            </div>

            <textarea
              className="w-full border-2 border-purple-200 rounded-xl p-4 text-base text-gray-700 placeholder-purple-400 focus:outline-none focus:border-purple-500 h-30 resize-none mb-5"
              placeholder="Write your review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            <div className="mb-5">
              <p className="text-base font-semibold text-purple-600 mb-3">Tags</p>
              <div className="max-h-30 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_TAGS.map(tag => (
                    <button
                      key={tag}
                      className={`px-3 py-1.5 rounded-2xl border-2 text-sm font-medium transition-all ${
                        selectedTags.includes(tag) 
                          ? 'bg-purple-600 border-purple-600 text-white' 
                          : 'bg-white border-purple-200 text-purple-600 hover:bg-purple-50'
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-600 py-3 rounded-xl font-bold transition-colors"
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold transition-colors"
                onClick={saveReview}
              >
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}