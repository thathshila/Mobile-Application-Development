// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Alert,
//   ScrollView,
//   Image,
//   Modal,
//   Dimensions,
//   ActivityIndicator,
// } from "react-native";
// import { BookService } from "@/service/bookService";
// import { Book } from "@/types/book";
// import { auth } from "@/firebase";
// import * as ImagePicker from "expo-image-picker";
// import * as MediaLibrary from "expo-media-library";
// import {
//   CameraView,
//   CameraType,
//   useCameraPermissions,
// } from "expo-camera";

// const { width } = Dimensions.get("window");

// interface EnhancedBook extends Book {
//   coverImage?: string;
//   description?: string;
// }

// export default function BooksScreen() {
//   const userId = auth.currentUser?.uid ?? "guest";
//   const [books, setBooks] = useState<EnhancedBook[]>([]);
//   const [title, setTitle] = useState("");
//   const [author, setAuthor] = useState("");
//   const [genre, setGenre] = useState("");
//   const [description, setDescription] = useState("");
//   const [notes, setNotes] = useState("");
//   const [coverImage, setCoverImage] = useState<string>("");
//   const [editingId, setEditingId] = useState<string | null>(null);

//   // Camera related states
//   const [showCamera, setShowCamera] = useState(false);
//   const [facing, setFacing] = useState<CameraType>("back");
//   const [permission, requestPermission] = useCameraPermissions();
//   const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
//   const cameraRef = useRef<CameraView>(null);

//   const loadBooks = async () => {
//     try {
//       const data = await BookService.getBooksByUser(userId);
//       setBooks(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     loadBooks();
//   }, []);

//   const clearForm = () => {
//     setTitle("");
//     setAuthor("");
//     setGenre("");
//     setDescription("");
//     setNotes("");
//     setCoverImage("");
//     setEditingId(null);
//   };

//   const handleSave = async () => {
//     if (!title || !author) {
//       Alert.alert("Validation", "Please enter title and author");
//       return;
//     }

//     try {
//       const bookData = {
//         title,
//         author,
//         genre,
//         description,
//         notes,
//         coverImage,
//         userId,
//       };

//       if (editingId) {
//         await BookService.updateBook(editingId, bookData);
//         Alert.alert("Updated", "Book updated successfully");
//       } else {
//         await BookService.addBook(bookData);
//         Alert.alert("Added", "Book added successfully");
//       }
//       clearForm();
//       loadBooks();
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to save book");
//     }
//   };

//   const handleDelete = async (id: string) => {
//     Alert.alert("Delete Book", "Are you sure you want to delete this book?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: async () => {
//           try {
//             await BookService.deleteBook(id);
//             loadBooks();
//           } catch (err) {
//             console.error(err);
//             Alert.alert("Error", "Failed to delete book");
//           }
//         },
//       },
//     ]);
//   };

//   const handleEditBook = (item: EnhancedBook) => {
//     setTitle(item.title);
//     setAuthor(item.author);
//     setGenre(item.genre || "");
//     setDescription(item.description || "");
//     setNotes(item.notes || "");
//     setCoverImage(item.coverImage || "");
//     setEditingId(item.id!);
//   };

//   const showImageOptions = () => {
//     Alert.alert("Add Cover Image", "Choose an option", [
//       { text: "Cancel", style: "cancel" },
//       { text: "Camera", onPress: openCamera },
//       { text: "Gallery", onPress: pickFromGallery },
//     ]);
//   };

//   const openCamera = async () => {
//     if (!permission?.granted) {
//       const result = await requestPermission();
//       if (!result.granted) {
//         Alert.alert("Permission denied", "Camera permission is required");
//         return;
//       }
//     }

//     if (!mediaPermission?.granted) {
//       const result = await requestMediaPermission();
//       if (!result.granted) {
//         Alert.alert("Permission denied", "Media library permission is required");
//         return;
//       }
//     }

//     setShowCamera(true);
//   };

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       try {
//         const photo = await cameraRef.current.takePictureAsync({
//           quality: 0.8,
//         } as any); // takePictureAsync typing can vary by camera lib
//         setCoverImage((photo as any).uri);
//         setShowCamera(false);

//         // Optionally save to gallery
//         try {
//           const asset = await MediaLibrary.createAssetAsync((photo as any).uri);
//           await MediaLibrary.createAlbumAsync("BookCovers", asset, false);
//         } catch (saveError) {
//           console.log("Could not save to gallery:", saveError);
//         }

//         Alert.alert("Photo captured", "Cover image has been set!");
//       } catch (err) {
//         console.error("Failed to take picture:", err);
//         Alert.alert("Error", "Failed to capture photo");
//       }
//     }
//   };

//   const pickFromGallery = async () => {
//     try {
//       const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (!permissionResult.granted) {
//         Alert.alert("Permission denied", "Gallery permission is required");
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [3, 4], // Book cover aspect ratio
//         quality: 0.8,
//       });

//       if (!result.canceled && result.assets[0]) {
//         setCoverImage(result.assets[0].uri);
//         Alert.alert("Image selected", "Cover image has been set!");
//       }
//     } catch (err) {
//       console.error("Failed to pick image:", err);
//       Alert.alert("Error", "Failed to select image");
//     }
//   };

//   const renderBookItem = ({ item }: { item: EnhancedBook }) => (
//     <View className="bg-violet-50 rounded-xl p-4 mb-3 border border-violet-100">
//       <View className="flex-row mb-3">
//         {item.coverImage ? (
//           <Image source={{ uri: item.coverImage }} className="w-15 h-20 rounded-md mr-3" />
//         ) : (
//           <View className="w-15 h-20 rounded-md mr-3 bg-violet-100 justify-center items-center">
//             <Text className="text-2xl">📚</Text>
//           </View>
//         )}

//         <View className="flex-1">
//           <Text className="text-base font-bold text-gray-800 mb-1" numberOfLines={2}>
//             {item.title}
//           </Text>
//           <Text className="text-sm text-violet-600 font-semibold mb-1" numberOfLines={1}>
//             by {item.author}
//           </Text>
//           {item.genre && (
//             <Text className="text-xs text-violet-500 font-medium mb-1" numberOfLines={1}>
//               {item.genre}
//             </Text>
//           )}
//           {item.description && (
//             <Text className="text-xs text-gray-600 leading-4 mb-1" numberOfLines={2}>
//               {item.description}
//             </Text>
//           )}
//           {item.notes && (
//             <Text className="text-xs text-gray-400 italic" numberOfLines={1}>
//               Notes: {item.notes}
//             </Text>
//           )}
//         </View>
//       </View>

//       <View className="flex-row space-x-3">
//         <TouchableOpacity
//           className="flex-1 bg-violet-600 p-2 rounded-md items-center"
//           onPress={() => handleEditBook(item)}
//         >
//           <Text className="text-white font-semibold text-sm">✏️ Edit</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           className="flex-1 bg-red-500 p-2 rounded-md items-center"
//           onPress={() => handleDelete(item.id!)}
//         >
//           <Text className="text-white font-semibold text-sm">🗑️ Delete</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View className="flex-1 bg-violet-100">
//       <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
//         <Text className="text-2xl font-extrabold text-violet-800 text-center my-5">📖 My Book Collection</Text>

//         {/* Form Section */}
//         <View className="bg-white rounded-2xl p-5 mb-5 shadow-lg">
//           <Text className="text-lg font-bold text-violet-600 mb-3">Add New Book</Text>

//           {/* Cover Image Section */}
//           <View className="items-center mb-4">
//             {coverImage ? (
//               <TouchableOpacity onPress={showImageOptions} className="relative">
//                 <Image source={{ uri: coverImage }} className="w-30 h-40 rounded-lg border-2 border-violet-400" />
//                 <View className="absolute bottom-0 left-0 right-0 bg-violet-600 rounded-b-md py-1">
//                   <Text className="text-white text-xs text-center font-semibold">Tap to change</Text>
//                 </View>
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity onPress={showImageOptions} className="w-30 h-40 rounded-lg border-2 border-dashed border-violet-400 bg-violet-50 justify-center items-center">
//                 <Text className="text-3xl mb-2">📷</Text>
//                 <Text className="text-violet-600 font-semibold text-sm text-center">Add Cover Image</Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           <TextInput
//             className="border-2 border-violet-200 bg-white px-4 py-3 rounded-xl mb-3 text-base text-gray-700"
//             placeholder="Book Title *"
//             placeholderTextColor="#A855F7"
//             value={title}
//             onChangeText={setTitle}
//           />

//           <TextInput
//             className="border-2 border-violet-200 bg-white px-4 py-3 rounded-xl mb-3 text-base text-gray-700"
//             placeholder="Author *"
//             placeholderTextColor="#A855F7"
//             value={author}
//             onChangeText={setAuthor}
//           />

//           <TextInput
//             className="border-2 border-violet-200 bg-white px-4 py-3 rounded-xl mb-3 text-base text-gray-700"
//             placeholder="Genre"
//             placeholderTextColor="#A855F7"
//             value={genre}
//             onChangeText={setGenre}
//           />

//           <TextInput
//             className="border-2 border-violet-200 bg-white px-4 py-3 rounded-xl mb-3 text-base text-gray-700 h-20"
//             placeholder="Description"
//             placeholderTextColor="#A855F7"
//             value={description}
//             onChangeText={setDescription}
//             multiline
//             numberOfLines={3}
//           />

//           <TextInput
//             className="border-2 border-violet-200 bg-white px-4 py-3 rounded-xl mb-3 text-base text-gray-700 h-16"
//             placeholder="Personal Notes"
//             placeholderTextColor="#A855F7"
//             value={notes}
//             onChangeText={setNotes}
//             multiline
//             numberOfLines={2}
//           />

//           <View className="flex-row space-x-3 mt-2">
//             <TouchableOpacity className="flex-2 bg-violet-600 px-4 py-3 rounded-xl items-center" onPress={handleSave}>
//               <Text className="text-white font-bold text-base">{editingId ? "📝 Update Book" : "➕ Add Book"}</Text>
//             </TouchableOpacity>

//             {editingId && (
//               <TouchableOpacity className="flex-1 bg-gray-200 px-4 py-3 rounded-xl items-center" onPress={clearForm}>
//                 <Text className="text-gray-700 font-bold text-base">✖️ Cancel</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         {/* Books List Section */}
//         <View className="bg-white rounded-2xl p-5 mb-7 shadow-lg">
//           <Text className="text-lg font-bold text-violet-600 mb-4">My Books ({books.length})</Text>

//           {books.length === 0 ? (
//             <View className="items-center py-10">
//               <Text className="text-5xl mb-3">📚</Text>
//               <Text className="text-lg font-semibold text-gray-600 mb-1">No books added yet</Text>
//               <Text className="text-sm text-gray-400">Add your first book above!</Text>
//             </View>
//           ) : (
//             <FlatList
//               data={books}
//               keyExtractor={(item) => item.id!}
//               renderItem={renderBookItem}
//               scrollEnabled={false}
//               showsVerticalScrollIndicator={false}
//             />
//           )}
//         </View>
//       </ScrollView>

//       {/* Camera Modal */}
//       <Modal visible={showCamera} animationType="slide" onRequestClose={() => setShowCamera(false)}>
//         <View className="flex-1 bg-black">
//           <CameraView ref={cameraRef} className="flex-1" facing={facing} />

//           <View className="absolute bottom-12 left-0 right-0 flex-row justify-around items-center px-10">
//             <TouchableOpacity className="w-14 h-14 rounded-full bg-violet-600 justify-center items-center border-2 border-white" onPress={() => setShowCamera(false)}>
//               <Text className="text-white text-lg">✖️</Text>
//             </TouchableOpacity>

//             <TouchableOpacity className="w-20 h-20 rounded-full bg-violet-600 justify-center items-center border-4 border-white" onPress={takePicture}>
//               <Text className="text-white text-2xl">📸</Text>
//             </TouchableOpacity>

//             <TouchableOpacity className="w-14 h-14 rounded-full bg-violet-600 justify-center items-center border-2 border-white" onPress={() => setFacing(facing === "back" ? "front" : "back")}>
//               <Text className="text-white text-lg">🔄</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }


import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import { BookService } from "@/service/bookService";
import { Book } from "@/types/book";
import { auth } from "@/firebase";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
} from "expo-camera";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface EnhancedBook extends Book {
  coverImage?: string;
  description?: string;
}

export default function BooksScreen() {
  const userId = auth.currentUser?.uid ?? "guest";
  const [books, setBooks] = useState<EnhancedBook[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Camera related states
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);

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

  const clearForm = () => {
    setTitle("");
    setAuthor("");
    setGenre("");
    setDescription("");
    setNotes("");
    setCoverImage("");
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!title || !author) {
      Alert.alert("Validation", "Please enter title and author");
      return;
    }

    try {
      const bookData = {
        title,
        author,
        genre,
        description,
        notes,
        coverImage,
        userId,
      };

      if (editingId) {
        await BookService.updateBook(editingId, bookData);
        Alert.alert("Updated", "Book updated successfully");
      } else {
        await BookService.addBook(bookData);
        Alert.alert("Added", "Book added successfully");
      }
      clearForm();
      loadBooks();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save book");
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Delete Book", "Are you sure you want to delete this book?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await BookService.deleteBook(id);
            loadBooks();
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to delete book");
          }
        },
      },
    ]);
  };

  const handleEditBook = (item: EnhancedBook) => {
    setTitle(item.title);
    setAuthor(item.author);
    setGenre(item.genre || "");
    setDescription(item.description || "");
    setNotes(item.notes || "");
    setCoverImage(item.coverImage || "");
    setEditingId(item.id!);
  };

  const showImageOptions = () => {
    Alert.alert("Add Cover Image", "Choose an option", [
      { text: "Cancel", style: "cancel" },
      { text: "Camera", onPress: openCamera },
      { text: "Gallery", onPress: pickFromGallery },
    ]);
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert("Permission denied", "Camera permission is required");
        return;
      }
    }

    if (!mediaPermission?.granted) {
      const result = await requestMediaPermission();
      if (!result.granted) {
        Alert.alert("Permission denied", "Media library permission is required");
        return;
      }
    }

    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        } as any);
        setCoverImage((photo as any).uri);
        setShowCamera(false);

        // Optionally save to gallery
        try {
          const asset = await MediaLibrary.createAssetAsync((photo as any).uri);
          await MediaLibrary.createAlbumAsync("BookCovers", asset, false);
        } catch (saveError) {
          console.log("Could not save to gallery:", saveError);
        }

        Alert.alert("Photo captured", "Cover image has been set!");
      } catch (err) {
        console.error("Failed to take picture:", err);
        Alert.alert("Error", "Failed to capture photo");
      }
    }
  };

  const pickFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission denied", "Gallery permission is required");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCoverImage(result.assets[0].uri);
        Alert.alert("Image selected", "Cover image has been set!");
      }
    } catch (err) {
      console.error("Failed to pick image:", err);
      Alert.alert("Error", "Failed to select image");
    }
  };

  const renderBookItem = ({ item }: { item: EnhancedBook }) => (
    <View className="bg-violet-50 rounded-xl p-4 mb-3 border border-violet-100">
      <View className="flex-row mb-3">
        {item.coverImage ? (
          <Image source={{ uri: item.coverImage }} className="w-15 h-20 rounded-md mr-3" />
        ) : (
          <View className="w-15 h-20 rounded-md mr-3 bg-violet-100 justify-center items-center">
            <Text className="text-2xl">📚</Text>
          </View>
        )}

        <View className="flex-1">
          <Text className="text-base font-bold text-gray-800 mb-1" numberOfLines={2}>
            {item.title}
          </Text>
          <Text className="text-sm text-violet-600 font-semibold mb-1" numberOfLines={1}>
            by {item.author}
          </Text>
          {item.genre && (
            <Text className="text-xs text-violet-500 font-medium mb-1" numberOfLines={1}>
              {item.genre}
            </Text>
          )}
          {item.description && (
            <Text className="text-xs text-gray-600 leading-4 mb-1" numberOfLines={2}>
              {item.description}
            </Text>
          )}
          {item.notes && (
            <Text className="text-xs text-gray-400 italic" numberOfLines={1}>
              Notes: {item.notes}
            </Text>
          )}
        </View>
      </View>

      <View className="flex-row space-x-3">
        <TouchableOpacity
          className="flex-1 bg-violet-600 p-2 rounded-md items-center"
          onPress={() => handleEditBook(item)}
        >
          <Text className="text-white font-semibold text-sm">✏️ Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-red-500 p-2 rounded-md items-center"
          onPress={() => handleDelete(item.id!)}
        >
          <Text className="text-white font-semibold text-sm">🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-violet-100">
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-extrabold text-violet-800 text-center my-5 pt-7">📖 My Book Collection</Text>

      {/* Purple arrow in top-left */}
        <TouchableOpacity
          onPress={() => router.push("/")}  // or router.back() if you want back behaviour
          style={{
            position: "absolute",
            top: 40,    // adjust for safe area / header height
            left: 10,   // padding from edge
            zIndex: 10,
          }}
        >
          <Ionicons name="arrow-back" size={35} color="#7C3AED" />
        </TouchableOpacity>




        {/* Form Section */}
        <View className="bg-white rounded-2xl p-5 mb-5 shadow-lg">
          <Text className="text-lg font-bold text-violet-600 mb-3">Add New Book</Text>

          {/* Cover Image Section */}
          <View className="items-center mb-4">
            {coverImage ? (
              <TouchableOpacity onPress={showImageOptions} className="relative">
                <Image source={{ uri: coverImage }} className="w-30 h-40 rounded-lg border-2 border-violet-400" />
                <View className="absolute bottom-0 left-0 right-0 bg-violet-600 rounded-b-md py-1">
                  <Text className="text-white text-xs text-center font-semibold">Tap to change</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={showImageOptions}
                className="w-30 h-40 rounded-lg border-2 border-dashed border-violet-400 bg-violet-50 justify-center items-center"
              >
                <Text className="text-3xl mb-2">📷</Text>
                <Text className="text-violet-600 font-semibold text-sm text-center">Add Cover Image</Text>
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            className="border-2 border-violet-200 bg-white px-4 py-3 rounded-xl mb-3 text-base text-gray-700"
            placeholder="Book Title *"
            placeholderTextColor="#A855F7"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            className="border-2 border-violet-200 bg-white px-4 py-3 rounded-xl mb-3 text-base text-gray-700"
            placeholder="Author *"
            placeholderTextColor="#A855F7"
            value={author}
            onChangeText={setAuthor}
          />

          <TextInput
            className="border-2 border-violet-200 bg-white px-4 py-3 rounded-xl mb-3 text-base text-gray-700"
            placeholder="Genre"
            placeholderTextColor="#A855F7"
            value={genre}
            onChangeText={setGenre}
          />

          <TextInput
            className="border-2 border-violet-200 bg-white px-4 py-3 rounded-xl mb-3 text-base text-gray-700 h-20"
            placeholder="Description"
            placeholderTextColor="#A855F7"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          <TextInput
            className="border-2 border-violet-200 bg-white px-4 py-3 rounded-xl mb-3 text-base text-gray-700 h-16"
            placeholder="Personal Notes"
            placeholderTextColor="#A855F7"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={2}
          />

          <View className="flex-row space-x-3 mt-2">
            <TouchableOpacity className="flex-2 bg-violet-600 px-4 py-3 rounded-xl items-center" onPress={handleSave}>
              <Text className="text-white font-bold text-base">{editingId ? "📝 Update Book" : "➕ Add Book"}</Text>
            </TouchableOpacity>

            {editingId && (
              <TouchableOpacity className="flex-1 bg-gray-200 px-4 py-3 rounded-xl items-center" onPress={clearForm}>
                <Text className="text-gray-700 font-bold text-base">✖️ Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Books List Section */}
        <View className="bg-white rounded-2xl p-5 mb-7 shadow-lg">
          <Text className="text-lg font-bold text-violet-600 mb-4">My Books ({books.length})</Text>

          {books.length === 0 ? (
            <View className="items-center py-10">
              <Text className="text-5xl mb-3">📚</Text>
              <Text className="text-lg font-semibold text-gray-600 mb-1">No books added yet</Text>
              <Text className="text-sm text-gray-400">Add your first book above!</Text>
            </View>
          ) : (
            <FlatList
              data={books}
              keyExtractor={(item) => item.id!}
              renderItem={renderBookItem}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Camera Modal */}
      <Modal visible={showCamera} animationType="slide" onRequestClose={() => setShowCamera(false)}>
        <View style={{ flex: 1, backgroundColor: "black" }}>
          {permission?.granted ? (
            <CameraView
              ref={cameraRef}
              style={{ flex: 1, width: "100%" }}
              facing={facing}
              active={showCamera} // <— important!
            />
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: "white" }}>Requesting camera permission…</Text>
            </View>
          )}

          <View
            style={{
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#7C3AED",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "white",
              }}
              onPress={() => setShowCamera(false)}
            >
              <Text style={{ color: "white", fontSize: 18 }}>✖️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#7C3AED",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 4,
                borderColor: "white",
              }}
              onPress={takePicture}
            >
              <Text style={{ color: "white", fontSize: 28 }}>📸</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#7C3AED",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "white",
              }}
              onPress={() => setFacing(facing === "back" ? "front" : "back")}
            >
              <Text style={{ color: "white", fontSize: 18 }}>🔄</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
