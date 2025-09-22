

import { router } from "expo-router";
import React, { useEffect, useState} from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Image, ActivityIndicator } from 'react-native';
import { auth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { BookService } from "@/service/bookService"; // Import your real BookService
import { Book } from "@/types/book"; // Import your Book type

type ReadingStatus = "want-to-read" | "currently-reading" | "finished";

interface EnhancedBook extends Book {
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
  // Real Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [books, setBooks] = useState<EnhancedBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<EnhancedBook[]>([]);
  const [activeFilter, setActiveFilter] = useState<ReadingStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingBooks, setLoadingBooks] = useState(false);
  
  // Review Modal States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookForReview, setSelectedBookForReview] = useState<EnhancedBook | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [savingReview, setSavingReview] = useState(false);

  const PREDEFINED_TAGS = [
    "inspiring", "boring", "emotional", "funny", "dark", "romantic", 
    "thriller", "educational", "life-changing", "page-turner", "slow-paced",
    "thought-provoking", "heartwarming", "intense", "relaxing", "nostalgic"
  ];

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
      
      if (!user) {
        router.replace("/login");
      }
    });

    return unsubscribe;
  }, []);

  const loadBooks = async () => {
    if (!currentUser) return;
    
    try {
      setLoadingBooks(true);
      const data = await BookService.getBooksByUser(currentUser.uid);
      setBooks(data);
      filterBooks(data, activeFilter, searchQuery);
    } catch (err) {
      console.error("Error loading books:", err);
      Alert.alert("Error", "Failed to load books. Please try again.");
    } finally {
      setLoadingBooks(false);
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
    if (currentUser) {
      loadBooks();
    }
  }, [currentUser]);

  useEffect(() => {
    filterBooks(books, activeFilter, searchQuery);
  }, [books, activeFilter, searchQuery]);

  const handleQuickStatusChange = async (bookId: string, newStatus: ReadingStatus) => {
    if (!currentUser) {
      Alert.alert("Error", "Please log in to update books");
      return;
    }

    try {
      const updateData: any = { readingStatus: newStatus };
      
      if (newStatus === "currently-reading") {
        updateData.dateStarted = new Date().toISOString();
      } else if (newStatus === "finished") {
        updateData.dateFinished = new Date().toISOString();
      }
      
      await BookService.updateBook(bookId, updateData);
      await loadBooks(); // Reload to get updated data
      
      const statusLabel = READING_STATUS_OPTIONS.find(s => s.value === newStatus)?.label || newStatus;
      Alert.alert("Success", `Book marked as ${statusLabel}`);
    } catch (err) {
      console.error("Error updating book status:", err);
      Alert.alert("Error", "Failed to update status");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!currentUser) {
      Alert.alert("Error", "Please log in to delete books");
      return;
    }

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
              await loadBooks();
              Alert.alert("Success", "Book deleted successfully");
            } catch (err) {
              console.error("Error deleting book:", err);
              Alert.alert("Error", "Failed to delete book");
            }
          }
        }
      ]
    );
  };

  const openReviewModal = (book: EnhancedBook) => {
    if (!currentUser) {
      Alert.alert("Error", "Please log in to write reviews");
      return;
    }

    setSelectedBookForReview(book);
    setRating(book.rating || 0);
    setReview(book.review || "");
    setSelectedTags(book.tags || []);
    setShowReviewModal(true);
  };

  const saveReview = async () => {
    if (!selectedBookForReview || !currentUser) return;
    
    try {
      setSavingReview(true);
      await BookService.updateBook(selectedBookForReview.id!, {
        rating,
        review,
        tags: selectedTags
      });
      
      setShowReviewModal(false);
      setSelectedBookForReview(null);
      await loadBooks(); // Reload to show updated review
      Alert.alert("Success", "Your review has been saved successfully");
    } catch (err) {
      console.error("Error saving review:", err);
      Alert.alert("Error", "Failed to save review");
    } finally {
      setSavingReview(false);
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
              <Image
                source={{ uri: item.coverImage }}
                className="w-18 h-24 rounded-lg mr-3"
                style={{ resizeMode: 'cover' }}
              />
            ) : (
              <View className="w-18 h-24 rounded-lg mr-3 bg-purple-100 items-center justify-center">
                <Text className="text-2xl">📚</Text>
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

        {/* Description */}
        {item.description && (
          <View className="mb-3">
            <Text className="text-sm text-gray-600 leading-5" numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        )}

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
        <View className="flex-row gap-1.5">
          <TouchableOpacity
            className="flex-1 bg-purple-500 py-2 rounded-lg items-center"
            onPress={() => openReviewModal(item)}
          >
            <Text className="text-white text-xs font-semibold">⭐ Review</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 bg-cyan-500 py-2 rounded-lg items-center"
            onPress={() => console.log('Edit book:', item.id)}
          >
            <Text className="text-white text-xs font-semibold">✏️ Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-red-500 py-2 px-2.5 rounded-lg items-center"
            onPress={() => handleDelete(item.id!, item.title)}
          >
            <Text className="text-white text-xs font-semibold">🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <View className="flex-1 bg-purple-50 items-center justify-center">
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text className="text-xl font-bold text-purple-600 mt-4">Loading...</Text>
      </View>
    );
  }

  // Show message if user is not authenticated
  if (!currentUser) {
    return (
      <View className="flex-1 bg-purple-50 items-center justify-center px-6">
        <Text className="text-6xl mb-4">🔒</Text>
        <Text className="text-xl font-bold text-gray-600 mb-2 text-center">
          Please Log In
        </Text>
        <Text className="text-base text-gray-500 text-center mb-6">
          You need to be logged in to view your book library.
        </Text>
        <TouchableOpacity
          className="bg-purple-600 px-6 py-3 rounded-xl"
          onPress={() => router.push("/login")}
        >
          <Text className="text-white font-bold">Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const stats = getBookStats();

  return (
    <ScrollView className="flex-1 bg-purple-50">
      <View className="pb-8">
        {/* Header with user info */}
        <View className="flex-row justify-between items-center px-5 pt-12 mb-8">
          <View>
            <Text className="text-3xl font-bold text-purple-800">📖 My Library</Text>
            <Text className="text-sm text-purple-600 mt-1">
              Welcome, {currentUser.email?.split('@')[0]}!
            </Text>
          </View>
          <TouchableOpacity
            className="bg-purple-600 px-4 py-2 rounded-full"
            onPress={() => router.push("/add-book")}
          >
            <Text className="text-white font-bold">➕ Add Book</Text>
          </TouchableOpacity>
        </View>

        {/* Loading indicator for books */}
        {loadingBooks && (
          <View className="items-center mb-4">
            <ActivityIndicator size="small" color="#7C3AED" />
            <Text className="text-purple-600 text-sm mt-2">Loading your books...</Text>
          </View>
        )}

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
                  onPress={() => router.push("/add-book")}
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
                    disabled={savingReview}
                  >
                    <Text className="text-gray-600 font-bold">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`flex-1 py-3 rounded-xl items-center ${savingReview ? 'bg-purple-400' : 'bg-purple-600'}`}
                    onPress={saveReview}
                    disabled={savingReview}
                  >
                    <Text className="text-white font-bold">
                      {savingReview ? "Saving..." : "Save Review"}
                    </Text>
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