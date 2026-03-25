import React, { useState } from 'react';
import { Search, Send, MoreVertical, Phone, Info } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: 'online' | 'offline';
}

const MessagesPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>('conv1');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Demo conversations data
  const conversations: Conversation[] = [
    {
      id: 'conv1',
      name: 'Raj Kumar',
      avatar: 'RK',
      lastMessage: 'AC repair completed! Service quality was excellent.',
      timestamp: '2m ago',
      unreadCount: 0,
      status: 'online'
    },
    {
      id: 'conv2',
      name: 'Priya Sharma',
      avatar: 'PS',
      lastMessage: 'Can you come tomorrow at 10 AM?',
      timestamp: '1h ago',
      unreadCount: 3,
      status: 'online'
    },
    {
      id: 'conv3',
      name: 'Support Team',
      avatar: 'ST',
      lastMessage: 'Thank you for contacting HandyFix support',
      timestamp: '3h ago',
      unreadCount: 0,
      status: 'offline'
    },
    {
      id: 'conv4',
      name: 'Amit Patel',
      avatar: 'AP',
      lastMessage: 'Plumber was great! Thanks for the recommendation.',
      timestamp: '1d ago',
      unreadCount: 0,
      status: 'offline'
    },
    {
      id: 'conv5',
      name: 'Neha Singh',
      avatar: 'NS',
      lastMessage: 'When is the best time to schedule?',
      timestamp: '2d ago',
      unreadCount: 0,
      status: 'offline'
    }
  ];

  // Demo messages for selected conversation
  const messagesMap: { [key: string]: Message[] } = {
    conv1: [
      {
        id: 'm1',
        text: 'Hi Raj! Your AC repair is scheduled for today at 2 PM',
        sender: 'user',
        timestamp: '9:30 AM',
        read: true
      },
      {
        id: 'm2',
        text: 'Thanks! I will be home by 1:30 PM. Is the technician experienced?',
        sender: 'other',
        timestamp: '9:35 AM',
        read: true
      },
      {
        id: 'm3',
        text: 'Absolutely! Our technician Vikram has 8+ years of experience with all AC brands.',
        sender: 'user',
        timestamp: '9:40 AM',
        read: true
      },
      {
        id: 'm4',
        text: 'Perfect! See you at 2 PM.',
        sender: 'other',
        timestamp: '9:42 AM',
        read: true
      },
      {
        id: 'm5',
        text: '✅ Service completed! Your AC is now working perfectly. Please share your feedback.',
        sender: 'user',
        timestamp: '3:15 PM',
        read: true
      },
      {
        id: 'm6',
        text: 'AC repair completed! Service quality was excellent.',
        sender: 'other',
        timestamp: '3:20 PM',
        read: true
      }
    ],
    conv2: [
      {
        id: 'm1',
        text: 'Hi Priya! How can I help you today?',
        sender: 'user',
        timestamp: '10:15 AM',
        read: true
      },
      {
        id: 'm2',
        text: 'I need an electrician to install a ceiling fan. Can you come tomorrow?',
        sender: 'other',
        timestamp: '10:20 AM',
        read: true
      },
      {
        id: 'm3',
        text: 'Sure! We have a skilled electrician available. What time works best for you?',
        sender: 'user',
        timestamp: '10:22 AM',
        read: true
      },
      {
        id: 'm4',
        text: 'Can you come tomorrow at 10 AM?',
        sender: 'other',
        timestamp: '10:25 AM',
        read: true
      }
    ],
    conv3: [
      {
        id: 'm1',
        text: 'Hello! How can our support team assist you?',
        sender: 'other',
        timestamp: '2:00 PM',
        read: true
      },
      {
        id: 'm2',
        text: 'I have a question about cancellation policy',
        sender: 'user',
        timestamp: '2:05 PM',
        read: true
      },
      {
        id: 'm3',
        text: 'Thank you for contacting HandyFix support',
        sender: 'other',
        timestamp: '2:10 PM',
        read: true
      }
    ],
    conv4: [
      {
        id: 'm1',
        text: 'Thanks for booking a plumber through HandyFix!',
        sender: 'user',
        timestamp: '11:00 AM',
        read: true
      },
      {
        id: 'm2',
        text: 'Plumber was great! Thanks for the recommendation.',
        sender: 'other',
        timestamp: '11:30 AM',
        read: true
      }
    ],
    conv5: [
      {
        id: 'm1',
        text: 'Hi! When would you like to schedule the repair?',
        sender: 'user',
        timestamp: '9:00 AM',
        read: true
      },
      {
        id: 'm2',
        text: 'When is the best time to schedule?',
        sender: 'other',
        timestamp: '9:15 AM',
        read: true
      }
    ]
  };

  const selectedMessages = messagesMap[selectedConversation] || [];
  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log('Message sent:', messageText);
      setMessageText('');
    }
  };

  return (
    <div
      className="messages-page-shell"
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#0f0f0f',
        paddingTop: '80px',
        color: '#FFFFFF',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}
    >
      {/* Left Sidebar - Conversations List */}
      <div
        style={{
          width: '280px',
          borderRight: '1px solid #333333',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1a1a1a',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid #333333' }}>
          <h2
            style={{
              margin: '0 0 16px 0',
              fontSize: '24px',
              fontWeight: 700,
              color: '#FFFFFF'
            }}
          >
            Messages
          </h2>

          {/* Search Bar */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#0f0f0f',
              borderRadius: '8px',
              border: '1px solid #333333',
              padding: '8px 12px'
            }}
          >
            <Search size={16} style={{ color: '#808080', marginRight: '8px' }} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              style={{
                padding: '12px 16px',
                marginBottom: '8px',
                cursor: 'pointer',
                backgroundColor:
                  selectedConversation === conv.id ? '#333333' : '#0a0a0a',
                border: selectedConversation === conv.id ? '1px solid #FFC107' : '1px solid transparent',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#FFC107',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0F1419',
                  fontWeight: 600,
                  fontSize: '14px',
                  flexShrink: 0,
                  position: 'relative'
                }}
              >
                {conv.avatar}
                {conv.status === 'online' && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#00E676',
                      borderRadius: '50%',
                      border: '2px solid #0F1419'
                    }}
                  />
                )}
              </div>

              {/* Conversation Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#FFFFFF'
                    }}
                  >
                    {conv.name}
                  </h3>
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#808080',
                      marginLeft: '8px',
                      flexShrink: 0
                    }}
                  >
                    {conv.timestamp}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    color: conv.unreadCount > 0 ? '#FFC107' : '#B0B0B0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontWeight: conv.unreadCount > 0 ? 600 : 400
                  }}
                >
                  {conv.lastMessage}
                </p>
              </div>

              {/* Unread Badge */}
              {conv.unreadCount > 0 && (
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#FFC107',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0F1419',
                    fontSize: '12px',
                    fontWeight: 600,
                    flexShrink: 0
                  }}
                >
                  {conv.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Message Area */}
      {selectedConv ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1a1a1a'
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid #333333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#1a1a1a'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#FFC107',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0F1419',
                  fontWeight: 600,
                  fontSize: '12px'
                }}
              >
                {selectedConv.avatar}
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#FFFFFF'
                  }}
                >
                  {selectedConv.name}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#B0B0B0'
                  }}
                >
                  AC Repair • Currently 8 min away
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#0f0f0f',
                  border: '1px solid #333333',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    'rgba(255, 193, 7, 0.1)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#FFC107';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    'rgba(255, 255, 255, 0.05)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    'rgba(255, 193, 7, 0.15)';
                }}
              >
                <Phone size={16} />
              </button>
              <button
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#0f0f0f',
                  border: '1px solid #333333',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    'rgba(255, 193, 7, 0.1)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#FFC107';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    'rgba(255, 255, 255, 0.05)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    'rgba(255, 193, 7, 0.15)';
                }}
              >
                <Info size={16} />
              </button>
              <button
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#0f0f0f',
                  border: '1px solid #333333',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    'rgba(255, 193, 7, 0.1)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#FFC107';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    'rgba(255, 255, 255, 0.05)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    'rgba(255, 193, 7, 0.15)';
                }}
              >
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          {/* Messages Display */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {selectedMessages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '60%',
                    padding: '12px 16px',
                    borderRadius:
                      msg.sender === 'user'
                        ? '16px 16px 4px 16px'
                        : '16px 16px 16px 4px',
                    backgroundColor:
                      msg.sender === 'user'
                        ? '#FFC107'
                        : '#333333',
                    border:
                      msg.sender === 'user'
                        ? 'none'
                        : '1px solid #333333',
                    color: msg.sender === 'user' ? '#1a1a1a' : '#FFFFFF',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    wordBreak: 'break-word'
                  }}
                >
                  <p style={{ margin: '0 0 4px 0' }}>{msg.text}</p>
                  <span
                    style={{
                      fontSize: '11px',
                      color:
                        msg.sender === 'user'
                          ? 'rgba(15, 20, 25, 0.6)'
                          : '#B0B0B0',
                      display: 'block',
                      marginTop: '4px'
                    }}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #333333',
              backgroundColor: '#1a1a1a',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-end'
            }}
          >
            <input
              type="text"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: '#0f0f0f',
                border: '1px solid #333333',
                color: '#FFFFFF',
                fontSize: '14px',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLInputElement).style.borderColor = '#FFC107';
                (e.currentTarget as HTMLInputElement).style.backgroundColor =
                  '#1a1a1a';
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLInputElement).style.borderColor =
                  '#333333';
                (e.currentTarget as HTMLInputElement).style.backgroundColor =
                  '#0f0f0f';
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                height: '44px',
                width: '44px',
                borderRadius: '8px',
                backgroundColor: '#FFC107',
                border: 'none',
                color: '#0F1419',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 24px rgba(255, 193, 7, 0.3)',
                fontWeight: 600
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 12px 32px rgba(255, 193, 7, 0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 8px 24px rgba(255, 193, 7, 0.3)';
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8892A0'
          }}
        >
          <p style={{ fontSize: '16px' }}>Select a conversation to start messaging</p>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .messages-page-shell {
            display: block !important;
            height: auto !important;
            min-height: 100vh;
          }
          .messages-page-shell > div:first-child {
            width: 100% !important;
            max-height: 320px;
          }
        }
      `}</style>
    </div>
  );
};

export default MessagesPage;
