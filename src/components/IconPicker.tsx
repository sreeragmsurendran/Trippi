import React, { useState } from 'react';
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
import { THEME } from '../constants/colors';
import { AVAILABLE_ICONS, ICON_CATEGORIES } from '../constants/icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ICON_SIZE = (SCREEN_WIDTH - 80) / 5;

interface IconPickerProps {
  visible: boolean;
  message: BikeMessage | null;
  onSelect: (iconName: string) => void;
  onClose: () => void;
}

const IconPicker: React.FC<IconPickerProps> = ({
  visible,
  message,
  onSelect,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState(ICON_CATEGORIES[0]);

  if (!message) return null;

  const filteredIcons = AVAILABLE_ICONS.filter(
    icon => icon.category === activeCategory,
  );

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
                  styles.currentIcon,
                  { backgroundColor: message.color },
                ]}
              >
                <Icon name={message.icon} size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>Choose Icon</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={THEME.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Category tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContent}
          >
            {ICON_CATEGORIES.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryTab,
                  activeCategory === category && styles.categoryTabActive,
                ]}
                onPress={() => setActiveCategory(category)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryText,
                    activeCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Icon grid */}
          <ScrollView
            style={styles.iconGrid}
            contentContainerStyle={styles.iconGridContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.iconRow}>
              {filteredIcons.map(icon => (
                <TouchableOpacity
                  key={icon.name}
                  style={[
                    styles.iconItem,
                    message.icon === icon.name && styles.iconItemSelected,
                  ]}
                  onPress={() => onSelect(icon.name)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor:
                          message.icon === icon.name
                            ? message.color
                            : THEME.surfaceHover,
                      },
                    ]}
                  >
                    <Icon
                      name={icon.name}
                      size={26}
                      color={
                        message.icon === icon.name
                          ? '#FFFFFF'
                          : THEME.textSecondary
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.iconLabel,
                      message.icon === icon.name && styles.iconLabelSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {icon.label}
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
    maxHeight: '75%',
    paddingBottom: 24,
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
  currentIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.textPrimary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryScroll: {
    maxHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  categoryContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: THEME.surface,
    marginRight: 6,
  },
  categoryTabActive: {
    backgroundColor: THEME.accent,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textSecondary,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  iconGrid: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  iconGridContent: {
    paddingBottom: 20,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  iconItem: {
    width: ICON_SIZE,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  iconItemSelected: {
    backgroundColor: THEME.surfaceLight,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconLabel: {
    fontSize: 10,
    color: THEME.textMuted,
    textAlign: 'center',
    fontWeight: '500',
  },
  iconLabelSelected: {
    color: THEME.textPrimary,
    fontWeight: '700',
  },
});

export default IconPicker;
