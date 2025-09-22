

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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VibeService } from '../../service/dailyReadingVibeService';
import { DailyReadingVibe } from '../../types/vibe';
import { auth } from '@/firebase';
import { router } from 'expo-router';
import { 
  getCurrentUser, 
  updateUserProfile, 
  updateUserEmail, 
  changePassword,
  logout 
} from '@/service/authService';

const { width } = Dimensions.get('window');

export default function Profile() {
  const userId = auth.currentUser?.uid ?? "guest";
  const [dailyNote, setDailyNote] = useState('');
  const [dailyEmoji, setDailyEmoji] = useState('📚');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [savedNotes, setSavedNotes] = useState<DailyReadingVibe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Profile management states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: ''
  });
  const [editProfileData, setEditProfileData] = useState({
    displayName: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const emojiOptions = ['📚', '😊', '🤔', '❤️', '🌟', '📖', '✨', '🎯', '🔥', '💭'];

  useEffect(() => {
    loadAllData();
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    const user = getCurrentUser();
    if (user) {
      setProfileData({
        displayName: user.displayName || '',
        email: user.email || ''
      });
      setEditProfileData({
        displayName: user.displayName || '',
        email: user.email || ''
      });
    }
  };

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([loadTodayData(), loadSavedNotes()]);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTodayData = async () => {
    try {
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
    }
  };

  const loadSavedNotes = async () => {
    try {
      const notes = await VibeService.getVibesByUser(userId);
      const sortedNotes = notes.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
      setSavedNotes(sortedNotes);
    } catch (error) {
      console.error('Error loading saved notes:', error);
      Alert.alert('Error', 'Failed to load your saved notes. Please try again.');
    }
  };

  const handleEmojiSelect = async (emoji: string) => {
    if (emoji === dailyEmoji) return;
    
    const previousEmoji = dailyEmoji;
    try {
      setDailyEmoji(emoji);
      await VibeService.updateTodayEmoji(emoji, userId);
      setLastSaved(new Date());
      await loadSavedNotes();
    } catch (error) {
      console.error('Error saving emoji:', error);
      Alert.alert('Error', 'Failed to save emoji. Please try again.');
      setDailyEmoji(previousEmoji);
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
      await loadSavedNotes();
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

  const handleDeleteSavedNote = (noteId: string, date: string) => {
    Alert.alert(
      'Delete Note',
      `Are you sure you want to delete the note from ${formatDate(date)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await VibeService.deleteVibe(noteId);
              
              const today = VibeService.getTodayDate();
              if (date === today) {
                setDailyNote('');
                setDailyEmoji('📚');
                setLastSaved(null);
              }
              
              await loadSavedNotes();
              Alert.alert('Deleted', 'Your note has been deleted.');
            } catch (error) {
              console.error('Error deleting note:', error);
              Alert.alert('Error', 'Failed to delete note. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleUpdateProfile = async () => {
    try {
      setIsUpdatingProfile(true);
      
      // Update display name if changed
      if (editProfileData.displayName !== profileData.displayName) {
        await updateUserProfile(editProfileData.displayName);
      }
      
      // Update email if changed (requires current password)
      if (editProfileData.email !== profileData.email) {
        Alert.prompt(
          'Verify Password',
          'Please enter your current password to update your email:',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Update',
              onPress: async (currentPassword) => {
                if (!currentPassword) return;
                try {
                  await updateUserEmail(editProfileData.email, currentPassword);
                  setProfileData(editProfileData);
                  setShowProfileModal(false);
                  Alert.alert('Success', 'Profile updated successfully!');
                  loadUserProfile(); // Refresh profile data
                } catch (error: any) {
                  Alert.alert('Error', error.message || 'Failed to update email. Please check your password.');
                }
              }
            }
          ],
          'secure-text'
        );
      } else {
        setProfileData(editProfileData);
        setShowProfileModal(false);
        Alert.alert('Success', 'Profile updated successfully!');
        loadUserProfile(); // Refresh profile data
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsChangingPassword(true);
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      Alert.alert('Success', 'Password changed successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to change password. Please check your current password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayFormatted = yesterday.toISOString().split('T')[0];

    if (dateString === todayFormatted) {
      return 'Today';
    } else if (dateString === yesterdayFormatted) {
      return 'Yesterday';
    } else {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
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

  const formatFirestoreDate = (timestamp: any, fallbackDate: string) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleDateString();
    }
    return fallbackDate;
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-violet-100">
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text className="mt-3 text-violet-800">Loading your reading journey...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-violet-100">
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Header with Profile Button */}
        <View className="flex-row justify-between items-center my-5 pt-7">
          <TouchableOpacity
            onPress={() => router.push("/")}
            className="p-2 bg-white rounded-full shadow-md"
          >
            <Ionicons name="arrow-back" size={24} color="#7C3AED" />
          </TouchableOpacity>
          
          <Text className="text-2xl font-extrabold text-violet-800 text-center">
            📖 My Reading Journey
          </Text>
          
          <TouchableOpacity
            onPress={() => setShowProfileModal(true)}
            className="p-2 bg-white rounded-full shadow-md"
          >
            <Ionicons name="person" size={24} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        {/* User Info Card */}
        <View className="bg-white rounded-2xl p-5 mb-4 shadow-lg">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-violet-100 rounded-full justify-center items-center mr-4">
                <Text className="text-xl">👤</Text>
              </View>
              <View>
                <Text className="text-lg font-bold text-violet-800">
                  {profileData.displayName || 'Book Lover'}
                </Text>
                <Text className="text-sm text-gray-600">
                  {profileData.email}
                </Text>
              </View>
            </View>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => setShowPasswordModal(true)}
                className="p-2 bg-violet-100 rounded-lg"
              >
                <Ionicons name="lock-closed" size={20} color="#7C3AED" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                className="p-2 bg-red-100 rounded-lg"
              >
                <Ionicons name="log-out" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Main Reading Vibe Card */}
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

        {/* Saved Notes Section */}
        <View className="bg-white rounded-2xl p-5 mb-7 shadow-lg">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Ionicons name="library" size={24} color="#7C3AED" />
              <Text className="text-lg font-bold text-violet-600 ml-2">
                Reading History
              </Text>
            </View>
            <Text className="text-sm text-gray-500">
              {savedNotes.length} {savedNotes.length === 1 ? 'entry' : 'entries'}
            </Text>
          </View>

          {savedNotes.length === 0 ? (
            <View className="items-center py-6">
              <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-400 text-center mt-2">
                No reading notes yet.{'\n'}Start by adding today's reading vibe!
              </Text>
            </View>
          ) : (
            <View>
              {savedNotes.map((note) => (
                <View key={note.id} className="mb-4 last:mb-0">
                  <View className="bg-violet-50 rounded-xl p-4">
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-row items-center">
                        <Text className="text-2xl mr-3">{note.emoji}</Text>
                        <View>
                          <Text className="font-semibold text-violet-700">
                            {formatDate(note.date)}
                          </Text>
                          <Text className="text-xs text-gray-500">
                            {formatFirestoreDate(note.createdAt, note.date)}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteSavedNote(note.id, note.date)}
                      >
                        <Ionicons name="trash" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                    {note.note ? (
                      <Text className="text-gray-700 text-base leading-5">
                        {note.note}
                      </Text>
                    ) : (
                      <Text className="text-gray-400 italic">No note written</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Profile Update Modal */}
      <Modal
        visible={showProfileModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 mx-4 w-full max-w-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-violet-800">Update Profile</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <Ionicons name="close" size={24} color="#7C3AED" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Display Name</Text>
              <TextInput
                value={editProfileData.displayName}
                onChangeText={(text) => setEditProfileData(prev => ({ ...prev, displayName: text }))}
                placeholder="Enter your name"
                className="border border-violet-200 rounded-xl px-4 py-3 text-base"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Email</Text>
              <TextInput
                value={editProfileData.email}
                onChangeText={(text) => setEditProfileData(prev => ({ ...prev, email: text }))}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                className="border border-violet-200 rounded-xl px-4 py-3 text-base"
              />
            </View>

            <TouchableOpacity
              onPress={handleUpdateProfile}
              disabled={isUpdatingProfile}
              className="bg-violet-600 rounded-xl py-3 items-center"
            >
              <Text className="text-white font-bold text-base">
                {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 mx-4 w-full max-w-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-violet-800">Change Password</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <Ionicons name="close" size={24} color="#7C3AED" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Current Password</Text>
              <TextInput
                value={passwordData.currentPassword}
                onChangeText={(text) => setPasswordData(prev => ({ ...prev, currentPassword: text }))}
                placeholder="Enter current password"
                secureTextEntry
                className="border border-violet-200 rounded-xl px-4 py-3 text-base"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">New Password</Text>
              <TextInput
                value={passwordData.newPassword}
                onChangeText={(text) => setPasswordData(prev => ({ ...prev, newPassword: text }))}
                placeholder="Enter new password"
                secureTextEntry
                className="border border-violet-200 rounded-xl px-4 py-3 text-base"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Confirm New Password</Text>
              <TextInput
                value={passwordData.confirmPassword}
                onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
                placeholder="Confirm new password"
                secureTextEntry
                className="border border-violet-200 rounded-xl px-4 py-3 text-base"
              />
            </View>

            <TouchableOpacity
              onPress={handleChangePassword}
              disabled={isChangingPassword}
              className="bg-violet-600 rounded-xl py-3 items-center"
            >
              <Text className="text-white font-bold text-base">
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

