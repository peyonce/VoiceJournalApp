import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import AudioService from '../services/audioService';
import StorageService from '../services/storageService';
import { styles } from '../styles/globalStyles';
import { formatTime } from '../utils/helpers';

export default function RecordingScreen() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      console.log('=== STARTING RECORDING ===');
      setIsLoading(true);
      await AudioService.startRecording();
      setIsRecording(true);
      setRecordingTime(0);
      console.log('=== RECORDING STARTED ===');
    } catch (error) {
      console.error('START RECORDING ERROR:', error);
      Alert.alert('Error', 'Failed to start recording');
    } finally {
      setIsLoading(false);
    }
  };

  const stopRecording = async () => {
    try {
      console.log('=== STOPPING RECORDING ===');
      setIsLoading(true);
      const audioPath = await AudioService.stopRecording();
      console.log('Audio path received:', audioPath);
      
      const voiceNote = {
        id: Date.now().toString(),
        filename: `Recording_${new Date().toLocaleDateString()}`,
        filepath: audioPath,
        date: new Date().toLocaleString(),
        duration: recordingTime
      };

      console.log('Saving voice note:', voiceNote);
      await StorageService.saveVoiceNote(voiceNote);
      console.log('=== RECORDING SAVED SUCCESSFULLY ===');
      
      setIsRecording(false);
      setRecordingTime(0);
      
      router.back();
    } catch (error) {
      console.error('STOP RECORDING ERROR:', error);
      Alert.alert('Error', 'Failed to save recording');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.recordingContainer}>
        <Text style={styles.recordingTime}>
          {formatTime(recordingTime)}
        </Text>
        <Text style={styles.recordingStatus}>
          {isRecording ? 'Recording...' : 'Ready to record'}
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <TouchableOpacity
          style={[
            styles.recordButton,
            isRecording && styles.recordButtonActive
          ]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <MaterialIcons
            name={isRecording ? 'stop' : 'mic'}
            size={32}
            color="white"
          />
        </TouchableOpacity>
      )}

      <Text style={styles.recordingHint}>
        {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
      </Text>
    </ThemedView>
  );
}
