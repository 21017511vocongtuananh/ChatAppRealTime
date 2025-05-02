import { useState, useEffect, useRef, createContext, useContext } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const stompClientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const subscriptionsRef = useRef(new Map());

  const connect = (token) => {
    if (!token || (stompClientRef.current?.connected && isConnected)) {
      return;
    }

    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);
    client.connect({ Authorization: `Bearer ${token}` }, () => {
      stompClientRef.current = client;
      setIsConnected(true);
      console.log('🔌 Kết nối WebSocket thành công');
      subscriptionsRef.current.forEach((subInfo, topic) => {
        if (subInfo.callback && typeof subInfo.callback === 'function') {
          const subscription = client.subscribe(topic, (msg) => {
            subInfo.callback(JSON.parse(msg.body));
          });
          subscriptionsRef.current.set(topic, {
            callback: subInfo.callback,
            subscription
          });
        }
      });
    });
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      connect(token);
    }
  }, []);

  const subscribe = (topic, callback) => {
    if (typeof callback !== 'function') {
      console.error(`Callback cho topic ${topic} không phải là hàm`);
      return () => {};
    }

    if (!stompClientRef.current?.connected || !isConnected) {
      console.warn(`Không thể đăng ký ${topic}: WebSocket chưa được kết nối`);
      subscriptionsRef.current.set(topic, { callback, subscription: null });
      return () => {
        console.log(`Đã hủy đăng ký ${topic} (không có kết nối)`);
        subscriptionsRef.current.delete(topic);
      };
    }

    console.log(`📡 Đang đăng ký vào ${topic}`);
    const subscription = stompClientRef.current.subscribe(topic, (msg) => {
      callback(JSON.parse(msg.body));
    });

    subscriptionsRef.current.set(topic, { callback, subscription });

    return () => {
      const subInfo = subscriptionsRef.current.get(topic);
      if (subInfo?.subscription && stompClientRef.current?.connected) {
        console.log(`Đã hủy đăng ký từ ${topic}`);
        subInfo.subscription.unsubscribe();
      }
      subscriptionsRef.current.delete(topic);
    };
  };

  const sendMessage = (destination, payload) => {
    if (stompClientRef.current?.connected && isConnected) {
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
        setIsConnected(false);
        stompClientRef.current = null;
        subscriptionsRef.current.clear();
      });
    } else {
      console.warn('Không thể ngắt kết nối: client chưa được kết nối');
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ connect, subscribe, sendMessage, disconnect, isConnected }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
