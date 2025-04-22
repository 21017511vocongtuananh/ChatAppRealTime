import React, { useEffect, useRef, useState } from 'react';
import { useWebSocket } from './WebSocketContext';
import { Button, Tooltip } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  VideoCameraOutlined,
  VideoCameraAddOutlined,
  AudioOutlined,
  AudioMutedOutlined,
  PhoneOutlined,
  SwapOutlined
} from '@ant-design/icons';

const VideoCall = ({ conversationId, userId, receiverId, onClose }) => {
  const { subscribe, sendMessage } = useWebSocket();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [callActive, setCallActive] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [facingMode, setFacingMode] = useState('user');
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);
  const localStreamRef = useRef(null);

  useEffect(() => {
    console.log('VideoCall mounted with props:', {
      conversationId,
      userId,
      receiverId
    });

    // Khởi tạo PeerConnection
    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    // Lấy media (camera/microphone)
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { width: 100, height: 70, facingMode }
        });
        localStreamRef.current = stream;
        if (isMountedRef.current && localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          console.log('Local video stream set');
        }
        if (
          peerConnectionRef.current &&
          peerConnectionRef.current.signalingState !== 'closed'
        ) {
          stream.getTracks().forEach((track) => {
            peerConnectionRef.current.addTrack(track, stream);
          });
          console.log('Tracks added to PeerConnection');
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setError(`Lỗi truy cập camera/microphone: ${error.message}`);
      }
    };

    // Xử lý ICE candidate
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate');
        sendMessage(`/app/call/${conversationId}`, {
          type: 'ice-candidate',
          senderId: userId,
          receiverId: receiverId,
          payload: event.candidate
        });
      }
    };

    // Xử lý track từ remote
    peerConnectionRef.current.ontrack = (event) => {
      if (!isMountedRef.current) return;
      if (remoteVideoRef.current) {
        const remoteStream = new MediaStream();
        remoteStream.addTrack(event.track);
        remoteVideoRef.current.srcObject = remoteStream;
        console.log('Remote video stream set');
      }
    };

    // Xử lý tín hiệu WebSocket
    const unsubscribe = subscribe(
      `/topic/conversation/${conversationId}`,
      (signal) => {
        if (!isMountedRef.current) return;
        if (signal.receiverId !== userId) return;

        console.log('Received WebSocket signal:', signal);
        const pc = peerConnectionRef.current;
        if (!pc || pc.signalingState === 'closed') return;

        if (signal.type === 'offer') {
          pc.setRemoteDescription(new RTCSessionDescription(signal.payload))
            .then(() => pc.createAnswer())
            .then((answer) => {
              pc.setLocalDescription(answer);
              sendMessage(`/app/call/${conversationId}`, {
                type: 'answer',
                senderId: userId,
                receiverId: signal.senderId,
                payload: answer
              });
              console.log('Answer sent');
            })
            .catch((error) => {
              console.error('Error handling offer:', error);
              setError('Lỗi xử lý offer');
            });
          if (isMountedRef.current) {
            setCallActive(true);
            setIsRinging(false);
          }
        } else if (signal.type === 'answer') {
          pc.setRemoteDescription(
            new RTCSessionDescription(signal.payload)
          ).catch((error) => {
            console.error('Error setting remote description:', error);
            setError('Lỗi xử lý answer');
          });
          if (isMountedRef.current) {
            setCallActive(true);
            setIsRinging(false);
          }
        } else if (signal.type === 'ice-candidate') {
          pc.addIceCandidate(new RTCIceCandidate(signal.payload)).catch(
            (error) => {
              console.error('Error adding ICE candidate:', error);
              setError('Lỗi thêm ICE candidate');
            }
          );
        } else if (signal.type === 'end-call') {
          endCall();
        }
      }
    );

    // Lấy media và bắt đầu cuộc gọi
    getMedia().then(() => {
      if (!error) {
        startCall();
      }
    });

    // Cleanup
    return () => {
      console.log('Cleaning up VideoCall');
      isMountedRef.current = false;
      unsubscribe();
      if (
        peerConnectionRef.current &&
        peerConnectionRef.current.signalingState !== 'closed'
      ) {
        peerConnectionRef.current.close();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [subscribe, sendMessage, conversationId, userId, receiverId, facingMode]);

  const startCall = async () => {
    try {
      const pc = peerConnectionRef.current;
      if (!pc || pc.signalingState === 'closed') {
        console.warn('Cannot start call: peerConnection is closed');
        setError('Kết nối WebRTC đã đóng');
        return;
      }
      console.log('Creating offer...');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      console.log('Offer created:', offer);
      sendMessage(`/app/call/${conversationId}`, {
        type: 'offer',
        senderId: userId,
        receiverId: receiverId,
        payload: offer
      });
      console.log('Offer sent via WebSocket');
      setIsRinging(true);
    } catch (error) {
      console.error('Error starting call:', error);
      setError(`Lỗi bắt đầu cuộc gọi: ${error.message}`);
    }
  };

  const endCall = () => {
    if (!isMountedRef.current) return;
    if (
      peerConnectionRef.current &&
      peerConnectionRef.current.signalingState !== 'closed'
    ) {
      peerConnectionRef.current.close();
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    sendMessage(`/app/call/${conversationId}`, {
      type: 'end-call',
      senderId: userId,
      receiverId: receiverId,
      payload: {}
    });
    console.log('Call ended');
    setCallActive(false);
    setIsRinging(false);
    onClose();
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicOn(audioTrack.enabled);
        console.log('Mic toggled:', audioTrack.enabled);
      }
    }
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCameraOn(videoTrack.enabled);
        console.log('Camera toggled:', videoTrack.enabled);
      }
    }
  };

  const switchCamera = async () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    console.log('Switching camera to:', newFacingMode);
  };

  return (
    <AnimatePresence>
      <motion.div
        className='fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50'
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {error ? (
          <div className='text-white text-lg mb-4'>
            {error}
            <Button type='primary' danger onClick={onClose} className='ml-4'>
              Đóng
            </Button>
          </div>
        ) : isRinging ? (
          <motion.div
            className='text-white text-2xl font-bold mb-5'
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Đang đổ chuông...
          </motion.div>
        ) : callActive ? (
          <div className='flex flex-col md:flex-row w-full max-w-4xl h-[80%] gap-2 px-4'>
            <div className='relative flex-1 bg-gray-800 rounded-lg overflow-hidden'>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className='w-full h-full object-cover'
              />
              <span className='absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm'>
                Người nhận
              </span>
            </div>
            <div className='relative flex-1 bg-gray-800 rounded-lg overflow-hidden'>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className='w-full h-full object-cover'
              />
              <span className='absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm'>
                Bạn
              </span>
            </div>
          </div>
        ) : (
          <div className='text-white text-lg'>Đang kết nối...</div>
        )}
        <div className='flex gap-4 p-5 bg-black bg-opacity-70 rounded-full mt-2'>
          <Tooltip title={micOn ? 'Tắt mic' : 'Bật mic'}>
            <Button
              type='primary'
              shape='circle'
              icon={micOn ? <AudioOutlined /> : <AudioMutedOutlined />}
              onClick={toggleMic}
              className={`w-12 h-12 flex items-center justify-center transition-transform hover:scale-110 ${
                micOn
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-gray-500 border-gray-500'
              }`}
            />
          </Tooltip>
          <Tooltip title={cameraOn ? 'Tắt camera' : 'Bật camera'}>
            <Button
              type='primary'
              shape='circle'
              icon={
                cameraOn ? <VideoCameraOutlined /> : <VideoCameraAddOutlined />
              }
              onClick={toggleCamera}
              className={`w-12 h-12 flex items-center justify-center transition-transform hover:scale-110 ${
                cameraOn
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-gray-500 border-gray-500'
              }`}
            />
          </Tooltip>
          <Tooltip title='Chuyển camera'>
            <Button
              type='primary'
              shape='circle'
              icon={<SwapOutlined />}
              onClick={switchCamera}
              className='w-12 h-12 flex items-center justify-center bg-blue-500 border-blue-500 transition-transform hover:scale-110'
            />
          </Tooltip>
          <Tooltip title='Kết thúc cuộc gọi'>
            <Button
              type='primary'
              shape='circle'
              danger
              icon={<PhoneOutlined />}
              onClick={endCall}
              className='w-12 h-12 flex items-center justify-center transition-transform hover:scale-110'
            />
          </Tooltip>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoCall;
