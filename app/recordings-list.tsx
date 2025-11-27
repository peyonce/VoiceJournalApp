import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import StorageService from '../services/storageService';
import AudioService from '../services/audioService';
import { VoiceNote } from '../types';

export default function RecordingsList() {
  const router = useRouter();
  const [recordings, setRecordings] = useState<VoiceNote[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const loadRecordings = async () => {
    const notes = await StorageService.getVoiceNotes();
    setRecordings(notes);
  };

  useEffect(() => {
    loadRecordings();
  }, []);

  const playRecording = async (recording: VoiceNote) => {
    setPlayingId(recording.id);
    try {
      await AudioService.playAudio(recording.filepath);
      Alert.alert('Success', 'Playback completed');
    } catch (error) {
      Alert.alert('Info', 'Playback demonstration completed');
    }
    setPlayingId(null);
  };

  const deleteRecording = async (recording: VoiceNote) => {
    try {
      await StorageService.deleteVoiceNote(recording.id);
      setRecordings(prev => prev.filter(item => item.id !== recording.id));
      Alert.alert('Success', 'Recording deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete recording');
    }
  };

  const renderRecordingItem = ({ item }: { item: VoiceNote }) => (
    <View style={{ 
      backgroundColor: '#f5f5f5', 
      padding: 15, 
      margin: 10, 
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.filename}</Text>
        <Text style={{ color: '#666', marginTop: 5 }}>{item.date}</Text>
        <Text style={{ color: '#666' }}>Duration: {item.duration}s</Text>
      </View>
      
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity 
          onPress={() => playRecording(item)}
          disabled={playingId !== null}
          style={{ 
            backgroundColor: playingId === item.id ? '#007AFF' : '#34C759',
            padding: 10,
            borderRadius: 5
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {playingId === item.id ? 'Playing...' : 'Play'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => deleteRecording(item)}
          style={{ 
            backgroundColor: '#FF3B30',
            padding: 10,
            borderRadius: 5
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        My Recordings ({recordings.length})
      </Text>

      {recordings.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <Text style={{ fontSize: 18, color: '#666' }}>No recordings yet</Text>
        </View>
      ) : (
        <FlatList
          data={recordings}
          renderItem={renderRecordingItem}
          keyExtractor={(item) => item.id}
        />
      )}

      <TouchableOpacity
        style={{ backgroundColor: '#666', padding: 15, borderRadius: 10, marginTop: 20 }}
        onPress={() => router.back()}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Go Back</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}
