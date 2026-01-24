import { useEffect } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import useChatStore from '../store/useChatStore';
import { socket } from '../utils/socket';

const ChatSocketManager = () => {
  const { user } = useAuthStore();
  const { refreshUnreadCount } = useChatStore();

  useEffect(() => {
    if (!user?.id) return;

    socket.connect();
    socket.emit('chat:join', user.id);

    refreshUnreadCount();

    const onNotification = (data) => {
      // Only show notification if we're NOT the sender (don't notify ourselves)
      const normalizedSenderId = parseInt(data.senderId);
      const normalizedUserId = parseInt(user.id);
      
      if (data.senderId && normalizedSenderId !== normalizedUserId) {
        toast.success(`New message from ${data.senderName || 'Someone'}: ${data.messagePreview || 'New message'}`, { 
          duration: 4000,
          icon: '💬'
        });
        refreshUnreadCount();
      }
    };

    const onReceive = () => {
      // Refresh unread count when any message is received
      refreshUnreadCount();
    };

    socket.on('chat:notification', onNotification);
    socket.on('chat:receive', onReceive);

    return () => {
      socket.off('chat:notification', onNotification);
      socket.off('chat:receive', onReceive);
    };
  }, [user?.id]);

  useEffect(() => {
    if (user) return;
    try {
      socket.disconnect();
    } catch {
      // ignore
    }
  }, [user]);

  return null;
};

export default ChatSocketManager;

