import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MessageDraft } from '../types';
import { THEME, MESSAGE_COLORS } from '../constants/colors';
import { AVAILABLE_ICONS } from '../constants/icons';

interface AddMessageFormProps {
  onAdd: (draft: MessageDraft) => void;
}

const AddMessageForm: React.FC<AddMessageFormProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const toggleExpand = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.spring(expandAnim, {
      toValue,
      friction: 8,
      tension: 50,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      Keyboard.dismiss();
    }
  };

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed.length === 0) return;

    // Pick a random icon and color for new messages
    const randomIcon =
      AVAILABLE_ICONS[Math.floor(Math.random() * AVAILABLE_ICONS.length)];
    const randomColor =
      MESSAGE_COLORS[Math.floor(Math.random() * MESSAGE_COLORS.length)];

    onAdd({
      text: trimmed,
      icon: randomIcon.name,
      color: randomColor.hex,
    });

    setText('');
    toggleExpand();
  };

  const formHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 70],
  });

  const formOpacity = expandAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.formContainer,
          {
            height: formHeight,
            opacity: formOpacity,
          },
        ]}
      >
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Enter message text..."
            placeholderTextColor={THEME.textMuted}
            maxLength={30}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
          <TouchableOpacity
            style={[
              styles.submitButton,
              text.trim().length === 0 && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={text.trim().length === 0}
            activeOpacity={0.7}
          >
            <Icon name="check" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <TouchableOpacity
        style={[styles.addButton, isExpanded && styles.addButtonActive]}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <Icon
          name={isExpanded ? 'close' : 'plus'}
          size={22}
          color={isExpanded ? THEME.textSecondary : THEME.accent}
        />
        <Text
          style={[
            styles.addButtonText,
            isExpanded && styles.addButtonTextActive,
          ]}
        >
          {isExpanded ? 'Cancel' : 'Add New Message'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: THEME.background,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },
  formContainer: {
    overflow: 'hidden',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: THEME.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '600',
    color: THEME.textPrimary,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  submitButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: THEME.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: THEME.surfaceHover,
    shadowOpacity: 0,
    elevation: 0,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.border,
    borderStyle: 'dashed',
    gap: 8,
  },
  addButtonActive: {
    backgroundColor: THEME.surfaceHover,
    borderStyle: 'solid',
    borderColor: THEME.textMuted,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.accent,
  },
  addButtonTextActive: {
    color: THEME.textSecondary,
  },
});

export default AddMessageForm;
