import React, { createContext, useContext, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const WebSocketContext = createContext();

const getHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`
});

export const WebSocketProvider = ({ children }) => {
  const stompClientRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);

    client.connect(
      getHeader(),
      () => {
        stompClientRef.current = client;
      },
      (error) => console.error('WebSocket connection error:', error)
    );

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
    };
  }, []);

  const subscribe = (topic, callback) => {
    if (!stompClientRef.current?.connected) return () => {};

    const subscription = stompClientRef.current.subscribe(topic, (msg) => {
      callback(JSON.parse(msg.body));
    });
    return () => subscription.unsubscribe();
  };

  const sendMessage = (destination, payload) => {
    if (stompClientRef.current?.connected) {
      stompClientRef.current.send(destination, {}, JSON.stringify(payload));
    }
  };

  return (
    <WebSocketContext.Provider value={{ subscribe, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
