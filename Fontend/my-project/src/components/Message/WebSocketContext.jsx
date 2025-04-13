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
      console.log('🔌 Kết nối WebSocket thành công');
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
        console.log(`Đã hủy đăng ký ${topic} (không có kết nối)`);
      };
    }

    console.log(`📡 Đang đăng ký vào ${topic}`);
    const subscription = stompClientRef.current.subscribe(topic, (msg) => {
      callback(JSON.parse(msg.body));
    });

    return () => {
      console.log(`Đã hủy đăng ký từ ${topic}`);
      subscription.unsubscribe();
    };
  };

  const sendMessage = (destination, payload) => {
    if (stompClientRef.current?.connected) {
      console.log(`Đang gửi tin nhắn đến ${destination}:`, payload);
      stompClientRef.current.send(destination, {}, JSON.stringify(payload));
    } else {
      console.warn('Không thể gửi tin nhắn: WebSocket chưa được kết nối.');
    }
  };

  const disconnect = () => {
    if (stompClientRef.current?.connected) {
      stompClientRef.current.disconnect(() => {
        console.log('🔌 Đã ngắt kết nối WebSocket');
      });
    } else {
      console.warn('Không thể ngắt kết nối: client chưa được kết nối');
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
