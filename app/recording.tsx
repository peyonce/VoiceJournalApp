import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import AudioService from '../services/audioService';
import StorageService from '../services/storageService';

export default function RecordingScreen() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startRecording = async () => {
    try {
      setIsLoading(true);
      await AudioService.startRecording();
      setIsRecording(true);
      Alert.alert('Recording Started', 'Speak now - your voice is being recorded');
    } catch (error) {
      Alert.alert('Error', 'Failed to access microphone');
    } finally {
      setIsLoading(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsLoading(true);
      const result = await AudioService.stopRecording();
      
      const voiceNote = {
        id: Date.now().toString(),
        filename: result.filename,
        filepath: result.filepath,
        date: new Date().toLocaleString(),
        duration: result.duration
      };

      await StorageService.saveVoiceNote(voiceNote);
      setIsRecording(false);
      
      Alert.alert('Success', `"${voiceNote.filename}" saved successfully!`);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to save recording');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        {isRecording ? '🔴 Recording...' : 'Voice Recorder'}
      </Text>
      <Text style={{ color: '#666', marginBottom: 30, textAlign: 'center' }}>
        {isRecording ? 'Speak into your microphone' : 'Tap below to start recording'}
      </Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <TouchableOpacity
          style={{ 
            backgroundColor: isRecording ? '#FF3B30' : '#007AFF', 
            padding: 20, 
            borderRadius: 50, 
            width: 200, 
            alignItems: 'center',
            elevation: 5,
          }}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={{ backgroundColor: '#666', padding: 15, borderRadius: 10, marginTop: 30, width: 200, alignItems: 'center' }}
        onPress={() => router.back()}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Back to Home</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}
