import React from 'react';
import { View, Text, Button } from 'react-native';
import AudioService from './audioService';

export default function PlaybackScreen({ note }) {
  const handlePlay = async () => {
    console.log('Attempting to play audio:', note.audioUri);
    try {
      await AudioService.playAudio(note.audioUri);
    } catch (error) {
      console.error('Play audio error:', error);
    }
  };

  return (
    <View>
      <Text>Playback screen loaded note: {JSON.stringify(note)}</Text>
      <Button title="Play Audio" onPress={handlePlay} />
    </View>
  );
}
