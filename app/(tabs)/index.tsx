import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 30 }}>Voice Journal</Text>
      
      <TouchableOpacity
        style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 10, margin: 10, width: 200, alignItems: 'center' }}
        onPress={() => router.push('/recording')}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Start Recording</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ backgroundColor: '#666', padding: 15, borderRadius: 10, margin: 10, width: 200, alignItems: 'center' }}
        onPress={() => router.push('/recordings-list')}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>View Recordings</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}
