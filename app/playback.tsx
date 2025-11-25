import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import AudioService from '../services/audioService';
import { VoiceNote } from '../types';
import { styles } from '../styles/globalStyles';
import { formatTime } from '../utils/helpers';

export default function PlaybackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [voiceNote, setVoiceNote] = useState<VoiceNote | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (params.voiceNote) {
      try {
        const note = JSON.parse(params.voiceNote as string);
        setVoiceNote(note);
        console.log('Playback screen loaded note:', note);
      } catch (error) {
        const errorMsg = 'Error parsing voice note: ' + error;
        setError(errorMsg);
        console.error(errorMsg);
        Alert.alert('Error', 'Invalid voice note data');
      }
    }
  }, [params.voiceNote]);

  const handlePlay = async () => {
    if (!voiceNote) return;

    try {
      setError('');
      setIsLoading(true);
      console.log('Attempting to play audio:', voiceNote.filepath);
      
      await AudioService.playAudio(voiceNote.filepath);
      setIsPlaying(true);
      console.log('Audio playback started successfully');
      
    } catch (error: any) {
      const errorMsg = 'Play failed: ' + (error.message || error);
      setError(errorMsg);
      console.error('Play audio error:', error);
      Alert.alert('Playback Error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!voiceNote) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading voice note...</Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.recordingContainer}>
        <Text style={styles.noteTitle}>{voiceNote.filename}</Text>
        <Text style={styles.noteDate}>{voiceNote.date}</Text>
        <Text style={styles.noteDate}>Duration: {formatTime(voiceNote.duration)}</Text>
        <Text style={styles.noteDate}>ID: {voiceNote.id}</Text>
      </View>

      {/* Error Display */}
      {error ? (
        <View style={{ backgroundColor: '#FFE6E6', padding: 10, borderRadius: 5, marginBottom: 20 }}>
          <Text style={{ color: '#FF3B30', textAlign: 'center' }}>Error: {error}</Text>
        </View>
      ) : null}

      {isLoading ? (
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10 }}>Loading audio...</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.recordButton}
          onPress={handlePlay}
          disabled={isLoading}
        >
          <MaterialIcons
            name={isPlaying ? "volume-up" : "play-arrow"}
            size={32}
            color="white"
          />
        </TouchableOpacity>
      )}

      <Text style={styles.recordingHint}>
        {isPlaying ? 'Audio is playing...' : 'Tap the button to play'}
      </Text>

      <TouchableOpacity
        style={[styles.recordButton, { backgroundColor: '#666', marginTop: 10 }]}
        onPress={() => router.back()}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Go Back</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}
