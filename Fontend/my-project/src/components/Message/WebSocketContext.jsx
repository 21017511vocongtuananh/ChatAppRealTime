import { useState, useEffect, useRef, createContext, useContext } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const stompClientRef = useRef(null);

  const connect = (token) => {
    if (token == null) {
      return;
    }

    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);
    client.connect({ Authorization: `Bearer ${token}` }, () => {
      stompClientRef.current = client;
      console.log('🔌 WebSocket connected');
    });
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token && !stompClientRef.current?.connected) {
      connect(token);
    }
  }, []);

  const subscribe = (topic, callback) => {
    if (!stompClientRef.current?.connected) {
      return () => {
        console.log(`Unsubscribed from ${topic} (no connection)`);
      };
    }

    console.log(`📡 Subscribing to ${topic}`);
    const subscription = stompClientRef.current.subscribe(topic, (msg) => {
      callback(JSON.parse(msg.body));
    });

    return () => {
      console.log(`Unsubscribing from ${topic}`);
      subscription.unsubscribe();
    };
  };

  const sendMessage = (destination, payload) => {
    if (stompClientRef.current?.connected) {
      console.log(`Sending message to ${destination}:`, payload);
      stompClientRef.current.send(destination, {}, JSON.stringify(payload));
    } else {
      console.warn('Cannot send message: WebSocket is not connected.');
    }
  };

  const disconnect = () => {
    if (stompClientRef.current?.connected) {
      stompClientRef.current.disconnect(() => {
        console.log('🔌 Disconnected from WebSocket');
      });
    } else {
      console.warn('Cannot disconnect: client not connected');
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ connect, subscribe, sendMessage, disconnect }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
