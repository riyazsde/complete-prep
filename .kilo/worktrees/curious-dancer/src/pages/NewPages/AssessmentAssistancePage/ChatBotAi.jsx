import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MessageRenderer from '../../../components/chat/MessageRenderer';
import HOC from '../../../components/layout/HOC';
import api from '../../../services/api';

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'];
const MAX_IMAGE_COUNT = 4;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const CHAT_SESSIONS_LIMIT = 20;
const CHAT_MESSAGES_LIMIT = 50;

const ChatBotAi = () => {
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      role: 'assistant',
      content:
        "Hello! I'm Prepo AI, your academic study assistant. How can I help you with your studies today?",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [historyVersion, setHistoryVersion] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [pendingClientMessageIds, setPendingClientMessageIds] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const chatEndRef = useRef(null);
  const controllerRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const createPreviewForFile = file => ({ file, previewUrl: URL.createObjectURL(file) });

  const isValidImageFile = file => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      window.alert('Only PNG, JPEG, WEBP, HEIC, and HEIF images are allowed.');
      return false;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      window.alert('Each image must be 5MB or smaller.');
      return false;
    }
    return true;
  };

  const convertServerMessage = serverMessage => ({
    id: serverMessage.id,
    role: serverMessage.role,
    content:
      serverMessage.parts
        ?.filter(part => part.type === 'text')
        .map(part => part.text)
        .join('') || '',
    parts:
      serverMessage.parts?.map(part => ({
        ...part,
        previewUrl: part.type === 'image' ? part.url : undefined,
      })) ?? [],
    createdAt: serverMessage.createdAt ? new Date(serverMessage.createdAt).getTime() : Date.now(),
    clientMessageId: serverMessage.clientMessageId,
  });

  const replaceMessageById = (messageId, updatedMessage) => {
    setMessages(prev => prev.map(msg => (msg.id === messageId ? updatedMessage : msg)));
  };

  const loadSessions = async () => {
    try {
      const response = await api.get('/user/chat/sessions', {
        params: { limit: CHAT_SESSIONS_LIMIT },
      });
      setSessions(response.data?.data?.sessions ?? []);
    } catch (error) {
      console.error('Unable to load chat sessions', error);
    }
  };

  const loadChatMessages = async chatId => {
    if (!chatId) return;

    try {
      const response = await api.get(`/user/chat/sessions/${chatId}/messages`, {
        params: { limit: CHAT_MESSAGES_LIMIT },
      });
      const chatData = response.data?.data?.chat;
      const serverMessages = response.data?.data?.messages ?? [];

      if (chatData) {
        setCurrentChatId(chatData.id);
        setHistoryVersion(chatData.historyVersion ?? null);
      }

      const uiMessages = serverMessages.map(convertServerMessage);
      setMessages(
        uiMessages.length > 0
          ? uiMessages
          : [
              {
                id: Date.now(),
                role: 'assistant',
                content:
                  "Hello! I'm Prepo AI, your academic study assistant. How can I help you with your studies today?",
                ts: Date.now(),
              },
            ]
      );
      setShowSidebar(false);
    } catch (error) {
      console.error('Unable to load chat messages', error);
    }
  };

  useEffect(() => {
    const savedDraft = localStorage.getItem('chatDraft');
    const savedChatId = localStorage.getItem('activeChatId');

    if (savedDraft) setInput(savedDraft);
    if (savedChatId) setCurrentChatId(savedChatId);

    loadSessions();
    if (savedChatId) {
      loadChatMessages(savedChatId).catch(() => {});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatDraft', input);
  }, [input]);

  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem('activeChatId', currentChatId);
    } else {
      localStorage.removeItem('activeChatId');
    }
  }, [currentChatId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      selectedImages.forEach(image => URL.revokeObjectURL(image.previewUrl));
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [selectedImages]);

  const addMessage = (role, content, meta = {}) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      role,
      content,
      parts: [{ type: 'text', text: content }],
      meta,
      ts: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const updateLastAssistantMessage = (content, meta = {}) => {
    setMessages(prev => {
      const lastIndex = prev.length - 1;
      if (lastIndex < 0) return prev;

      return prev.map((msg, index) =>
        index === lastIndex && msg.role === 'assistant'
          ? { ...msg, content, parts: [{ type: 'text', text: content }], meta, ts: Date.now() }
          : msg
      );
    });
  };

  const handleSessionSelect = async chat => {
    await loadChatMessages(chat.id);
    setShowSidebar(false);
  };

  const startNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        content:
          "Hello! I'm Prepo AI, your academic study assistant. How can I help you with your studies today?",
        ts: Date.now(),
      },
    ]);
    setCurrentChatId(null);
    setHistoryVersion(null);
    setSelectedImages([]);
    setInput('');
    setShowSidebar(false);
  };

  const deleteChatFromHistory = async (chatId, e) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await api.delete(`/user/chat/sessions/${chatId}`);
      setSessions(prev => prev.filter(chat => chat.id !== chatId));
      if (currentChatId === chatId) {
        startNewChat();
      }
    } catch (error) {
      console.error('Unable to delete chat session', error);
      window.alert('Unable to delete the chat session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addSelectedImages = files => {
    const incomingFiles = Array.from(files || []);
    const newFiles = [];

    for (const file of incomingFiles) {
      if (selectedImages.length + newFiles.length >= MAX_IMAGE_COUNT) {
        window.alert(`You can only upload up to ${MAX_IMAGE_COUNT} images.`);
        break;
      }
      if (!isValidImageFile(file)) continue;
      newFiles.push(createPreviewForFile(file));
    }

    if (newFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...newFiles]);
    }
  };

  const removeSelectedImage = index => {
    setSelectedImages(prev => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed?.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return next;
    });
  };

  const buildUploadFormData = ({ prompt, clientMessageId }) => {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('clientMessageId', clientMessageId);

    if (currentChatId) {
      formData.append('chatId', currentChatId);
    }
    if (historyVersion !== null) {
      formData.append('expectedHistoryVersion', String(historyVersion));
    }
    selectedImages.forEach(({ file }) => formData.append('images', file));
    return formData;
  };

  const sendMessage = async () => {
    const prompt = input.trim();
    if (!prompt || loading) return;

    const clientMessageId = generateUUID();
    if (pendingClientMessageIds.includes(clientMessageId)) return;

    setPendingClientMessageIds(prev => [...prev, clientMessageId]);
    const optimisticUserMessage = {
      id: clientMessageId,
      role: 'user',
      content: prompt,
      parts: [
        { type: 'text', text: prompt },
        ...selectedImages.map(({ previewUrl }) => ({
          type: 'image',
          previewUrl,
        })),
      ],
      meta: { pending: true, clientMessageId },
      ts: Date.now(),
    };

    setMessages(prev => [
      ...prev,
      optimisticUserMessage,
      {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        parts: [],
        meta: { typing: true },
        ts: Date.now(),
      },
    ]);
    setInput('');
    setLoading(true);

    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    try {
      const formData = buildUploadFormData({ prompt, clientMessageId });
      const response = await api.post('/user/chat/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal: controllerRef.current.signal,
      });

      const payload = response.data?.data;
      if (!payload) {
        throw new Error('Unexpected server response.');
      }

      setCurrentChatId(payload.chatId);
      setHistoryVersion(payload.historyVersion ?? null);

      const serverUser = convertServerMessage(payload.userMessage);
      const serverAssistant = convertServerMessage(payload.assistantMessage);

      setMessages(prev =>
        prev
          .map(msg => (msg.id === clientMessageId ? serverUser : msg))
          .map((msg, index, arr) => {
            if (index === arr.length - 1 && msg.role === 'assistant' && msg.meta?.typing) {
              return {
                ...serverAssistant,
                meta: { typing: false },
              };
            }
            return msg;
          })
      );

      setSelectedImages([]);
      await loadSessions();
    } catch (error) {
      const errorCode = error?.response?.data?.errorCode;
      const errorMessage =
        error?.response?.data?.message || error.message || 'Unable to send your message.';

      if (errorCode === 'CHAT_VERSION_CONFLICT' && currentChatId) {
        await loadChatMessages(currentChatId);
        window.alert('Chat history has changed. Reloaded the latest messages. Please try again.');
      } else if (errorCode === 'CHAT_MESSAGE_IN_PROGRESS') {
        window.alert('This message is already being processed. Please wait a moment.');
      } else {
        updateLastAssistantMessage(`❌ ${errorMessage}`);
      }
    } finally {
      setPendingClientMessageIds(prev => prev.filter(id => id !== clientMessageId));
      setLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = timestamp => {
    try {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const formatDate = timestamp => {
    try {
      return new Date(timestamp).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = e => {
    addSelectedImages(e.target.files);
    e.target.value = '';
  };

  return (
    <div className="p-6">
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-[calc(100vh-264px)] p-0 md:p-4 lg:p-0">
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        <div className="w-full h-[calc(100vh-48px)] bg-white rounded-2xl flex flex-col overflow-hidden min-h-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-4 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                title="Toggle sidebar"
              >
                <Icon icon={showSidebar ? 'mdi:close' : 'mdi:menu'} width="22" height="22" />
              </button>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Icon icon="mdi:robot" width="22" height="22" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Prepo AI</h1>
                <p className="text-sm text-white/90 hidden sm:block">
                  Your academic study assistant
                </p>
              </div>
            </div>

            {/* <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Go back"
            >
              <Icon icon="mdi:arrow-left" width="20" height="20" />
            </button>
          </div> */}
          </div>

          <div className="flex flex-1 min-h-0 relative">
            {/* Sidebar */}
            <div
              className={`
            ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            fixed md:relative inset-y-0 left-0 z-50 md:z-auto
            w-64 md:w-64 lg:w-72
            bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200
            flex flex-col flex-shrink-0 min-h-0
            transition-transform duration-300 ease-in-out
            h-[calc(100vh-120px)] md:h-auto
          `}
            >
              <div className="p-4 border-b border-gray-200">
                <button
                  onClick={startNewChat}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 font-medium text-sm md:text-base"
                >
                  <Icon icon="mdi:plus" width="18" height="18" />
                  New Chat
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 min-h-0">
                <h3 className="text-sm font-semibold text-gray-500 px-2 mb-3">Recent Chats</h3>

                {sessions.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    <Icon icon="mdi:chat-outline" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No chat sessions yet</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {sessions.map(chat => (
                      <div
                        key={chat.id}
                        className={`group relative flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          currentChatId === chat.id
                            ? 'bg-emerald-50 border border-emerald-200'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handleSessionSelect(chat)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon
                              icon="mdi:message-text-outline"
                              width="14"
                              height="14"
                              className={
                                currentChatId === chat.id ? 'text-emerald-600' : 'text-gray-400'
                              }
                            />
                            <span
                              className={`text-sm font-medium truncate ${
                                currentChatId === chat.id ? 'text-emerald-700' : 'text-gray-700'
                              }`}
                            >
                              {chat.title}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(chat.lastMessageAt)}
                          </div>
                        </div>
                        <button
                          onClick={e =>
                            window.confirm('Are you sure you want to delete this chat?') &&
                            deleteChatFromHistory(chat.id, e)
                          }
                          className="p-1.5 hover:bg-red-100 rounded-lg transition-all duration-200 flex-shrink-0"
                          title="Delete chat"
                        >
                          <Icon
                            icon="mdi:trash-can-outline"
                            width="16"
                            height="16"
                            className="text-red-400 hover:text-red-600"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6 bg-gradient-to-b from-white to-gray-50 min-h-0 w-full">
              <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 min-h-0">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[90%] xs:max-w-[85%] sm:max-w-[80%] ${
                        message.role === 'user' ? 'ml-auto' : ''
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-3 py-2 md:px-4 md:py-3 ${
                          message.role === 'user'
                            ? 'bg-emerald-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <div>
                            <div className="whitespace-pre-wrap break-words text-sm md:text-base">
                              {message.parts
                                ?.filter(part => part.type === 'text')
                                .map(part => part.text)
                                .join('') || message.content}
                            </div>
                            {message.parts?.filter(part => part.type === 'image').length > 0 && (
                              <div className="mt-3 grid grid-cols-2 gap-2">
                                {message.parts
                                  .filter(part => part.type === 'image')
                                  .map((part, idx) => (
                                    <img
                                      key={`user-image-${idx}`}
                                      src={part.previewUrl}
                                      alt="uploaded"
                                      className="rounded-xl border border-white/20 object-cover max-h-40 w-full"
                                    />
                                  ))}
                              </div>
                            )}
                          </div>
                        ) : message.meta?.typing ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 text-sm md:text-base">
                              Prepo AI is typing
                            </span>
                            <div className="flex space-x-1">
                              <div
                                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0ms' }}
                              />
                              <div
                                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '150ms' }}
                              />
                              <div
                                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '300ms' }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="message-content">
                            {message.parts?.some(part => part.type === 'text') ? (
                              <MessageRenderer
                                content={message.parts
                                  .filter(part => part.type === 'text')
                                  .map(part => part.text)
                                  .join('')}
                              />
                            ) : (
                              <div className="whitespace-pre-wrap break-words text-sm md:text-base">
                                {message.content}
                              </div>
                            )}
                            {message.parts?.filter(part => part.type === 'image').length > 0 && (
                              <div className="mt-3 grid grid-cols-2 gap-2">
                                {message.parts
                                  .filter(part => part.type === 'image')
                                  .map((part, idx) => (
                                    <img
                                      key={`assistant-image-${idx}`}
                                      src={part.previewUrl || part.url}
                                      alt="assistant attachment"
                                      className="rounded-xl border border-gray-200 object-cover max-h-52 w-full"
                                    />
                                  ))}
                              </div>
                            )}

                            <style>{`
                                .message-content pre {
                                  background-color: #1a202c !important;
                                  color: #e2e8f0 !important;
                                  border-radius: 8px;
                                  padding: 12px 16px;
                                  margin: 8px 0;
                                  overflow-x: auto;
                                  font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
                                  font-size: 0.85em;
                                  line-height: 1.5;
                                  border: 1px solid #2d3748;
                                }

                                .message-content code {
                                  background-color: #f7fafc;
                                  color: #2d3748;
                                  padding: 2px 4px;
                                  border-radius: 4px;
                                  font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
                                  font-size: 0.85em;
                                  border: 1px solid #e2e8f0;
                                }

                                .message-content pre code {
                                  background-color: transparent !important;
                                  color: inherit !important;
                                  padding: 0;
                                  border: none;
                                  font-size: inherit;
                                }

                                .message-content .hljs {
                                  color: #e2e8f0;
                                }

                                .message-content .hljs-keyword {
                                  color: #63b3ed;
                                }

                                .message-content .hljs-string {
                                  color: #68d391;
                                }

                                .message-content .hljs-number {
                                  color: #fbb6ce;
                                }

                                .message-content .hljs-comment {
                                  color: #a0aec0;
                                }

                                .message-content .hljs-function {
                                  color: #f6ad55;
                                }

                                .message-content .hljs-title {
                                  color: #90cdf4;
                                }

                                .message-content table {
                                  width: 100%;
                                  border-collapse: collapse;
                                  margin: 0.75em 0;
                                  font-size: 0.9em;
                                }

                                .message-content th,
                                .message-content td {
                                  border: 1px solid #e2e8f0;
                                  padding: 0.5em;
                                  text-align: left;
                                }

                                .message-content th {
                                  background-color: #f7fafc;
                                  font-weight: 600;
                                }

                                .message-content blockquote {
                                  border-left: 3px solid #48bb78;
                                  margin: 0.75em 0;
                                  padding-left: 1em;
                                  color: #4a5568;
                                  font-style: italic;
                                  font-size: 0.95em;
                                }

                                .message-content ul,
                                .message-content ol {
                                  padding-left: 1.25em;
                                  margin: 0.5em 0;
                                }

                                .message-content li {
                                  margin: 0.2em 0;
                                }

                                .message-content h1 {
                                  font-size: 1.25em;
                                  margin: 1em 0 0.5em;
                                }

                                .message-content h2 {
                                  font-size: 1.125em;
                                  margin: 0.875em 0 0.5em;
                                }

                                .message-content h3 {
                                  font-size: 1em;
                                  margin: 0.75em 0 0.5em;
                                }

                                .message-content h1,
                                .message-content h2,
                                .message-content h3,
                                .message-content h4 {
                                  color: #2d3748;
                                  font-weight: 600;
                                }

                                .message-content p {
                                  margin: 0.5em 0;
                                  line-height: 1.6;
                                  font-size: 0.95em;
                                }

                                .message-content a {
                                  color: #3182ce;
                                  text-decoration: underline;
                                  font-size: 0.95em;
                                }

                                .message-content a:hover {
                                  color: #2c5282;
                                }

                                .message-content strong {
                                  font-weight: 700;
                                  color: #2d3748;
                                }

                                .message-content em {
                                  font-style: italic;
                                }

                                @media (max-width: 640px) {
                                  .message-content pre {
                                    padding: 8px 12px;
                                    font-size: 0.8em;
                                  }

                                  .message-content table {
                                    font-size: 0.8em;
                                  }

                                  .message-content h1 {
                                    font-size: 1.125em;
                                  }

                                  .message-content h2 {
                                    font-size: 1em;
                                  }

                                  .message-content h3 {
                                    font-size: 0.95em;
                                  }
                                }
                              `}</style>
                          </div>
                        )}
                      </div>

                      <div
                        className={`text-xs mt-1 px-1 text-gray-500 ${
                          message.role === 'user' ? 'text-right' : 'text-left'
                        }`}
                      >
                        {formatTime(message.createdAt || message.ts)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* {loading && !isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%]">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex space-x-1">
                          <div
                            className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"
                            style={{ animationDelay: '0ms' }}
                          />
                          <div
                            className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"
                            style={{ animationDelay: '200ms' }}
                          />
                          <div
                            className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"
                            style={{ animationDelay: '400ms' }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">Processing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )} */}

                <div ref={chatEndRef} />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 bg-white flex-shrink-0">
            <div className="py-3">
              <div className="flex items-start gap-2 md:gap-3 relative">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a study-related question..."
                    className="w-full py-2.5 md:py-3 pr-10 md:pr-12 pl-3 border border-gray-300 rounded-lg focus:outline-none resize-none text-sm md:text-base"
                    rows="1"
                    style={{ minHeight: '44px', maxHeight: '100px' }}
                    disabled={loading || isTyping}
                  />
                  {selectedImages.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {selectedImages.map((image, idx) => (
                        <div
                          key={`preview-${idx}`}
                          className="relative rounded-xl overflow-hidden border border-gray-200"
                        >
                          <img
                            src={image.previewUrl}
                            alt="attachment preview"
                            className="h-24 w-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => removeSelectedImage(idx)}
                            className="absolute top-1 right-1 rounded-full bg-black/50 text-white p-1"
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <>
                    <div onClick={handleClick} className="absolute right-3 top-4 cursor-pointer">
                      <Icon
                        icon="mdi:image-plus-outline"
                        width="18"
                        height="18"
                        className="text-emerald-500"
                      />
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </>
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading || isTyping}
                  className="px-4 md:px-6 py-2.5 md:py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1 md:gap-2 font-medium text-sm md:text-base"
                >
                  {loading ? (
                    <>
                      <Icon icon="mdi:loading" className="animate-spin" width="16" height="16" />
                      <span className="hidden sm:inline">Sending...</span>
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:send" width="16" height="16" />
                      <span className="hidden sm:inline">Send</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-2 text-xs text-gray-500 text-center">
                <p className="flex items-center justify-center gap-1">
                  <Icon icon="mdi:lightbulb" width="12" height="12" className="flex-shrink-0" />
                  <span className="text-xs">
                    Prepo AI specializes in academic subjects, homework help, and exam preparation
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOC(ChatBotAi);
