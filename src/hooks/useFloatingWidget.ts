import { useState, useCallback, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { BikeMessage } from '../types';
import { floatingService } from '../services/FloatingService';

interface UseFloatingWidgetReturn {
  isFloating: boolean;
  hasPermission: boolean;
  isSupported: boolean;
  startFloating: (messages: BikeMessage[]) => Promise<void>;
  stopFloating: () => Promise<void>;
  checkPermission: () => Promise<void>;
  requestPermission: () => void;
  minimizeAndFloat: (messages: BikeMessage[]) => Promise<void>;
}

export const useFloatingWidget = (): UseFloatingWidgetReturn => {
  const [isFloating, setIsFloating] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const isSupported = floatingService.isSupported();

  const checkPermission = useCallback(async () => {
    if (!isSupported) return;
    const permitted = await floatingService.hasOverlayPermission();
    setHasPermission(permitted);
  }, [isSupported]);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const requestPermission = useCallback(() => {
    if (!isSupported) {
      Alert.alert(
        'Not Supported',
        'Floating overlay is only available on Android. On iOS, use lock screen widgets instead.',
      );
      return;
    }
    floatingService.requestOverlayPermission();
    // Re-check after a delay (user might grant permission)
    setTimeout(checkPermission, 2000);
  }, [isSupported, checkPermission]);

  const startFloating = useCallback(async (messages: BikeMessage[]) => {
    if (!isSupported) return;

    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'BikeMessenger needs "Display over other apps" permission to show the floating widget.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant Permission', onPress: requestPermission },
        ],
      );
      return;
    }

    const success = await floatingService.startFloating(messages);
    setIsFloating(success);
  }, [isSupported, hasPermission, requestPermission]);

  const stopFloating = useCallback(async () => {
    const success = await floatingService.stopFloating();
    if (success) {
      setIsFloating(false);
    }
  }, []);

  const minimizeAndFloat = useCallback(async (messages: BikeMessage[]) => {
    if (!isFloating) {
      await startFloating(messages);
    }
    floatingService.minimizeApp();
  }, [isFloating, startFloating]);

  return {
    isFloating,
    hasPermission,
    isSupported,
    startFloating,
    stopFloating,
    checkPermission,
    requestPermission,
    minimizeAndFloat,
  };
};
