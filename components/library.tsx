// app/library.tsx
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

interface Book {
  id: string;
  title: string;
  author: string;
}

export default function LibraryScreen() {
  const router = useRouter();

  // Example in-memory library
  const [library, setLibrary] = useState<Book[]>([
    { id: "1", title: "The Hobbit", author: "J.R.R. Tolkien" },
    { id: "2", title: "1984", author: "George Orwell" },
  ]);

  return (
    <View style={styles.container}>
      {/* Add Book Button */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/../components/add-book")}
      >
        <Text style={styles.addText}>Add New Book</Text>
      </TouchableOpacity>

      {/* Book List */}
      <FlatList
        data={library}
        keyExtractor={(book) => book.id}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9FAFB" },
  addBtn: {
    backgroundColor: "#7C3AED",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addText: { color: "white", fontWeight: "600" },
  bookItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  title: { fontWeight: "600", fontSize: 16, color: "#111827" },
  author: { color: "#6B7280", fontSize: 14 },
});
