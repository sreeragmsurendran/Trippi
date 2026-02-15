import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { THEME } from '../constants/colors';

interface HeaderProps {
  onMinimize: () => void;
  onReset: () => void;
  isFloating: boolean;
  isSupported: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onMinimize,
  onReset,
  isFloating,
  isSupported,
}) => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={THEME.background}
        translucent={false}
      />

      <View style={styles.leftSection}>
        <View style={styles.logoContainer}>
          <Icon name="motorbike" size={28} color={THEME.accent} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>BikeMessenger</Text>
          <Text style={styles.subtitle}>
            {isFloating ? '● Floating Active' : 'Group Riding Comms'}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onReset}
          activeOpacity={0.7}
        >
          <Icon name="restore" size={22} color={THEME.textSecondary} />
        </TouchableOpacity>

        {isSupported && (
          <TouchableOpacity
            style={[
              styles.minimizeButton,
              isFloating && styles.minimizeButtonActive,
            ]}
            onPress={onMinimize}
            activeOpacity={0.7}
          >
            <Icon
              name={isFloating ? 'arrow-expand' : 'arrow-collapse'}
              size={20}
              color={isFloating ? THEME.accent : THEME.textPrimary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    backgroundColor: THEME.background,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: THEME.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.accentDark,
  },
  titleContainer: {
    marginLeft: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: THEME.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: THEME.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  minimizeButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: THEME.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  minimizeButtonActive: {
    backgroundColor: THEME.surfaceLight,
    borderColor: THEME.accent,
  },
});

export default Header;
