'use client';
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useChatStore } from '@/stores/chatStore';
import type { ChatMessage } from '@/types';

export function useChat(sessionId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();
  const store = useChatStore();

  const fetchMessages = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:profiles(username, display_name, avatar_url)')
        .eq('session_id', id)
        .order('created_at', { ascending: true })
        .limit(100);
        
      if (error) throw error;
      
      const formattedMessages: ChatMessage[] = data.map(msg => ({
        id: msg.id,
        sessionId: msg.session_id,
        userId: msg.user_id,
        content: msg.content,
        createdAt: msg.created_at,
        sender: msg.sender ? {
          username: msg.sender.username,
          displayName: msg.sender.display_name,
          avatarUrl: msg.sender.avatar_url
        } : undefined
      }));
      
      store.setMessages(formattedMessages);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, store]);

  useEffect(() => {
    if (!sessionId) return;
    
    fetchMessages(sessionId);

    const channel = supabase.channel(`chat:${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `session_id=eq.${sessionId}`
      }, async (payload) => {
        const msg = payload.new;
        
        // Fetch sender details since they aren't in the INSERT payload
        const { data: senderData } = await supabase
          .from('profiles')
          .select('username, display_name, avatar_url')
          .eq('id', msg.user_id)
          .single();
          
        const formattedMessage: ChatMessage = {
          id: msg.id,
          sessionId: msg.session_id,
          userId: msg.user_id,
          content: msg.content,
          createdAt: msg.created_at,
          sender: senderData ? {
            username: senderData.username,
            displayName: senderData.display_name,
            avatarUrl: senderData.avatar_url
          } : undefined
        };
        
        store.addMessage(formattedMessage);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, supabase, fetchMessages, store]);

  const sendMessage = async (userId: string, content: string) => {
    if (!sessionId || !content.trim()) return;
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          session_id: sessionId,
          user_id: userId,
          content: content.trim()
        });
        
      if (error) throw error;
    } catch (err: any) {
      console.error('Send message error:', err);
      setError(err);
      throw err;
    }
  };

  return {
    messages: store.messages,
    isOpen: store.isOpen,
    unreadCount: store.unreadCount,
    isLoading,
    error,
    sendMessage,
    toggleChat: store.toggleChat,
    setIsOpen: store.setIsOpen,
    resetUnread: store.resetUnread
  };
}
