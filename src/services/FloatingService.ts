import { NativeModules, Platform } from 'react-native';
import { BikeMessage, BikeMessengerNativeModule } from '../types';
import { serializeMessages } from '../utils/helpers';

// The native module is registered as 'BikeMessengerModule' on Android
const NativeBridge: BikeMessengerNativeModule | undefined =
  Platform.OS === 'android'
    ? NativeModules.BikeMessengerModule
    : undefined;

class FloatingService {
  private isRunning = false;

  /**
   * Check if the app has overlay permission (Android)
   */
  async hasOverlayPermission(): Promise<boolean> {
    if (Platform.OS !== 'android' || !NativeBridge) {
      return false;
    }
    try {
      return await NativeBridge.checkOverlayPermission();
    } catch (error) {
      console.error('Failed to check overlay permission:', error);
      return false;
    }
  }

  /**
   * Request overlay permission from user
   */
  requestOverlayPermission(): void {
    if (Platform.OS === 'android' && NativeBridge) {
      NativeBridge.requestOverlayPermission();
    }
  }

  /**
   * Start the floating widget overlay service
   */
  async startFloating(messages: BikeMessage[]): Promise<boolean> {
    if (Platform.OS !== 'android' || !NativeBridge) {
      console.warn('Floating widget is only supported on Android');
      return false;
    }

    try {
      const serialized = serializeMessages(messages);
      const success = await NativeBridge.startFloatingWidget(serialized);
      this.isRunning = success;
      return success;
    } catch (error) {
      console.error('Failed to start floating widget:', error);
      return false;
    }
  }

  /**
   * Stop the floating widget overlay service
   */
  async stopFloating(): Promise<boolean> {
    if (Platform.OS !== 'android' || !NativeBridge) {
      return false;
    }

    try {
      const success = await NativeBridge.stopFloatingWidget();
      this.isRunning = !success;
      return success;
    } catch (error) {
      console.error('Failed to stop floating widget:', error);
      return false;
    }
  }

  /**
   * Update messages in the running floating widget
   */
  async updateMessages(messages: BikeMessage[]): Promise<boolean> {
    if (Platform.OS !== 'android' || !NativeBridge || !this.isRunning) {
      return false;
    }

    try {
      const serialized = serializeMessages(messages);
      return await NativeBridge.updateMessages(serialized);
    } catch (error) {
      console.error('Failed to update floating messages:', error);
      return false;
    }
  }

  /**
   * Minimize the React Native activity (go to background)
   */
  minimizeApp(): void {
    if (Platform.OS === 'android' && NativeBridge) {
      NativeBridge.minimizeApp();
    }
  }

  /**
   * Check if floating service is currently running
   */
  getIsRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Check if platform supports floating overlay
   */
  isSupported(): boolean {
    return Platform.OS === 'android';
  }
}

export const floatingService = new FloatingService();
