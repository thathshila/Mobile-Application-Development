import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

interface Book {
  id: string;
  title: string;
  author: string;
}

const Home = () => {
  const router = useRouter();

  // Define library state
  const [library, setLibrary] = useState<Book[]>([
    { id: "1", title: "The Hobbit", author: "J.R.R. Tolkien" },
    { id: "2", title: "1984", author: "George Orwell" },
  ]);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#F9FAFB" }}>
      {/* Add Book Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#7C3AED",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 16,
        }}
        onPress={() => router.push("/../components/add-book")}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>Add New Book</Text>
      </TouchableOpacity>

      {/* Library List */}
      <FlatList
        data={library}
        keyExtractor={(book) => book.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Text style={{ fontWeight: "600" }}>{item.title}</Text>
            <Text style={{ color: "#6B7280" }}>{item.author}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Home;
