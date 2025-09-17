// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
// import { Feather, MaterialIcons } from '@expo/vector-icons';

// export default function Profile() {
//   const [dailyNote, setDailyNote] = useState('');
//   const [dailyEmoji, setDailyEmoji] = useState('📚');
//   const [isEditingNote, setIsEditingNote] = useState(false);
//   const [tempNote, setTempNote] = useState('');

//   const emojiOptions = ['📚', '😊', '🤔', '❤️', '🌟', '📖', '✨', '🎯', '🔥', '💭'];

//   const handleEditNote = () => {
//     setTempNote(dailyNote);
//     setIsEditingNote(true);
//   };

//   const handleSaveNote = () => {
//     setDailyNote(tempNote);
//     setIsEditingNote(false);
//   };

//   const handleCancelEdit = () => {
//     setTempNote('');
//     setIsEditingNote(false);
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.card}>
//         {/* Daily Section Header */}
//         <View style={styles.header}>
//           <Feather name="calendar" size={24} color="#3B82F6" />
//           <Text style={styles.headerText}>Today's Reading Vibe</Text>
//         </View>

//         {/* Emoji Selector */}
//         <View style={{ marginBottom: 20 }}>
//           <Text style={styles.label}>How are you feeling about reading today?</Text>
//           <View style={styles.emojiContainer}>
//             {emojiOptions.map((emoji, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => setDailyEmoji(emoji)}
//                 style={[
//                   styles.emojiButton,
//                   dailyEmoji === emoji ? styles.selectedEmoji : styles.unselectedEmoji,
//                 ]}
//               >
//                 <Text style={styles.emoji}>{emoji}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Daily Note */}
//         <View>
//           <View style={styles.noteHeader}>
//             <Text style={styles.label}>Daily Reading Note</Text>
//             {!isEditingNote && (
//               <TouchableOpacity onPress={handleEditNote}>
//                 <Feather name="edit-3" size={20} color="#3B82F6" />
//               </TouchableOpacity>
//             )}
//           </View>

//           {isEditingNote ? (
//             <View>
//               <TextInput
//                 value={tempNote}
//                 onChangeText={setTempNote}
//                 placeholder="What are your reading thoughts today?"
//                 multiline
//                 style={styles.textArea}
//               />
//               <View style={styles.buttonRow}>
//                 <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
//                   <MaterialIcons name="save" size={20} color="#fff" />
//                   <Text style={styles.saveButtonText}>Save</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
//                   <MaterialIcons name="cancel" size={20} color="#000" />
//                   <Text style={styles.cancelButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ) : (
//             <View style={styles.noteBox}>
//               {dailyNote ? (
//                 <Text style={styles.noteText}>{dailyNote}</Text>
//               ) : (
//                 <Text style={styles.placeholderText}>
//                   Click the edit button to add your daily reading thoughts...
//                 </Text>
//               )}
//             </View>
//           )}
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//     padding: 16,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginLeft: 8,
//     color: '#111827',
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 8,
//     color: '#374151',
//   },
//   emojiContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   emojiButton: {
//     width: 48,
//     height: 48,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     margin: 4,
//   },
//   selectedEmoji: {
//     backgroundColor: '#DBEAFE',
//     borderWidth: 2,
//     borderColor: '#3B82F6',
//   },
//   unselectedEmoji: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//   },
//   emoji: {
//     fontSize: 24,
//   },
//   noteHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   textArea: {
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 12,
//     padding: 12,
//     minHeight: 100,
//     textAlignVertical: 'top',
//     marginBottom: 12,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   saveButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#3B82F6',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     marginRight: 8,
//   },
//   saveButtonText: {
//     color: '#fff',
//     marginLeft: 6,
//     fontWeight: '600',
//   },
//   cancelButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#E5E7EB',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//   },
//   cancelButtonText: {
//     color: '#111827',
//     marginLeft: 6,
//     fontWeight: '600',
//   },
//   noteBox: {
//     backgroundColor: '#F3F4F6',
//     borderRadius: 12,
//     padding: 12,
//     minHeight: 100,
//   },
//   noteText: {
//     color: '#374151',
//     fontSize: 16,
//     lineHeight: 22,
//   },
//   placeholderText: {
//     color: '#9CA3AF',
//     fontStyle: 'italic',
//   },
// });


// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   TouchableOpacity, 
//   TextInput, 
//   ScrollView, 
//   StyleSheet, 
//   Alert, 
//   ActivityIndicator,
//   StatusBar
// } from 'react-native';
// import { Feather, MaterialIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { DailyReadingVibe } from '@/service/dailyReadingVibeService'; // Assume this service handles Firebase interactions

// export default function Profile() {
//   const [dailyNote, setDailyNote] = useState('');
//   const [dailyEmoji, setDailyEmoji] = useState('📚');
//   const [isEditingNote, setIsEditingNote] = useState(false);
//   const [tempNote, setTempNote] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [lastSaved, setLastSaved] = useState<Date | null>(null);

//   const emojiOptions = ['📚', '😊', '🤔', '❤️', '🌟', '📖', '✨', '🎯', '🔥', '💭'];

//   // Load today's data on component mount
//   useEffect(() => {
//     loadTodayData();
//   }, []);

//   const loadTodayData = async () => {
//     try {
//       setIsLoading(true);
//       const todayVibe = await firebaseService.getTodayReadingVibe();
      
//       if (todayVibe) {
//         setDailyEmoji(todayVibe.emoji);
//         setDailyNote(todayVibe.note);
//         if (todayVibe.updatedAt) {
//           setLastSaved(todayVibe.updatedAt.toDate());
//         }
//       }
//     } catch (error) {
//       console.error('Error loading today\'s data:', error);
//       Alert.alert('Error', 'Failed to load your daily data. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEmojiSelect = async (emoji: string) => {
//     if (emoji === dailyEmoji) return;
    
//     try {
//       setDailyEmoji(emoji);
//       await firebaseService.updateDailyEmoji(emoji);
//       setLastSaved(new Date());
//     } catch (error) {
//       console.error('Error saving emoji:', error);
//       Alert.alert('Error', 'Failed to save emoji. Please try again.');
//       // Revert on error
//       setDailyEmoji(dailyEmoji);
//     }
//   };

//   const handleEditNote = () => {
//     setTempNote(dailyNote);
//     setIsEditingNote(true);
//   };

//   const handleSaveNote = async () => {
//     try {
//       setIsSaving(true);
//       await firebaseService.updateDailyNote(tempNote);
//       setDailyNote(tempNote);
//       setIsEditingNote(false);
//       setLastSaved(new Date());
//       setTempNote('');
//     } catch (error) {
//       console.error('Error saving note:', error);
//       Alert.alert('Error', 'Failed to save note. Please try again.');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleCancelEdit = () => {
//     setTempNote('');
//     setIsEditingNote(false);
//   };

//   const formatLastSaved = (date: Date) => {
//     const now = new Date();
//     const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
//     if (diffInMinutes < 1) return 'Just saved';
//     if (diffInMinutes < 60) return `Saved ${diffInMinutes}m ago`;
    
//     const diffInHours = Math.floor(diffInMinutes / 60);
//     if (diffInHours < 24) return `Saved ${diffInHours}h ago`;
    
//     return `Saved on ${date.toLocaleDateString()}`;
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#3B82F6" />
//         <Text style={styles.loadingText}>Loading your reading vibe...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
//       {/* Header with Gradient */}
//       <LinearGradient
//         colors={['#3B82F6', '#1D4ED8']}
//         style={styles.headerGradient}
//       >
//         <View style={styles.headerContent}>
//           <Feather name="user" size={32} color="#fff" />
//           <Text style={styles.headerTitle}>My Reading Journey</Text>
//           <Text style={styles.headerSubtitle}>Track your daily reading vibes</Text>
//         </View>
//       </LinearGradient>

//       <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
//         {/* Daily Vibe Card */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <View style={styles.headerLeft}>
//               <Feather name="calendar" size={24} color="#3B82F6" />
//               <Text style={styles.cardTitle}>Today's Reading Vibe</Text>
//             </View>
//             {lastSaved && (
//               <Text style={styles.lastSavedText}>
//                 {formatLastSaved(lastSaved)}
//               </Text>
//             )}
//           </View>

//           {/* Emoji Selector */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>How are you feeling about reading today?</Text>
//             <View style={styles.emojiContainer}>
//               {emojiOptions.map((emoji, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   onPress={() => handleEmojiSelect(emoji)}
//                   style={[
//                     styles.emojiButton,
//                     dailyEmoji === emoji ? styles.selectedEmoji : styles.unselectedEmoji,
//                   ]}
//                   activeOpacity={0.7}
//                 >
//                   <Text style={styles.emoji}>{emoji}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           {/* Daily Note Section */}
//           <View style={styles.section}>
//             <View style={styles.noteHeader}>
//               <Text style={styles.sectionTitle}>Daily Reading Note</Text>
//               {!isEditingNote && (
//                 <TouchableOpacity 
//                   onPress={handleEditNote}
//                   style={styles.editButton}
//                   activeOpacity={0.7}
//                 >
//                   <Feather name="edit-3" size={20} color="#3B82F6" />
//                 </TouchableOpacity>
//               )}
//             </View>

//             {isEditingNote ? (
//               <View style={styles.editingContainer}>
//                 <TextInput
//                   value={tempNote}
//                   onChangeText={setTempNote}
//                   placeholder="What are your reading thoughts today?"
//                   placeholderTextColor="#9CA3AF"
//                   multiline
//                   style={styles.textArea}
//                   maxLength={500}
//                 />
//                 <Text style={styles.characterCount}>
//                   {tempNote.length}/500
//                 </Text>
                
//                 <View style={styles.buttonRow}>
//                   <TouchableOpacity 
//                     style={[styles.saveButton, isSaving && styles.disabledButton]} 
//                     onPress={handleSaveNote}
//                     disabled={isSaving}
//                     activeOpacity={0.8}
//                   >
//                     {isSaving ? (
//                       <ActivityIndicator size="small" color="#fff" />
//                     ) : (
//                       <MaterialIcons name="save" size={20} color="#fff" />
//                     )}
//                     <Text style={styles.saveButtonText}>
//                       {isSaving ? 'Saving...' : 'Save'}
//                     </Text>
//                   </TouchableOpacity>
                  
//                   <TouchableOpacity 
//                     style={styles.cancelButton} 
//                     onPress={handleCancelEdit}
//                     disabled={isSaving}
//                     activeOpacity={0.8}
//                   >
//                     <MaterialIcons name="cancel" size={20} color="#6B7280" />
//                     <Text style={styles.cancelButtonText}>Cancel</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             ) : (
//               <View style={styles.noteDisplayContainer}>
//                 <View style={styles.noteBox}>
//                   {dailyNote ? (
//                     <Text style={styles.noteText}>{dailyNote}</Text>
//                   ) : (
//                     <Text style={styles.placeholderText}>
//                       Click the edit button to add your daily reading thoughts...
//                     </Text>
//                   )}
//                 </View>
//               </View>
//             )}
//           </View>
//         </View>

//         {/* Stats Preview Card */}
//         <View style={[styles.card, styles.statsCard]}>
//           <View style={styles.cardHeader}>
//             <View style={styles.headerLeft}>
//               <Feather name="trending-up" size={24} color="#10B981" />
//               <Text style={styles.cardTitle}>Reading Stats</Text>
//             </View>
//           </View>
          
//           <View style={styles.statsContainer}>
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>7</Text>
//               <Text style={styles.statLabel}>Day Streak</Text>
//             </View>
//             <View style={styles.statDivider} />
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>12</Text>
//               <Text style={styles.statLabel}>Books Read</Text>
//             </View>
//             <View style={styles.statDivider} />
//             <View style={styles.statItem}>
//               <Text style={styles.statNumber}>85%</Text>
//               <Text style={styles.statLabel}>This Month</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#6B7280',
//   },
//   headerGradient: {
//     paddingTop: 60,
//     paddingBottom: 30,
//     paddingHorizontal: 20,
//   },
//   headerContent: {
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginTop: 12,
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: 'rgba(255, 255, 255, 0.8)',
//     marginTop: 4,
//   },
//   scrollContainer: {
//     flex: 1,
//     marginTop: -20,
//   },
//   card: {
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginBottom: 16,
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 12,
//     elevation: 4,
//   },
//   statsCard: {
//     marginBottom: 32,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginLeft: 12,
//     color: '#111827',
//   },
//   lastSavedText: {
//     fontSize: 12,
//     color: '#10B981',
//     fontWeight: '500',
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 12,
//     color: '#374151',
//   },
//   emojiContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   emojiButton: {
//     width: 56,
//     height: 56,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     margin: 2,
//   },
//   selectedEmoji: {
//     backgroundColor: '#DBEAFE',
//     borderWidth: 2,
//     borderColor: '#3B82F6',
//     transform: [{ scale: 1.05 }],
//   },
//   unselectedEmoji: {
//     backgroundColor: '#F9FAFB',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   emoji: {
//     fontSize: 28,
//   },
//   noteHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   editButton: {
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: '#F3F4F6',
//   },
//   editingContainer: {
//     marginTop: 8,
//   },
//   textArea: {
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 12,
//     padding: 16,
//     minHeight: 120,
//     textAlignVertical: 'top',
//     fontSize: 16,
//     lineHeight: 24,
//     color: '#111827',
//     backgroundColor: '#FAFAFA',
//   },
//   characterCount: {
//     textAlign: 'right',
//     fontSize: 12,
//     color: '#9CA3AF',
//     marginTop: 8,
//     marginBottom: 16,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   saveButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#3B82F6',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     flex: 1,
//     justifyContent: 'center',
//   },
//   disabledButton: {
//     opacity: 0.7,
//   },
//   saveButtonText: {
//     color: '#fff',
//     marginLeft: 8,
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   cancelButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F3F4F6',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     flex: 1,
//     justifyContent: 'center',
//   },
//   cancelButtonText: {
//     color: '#6B7280',
//     marginLeft: 8,
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   noteDisplayContainer: {
//     marginTop: 8,
//   },
//   noteBox: {
//     backgroundColor: '#F8FAFC',
//     borderRadius: 12,
//     padding: 16,
//     minHeight: 100,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//   },
//   noteText: {
//     color: '#374151',
//     fontSize: 16,
//     lineHeight: 24,
//   },
//   placeholderText: {
//     color: '#9CA3AF',
//     fontStyle: 'italic',
//     fontSize: 16,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#10B981',
//   },
//   statLabel: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 4,
//   },
//   statDivider: {
//     width: 1,
//     height: 40,
//     backgroundColor: '#E5E7EB',
//   },
// });

// Profile.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VibeService } from '../../service/dailyReadingVibeService';
import { DailyReadingVibe } from '../../types/vibe';
import { auth } from '@/firebase';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Profile() {
  const userId = auth.currentUser?.uid ?? "guest";
  const [dailyNote, setDailyNote] = useState('');
  const [dailyEmoji, setDailyEmoji] = useState('📚');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const emojiOptions = ['📚', '😊', '🤔', '❤️', '🌟', '📖', '✨', '🎯', '🔥', '💭'];

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    try {
      setIsLoading(true);
      const todayVibe = await VibeService.getTodayVibe(userId);
      if (todayVibe) {
        setDailyEmoji(todayVibe.emoji);
        setDailyNote(todayVibe.note);
        if (todayVibe.updatedAt) {
          setLastSaved(todayVibe.updatedAt.toDate());
        }
      }
    } catch (error) {
      console.error('Error loading today data:', error);
      Alert.alert('Error', 'Failed to load your daily data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmojiSelect = async (emoji: string) => {
    if (emoji === dailyEmoji) return;
    
    try {
      setDailyEmoji(emoji);
      await VibeService.updateTodayEmoji(emoji, userId);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving emoji:', error);
      Alert.alert('Error', 'Failed to save emoji. Please try again.');
      setDailyEmoji(dailyEmoji); // Revert on error
    }
  };

  const handleEditNote = () => {
    setTempNote(dailyNote);
    setIsEditingNote(true);
  };

  const handleSaveNote = async () => {
    try {
      setIsSaving(true);
      await VibeService.updateTodayNote(tempNote, userId);
      setDailyNote(tempNote);
      setIsEditingNote(false);
      setLastSaved(new Date());
      setTempNote('');
      Alert.alert('Saved', 'Your reading note has been saved!');
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setTempNote('');
    setIsEditingNote(false);
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffInMinutes < 1) return 'Just saved';
    if (diffInMinutes < 60) return `Saved ${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Saved ${diffInHours}h ago`;
    return `Saved on ${date.toLocaleDateString()}`;
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-violet-100">
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text className="mt-3 text-violet-800">Loading your reading vibe...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-violet-100">
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-extrabold text-violet-800 text-center my-5 pt-7">
          📖 My Reading Journey
        </Text>

        {/* Purple arrow in top-left */}
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={{
            position: "absolute",
            top: 40,
            left: 10,
            zIndex: 10,
          }}
        >
          <Ionicons name="arrow-back" size={35} color="#7C3AED" />
        </TouchableOpacity>

        {/* Main Card */}
        <View className="bg-white rounded-2xl p-5 mb-7 shadow-lg">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Ionicons name="calendar" size={24} color="#7C3AED" />
              <Text className="text-lg font-bold text-violet-600 ml-2">
                Today's Reading Vibe
              </Text>
            </View>
            {lastSaved && (
              <Text className="text-xs text-gray-500 italic">
                {formatLastSaved(lastSaved)}
              </Text>
            )}
          </View>

          {/* Emoji Selection */}
          <Text className="text-base font-semibold text-gray-700 mb-3">
            How are you feeling about reading today?
          </Text>
          <View className="flex-row flex-wrap justify-center mb-6">
            {emojiOptions.map((emoji, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleEmojiSelect(emoji)}
                className={`w-12 h-12 rounded-xl justify-center items-center m-2 ${
                  dailyEmoji === emoji
                    ? 'bg-violet-200 border-2 border-violet-500'
                    : 'bg-violet-50 border border-violet-200'
                }`}
                activeOpacity={0.7}
              >
                <Text className="text-2xl">{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Note Section */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-semibold text-gray-700">
              Daily Reading Note
            </Text>
            {!isEditingNote && (
              <TouchableOpacity onPress={handleEditNote}>
                <Ionicons name="pencil" size={20} color="#7C3AED" />
              </TouchableOpacity>
            )}
          </View>

          {isEditingNote ? (
            <View>
              <TextInput
                value={tempNote}
                onChangeText={setTempNote}
                placeholder="What are your reading thoughts today?"
                multiline
                numberOfLines={4}
                className="border-2 border-violet-200 bg-violet-50 px-4 py-3 rounded-xl mb-3 text-base text-gray-700 h-24"
                placeholderTextColor="#A855F7"
                textAlignVertical="top"
              />
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  className="flex-1 bg-violet-600 px-4 py-3 rounded-xl items-center"
                  onPress={handleSaveNote}
                  disabled={isSaving}
                >
                  <Text className="text-white font-bold text-base">
                    {isSaving ? 'Saving...' : 'Save Note'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-gray-200 px-4 py-3 rounded-xl items-center"
                  onPress={handleCancelEdit}
                >
                  <Text className="text-gray-700 font-bold text-base">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="bg-violet-50 rounded-xl p-4 min-h-24">
              {dailyNote ? (
                <Text className="text-gray-700 text-base leading-6">{dailyNote}</Text>
              ) : (
                <Text className="text-gray-400 italic text-base">
                  Click the edit button to add your daily reading thoughts...
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Today's Summary */}
        <View className="bg-white rounded-2xl p-5 mb-7 shadow-lg">
          <Text className="text-lg font-bold text-violet-600 mb-3">Today's Summary</Text>
          <View className="flex-row items-center justify-center">
            <View className="items-center mr-8">
              <Text className="text-4xl mb-2">{dailyEmoji}</Text>
              <Text className="text-sm text-gray-600 font-medium">Current Mood</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-violet-600 mb-1">
                {dailyNote ? dailyNote.split(' ').length : 0}
              </Text>
              <Text className="text-sm text-gray-600 font-medium">Words in Note</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}