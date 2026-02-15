// ============================================================
// BikeMessenger Type Definitions
// ============================================================

export interface BikeMessage {
  id: string;
  text: string;
  icon: string;
  color: string;
  order: number;
  lastSentAt?: number;
  sendCount: number;
}

export interface MessageDraft {
  text: string;
  icon: string;
  color: string;
}

export interface FloatingWidgetState {
  isVisible: boolean;
  isMenuOpen: boolean;
  position: FloatingPosition;
}

export interface FloatingPosition {
  x: number;
  y: number;
}

export type SnapPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'custom';

export interface SendConfirmationData {
  messageId: string;
  messageText: string;
  timestamp: number;
}

export interface AppState {
  messages: BikeMessage[];
  isMinimized: boolean;
  lastSentMessage: SendConfirmationData | null;
  isFloatingActive: boolean;
}

export interface IconOption {
  name: string;
  label: string;
  category: string;
}

export interface ColorOption {
  hex: string;
  name: string;
}

// Native Module Types
export interface BikeMessengerNativeModule {
  startFloatingWidget(messages: string): Promise<boolean>;
  stopFloatingWidget(): Promise<boolean>;
  updateMessages(messages: string): Promise<boolean>;
  checkOverlayPermission(): Promise<boolean>;
  requestOverlayPermission(): void;
  minimizeApp(): void;
}

export type EditMode = 'text' | 'icon' | 'color' | null;

export interface DragInfo {
  id: string;
  fromIndex: number;
  toIndex: number;
}
