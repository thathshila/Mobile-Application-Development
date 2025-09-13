import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { BookService } from "@/service/bookService";
import { Book } from "@/types/book";
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
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<ExploreBook | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ReadingStatus>("want-to-read");

  const READING_STATUS_OPTIONS = [
    { value: "want-to-read", label: "Want to Read", color: "#8B5CF6", icon: "📚" },
    { value: "currently-reading", label: "Currently Reading", color: "#06B6D4", icon: "📖" },
    { value: "finished", label: "Finished", color: "#10B981", icon: "✅" }
  ];

  const loadMyBooks = async () => {
    try {
      const data = await BookService.getBooksByUser(userId);
      setMyBooks(data);
      updateExploreBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateExploreBooks = (userBooks: Book[]) => {
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
    if (!selectedBook) return;

    try {
      const bookData = {
        title: selectedBook.title,
        author: selectedBook.author,
        genre: selectedBook.genre || "",
        description: selectedBook.description || "",
        notes: "",
        readingStatus: selectedStatus,
        userId
      };

      await BookService.addBook(bookData);
      setShowAddModal(false);
      setSelectedBook(null);
      Alert.alert("Added to Library", `"${selectedBook.title}" has been added to your library!`);
      loadMyBooks(); // Refresh to update isInLibrary status
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to add book to library");
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text key={star} style={styles.star}>
            {star <= rating ? "⭐" : "☆"}
          </Text>
        ))}
      </View>
    );
  };

  const renderGenreChip = (genre: string) => (
    <TouchableOpacity
      key={genre}
      style={[
        styles.genreChip,
        selectedGenre === genre && styles.selectedGenreChip
      ]}
      onPress={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
    >
      <Text style={[
        styles.genreChipText,
        selectedGenre === genre && styles.selectedGenreChipText
      ]}>
        {genre}
      </Text>
    </TouchableOpacity>
  );

  const renderBookItem = ({ item }: { item: ExploreBook }) => (
    <View style={styles.bookItem}>
      <View style={styles.bookContent}>
        {item.coverImage ? (
          <Image source={{ uri: item.coverImage }} style={styles.coverImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>📚</Text>
          </View>
        )}
        
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            by {item.author}
          </Text>
          {item.genre && (
            <Text style={styles.bookGenre} numberOfLines={1}>
              {item.genre}
            </Text>
          )}
          
          {item.publicRating && (
            <View style={styles.ratingContainer}>
              {renderStars(item.publicRating)}
              <Text style={styles.ratingText}>({item.publicRating}/5)</Text>
            </View>
          )}
          
          {item.description && (
            <Text style={styles.bookDescription} numberOfLines={3}>
              {item.description}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.bookActions}>
        {item.isInLibrary ? (
          <View style={styles.inLibraryBadge}>
            <Text style={styles.inLibraryText}>✓ In Library</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToLibrary(item)}
          >
            <Text style={styles.addButtonText}>+ Add to Library</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>🔍 Explore Books</Text>
        <Text style={styles.subheading}>Discover your next great read</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search books, authors..."
          placeholderTextColor="#A855F7"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Genre Filter */}
      <View style={styles.genreContainer}>
        <Text style={styles.sectionTitle}>Genres</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genreScroll}>
          {POPULAR_GENRES.map(renderGenreChip)}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
          {selectedGenre && ` in ${selectedGenre}`}
        </Text>
        {selectedGenre && (
          <TouchableOpacity onPress={() => setSelectedGenre(null)}>
            <Text style={styles.clearFilterText}>Clear Filter</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Books List */}
      {filteredBooks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🔍</Text>
          <Text style={styles.emptyStateText}>No books found</Text>
          <Text style={styles.emptyStateSubtext}>
            Try adjusting your search or filters
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          renderItem={renderBookItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Add to Library Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add to Library</Text>
            
            {selectedBook && (
              <View style={styles.modalBookInfo}>
                <Text style={styles.modalBookTitle}>{selectedBook.title}</Text>
                <Text style={styles.modalBookAuthor}>by {selectedBook.author}</Text>
              </View>
            )}
            
            <Text style={styles.statusLabel}>Choose reading status:</Text>
            
            {READING_STATUS_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusOption,
                  selectedStatus === option.value && { ...styles.selectedStatusOption, backgroundColor: option.color }
                ]}
                onPress={() => setSelectedStatus(option.value as ReadingStatus)}
              >
                <Text style={styles.statusIcon}>{option.icon}</Text>
                <Text style={[
                  styles.statusText,
                  selectedStatus === option.value && styles.selectedStatusText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmAddBook}
              >
                <Text style={styles.confirmButtonText}>Add Book</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E8FF",
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6B21A8",
  },
  subheading: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 4,
  },
  
  // Search
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#DDD6FE",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#374151",
  },
  
  // Genres
  genreContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  genreScroll: {
    paddingLeft: 20,
  },
  genreChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#DDD6FE",
    marginRight: 8,
  },
  selectedGenreChip: {
    backgroundColor: "#7C3AED",
    borderColor: "#7C3AED",
  },
  genreChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7C3AED",
  },
  selectedGenreChipText: {
    color: "#FFFFFF",
  },
  
  // Results
  resultsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  clearFilterText: {
    fontSize: 14,
    color: "#7C3AED",
    fontWeight: "600",
  },
  
  // Books List
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bookItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#6B21A8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bookContent: {
    flexDirection: "row",
    marginBottom: 12,
  },
  coverImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  placeholderImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: "#E9D5FF",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 32,
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
    lineHeight: 24,
  },
  bookAuthor: {
    fontSize: 16,
    color: "#7C3AED",
    fontWeight: "600",
    marginBottom: 4,
  },
  bookGenre: {
    fontSize: 14,
    color: "#A855F7",
    fontWeight: "500",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: "row",
  },
  star: {
    fontSize: 14,
    marginRight: 2,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  bookDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  
  // Book Actions
  bookActions: {
    alignItems: "flex-end",
  },
  addButton: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  inLibraryBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  inLibraryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7C3AED",
    marginBottom: 16,
    textAlign: "center",
  },
  modalBookInfo: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalBookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 4,
  },
  modalBookAuthor: {
    fontSize: 16,
    color: "#7C3AED",
    fontWeight: "500",
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginBottom: 8,
  },
  selectedStatusOption: {
    borderColor: "#7C3AED",
  },
  statusIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  selectedStatusText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#7C3AED",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  }
});