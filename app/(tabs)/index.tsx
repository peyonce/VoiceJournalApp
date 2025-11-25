import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import StorageService from '../../services/storageService';
import { VoiceNote } from '../../types';
import { styles } from '../../styles/globalStyles';

export default function VoiceJournalScreen() {
  const router = useRouter();
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);

  useEffect(() => {
    loadVoiceNotes();
  }, []);

  const loadVoiceNotes = async () => {
    try {
      const notes = await StorageService.getVoiceNotes();
      setVoiceNotes(notes);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleDeleteNote = (id: string, filename: string) => {
    Alert.alert(
      'Delete Voice Note',
      `Are you sure you want to delete "${filename}"?`,
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.deleteVoiceNote(id);
              loadVoiceNotes();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete voice note');
            }
          }
        }
      ]
    );
  };

  const handlePlayNote = (note: VoiceNote) => {
    router.push(`/playback?voiceNote=${encodeURIComponent(JSON.stringify(note))}`);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={{ marginBottom: 20, textAlign: 'center' }}>
        Voice Journal
      </ThemedText>

      <FlatList
        data={voiceNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.noteItem}>
            <View style={styles.noteInfo}>
              <Text style={styles.noteTitle}>{item.filename}</Text>
              <Text style={styles.noteDate}>{item.date}</Text>
              <Text style={styles.noteDate}>Duration: {item.duration}s</Text>
            </View>
            <View style={styles.noteActions}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handlePlayNote(item)}
              >
                <MaterialIcons name="play-arrow" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleDeleteNote(item.id, item.filename)}
              >
                <MaterialIcons name="delete" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No voice notes yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the + button to create your first recording
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/recording')}
      >
        <MaterialIcons name="mic" size={24} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}
