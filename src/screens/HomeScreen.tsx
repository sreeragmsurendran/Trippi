import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BikeMessage } from '../types';
import { THEME } from '../constants/colors';
import { useMessages } from '../hooks/useMessages';
import { useFloatingWidget } from '../hooks/useFloatingWidget';
import Header from '../components/Header';
import MessageList from '../components/MessageList';
import AddMessageForm from '../components/AddMessageForm';
import IconPicker from '../components/IconPicker';
import ColorPicker from '../components/ColorPicker';
import SendConfirmation from '../components/SendConfirmation';
import FloatingButton from '../components/FloatingButton';
import FloatingMenu from '../components/FloatingMenu';
import MinimizeButton from '../components/MinimizeButton';

const HomeScreen: React.FC = () => {
  const {
    messages,
    isLoading,
    lastSent,
    isSending,
    addMessage,
    updateMessage,
    deleteMessage,
    reorderMessages,
    sendMessage,
    resetToDefaults,
  } = useMessages();

  const {
    isFloating,
    hasPermission,
    isSupported,
    minimizeAndFloat,
    stopFloating,
  } = useFloatingWidget();

  // Modal states
  const [iconPickerMessage, setIconPickerMessage] = useState<BikeMessage | null>(null);
  const [colorPickerMessage, setColorPickerMessage] = useState<BikeMessage | null>(null);

  // Floating menu state (in-app preview)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Icon picker handlers
  const handleEditIcon = useCallback((message: BikeMessage) => {
    setIconPickerMessage(message);
  }, []);

  const handleIconSelect = useCallback(
    (iconName: string) => {
      if (iconPickerMessage) {
        updateMessage(iconPickerMessage.id, { icon: iconName });
        setIconPickerMessage(prev =>
          prev ? { ...prev, icon: iconName } : null,
        );
      }
    },
    [iconPickerMessage, updateMessage],
  );

  const handleIconPickerClose = useCallback(() => {
    setIconPickerMessage(null);
  }, []);

  // Color picker handlers
  const handleEditColor = useCallback((message: BikeMessage) => {
    setColorPickerMessage(message);
  }, []);

  const handleColorSelect = useCallback(
    (color: string) => {
      if (colorPickerMessage) {
        updateMessage(colorPickerMessage.id, { color });
        setColorPickerMessage(prev =>
          prev ? { ...prev, color } : null,
        );
      }
    },
    [colorPickerMessage, updateMessage],
  );

  const handleColorPickerClose = useCallback(() => {
    setColorPickerMessage(null);
  }, []);

  // Minimize / Float
  const handleMinimize = useCallback(async () => {
    if (isFloating) {
      await stopFloating();
    } else {
      await minimizeAndFloat(messages);
    }
  }, [isFloating, messages, minimizeAndFloat, stopFloating]);

  // Reset
  const handleReset = useCallback(() => {
    Alert.alert(
      'Reset Messages',
      'Restore all messages to defaults? Your custom messages will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: resetToDefaults,
        },
      ],
    );
  }, [resetToDefaults]);

  // Floating menu handlers
  const handleFloatingPress = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleFloatingMenuSend = useCallback(
    (id: string) => {
      sendMessage(id);
      // Keep menu open for quick follow-up sends
    },
    [sendMessage],
  );

  const handleEditFromFloat = useCallback(() => {
    setIsMenuOpen(false);
    // In a real app with native overlay, this would bring the app to foreground
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.accent} />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        onMinimize={handleMinimize}
        onReset={handleReset}
        isFloating={isFloating}
        isSupported={isSupported}
      />

      {/* Send confirmation toast */}
      <SendConfirmation data={lastSent} messages={messages} />

      {/* Minimize/Float button */}
      <MinimizeButton
        onMinimize={handleMinimize}
        isFloating={isFloating}
        isSupported={isSupported}
      />

      {/* Message list */}
      <MessageList
        messages={messages}
        isSending={isSending}
        lastSent={lastSent}
        onSend={sendMessage}
        onUpdate={updateMessage}
        onDelete={deleteMessage}
        onReorder={reorderMessages}
        onEditIcon={handleEditIcon}
        onEditColor={handleEditColor}
      />

      {/* Add message form */}
      <AddMessageForm onAdd={addMessage} />

      {/* Floating button (in-app preview/demo) */}
      <FloatingButton
        onPress={handleFloatingPress}
        isMenuOpen={isMenuOpen}
      />

      {/* Floating menu popup */}
      <FloatingMenu
        visible={isMenuOpen}
        messages={messages}
        onSend={handleFloatingMenuSend}
        onEditMessages={handleEditFromFloat}
        onClose={() => setIsMenuOpen(false)}
        isSending={isSending}
      />

      {/* Icon Picker Modal */}
      <IconPicker
        visible={!!iconPickerMessage}
        message={iconPickerMessage}
        onSelect={handleIconSelect}
        onClose={handleIconPickerClose}
      />

      {/* Color Picker Modal */}
      <ColorPicker
        visible={!!colorPickerMessage}
        message={colorPickerMessage}
        onSelect={handleColorSelect}
        onClose={handleColorPickerClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: THEME.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: THEME.textSecondary,
    fontWeight: '600',
  },
});

export default HomeScreen;
