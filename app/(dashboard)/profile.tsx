import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';

export default function Profile() {
  const [dailyNote, setDailyNote] = useState('');
  const [dailyEmoji, setDailyEmoji] = useState('📚');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState('');

  const emojiOptions = ['📚', '😊', '🤔', '❤️', '🌟', '📖', '✨', '🎯', '🔥', '💭'];

  const handleEditNote = () => {
    setTempNote(dailyNote);
    setIsEditingNote(true);
  };

  const handleSaveNote = () => {
    setDailyNote(tempNote);
    setIsEditingNote(false);
  };

  const handleCancelEdit = () => {
    setTempNote('');
    setIsEditingNote(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* Daily Section Header */}
        <View style={styles.header}>
          <Feather name="calendar" size={24} color="#3B82F6" />
          <Text style={styles.headerText}>Today's Reading Vibe</Text>
        </View>

        {/* Emoji Selector */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.label}>How are you feeling about reading today?</Text>
          <View style={styles.emojiContainer}>
            {emojiOptions.map((emoji, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setDailyEmoji(emoji)}
                style={[
                  styles.emojiButton,
                  dailyEmoji === emoji ? styles.selectedEmoji : styles.unselectedEmoji,
                ]}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily Note */}
        <View>
          <View style={styles.noteHeader}>
            <Text style={styles.label}>Daily Reading Note</Text>
            {!isEditingNote && (
              <TouchableOpacity onPress={handleEditNote}>
                <Feather name="edit-3" size={20} color="#3B82F6" />
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
                style={styles.textArea}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
                  <MaterialIcons name="save" size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                  <MaterialIcons name="cancel" size={20} color="#000" />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.noteBox}>
              {dailyNote ? (
                <Text style={styles.noteText}>{dailyNote}</Text>
              ) : (
                <Text style={styles.placeholderText}>
                  Click the edit button to add your daily reading thoughts...
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#111827',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  emojiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  selectedEmoji: {
    backgroundColor: '#DBEAFE',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  unselectedEmoji: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  emoji: {
    fontSize: 24,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  saveButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#111827',
    marginLeft: 6,
    fontWeight: '600',
  },
  noteBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
  },
  noteText: {
    color: '#374151',
    fontSize: 16,
    lineHeight: 22,
  },
  placeholderText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});
