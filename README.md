# Voice Journal App

A React Native voice recording application built with Expo that allows users to create, manage, and play voice recordings.

## Features

- **Voice Recording** - Record audio notes using the device's microphone
- **Recording Management** - View, play, and delete recordings
- **Local Storage** - Recordings are saved locally using AsyncStorage
- **Search Functionality** - Search through your recordings
- **Responsive Design** - Works on web and mobile devices
-  **Modern UI** - Clean, intuitive interface with Expo Router

## Tech Stack

- **Frontend**: React Native, Expo
- **Navigation**: Expo Router
- **Storage**: AsyncStorage
- **Audio**: Expo AV (with web fallbacks)
- **Deployment**: Firebase Hosting

## Live Demo

**Live App**: https://voice-app-6973e.web.app

## Project Structure

voiceapp/
├── app/ # Expo Router app directory
│ ├── (tabs)/ # Tab navigation
│ ├── recording.tsx # Recording screen
│ ├── playback.tsx # Playback screen
│ └── recordings-list.tsx # Recordings management
├── services/ # Business logic
│ ├── audioService.ts # Audio recording/playback
│ └── storageService.ts # Data persistence
└── types/ # TypeScript definitions


## Getting Started

### Prerequisites
- Node.js 16+
- Expo CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/peyonce/VoiceJournalApp.git
   cd VoiceJournalApp