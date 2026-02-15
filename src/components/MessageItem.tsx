import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BikeMessage } from '../types';
import { THEME } from '../constants/colors';
import { formatRelativeTime, darkenColor } from '../utils/helpers';

interface MessageItemProps {
  message: BikeMessage;
  isSending: boolean;
  isLastSent: boolean;
  onSend: (id: string) => void;
  onUpdate: (id: string, updates: Partial<BikeMessage>) => void;
  onDelete: (id: string) => void;
  onEditIcon: (message: BikeMessage) => void;
  onEditColor: (message: BikeMessage) => void;
  isDragging?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isSending,
  isLastSent,
  onSend,
  onUpdate,
  onDelete,
  onEditIcon,
  onEditColor,
  isDragging = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const sendFlashAnim = useRef(new Animated.Value(0)).current;

  const handleSend = useCallback(() => {
    // Button press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Flash animation
    Animated.sequence([
      Animated.timing(sendFlashAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(sendFlashAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    onSend(message.id);
  }, [message.id, onSend, scaleAnim, sendFlashAnim]);

  const handleTextSubmit = useCallback(() => {
    const trimmed = editText.trim();
    if (trimmed.length > 0 && trimmed !== message.text) {
      onUpdate(message.id, { text: trimmed });
    } else {
      setEditText(message.text);
    }
    setIsEditing(false);
  }, [editText, message, onUpdate]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Message',
      `Remove "${message.text}" from your messages?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(message.id),
        },
      ],
    );
  }, [message, onDelete]);

  const flashOpacity = sendFlashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        isDragging && styles.containerDragging,
        isLastSent && styles.containerLastSent,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      {/* Send flash overlay */}
      <Animated.View
        style={[
          styles.flashOverlay,
          {
            opacity: flashOpacity,
            backgroundColor: message.color,
          },
        ]}
      />

      {/* Drag handle */}
      <View style={styles.dragHandle}>
        <Icon name="drag-horizontal-variant" size={20} color={THEME.textMuted} />
      </View>

      {/* Icon button (tap to change icon) */}
      <TouchableOpacity
        style={[styles.iconButton, { backgroundColor: message.color }]}
        onPress={() => onEditIcon(message)}
        activeOpacity={0.7}
      >
        <Icon name={message.icon} size={26} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Message text (tap to edit) */}
      <View style={styles.textSection}>
        {isEditing ? (
          <TextInput
            style={styles.textInput}
            value={editText}
            onChangeText={setEditText}
            onBlur={handleTextSubmit}
            onSubmitEditing={handleTextSubmit}
            autoFocus
            selectTextOnFocus
            maxLength={30}
            returnKeyType="done"
            placeholderTextColor={THEME.textMuted}
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)} activeOpacity={0.7}>
            <Text style={styles.messageText} numberOfLines={1}>
              {message.text}
            </Text>
            {message.lastSentAt && (
              <Text style={styles.lastSentText}>
                Last sent {formatRelativeTime(message.lastSentAt)}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Color dot (tap to change color) */}
      <TouchableOpacity
        style={styles.colorButton}
        onPress={() => onEditColor(message)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.colorDot,
            { backgroundColor: message.color },
          ]}
        />
      </TouchableOpacity>

      {/* Delete button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        activeOpacity={0.7}
      >
        <Icon name="close" size={16} color={THEME.textMuted} />
      </TouchableOpacity>

      {/* SEND button - large tap target */}
      <TouchableOpacity
        style={[
          styles.sendButton,
          { backgroundColor: message.color },
          isSending && styles.sendButtonSending,
        ]}
        onPress={handleSend}
        disabled={isSending}
        activeOpacity={0.7}
      >
        {isSending ? (
          <Icon name="loading" size={18} color="#FFFFFF" />
        ) : (
          <Icon name="send" size={18} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: THEME.border,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  containerDragging: {
    borderColor: THEME.accent,
    backgroundColor: THEME.surfaceLight,
    elevation: 10,
    shadowOpacity: 0.35,
    transform: [{ scale: 1.02 }],
  },
  containerLastSent: {
    borderColor: THEME.success,
    borderWidth: 1.5,
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  dragHandle: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  textSection: {
    flex: 1,
    marginHorizontal: 12,
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.textPrimary,
    letterSpacing: 0.3,
  },
  lastSentText: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 2,
  },
  textInput: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.textPrimary,
    backgroundColor: THEME.surfaceHover,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: THEME.accent,
  },
  colorButton: {
    padding: 6,
    marginRight: 4,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonSending: {
    opacity: 0.7,
  },
});

export default MessageItem;
