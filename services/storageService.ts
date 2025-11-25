import AsyncStorage from '@react-native-async-storage/async-storage';
import { VoiceNote } from '../types';

const STORAGE_KEYS = {
  VOICE_NOTES: '@voice_notes',
};

class StorageService {
  async saveVoiceNote(voiceNote: VoiceNote): Promise<boolean> {
    try {
      const existingNotes = await this.getVoiceNotes();
      const updatedNotes = [...existingNotes, voiceNote];
      await AsyncStorage.setItem(STORAGE_KEYS.VOICE_NOTES, JSON.stringify(updatedNotes));
      return true;
    } catch (error) {
      console.error('Error saving voice note:', error);
      throw error;
    }
  }

  async getVoiceNotes(): Promise<VoiceNote[]> {
    try {
      const notes = await AsyncStorage.getItem(STORAGE_KEYS.VOICE_NOTES);
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error('Error getting voice notes:', error);
      return [];
    }
  }

  async deleteVoiceNote(id: string): Promise<boolean> {
    try {
      const existingNotes = await this.getVoiceNotes();
      const updatedNotes = existingNotes.filter(note => note.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.VOICE_NOTES, JSON.stringify(updatedNotes));
      return true;
    } catch (error) {
      console.error('Error deleting voice note:', error);
      throw error;
    }
  }
}

export default new StorageService();
