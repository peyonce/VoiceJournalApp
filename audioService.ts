import { Platform } from 'react-native';

class AudioService {
  async playAudio(uri: string) {
    try {
      console.log('Playing audio from URI:', uri);
      
      if (Platform.OS === 'web') {
        await this.playWebAudio(uri);
      } else {
        await this.playNativeAudio(uri);
      }
    } catch (error) {
      console.error('Failed to play audio:', error);
      throw error;
    }
  }

  private async playWebAudio(uri: string) {
    console.log('Using web audio API for playback...');
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = uri;
      audio.onloadeddata = () => {
        audio.play().then(resolve).catch(reject);
      };
      audio.onerror = reject;
    });
  }

  private async playNativeAudio(uri: string) {
    console.log('Using native audio playback...');
    const { Sound } = await import('expo-audio');
    const sound = new Sound();
    await sound.loadAsync({ uri });
    await sound.playAsync();
  }
}

export default new AudioService();
