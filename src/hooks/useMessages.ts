import { useState, useEffect, useCallback } from 'react';
import { BikeMessage, MessageDraft, SendConfirmationData } from '../types';
import { messageService } from '../services/MessageService';
import { notificationService } from '../services/NotificationService';
import { floatingService } from '../services/FloatingService';

interface UseMessagesReturn {
  messages: BikeMessage[];
  isLoading: boolean;
  lastSent: SendConfirmationData | null;
  isSending: string | null;
  addMessage: (draft: MessageDraft) => Promise<void>;
  updateMessage: (id: string, updates: Partial<BikeMessage>) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  reorderMessages: (fromIndex: number, toIndex: number) => Promise<void>;
  sendMessage: (id: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

export const useMessages = (): UseMessagesReturn => {
  const [messages, setMessages] = useState<BikeMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSent, setLastSent] = useState<SendConfirmationData | null>(null);
  const [isSending, setIsSending] = useState<string | null>(null);

  // Load messages on mount
  useEffect(() => {
    const load = async () => {
      try {
        const loaded = await messageService.loadMessages();
        setMessages(loaded);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Sync messages to floating widget whenever they change
  useEffect(() => {
    if (messages.length > 0 && floatingService.getIsRunning()) {
      floatingService.updateMessages(messages);
    }
  }, [messages]);

  const addMessage = useCallback(async (draft: MessageDraft) => {
    const updated = await messageService.addMessage(messages, draft);
    setMessages(updated);
  }, [messages]);

  const updateMessage = useCallback(async (id: string, updates: Partial<BikeMessage>) => {
    const updated = await messageService.updateMessage(messages, id, updates);
    setMessages(updated);
  }, [messages]);

  const deleteMessage = useCallback(async (id: string) => {
    const updated = await messageService.deleteMessage(messages, id);
    setMessages(updated);
  }, [messages]);

  const reorderMessages = useCallback(async (fromIndex: number, toIndex: number) => {
    const updated = await messageService.reorderMessages(messages, fromIndex, toIndex);
    setMessages(updated);
  }, [messages]);

  const sendMessage = useCallback(async (id: string) => {
    const message = messages.find(m => m.id === id);
    if (!message) return;

    setIsSending(id);
    try {
      const confirmation = await notificationService.sendMessage(message);
      setLastSent(confirmation);

      // Update send count
      const updated = await messageService.markSent(messages, id);
      setMessages(updated);

      // Auto-clear last sent after 3 seconds
      setTimeout(() => {
        setLastSent(prev =>
          prev?.messageId === id ? null : prev,
        );
      }, 3000);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(null);
    }
  }, [messages]);

  const resetToDefaults = useCallback(async () => {
    const defaults = await messageService.resetToDefaults();
    setMessages(defaults);
  }, []);

  return {
    messages,
    isLoading,
    lastSent,
    isSending,
    addMessage,
    updateMessage,
    deleteMessage,
    reorderMessages,
    sendMessage,
    resetToDefaults,
  };
};
