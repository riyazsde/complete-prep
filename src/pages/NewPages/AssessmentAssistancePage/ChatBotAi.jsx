import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MessageRenderer from '../../../components/chat/MessageRenderer';
import HOC from '../../../components/layout/HOC';

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
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const chatEndRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const abortTypingRef = useRef(false);
  const navigate = useNavigate();

  const OPENAI_KEY = process.env.REACT_APP_OPENAI_KEY || '';

  const SYSTEM_PROMPT = `You are **Prepo AI**, an academic study assistant.

Your ONLY purpose is to help users with:
- School and university subjects
- Homework, assignments, projects
- Exam preparation and concepts
- Programming, engineering, science, math, business, literature
- Research, explanations, summaries, learning guidance

### 🚫 Forbidden Topics
You must NEVER answer questions related to:
- Personal advice
- Mental health
- Relationships
- Life coaching
- Entertainment, movies, celebrities
- Politics, religion, current news
- General chat or casual conversation
- Any non-educational topic

### 🛑 Enforcement Rule
If the user asks ANY question outside academic or learning scope:
Respond ONLY with this exact message (no extra text):
"I'm here to help only with study-related questions. Please ask something related to your learning, homework, or academic subjects."

### 📚 Response Formatting Rules
You must ALWAYS format responses using Markdown:
1. Start with a short clear introduction paragraph
2. Use proper section headings (##, ###)
3. Use bullet points and numbered lists
4. Keep paragraphs short and readable
5. Use fenced code blocks with language tags for technical examples
6. Use **bold** for key concepts
7. Never return a flat paragraph

### 🎓 Tone & Quality
- Professional, clear, supportive
- Optimized for learning and understanding
- No fluff, no casual chat

### 💡 Code Block Styling
When showing code examples, always use proper syntax highlighting and include clear explanations.`;

  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setChatHistory(Array.isArray(parsedHistory) ? parsedHistory : []);
      } catch (error) {
        console.error('Error loading chat history:', error);
        setChatHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      abortTypingRef.current = true;
    };
  }, []);

  const addMessage = (role, content, meta = {}) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      role,
      content,
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
          ? { ...msg, content, meta, ts: Date.now() }
          : msg
      );
    });
  };

  const generateChatTitle = userMessage => {
    const words = userMessage.trim().split(/\s+/);
    if (words.length <= 4) return userMessage;
    return words.slice(0, 4).join(' ') + '...';
  };

  const saveCurrentChatToHistory = () => {
    if (messages.length <= 1) return;

    const userMessages = messages.filter(msg => msg.role === 'user');
    const firstUserMessage = userMessages[0]?.content || 'New Chat';
    const title = generateChatTitle(firstUserMessage);

    const newChat = {
      id: currentChatId || Date.now(),
      title,
      messages: [...messages],
      lastUpdated: Date.now(),
    };

    setChatHistory(prev => {
      const existingIndex = prev.findIndex(chat => chat.id === newChat.id);
      let updatedHistory;

      if (existingIndex >= 0) {
        updatedHistory = [...prev];
        updatedHistory[existingIndex] = newChat;
      } else {
        updatedHistory = [newChat, ...prev];
      }

      return updatedHistory.slice(0, 20);
    });

    if (!currentChatId) {
      setCurrentChatId(newChat.id);
    }
  };

  const loadChatFromHistory = chat => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
    abortTypingRef.current = true;
    setIsTyping(false);
    setShowSidebar(false);
  };

  const startNewChat = () => {
    saveCurrentChatToHistory();
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
    setInput('');
    setShowSidebar(false);
  };

  const deleteChatFromHistory = (chatId, e) => {
    e.stopPropagation();
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));

    if (currentChatId === chatId) {
      startNewChat();
    }
  };

  const simulateTyping = (fullText, onComplete) => {
    abortTypingRef.current = false;
    setIsTyping(true);

    let charIdx = 0;
    const typingSpeed = Math.max(10, Math.min(50, 1000 / fullText.length));

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = setInterval(() => {
      if (abortTypingRef.current) {
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
        onComplete(fullText);
        return;
      }

      charIdx += 1;
      const partialText = fullText.substring(0, charIdx);
      updateLastAssistantMessage(partialText, { typing: true });

      if (charIdx >= fullText.length) {
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
        updateLastAssistantMessage(fullText, { typing: false });
        onComplete();
      }
    }, typingSpeed);
  };

  const controllerRef = useRef(null);

const sendMessage = async () => {
  const userMessage = input.trim();

  if (!userMessage || loading) return;

  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    updateLastAssistantMessage(
      '❌ Authentication token not found. Please login again.'
    );
    return;
  }

  addMessage('user', userMessage);
  setInput('');
  setLoading(true);

  controllerRef.current?.abort();
  controllerRef.current = new AbortController();

  addMessage('assistant', '');

  try {
    const timeoutId = setTimeout(() => {
      controllerRef.current?.abort();
    }, 80000);

    const history = messages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    const response = await fetch(
      'https://prep-project-zej8.onrender.com/api/v1/user/chatbot/ask',
      {
        method: 'POST',
        signal: controllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          message: userMessage,
          history: history,
        }),
      }
    );

    clearTimeout(timeoutId);

    const data = await response.json();

    console.log('Chatbot API response:', data);

    if (!response.ok) {
      throw new Error(
        data?.message || 'Chatbot request failed'
      );
    }

    // ✅ Backend returns the answer here
    const aiText = data?.data?.reply;

    if (!aiText) {
      throw new Error('No chatbot reply received.');
    }

    updateLastAssistantMessage(aiText);
    saveCurrentChatToHistory();

  } catch (err) {
    console.error('Chatbot error:', err);

    updateLastAssistantMessage(
      err.name === 'AbortError'
        ? '⚠️ Request timed out. Please try again.'
        : `❌ ${err.message}`
    );
  } finally {
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

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-[calc(100vh-264px)] p-0 md:p-4 lg:p-0">
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div className="w-full h-[96vh] bg-white rounded-2xl flex flex-col overflow-hidden min-h-0">
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
              <p className="text-sm text-white/90 hidden sm:block">Your academic study assistant</p>
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

              {chatHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  <Icon icon="mdi:chat-outline" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No chat history yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {chatHistory.map(chat => (
                    <div
                      key={chat.id}
                      className={`group relative flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        currentChatId === chat.id
                          ? 'bg-emerald-50 border border-emerald-200'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => loadChatFromHistory(chat)}
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
                        <div className="text-xs text-gray-500">{formatDate(chat.lastUpdated)}</div>
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
                        <div className="whitespace-pre-wrap break-words text-sm md:text-base">
                          {message.content}
                        </div>
                      ) : (
                        <div className="prose prose-sm max-w-none">
                          {message.meta?.typing ? (
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
                              <MessageRenderer content={message.content} />

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
                      )}
                    </div>

                    <div
                      className={`text-xs mt-1 px-1 text-gray-500 ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {formatTime(message.ts)}
                    </div>
                  </div>
                </div>
              ))}

              {loading && !isTyping && (
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
              )}

              <div ref={chatEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-3 md:p-4 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 md:gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a study-related question..."
                  className="w-full p-3 md:p-4 pr-10 md:pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-sm md:text-base"
                  rows="1"
                  style={{ minHeight: '44px', maxHeight: '100px' }}
                  disabled={loading || isTyping}
                />
                <div className="absolute right-3 bottom-3">
                  <Icon
                    icon="mdi:lightbulb-on-outline"
                    width="18"
                    height="18"
                    className="text-emerald-500"
                  />
                </div>
              </div>

              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading || isTyping}
                className="px-4 md:px-6 py-2.5 md:py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1 md:gap-2 font-medium text-sm md:text-base"
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
  );
};

export default HOC(ChatBotAi);
