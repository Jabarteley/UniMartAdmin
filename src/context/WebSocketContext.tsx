import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { WebSocketService } from '../services/websocketService';

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (event: string, data: any) => void;
  subscribe: (event: string, callback: (data: any) => void) => void;
  unsubscribe: (event: string, callback: (data: any) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authToken } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const wsService = WebSocketService.getInstance();

  useEffect(() => {
    if (authToken) {
      wsService.connect(authToken);
      
      const handleConnected = () => setIsConnected(true);
      const handleDisconnected = () => setIsConnected(false);
      
      wsService.subscribe('connected', handleConnected);
      wsService.subscribe('disconnected', handleDisconnected);
      
      return () => {
        wsService.unsubscribe('connected', handleConnected);
        wsService.unsubscribe('disconnected', handleDisconnected);
      };
    }
  }, [authToken]);

  const sendMessage = (event: string, data: any) => {
    wsService.send(event, data);
  };

  const subscribe = (event: string, callback: (data: any) => void) => {
    wsService.subscribe(event, callback);
  };

  const unsubscribe = (event: string, callback: (data: any) => void) => {
    wsService.unsubscribe(event, callback);
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, sendMessage, subscribe, unsubscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};