import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BikeMessage } from '../types';
import { THEME, MESSAGE_COLORS } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DOT_SIZE = (SCREEN_WIDTH - 80) / 6;

interface ColorPickerProps {
  visible: boolean;
  message: BikeMessage | null;
  onSelect: (color: string) => void;
  onClose: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  visible,
  message,
  onSelect,
  onClose,
}) => {
  if (!message) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.previewIcon,
                  { backgroundColor: message.color },
                ]}
              >
                <Icon name={message.icon} size={24} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.title}>Choose Color</Text>
                <Text style={styles.messageName}>{message.text}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={THEME.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Color grid */}
          <ScrollView
            style={styles.colorGrid}
            contentContainerStyle={styles.colorGridContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.colorRow}>
              {MESSAGE_COLORS.map(color => (
                <TouchableOpacity
                  key={color.hex}
                  style={styles.colorItem}
                  onPress={() => onSelect(color.hex)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: color.hex },
                      message.color === color.hex && styles.colorDotSelected,
                    ]}
                  >
                    {message.color === color.hex && (
                      <Icon name="check" size={22} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.colorName} numberOfLines={1}>
                    {color.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: THEME.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: THEME.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '60%',
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.textPrimary,
  },
  messageName: {
    fontSize: 13,
    color: THEME.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorGrid: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  colorGridContent: {
    paddingBottom: 20,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
  },
  colorItem: {
    width: DOT_SIZE,
    alignItems: 'center',
    paddingVertical: 6,
  },
  colorDot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  colorName: {
    fontSize: 10,
    color: THEME.textMuted,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ColorPicker;
