import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="recording" options={{ 
          title: 'New Recording',
          presentation: 'modal'
        }} />
        <Stack.Screen name="playback" options={{ 
          title: 'Play Recording',
          presentation: 'modal'
        }} />
        <Stack.Screen name="recordings-list" options={{ 
          title: 'My Recordings'
        }} />
      </Stack>
    </ThemeProvider>
  );
}
