import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { BookService } from "@/service/bookService";
import { Book } from "@/types/book";
import { auth } from "@/firebase";

export default function BooksScreen() {
  const userId = auth.currentUser?.uid ?? "guest"; // fallback
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadBooks = async () => {
    try {
      const data = await BookService.getBooksByUser(userId);
      setBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleSave = async () => {
    if (!title || !author) {
      Alert.alert("Validation", "Please enter title and author");
      return;
    }

    try {
      if (editingId) {
        await BookService.updateBook(editingId, { title, author, genre, notes });
        Alert.alert("Updated", "Book updated successfully");
      } else {
        await BookService.addBook({ title, author, genre, notes, userId });
        Alert.alert("Added", "Book added successfully");
      }
      setTitle("");
      setAuthor("");
      setGenre("");
      setNotes("");
      setEditingId(null);
      loadBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await BookService.deleteBook(id);
      loadBooks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>My Books</Text>

      {/* Form */}
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        value={genre}
        onChangeText={setGenre}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <TouchableOpacity style={styles.btn} onPress={handleSave}>
        <Text style={styles.btnText}>{editingId ? "Update" : "Add"} Book</Text>
      </TouchableOpacity>

      {/* List */}
      <FlatList
        data={books}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.title} — {item.author}
            </Text>
            <Text style={styles.meta}>Genre: {item.genre}</Text>
            <Text style={styles.meta}>Notes: {item.notes}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => {
                  setTitle(item.title);
                  setAuthor(item.author);
                  setGenre(item.genre);
                  setNotes(item.notes);
                  setEditingId(item.id!);
                }}
              >
                <Text style={styles.link}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id!)}>
                <Text style={[styles.link, { color: "red" }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  item: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: { fontSize: 16, fontWeight: "bold" },
  meta: { fontSize: 14, color: "#666", marginBottom: 4 },
  actions: { flexDirection: "row", gap: 15 },
  link: { fontWeight: "bold", color: "blue" },
});
