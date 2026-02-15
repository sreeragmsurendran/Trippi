import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { THEME } from '../constants/colors';

interface MinimizeButtonProps {
  onMinimize: () => void;
  isFloating: boolean;
  isSupported: boolean;
}

const MinimizeButton: React.FC<MinimizeButtonProps> = ({
  onMinimize,
  isFloating,
  isSupported,
}) => {
  const handlePress = () => {
    if (!isSupported) {
      Alert.alert(
        'Android Only',
        'The floating overlay widget requires Android. On iOS, you can use lock screen widgets and notifications for quick access.',
      );
      return;
    }
    onMinimize();
  };

  return (
    <TouchableOpacity
      style={[styles.container, isFloating && styles.containerActive]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Icon
          name={isFloating ? 'arrow-expand' : 'picture-in-picture-bottom-right'}
          size={20}
          color={isFloating ? THEME.accent : THEME.textPrimary}
        />
        <Text style={[styles.text, isFloating && styles.textActive]}>
          {isFloating ? 'Open Full App' : 'Minimize to Float'}
        </Text>
      </View>
      {!isSupported && Platform.OS === 'ios' && (
        <Text style={styles.unsupported}>iOS: Use Widgets</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  containerActive: {
    borderColor: THEME.accent,
    backgroundColor: THEME.surfaceLight,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  textActive: {
    color: THEME.accent,
  },
  unsupported: {
    fontSize: 11,
    color: THEME.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default MinimizeButton;
