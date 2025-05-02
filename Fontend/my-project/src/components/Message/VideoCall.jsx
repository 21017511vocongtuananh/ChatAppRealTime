import React, { useEffect, useRef, useState } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useWebSocket } from './WebSocketContext';

const getUrlParams = (url) => {
  const urlStr = url.split('?')[1];
  if (!urlStr) return {};
  const urlSearchParams = new URLSearchParams(urlStr);
  return Object.fromEntries(urlSearchParams.entries());
};

const VideoCall = ({ conversationId, userId, receiverId, onClose }) => {
  const containerRef = useRef(null);
  const { subscribe } = useWebSocket();
  const zpRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const appID = 1279438179;
  const serverSecret = '950f6baefc3a6489751ca1c54a9ed796';

  const roomID = conversationId || Math.floor(Math.random() * 10000) + '';
  const sanitizedUserId =
    String(userId)
      .trim()
      .replace(/[^a-zA-Z0-9]/g, '') || Math.floor(Math.random() * 10000) + '';
  const userName =
    getUrlParams(window.location.href)['username'] ||
    `userName${sanitizedUserId}`;

  useEffect(() => {
    if (!userId || !conversationId || !receiverId) {
      setError('Thiếu thông tin người dùng hoặc cuộc trò chuyện.');
      setIsLoading(false);
      return;
    }

    const initZego = async () => {
      try {
        setIsLoading(true);
        if (!sanitizedUserId) {
          throw new Error('User ID không hợp lệ hoặc rỗng.');
        }
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          sanitizedUserId,
          userName
        );
        zpRef.current = ZegoUIKitPrebuilt.create(kitToken);

        zpRef.current.joinRoom({
          container: containerRef.current,
          sharedLinks: [
            {
              name: 'Personal link',
              url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`
            }
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference
          },
          turnOnMicrophoneWhenJoining: false,
          turnOnCameraWhenJoining: false,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: true,
          showTextChat: true,
          showUserList: true,
          maxUsers: 2,
          layout: 'Auto',
          showLayoutButton: false,
          onLeaveRoom: () => {
            console.log('Đã rời phòng');
            window.location.href = `/conversations/${conversationId}`;
          },
          onUserLeave: () => {
            console.log('Người dùng khác đã rời phòng');
            window.location.href = `/conversations/${conversationId}`;
          }
        });
      } catch (err) {
        console.error('Lỗi khi tham gia phòng Zego:', err);
        setError(`Lỗi kết nối ZegoCloud: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    initZego();

    const unsubscribe = subscribe(
      `/topic/conversation/${conversationId}`,
      (signal) => {
        if (signal.type === 'CALL' && signal.receiverId === userId) {
          // Người nhận tự động tham gia phòng khi nhận tín hiệu
        } else if (
          signal.type === 'CANCEL_CALL' &&
          signal.receiverId === userId
        ) {
          onClose();
        }
      }
    );

    return () => {
      if (zpRef.current) {
        zpRef.current.hangUp();
        zpRef.current = null;
      }
      unsubscribe();
    };
  }, [conversationId, userId, receiverId, subscribe]);

  return <div></div>;
};

export default VideoCall;
