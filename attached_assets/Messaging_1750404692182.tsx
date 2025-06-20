import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type Message = { id: number; sender_id: number; receiver_id: number; content: string; created_at: string; };

type MessagingProps = { otherUserId: number; };

const socket: Socket = io('http://localhost:5000');

const Messaging: React.FC<MessagingProps> = ({ otherUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const token = localStorage.getItem('token') || '';
  const userId = /* get current user id from your auth context or decode token */;

  useEffect(() => {
    // Join user rooms on socket
    if (userId) {
      socket.emit('joinRoom', `user_${userId}`);
      socket.emit('joinRoom', `user_${otherUserId}`);
    }

    // Listen for new messages
    socket.on('newMessage', (message: Message) => {
      // Only add if it's a message between current user and otherUserId
      if (
        (message.sender_id === userId && message.receiver_id === otherUserId) ||
        (message.sender_id === otherUserId && message.receiver_id === userId)
      ) {
        setMessages(prev => [...prev, message]);
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, [otherUserId, userId]);

  useEffect(() => {
    // Load conversation on mount or user change (via REST)
    const fetchMessages = async () => {
      const res = await fetch(`http://localhost:5000/messages/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setMessages(data.messages);
    };
    fetchMessages();
  }, [otherUserId]);

  const sendMessage = () => {
    if (!input.trim() || !userId) return;

    // Emit message via socket
    socket.emit('sendMessage', {
      senderId: userId,
      receiverId: otherUserId,
      content: input,
    });

    setInput('');
  };

  return (
    <div>
      {/* same UI as before */}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        placeholder="Type your message"
      />
      <button onClick={sendMessage} disabled={!input.trim()}>Send</button>
      {/* messages rendering */}
    </div>
  );
};

export default Messaging;
