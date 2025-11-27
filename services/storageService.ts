import AsyncStorage from '@react-native-async-storage/async-storage';
import { VoiceNote } from '../types';

const STORAGE_KEY = '@voice_notes';

class StorageService {
  async saveVoiceNote(voiceNote: VoiceNote): Promise<void> {
    const existing = await this.getVoiceNotes();
    const updated = [...existing, voiceNote];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  async getVoiceNotes(): Promise<VoiceNote[]> {
    const notes = await AsyncStorage.getItem(STORAGE_KEY);
    return notes ? JSON.parse(notes) : [];
  }

  async deleteVoiceNote(id: string): Promise<void> {
    const existing = await this.getVoiceNotes();
    const updated = existing.filter(note => note.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  async searchVoiceNotes(query: string): Promise<VoiceNote[]> {
    const notes = await this.getVoiceNotes();
    return notes.filter(note => 
      note.filename.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export default new StorageService();
