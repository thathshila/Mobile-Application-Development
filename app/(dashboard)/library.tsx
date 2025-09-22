


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