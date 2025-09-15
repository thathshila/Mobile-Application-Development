import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { BookService } from "@/service/bookService";
import { Book } from "@/types/book";
import { auth } from "@/firebase";
import { router } from "expo-router";

interface EnhancedBook extends Book {
  coverImage?: string;
  description?: string;
}

 export default function BooksScreen() {
  const userId = auth.currentUser?.uid ?? "guest";
  const [books, setBooks] = useState<EnhancedBook[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await BookService.getBooksByUser(userId);
      setBooks(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const renderBookItem = ({ item }: { item: EnhancedBook }) => (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow">
      <View className="flex-row mb-3">
        {item.coverImage ? (
          <Image source={{ uri: item.coverImage }} className="w-16 h-20 rounded-lg mr-3" />
        ) : (
          <View className="w-16 h-20 bg-purple-100 rounded-lg mr-3 items-center justify-center">
            <Text className="text-2xl">📚</Text>
          </View>
        )}

        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={2}>
            {item.title}
          </Text>
          <Text className="text-purple-600 font-semibold text-sm mb-1" numberOfLines={1}>
            by {item.author}
          </Text>
          {item.genre && (
            <View className="self-start bg-purple-100 rounded-xl px-2 py-0.5 mb-1">
              <Text className="text-purple-600 text-xs">{item.genre}</Text>
            </View>
          )}
          {item.description && (
            <Text className="text-gray-500 text-xs" numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
      </View>

      <View className="flex-row space-x-3">
        <TouchableOpacity
          className="flex-2 bg-purple-600 py-3 rounded-lg items-center"
          onPress={() => {
            Alert.alert(
              item.title,
              `Author: ${item.author}\n${item.genre ? `Genre: ${item.genre}\n` : ''}${item.description ? `\nDescription: ${item.description}` : ''}`,
              [{ text: "OK" }]
            );
          }}
        >
          <Text className="text-white font-semibold">👁️ View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-red-500 py-3 rounded-lg items-center"
          onPress={() => {/* handle delete */}}
        >
          <Text className="text-white font-semibold">🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-50">
        <Text className="text-purple-600 text-lg">📚 Loading your books...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-purple-50">
    {/* ✅ Custom Header */}
    <View className="bg-purple-600 pt-14 pb-5 px-5 flex-row items-center justify-between">
      <Text className="text-white text-2xl font-bold">📚 My Library</Text>

      {/* Optional arrow / menu */}
      <TouchableOpacity onPress={() => router.push("/add-book")}>
        <Text className="text-white text-xl">➕</Text>
      </TouchableOpacity>
    </View>
    
      {books.length === 0 ? (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* header here */}
          <View className="items-center bg-white rounded-2xl mt-5 py-14">
            <Text className="text-6xl mb-4">📚</Text>
            <Text className="text-lg font-semibold text-gray-600 mb-2">No books in your collection</Text>
            <Text className="text-sm text-gray-400 text-center px-5">
              Your book collection will appear here once you add some books.
            </Text>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id!}
          renderItem={renderBookItem}
          contentContainerStyle={{ padding: 20 }}
        />
      )}
    </View>
  );
}

