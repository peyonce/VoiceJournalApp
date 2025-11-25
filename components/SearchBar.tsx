import React from 'react';
import { TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedView } from './themed-view';
import { styles } from '../styles/globalStyles';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChangeText, placeholder = "Search..." }: SearchBarProps) {
  return (
    <ThemedView style={styles.searchBar}>
      <MaterialIcons name="search" size={20} color="#666" style={{ marginRight: 8 }} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={{ 
          fontSize: 16, 
          flex: 1,
          color: '#333'
        }}
        placeholderTextColor="#999"
      />
    </ThemedView>
  );
}
