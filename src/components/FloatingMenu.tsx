import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BikeMessage } from '../types';
import { THEME } from '../constants/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FloatingMenuProps {
  visible: boolean;
  messages: BikeMessage[];
  onSend: (id: string) => void;
  onEditMessages: () => void;
  onClose: () => void;
  isSending: string | null;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({
  visible,
  messages,
  onSend,
  onEditMessages,
  onClose,
  isSending,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, opacityAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      <Animated.View
        style={[
          styles.menuContainer,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        {/* Menu header */}
        <View style={styles.menuHeader}>
          <Icon name="motorbike" size={20} color={THEME.accent} />
          <Text style={styles.menuTitle}>Quick Send</Text>
        </View>

        {/* Scrollable message grid */}
        <ScrollView
          style={styles.messageScroll}
          contentContainerStyle={styles.messageGrid}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => (
            <Animated.View
              key={message.id}
              style={[
                styles.messageItemWrapper,
                {
                  opacity: slideAnim,
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20 + index * 5, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.messageItem,
                  isSending === message.id && styles.messageItemSending,
                ]}
                onPress={() => onSend(message.id)}
                disabled={isSending === message.id}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.messageIcon,
                    { backgroundColor: message.color },
                  ]}
                >
                  <Icon name={message.icon} size={30} color="#FFFFFF" />
                </View>
                <Text style={styles.messageText} numberOfLines={1}>
                  {message.text}
                </Text>
                {isSending === message.id && (
                  <View style={styles.sendingIndicator}>
                    <Icon name="loading" size={14} color={THEME.success} />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Edit messages button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEditMessages}
          activeOpacity={0.7}
        >
          <Icon name="pencil" size={18} color={THEME.accent} />
          <Text style={styles.editButtonText}>Edit Messages</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9998,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    position: 'absolute',
    right: 16,
    bottom: 280,
    width: 200,
    maxHeight: SCREEN_HEIGHT * 0.5,
    backgroundColor: THEME.floatingBg,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: THEME.floatingBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 15,
    overflow: 'hidden',
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: 0.5,
  },
  messageScroll: {
    maxHeight: SCREEN_HEIGHT * 0.35,
  },
  messageGrid: {
    padding: 8,
    gap: 6,
  },
  messageItemWrapper: {},
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: THEME.surface,
    gap: 10,
  },
  messageItemSending: {
    opacity: 0.6,
    backgroundColor: THEME.surfaceLight,
  },
  messageIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  messageText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  sendingIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: THEME.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    backgroundColor: THEME.surfaceLight,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.accent,
  },
});

export default FloatingMenu;
