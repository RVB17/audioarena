import { create } from 'zustand';
import type { ChatMessage } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  unreadCount: number;
  
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleChat: () => void;
  resetUnread: () => void;
  incrementUnread: () => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isOpen: false,
  unreadCount: 0,
  
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message],
    unreadCount: state.isOpen ? state.unreadCount : state.unreadCount + 1
  })),
  setMessages: (messages) => set({ messages }),
  setIsOpen: (isOpen) => set((state) => ({ 
    isOpen,
    unreadCount: isOpen ? 0 : state.unreadCount
  })),
  toggleChat: () => set((state) => ({ 
    isOpen: !state.isOpen,
    unreadCount: !state.isOpen ? 0 : state.unreadCount
  })),
  resetUnread: () => set({ unreadCount: 0 }),
  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  reset: () => set({
    messages: [],
    isOpen: false,
    unreadCount: 0
  })
}));
