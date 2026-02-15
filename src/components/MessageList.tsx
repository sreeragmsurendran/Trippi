import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { BikeMessage, SendConfirmationData } from '../types';
import MessageItem from './MessageItem';
import { THEME } from '../constants/colors';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MessageListProps {
  messages: BikeMessage[];
  isSending: string | null;
  lastSent: SendConfirmationData | null;
  onSend: (id: string) => void;
  onUpdate: (id: string, updates: Partial<BikeMessage>) => void;
  onDelete: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onEditIcon: (message: BikeMessage) => void;
  onEditColor: (message: BikeMessage) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isSending,
  lastSent,
  onSend,
  onUpdate,
  onDelete,
  onReorder,
  onEditIcon,
  onEditColor,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragEnd = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex !== toIndex) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        onReorder(fromIndex, toIndex);
      }
      setDraggedIndex(null);
    },
    [onReorder],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: BikeMessage; index: number }) => {
      return (
        <MessageItem
          message={item}
          isSending={isSending === item.id}
          isLastSent={lastSent?.messageId === item.id}
          onSend={onSend}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onEditIcon={onEditIcon}
          onEditColor={onEditColor}
          isDragging={draggedIndex === index}
        />
      );
    },
    [
      isSending,
      lastSent,
      onSend,
      onUpdate,
      onDelete,
      onEditIcon,
      onEditColor,
      draggedIndex,
    ],
  );

  const keyExtractor = useCallback((item: BikeMessage) => item.id, []);

  return (
    <FlatList
      data={messages}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 100,
  },
  separator: {
    height: 2,
  },
});

export default MessageList;
