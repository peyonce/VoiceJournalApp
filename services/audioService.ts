class AudioService {
  private counter = 1;

  async playAudio(url: string) {
    console.log('Playing audio demonstration');
    
     
    return new Promise((resolve) => {
       
      setTimeout(() => {
        console.log('Playback demonstration completed');
        resolve(void 0);
      }, 2000);
    });
  }

  async startRecording() {
    console.log('Recording started');
    return Promise.resolve();
  }

  async stopRecording() {
    return {
      filename: `Recording ${this.counter++}`,
      filepath: 'audio-demo',
      duration: Math.floor(Math.random() * 8) + 3
    };
  }
}

export default new AudioService();
