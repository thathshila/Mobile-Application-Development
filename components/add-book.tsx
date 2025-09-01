// app/add-book.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddBookScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverURL, setCoverURL] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddBook = async () => {
    if (!title || !author) {
      Alert.alert("Required Fields", "Please fill in both Title and Author.");
      return;
    }
    try {
      const libraryRef = collection(db, "users", user!.uid, "library");
      await addDoc(libraryRef, {
        title,
        author,
        coverURL,
        notes,
        addedAt: new Date(),
      });
      Alert.alert("Success", "Book added to your library!");
      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", "Could not add book. Try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Book Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter book title"
      />

      <Text style={styles.label}>Author</Text>
      <TextInput
        style={styles.input}
        value={author}
        onChangeText={setAuthor}
        placeholder="Enter author's name"
      />

      <Text style={styles.label}>Cover Image URL</Text>
      <TextInput
        style={styles.input}
        value={coverURL}
        onChangeText={setCoverURL}
        placeholder="Optional"
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Optional notes about the book"
        multiline
      />

      <TouchableOpacity style={styles.addBtn} onPress={handleAddBook}>
        <Text style={styles.addText}>Add to Library</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#F9FAFB" },
  label: { fontSize: 14, fontWeight: "600", color: "#111827", marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 8, padding: 12, backgroundColor: "#FFF" },
  addBtn: { marginTop: 20, backgroundColor: "#7C3AED", padding: 16, borderRadius: 8, alignItems: "center" },
  addText: { color: "white", fontWeight: "600", fontSize: 16 },
});
