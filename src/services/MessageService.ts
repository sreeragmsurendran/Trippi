import AsyncStorage from '@react-native-async-storage/async-storage';
import { BikeMessage, MessageDraft } from '../types';
import { DEFAULT_MESSAGES } from '../constants/defaultMessages';
import { generateId } from '../utils/helpers';

const STORAGE_KEY = '@bike_messenger_messages';
const LAST_SENT_KEY = '@bike_messenger_last_sent';

class MessageService {
  /**
   * Load messages from storage, or return defaults
   */
  async loadMessages(): Promise<BikeMessage[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as BikeMessage[];
        return parsed.sort((a, b) => a.order - b.order);
      }
      // First launch - save and return defaults
      await this.saveMessages(DEFAULT_MESSAGES);
      return DEFAULT_MESSAGES;
    } catch (error) {
      console.error('Failed to load messages:', error);
      return DEFAULT_MESSAGES;
    }
  }

  /**
   * Save all messages to storage
   */
  async saveMessages(messages: BikeMessage[]): Promise<void> {
    try {
      const json = JSON.stringify(messages);
      await AsyncStorage.setItem(STORAGE_KEY, json);
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  }

  /**
   * Add a new message
   */
  async addMessage(
    messages: BikeMessage[],
    draft: MessageDraft,
  ): Promise<BikeMessage[]> {
    const newMessage: BikeMessage = {
      id: generateId(),
      text: draft.text.trim(),
      icon: draft.icon,
      color: draft.color,
      order: messages.length,
      sendCount: 0,
    };

    const updated = [...messages, newMessage];
    await this.saveMessages(updated);
    return updated;
  }

  /**
   * Update an existing message
   */
  async updateMessage(
    messages: BikeMessage[],
    id: string,
    updates: Partial<BikeMessage>,
  ): Promise<BikeMessage[]> {
    const updated = messages.map(msg =>
      msg.id === id ? { ...msg, ...updates } : msg,
    );
    await this.saveMessages(updated);
    return updated;
  }

  /**
   * Delete a message
   */
  async deleteMessage(
    messages: BikeMessage[],
    id: string,
  ): Promise<BikeMessage[]> {
    const filtered = messages.filter(msg => msg.id !== id);
    const reordered = filtered.map((msg, index) => ({
      ...msg,
      order: index,
    }));
    await this.saveMessages(reordered);
    return reordered;
  }

  /**
   * Reorder messages after drag
   */
  async reorderMessages(
    messages: BikeMessage[],
    fromIndex: number,
    toIndex: number,
  ): Promise<BikeMessage[]> {
    const result = [...messages];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);

    const reordered = result.map((msg, index) => ({
      ...msg,
      order: index,
    }));

    await this.saveMessages(reordered);
    return reordered;
  }

  /**
   * Mark a message as sent
   */
  async markSent(
    messages: BikeMessage[],
    id: string,
  ): Promise<BikeMessage[]> {
    const now = Date.now();
    const updated = messages.map(msg =>
      msg.id === id
        ? { ...msg, lastSentAt: now, sendCount: msg.sendCount + 1 }
        : msg,
    );
    await this.saveMessages(updated);
    await AsyncStorage.setItem(
      LAST_SENT_KEY,
      JSON.stringify({ messageId: id, timestamp: now }),
    );
    return updated;
  }

  /**
   * Reset to default messages
   */
  async resetToDefaults(): Promise<BikeMessage[]> {
    await this.saveMessages(DEFAULT_MESSAGES);
    return DEFAULT_MESSAGES;
  }
}

export const messageService = new MessageService();
