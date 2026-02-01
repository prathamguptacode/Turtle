import React, { useState, useRef, useEffect } from 'react';
import {
    Send,
    Sparkles,
    User,
    Bot,
    Menu,
    Plus,
    Trash2,
    MessageSquare,
} from 'lucide-react';
import api from '../api/axios';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface Chat {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
}

const ChatUi = () => {
    const [chats, setChats] = useState<Chat[]>([
        {
            id: '1',
            title: 'New Chat',
            messages: [],
            createdAt: new Date(),
        },
    ]);
    const [currentChatId, setCurrentChatId] = useState('1');
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const currentChat = chats.find((chat) => chat.id === currentChatId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentChat?.messages]);

    useEffect(() => {
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height =
                textareaRef.current.scrollHeight + 'px';
        }
    }, [inputValue]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
        };

        // Add user message to chat
        setChats((prevChats) =>
            prevChats.map((chat) =>
                chat.id === currentChatId
                    ? {
                          ...chat,
                          messages: [...chat.messages, userMessage],
                          title:
                              chat.messages.length === 0
                                  ? inputValue.slice(0, 30) +
                                    (inputValue.length > 30 ? '...' : '')
                                  : chat.title,
                      }
                    : chat,
            ),
        );

        const messageText = inputValue;
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await api.post(`/chat`, {
                input: messageText,
            });

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.data.message || 'No response received',
                timestamp: new Date(),
            };

            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat.id === currentChatId
                        ? { ...chat, messages: [...chat.messages, aiMessage] }
                        : chat,
                ),
            );

            setIsLoading(false);
        } catch (error: any) {
            setIsLoading(false);

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content:
                    error.response?.data?.message ||
                    'Sorry, I encountered an error. Please try again.',
                timestamp: new Date(),
            };

            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat.id === currentChatId
                        ? {
                              ...chat,
                              messages: [...chat.messages, errorMessage],
                          }
                        : chat,
                ),
            );

            console.error('Chat error:', error);
        }
    };

    const createNewChat = () => {
        const newChat: Chat = {
            id: Date.now().toString(),
            title: 'New Chat',
            messages: [],
            createdAt: new Date(),
        };
        setChats([newChat, ...chats]);
        setCurrentChatId(newChat.id);
    };

    const deleteChat = (chatId: string) => {
        if (chats.length === 1) return; // Don't delete the last chat

        setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));

        if (currentChatId === chatId) {
            setCurrentChatId(
                chats[0].id === chatId ? chats[1].id : chats[0].id,
            );
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e as any);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                height: '100vh',
                background: '#0a0f0a',
                color: '#fff',
                fontFamily:
                    'Netflix Sans, Helvetica Neue, Segoe UI, Roboto, Ubuntu, sans-serif',
                overflow: 'hidden',
            }}
        >
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .message {
          animation: fadeIn 0.3s ease;
        }

        .sidebar-item {
          transition: background 0.2s ease;
        }

        .sidebar-item:hover {
          background: #1a2a1a;
        }

        textarea {
          resize: none;
          overflow-y: auto;
          max-height: 200px;
        }

        textarea::-webkit-scrollbar {
          width: 4px;
        }

        textarea::-webkit-scrollbar-track {
          background: transparent;
        }

        textarea::-webkit-scrollbar-thumb {
          background: #2a3a2a;
          border-radius: 2px;
        }

        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: #2a3a2a;
          border-radius: 3px;
        }
      `}</style>

            {/* Sidebar */}
            <div
                style={{
                    width: sidebarOpen ? '280px' : '0',
                    background: '#0f1a0f',
                    borderRight: '1px solid #1a2a1a',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'width 0.3s ease',
                    overflow: 'hidden',
                }}
            >
                {/* Sidebar Header */}
                <div
                    style={{
                        padding: '20px',
                        borderBottom: '1px solid #1a2a1a',
                    }}
                >
                    <button
                        onClick={createNewChat}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: '#10b981',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#fff',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            transition: 'background 0.2s ease',
                            fontFamily: 'inherit',
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = '#059669')
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background = '#10b981')
                        }
                    >
                        <Plus size={18} />
                        New Chat
                    </button>
                </div>

                {/* Chat History */}
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '12px',
                    }}
                >
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            className="sidebar-item"
                            onClick={() => setCurrentChatId(chat.id)}
                            style={{
                                padding: '12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                marginBottom: '4px',
                                background:
                                    currentChatId === chat.id
                                        ? '#1a2a1a'
                                        : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    flex: 1,
                                    minWidth: 0,
                                }}
                            >
                                <MessageSquare
                                    size={16}
                                    style={{ flexShrink: 0, color: '#10b981' }}
                                />
                                <span
                                    style={{
                                        fontSize: '14px',
                                        color:
                                            currentChatId === chat.id
                                                ? '#fff'
                                                : '#b3b3b3',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {chat.title}
                                </span>
                            </div>
                            {chats.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteChat(chat.id);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#b3b3b3',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderRadius: '4px',
                                        flexShrink: 0,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background =
                                            'rgba(239, 68, 68, 0.1)';
                                        e.currentTarget.style.color = '#ef4444';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background =
                                            'none';
                                        e.currentTarget.style.color = '#b3b3b3';
                                    }}
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Sidebar Footer */}
                <div
                    style={{
                        padding: '20px',
                        borderTop: '1px solid #1a2a1a',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}
                    >
                        <div
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: '#10b981',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <User size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div
                                style={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#fff',
                                }}
                            >
                                User
                            </div>
                            <div style={{ fontSize: '12px', color: '#b3b3b3' }}>
                                Free Plan
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '16px 24px',
                        borderBottom: '1px solid #1a2a1a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                    }}
                >
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#b3b3b3',
                            cursor: 'pointer',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '6px',
                            transition: 'background 0.2s ease',
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                                'rgba(255,255,255,0.05)')
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background = 'none')
                        }
                    >
                        <Menu size={20} />
                    </button>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}
                    >
                        <div
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background:
                                    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Sparkles size={18} />
                        </div>
                        <h1
                            style={{
                                fontSize: '18px',
                                fontWeight: 700,
                                margin: 0,
                                color: '#10b981',
                            }}
                        >
                            Turtle AI
                        </h1>
                    </div>
                </div>

                {/* Messages */}
                <div
                    className="chat-messages"
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                    }}
                >
                    {currentChat?.messages.length === 0 ? (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                gap: '16px',
                                color: '#b3b3b3',
                            }}
                        >
                            <div
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background:
                                        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Sparkles size={40} />
                            </div>
                            <h2
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    margin: 0,
                                    color: '#fff',
                                }}
                            >
                                How can I help you today?
                            </h2>
                            <p style={{ fontSize: '16px', margin: 0 }}>
                                Ask me anything about movies, recommendations,
                                or general questions
                            </p>
                        </div>
                    ) : (
                        currentChat?.messages.map((message) => (
                            <div
                                key={message.id}
                                className="message"
                                style={{
                                    display: 'flex',
                                    gap: '16px',
                                    alignItems: 'flex-start',
                                }}
                            >
                                {/* Avatar */}
                                <div
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        background:
                                            message.role === 'user'
                                                ? '#1a2a1a'
                                                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    {message.role === 'user' ? (
                                        <User size={18} />
                                    ) : (
                                        <Bot size={18} />
                                    )}
                                </div>

                                {/* Message Content */}
                                <div style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color:
                                                message.role === 'user'
                                                    ? '#fff'
                                                    : '#10b981',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        {message.role === 'user'
                                            ? 'You'
                                            : 'Turtle AI'}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '15px',
                                            lineHeight: 1.6,
                                            color: '#e5e5e5',
                                            whiteSpace: 'pre-wrap',
                                        }}
                                    >
                                        <ReactMarkdown>
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div
                            className="message"
                            style={{
                                display: 'flex',
                                gap: '16px',
                                alignItems: 'flex-start',
                            }}
                        >
                            <div
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background:
                                        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Bot size={18} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: '#10b981',
                                        marginBottom: '8px',
                                    }}
                                >
                                    Turtle AI
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '4px',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: '#10b981',
                                            animation:
                                                'pulse 1.5s ease-in-out infinite',
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: '#10b981',
                                            animation:
                                                'pulse 1.5s ease-in-out 0.2s infinite',
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: '#10b981',
                                            animation:
                                                'pulse 1.5s ease-in-out 0.4s infinite',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div
                    style={{
                        padding: '24px',
                        borderTop: '1px solid #1a2a1a',
                    }}
                >
                    <form onSubmit={handleSendMessage}>
                        <div
                            style={{
                                maxWidth: '800px',
                                margin: '0 auto',
                                position: 'relative',
                                background: '#1a2a1a',
                                borderRadius: '12px',
                                border: '1px solid #2a3a2a',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 16px',
                                gap: '12px',
                            }}
                        >
                            <textarea
                                ref={textareaRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Message Turtle AI..."
                                rows={1}
                                style={{
                                    flex: 1,
                                    background: 'none',
                                    border: 'none',
                                    color: '#fff',
                                    fontSize: '15px',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    lineHeight: '24px',
                                    minHeight: '24px',
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                style={{
                                    background:
                                        inputValue.trim() && !isLoading
                                            ? '#10b981'
                                            : '#2a3a2a',
                                    border: 'none',
                                    borderRadius: '8px',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor:
                                        inputValue.trim() && !isLoading
                                            ? 'pointer'
                                            : 'not-allowed',
                                    transition: 'background 0.2s ease',
                                    flexShrink: 0,
                                }}
                                onMouseEnter={(e) =>
                                    inputValue.trim() &&
                                    !isLoading &&
                                    (e.currentTarget.style.background =
                                        '#059669')
                                }
                                onMouseLeave={(e) =>
                                    inputValue.trim() &&
                                    !isLoading &&
                                    (e.currentTarget.style.background =
                                        '#10b981')
                                }
                            >
                                {isLoading ? (
                                    <div
                                        style={{
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid rgba(255,255,255,0.3)',
                                            borderTopColor: '#fff',
                                            borderRadius: '50%',
                                            animation:
                                                'spin 0.8s linear infinite',
                                        }}
                                    />
                                ) : (
                                    <Send size={18} />
                                )}
                            </button>
                        </div>
                        <p
                            style={{
                                fontSize: '12px',
                                color: '#b3b3b3',
                                textAlign: 'center',
                                margin: '12px 0 0 0',
                            }}
                        >
                            Turtle AI can make mistakes. Please verify important
                            information.
                        </p>
                    </form>
                </div>
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default ChatUi;
