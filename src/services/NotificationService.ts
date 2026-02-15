import { BikeMessage, SendConfirmationData } from '../types';

/**
 * NotificationService handles sending messages to the group.
 * 
 * In a production app, this would integrate with:
 * - Firebase Cloud Messaging (FCM) for push notifications
 * - WebSocket server for real-time messaging
 * - Bluetooth Mesh for offline group communication
 * - SMS fallback for no-internet scenarios
 * 
 * For this implementation, we simulate the send and provide
 * the hooks for integrating your preferred transport.
 */

type SendCallback = (data: SendConfirmationData) => void;

class NotificationService {
  private listeners: SendCallback[] = [];

  /**
   * Send a message to the riding group
   */
  async sendMessage(message: BikeMessage): Promise<SendConfirmationData> {
    // Simulate network send (replace with actual implementation)
    // Options for real implementation:
    //
    // 1. Firebase Cloud Messaging:
    //    await firebase.messaging().sendMessage({
    //      data: { type: 'bike_alert', text: message.text, icon: message.icon },
    //      topic: 'ride_group_xyz',
    //    });
    //
    // 2. WebSocket:
    //    ws.send(JSON.stringify({ type: 'alert', message }));
    //
    // 3. Bluetooth Mesh (react-native-ble-plx):
    //    await bleManager.writeCharacteristic(...)

    const confirmation: SendConfirmationData = {
      messageId: message.id,
      messageText: message.text,
      timestamp: Date.now(),
    };

    // Simulate slight delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 150));

    // Notify all listeners
    this.listeners.forEach(callback => callback(confirmation));

    console.log(`[BikeMessenger] Sent: "${message.text}" at ${new Date().toLocaleTimeString()}`);

    return confirmation;
  }

  /**
   * Subscribe to send confirmations
   */
  onMessageSent(callback: SendCallback): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Clear all listeners
   */
  removeAllListeners(): void {
    this.listeners = [];
  }
}

export const notificationService = new NotificationService();
