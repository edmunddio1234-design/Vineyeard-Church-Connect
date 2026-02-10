import React, { useState, useRef, useEffect } from 'react';
import { T } from '../theme';
import { S } from '../styles';
import { Avatar, Button, Input } from '../components/UI';
import Icon from '../components/Icons';
import { api } from '../api';

export default function MessagesPage({ members, activeChat, setActiveChat }) {
  const [convos, setConvos] = useState({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [convos, activeChat]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (activeChat && !convos[activeChat]) {
      setLoading(true);
      api.getMessages(activeChat)
        .then((data) => {
          const messages = Array.isArray(data) ? data : (data.messages || []);
          setConvos((prev) => ({
            ...prev,
            [activeChat]: messages.map((msg) => ({
              id: msg.id,
              text: msg.text,
              sender: msg.sender_type === 'user' ? 'user' : 'other',
              time: msg.created_at
                ? new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                : new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            })),
          }));
        })
        .catch((error) => {
          console.error('Failed to load messages:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [activeChat, convos]);

  const handleSendMessage = () => {
    if (!msg.trim() || !activeChat) return;

    const messageText = msg;
    setMsg('');

    // Add optimistic message to UI
    const newMessage = {
      id: (convos[activeChat]?.length || 0) + 1,
      text: messageText,
      sender: 'user',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setConvos((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage],
    }));

    // Send message via API
    api.sendMessage(activeChat, messageText)
      .then((response) => {
        // Update with actual message from server if needed
        console.log('Message sent successfully:', response);
      })
      .catch((error) => {
        console.error('Failed to send message:', error);
        // Optionally remove the optimistic message on error
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeMember = members.find((m) => m.id === activeChat);
  const chatMessages = convos[activeChat] || [];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ ...S.h1, marginBottom: '20px' }}>Messages</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          borderRadius: '16px',
          overflow: 'hidden',
          border: `1px solid ${T.borderLight}`,
          boxShadow: T.shadow,
          height: '600px',
        }}
      >
        {/* LEFT SIDEBAR */}
        <div
          style={{
            backgroundColor: T.bgSoft,
            borderRight: `1px solid ${T.border}`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Search Bar */}
          <div
            style={{
              padding: '16px',
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <Input
              placeholder="Search members..."
              value=""
              onChange={() => {}}
              style={{ fontSize: '13px', width: '100%' }}
            />
          </div>

          {/* Member List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {members.map((member) => {
              const isActive = activeChat === member.id;
              const lastMsg = convos[member.id]?.[convos[member.id].length - 1];
              const msgPreview = lastMsg
                ? lastMsg.text.slice(0, 35) + (lastMsg.text.length > 35 ? '...' : '')
                : 'Start a conversation';

              return (
                <div
                  key={member.id}
                  onClick={() => setActiveChat(member.id)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    backgroundColor: isActive ? T.primaryFaint : 'transparent',
                    borderLeft: `3px solid ${isActive ? T.primaryDark : 'transparent'}`,
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    borderBottom: `1px solid ${T.border}`,
                    transition: 'background-color 0.2s',
                  }}
                >
                  <Avatar name={member.name} size={38} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: T.textDark }}>
                      {member.name}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: T.textMuted,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {msgPreview}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT CHAT AREA */}
        <div
          style={{
            backgroundColor: T.bg,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {!activeChat ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '20px',
              }}
            >
              <div style={{ fontSize: '48px', color: T.borderLight, marginBottom: '12px' }}>
                <Icon name="chat" size={48} color={T.borderLight} />
              </div>
              <h3 style={{ ...S.h3, color: T.textDark }}>Select a conversation</h3>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div
                style={{
                  padding: '16px 20px',
                  borderBottom: `1px solid ${T.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Avatar name={activeMember.name} size={36} />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: T.textDark }}>
                    {activeMember.name}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: T.textMuted,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Icon name="location" size={12} color={T.textMuted} />
                    {activeMember.location}
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'auto',
                  padding: '20px',
                  gap: '12px',
                }}
              >
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        backgroundColor:
                          message.sender === 'user'
                            ? `linear-gradient(135deg, ${T.primaryDark} 0%, ${T.primary} 100%)`
                            : T.bgSoft,
                        color: message.sender === 'user' ? T.white : T.textDark,
                        borderBottomLeftRadius: message.sender === 'user' ? '16px' : '4px',
                        borderBottomRightRadius: message.sender === 'user' ? '4px' : '16px',
                      }}
                    >
                      <div style={{ wordWrap: 'break-word' }}>{message.text}</div>
                      <div
                        style={{
                          fontSize: '11px',
                          opacity: 0.7,
                          marginTop: '4px',
                          textAlign: 'right',
                        }}
                      >
                        {message.time}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <div
                style={{
                  padding: '16px 20px',
                  borderTop: `1px solid ${T.border}`,
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-end',
                }}
              >
                <Input
                  placeholder="Type a message..."
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{ flex: 1 }}
                />
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  style={{
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '40px',
                  }}
                >
                  <Icon name="send" size={18} color={T.white} />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
