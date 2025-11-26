import { Audio } from 'expo-av';

class AudioService {
  private recording: Audio.Recording | null = null;
  private sound: Audio.Sound | null = null;

  async startRecording() {
    try {
      console.log('Requesting permissions...');
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        throw new Error('Audio permission not granted');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      console.log('Starting recording...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      console.log('Recording started successfully');
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<string> {
    if (!this.recording) {
      throw new Error('No active recording');
    }

    try {
      console.log('Stopping recording...');
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      if (!uri) {
        throw new Error('Recording URI is null');
      }

      console.log('Recording stopped, URI:', uri);
      
      // For web, we need to handle the blob URL immediately
      let finalUri = uri;
      if (uri.startsWith('blob:')) {
        console.log('Web environment detected, handling blob URL...');
        // On web, we'll use the blob URL directly but play it immediately
        // The issue is blob URLs expire, so we need to handle playback differently
      }
      
      return finalUri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw error;
    }
  }

  async playAudio(uri: string) {
    try {
      console.log('Playing audio from URI:', uri);
      
      // For web blob URLs, we need a different approach
      if (uri.startsWith('blob:')) {
        await this.playWebAudio(uri);
        return;
      }

      // Stop any currently playing sound
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      console.log('Creating sound object...');
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );

      this.sound = sound;
      console.log('Audio playback started successfully');

      // Set up playback completion handler
      sound.setOnPlaybackStatusUpdate((status: any) => {
        console.log('Playback status:', status);
        if (status.didJustFinish) {
          console.log('Playback finished');
          sound.unloadAsync();
          this.sound = null;
        }
      });

    } catch (error) {
      console.error('Failed to play audio:', error);
      throw error;
    }
  }

  // Special method for web audio playback
  async playWebAudio(blobUrl: string) {
    try {
      console.log('Using web audio API for playback...');
      
      // Create an audio element for web playback
      const audio = new Audio(blobUrl);
      
      audio.oncanplaythrough = () => {
        console.log('Web audio ready to play');
        audio.play().then(() => {
          console.log('Web audio playback started');
        }).catch((error) => {
          console.error('Web audio play failed:', error);
          throw error;
        });
      };

      audio.onerror = (error) => {
        console.error('Web audio error:', error);
        throw new Error('Web audio playback failed');
      };

      // Load the audio
      audio.load();

    } catch (error) {
      console.error('Web audio playback failed:', error);
      throw error;
    }
  }

  // Alternative method: Convert blob to base64 for permanent storage
  async blobToBase64(blobUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        const reader = new FileReader();
        reader.onloadend = function() {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open('GET', blobUrl);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }
}

export default new AudioService();
