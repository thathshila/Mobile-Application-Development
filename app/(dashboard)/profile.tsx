
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