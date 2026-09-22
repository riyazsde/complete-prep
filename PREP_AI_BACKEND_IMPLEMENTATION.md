# Prep.AI Backend Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Current State (Frontend)](#current-state-frontend)
3. [Backend Architecture](#backend-architecture)
4. [API Endpoints](#api-endpoints)
5. [System Prompt](#system-prompt)
6. [Chat History Management](#chat-history-management)
7. [Request/Response Formats](#requestresponse-formats)
8. [Error Handling](#error-handling)
9. [Security Considerations](#security-considerations)
10. [Environment Setup](#environment-setup)
11. [Implementation Examples](#implementation-examples)

---

## Overview

**Problem:** OpenAI API calls are currently happening on the frontend, which exposes sensitive API keys and violates security best practices.

**Solution:** Move all OpenAI interactions to a secure backend server. The frontend will send user messages to the backend, which will:
- Manage conversation history
- Apply system prompts
- Call OpenAI API securely
- Return responses to the frontend
- Store chat history in the database

**Benefits:**
- ✅ API keys stay secure (server-side only)
- ✅ Centralized prompt management
- ✅ Database-backed chat history (persistent across sessions)
- ✅ Rate limiting and usage monitoring
- ✅ Enhanced access control and authentication
- ✅ Easier to update system prompts without frontend changes

---

## Current State (Frontend)

### Current Implementation
```javascript
// ChatBotAi.jsx - UNSAFE - API key exposed in frontend
const OPENAI_KEY = process.env.REACT_APP_OPENAI_KEY || '';

const sendMessage = async () => {
  // Direct call to OpenAI from browser
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_KEY}`, // ⚠️ EXPOSED
    },
    body: JSON.stringify({
      model: 'gpt-5',
      messages: apiMessages,
    }),
  });
};
```

### Issues
1. **Security**: API key is exposed in browser network requests
2. **Rate Limiting**: No server-side rate limiting
3. **Audit Trail**: No logging of API calls
4. **Cost Control**: No ability to monitor usage
5. **History**: Only stored in localStorage (limited, not persistent)
6. **Maintenance**: Prompt changes require frontend redeploy

---

## Backend Architecture

### Technology Stack Recommendations

**Node.js/Express Stack**
```
Backend Server
├── Express.js (Web Framework)
├── OpenAI Node SDK (API Client)
├── Database (MongoDB/PostgreSQL)
│   ├── Chat Sessions
│   ├── Messages
│   └── User Preferences
├── Authentication Middleware (JWT)
├── Rate Limiter Middleware
└── Error Handler
```

### Folder Structure
```
backend/
├── src/
│   ├── controllers/
│   │   └── chatController.js
│   ├── services/
│   │   ├── openaiService.js
│   │   ├── chatService.js
│   │   └── historyService.js
│   ├── models/
│   │   ├── ChatSession.js
│   │   ├── Message.js
│   │   └── User.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── rateLimiter.js
│   │   └── errorHandler.js
│   ├── config/
│   │   ├── openai.js
│   │   └── database.js
│   ├── utils/
│   │   ├── prompts.js
│   │   └── validators.js
│   └── routes/
│       └── chatRoutes.js
├── .env
├── server.js
└── package.json
```

---

## API Endpoints

### 1. Send Message (Chat)
**Endpoint:** `POST /api/chat/send-message`

**Purpose:** Send a user message and get AI response

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Request Body:**
```json
{
  "chatId": "chat-uuid-or-null-for-new",
  "message": "What is photosynthesis?",
  "conversationHistory": ["msg-id-1", "msg-id-2"]
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "chatId": "chat-uuid-12345",
    "messageId": "msg-uuid-67890",
    "userMessage": "What is photosynthesis?",
    "assistantMessage": "Photosynthesis is the process by which plants convert light energy into chemical energy...",
    "timestamp": "2026-05-14T10:30:00Z",
    "tokensUsed": {
      "prompt": 45,
      "completion": 120,
      "total": 165
    }
  }
}
```

**Response (Error - 4xx/5xx):**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### 2. Get Chat History
**Endpoint:** `GET /api/chat/history`

**Purpose:** Retrieve all saved chat sessions for the user

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Query Parameters:**
```
limit=20        // Number of chats to return
offset=0        // Pagination offset
sortBy=date     // Sort by: date, title
order=desc      // asc or desc
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "chats": [
      {
        "id": "chat-uuid-1",
        "title": "What is photosynthesis?",
        "preview": "Photosynthesis is the process by which plants...",
        "messageCount": 8,
        "createdAt": "2026-05-14T09:00:00Z",
        "updatedAt": "2026-05-14T10:30:00Z"
      }
    ],
    "total": 45,
    "limit": 20,
    "offset": 0
  }
}
```

### 3. Get Chat Details (with Messages)
**Endpoint:** `GET /api/chat/:chatId`

**Purpose:** Retrieve a specific chat with all its messages

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "chat-uuid-1",
    "title": "What is photosynthesis?",
    "createdAt": "2026-05-14T09:00:00Z",
    "updatedAt": "2026-05-14T10:30:00Z",
    "messages": [
      {
        "id": "msg-1",
        "role": "assistant",
        "content": "Hello! I'm Prepo AI...",
        "timestamp": "2026-05-14T09:00:00Z"
      },
      {
        "id": "msg-2",
        "role": "user",
        "content": "What is photosynthesis?",
        "timestamp": "2026-05-14T09:01:00Z"
      },
      {
        "id": "msg-3",
        "role": "assistant",
        "content": "Photosynthesis is...",
        "timestamp": "2026-05-14T09:02:00Z"
      }
    ]
  }
}
```

### 4. Create New Chat
**Endpoint:** `POST /api/chat/new`

**Purpose:** Initialize a new chat session

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Request Body:**
```json
{
  "title": "Optional chat title"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "chat-uuid-new",
    "title": "Optional chat title",
    "createdAt": "2026-05-14T11:00:00Z",
    "messages": [
      {
        "id": "msg-initial",
        "role": "assistant",
        "content": "Hello! I'm Prepo AI...",
        "timestamp": "2026-05-14T11:00:00Z"
      }
    ]
  }
}
```

### 5. Delete Chat
**Endpoint:** `DELETE /api/chat/:chatId`

**Purpose:** Delete a chat session and all its messages

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Chat deleted successfully"
}
```

### 6. Update Chat Title
**Endpoint:** `PATCH /api/chat/:chatId`

**Purpose:** Update chat title

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Request Body:**
```json
{
  "title": "New chat title"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "chat-uuid-1",
    "title": "New chat title",
    "updatedAt": "2026-05-14T11:05:00Z"
  }
}
```

---

## System Prompt

### Complete System Prompt (Server-Managed)

The system prompt should be stored on the backend to allow easy updates without redeploying the frontend.

**Backend File: `src/config/systemPrompt.js`**

```javascript
export const SYSTEM_PROMPT = `You are **Prepo AI**, an academic study assistant.

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

// Optional: Version tracking for prompt updates
export const PROMPT_VERSION = "1.0.0";
export const PROMPT_UPDATED_AT = "2026-05-14";

// Optional: Environment-specific prompts
export const getSystemPrompt = (environment = 'production') => {
  // Could return different prompts for different environments
  return SYSTEM_PROMPT;
};
```

### Updating System Prompt Safely
- Store in database for dynamic updates
- Version control each change
- Don't apply to existing conversations
- Document all changes in a changelog

---

## Chat History Management

### Database Schema

**ChatSession Model:**
```javascript
{
  _id: ObjectId,
  userId: String,            // FK to User
  title: String,
  preview: String,           // First message snippet
  messageCount: Number,
  createdAt: Date,
  updatedAt: Date,
  lastMessageAt: Date,
  isArchived: Boolean,
  tags: [String],            // Optional: for categorization
  model: String,             // GPT model used: "gpt-4", "gpt-5"
  totalTokensUsed: Number,   // Track usage
  status: String             // 'active', 'archived', 'deleted'
}
```

**Message Model:**
```javascript
{
  _id: ObjectId,
  chatId: ObjectId,          // FK to ChatSession
  userId: String,            // FK to User
  role: String,              // "user" or "assistant"
  content: String,
  metadata: {
    wordCount: Number,
    tokensUsed: {
      prompt: Number,
      completion: Number,
      total: Number
    },
    responseTime: Number,    // ms
    model: String
  },
  createdAt: Date,
  editedAt: Date,            // If edited
  isEdited: Boolean
}
```

### History Operations

#### 1. Retrieve Conversation History for API
```javascript
// When sending a user message, fetch previous messages
async function getConversationHistory(chatId, limit = 10) {
  const messages = await Message.find({ chatId })
    .sort({ createdAt: 1 })
    .limit(limit)
    .lean();

  return messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
}
```

#### 2. Save New Message
```javascript
async function saveMessage(chatId, userId, role, content, metadata) {
  const message = new Message({
    chatId,
    userId,
    role,
    content,
    metadata,
    createdAt: new Date()
  });

  await message.save();

  // Update chat session
  await ChatSession.findByIdAndUpdate(
    chatId,
    {
      $inc: { messageCount: 1 },
      updatedAt: new Date(),
      lastMessageAt: new Date(),
      $set: { preview: content.substring(0, 100) }
    }
  );

  return message;
}
```

#### 3. Auto-Generate Chat Title
```javascript
async function generateChatTitle(chatId, firstUserMessage) {
  // Option 1: Use first few words
  const title = firstUserMessage.split(' ').slice(0, 4).join(' ') + '...';

  // Option 2: Use AI to generate title (optional)
  // const title = await callOpenAI to generate title

  await ChatSession.findByIdAndUpdate(chatId, { title });
  return title;
}
```

#### 4. Archive Old Chats
```javascript
async function archiveOldChats(userId, daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  await ChatSession.updateMany(
    {
      userId,
      lastMessageAt: { $lt: cutoffDate },
      isArchived: false
    },
    {
      isArchived: true,
      status: 'archived'
    }
  );
}
```

#### 5. Delete Chat History
```javascript
async function deleteChat(chatId, userId) {
  // Soft delete - mark as deleted instead of removing
  await ChatSession.findByIdAndUpdate(chatId, {
    status: 'deleted',
    deletedAt: new Date()
  });

  // Hard delete messages (or keep for audit)
  await Message.deleteMany({ chatId });
}
```

---

## Request/Response Formats

### Message Format Throughout Stack

**Frontend → Backend:**
```json
{
  "chatId": "uuid-or-null",
  "message": "User question here",
  "userId": "auto-from-token"
}
```

**Backend Processing:**
1. Extract userId from JWT
2. Retrieve or create ChatSession
3. Fetch previous messages (context window)
4. Build OpenAI message format:
   ```json
   [
     { "role": "system", "content": "SYSTEM_PROMPT" },
     { "role": "user", "content": "previous user message" },
     { "role": "assistant", "content": "previous response" },
     { "role": "user", "content": "current message" }
   ]
   ```
5. Call OpenAI API
6. Save response to database
7. Return formatted response to frontend

**Backend → Frontend:**
```json
{
  "success": true,
  "data": {
    "chatId": "uuid",
    "message": "AI response",
    "metadata": {
      "tokens": 165,
      "timestamp": "ISO-8601"
    }
  }
}
```

### Context Window Management

**Problem:** OpenAI has token limits (e.g., 4K, 8K, 32K depending on model)

**Solution:** Implement context window trimming

```javascript
async function buildContextMessages(chatId, maxTokens = 3000) {
  let messages = [];
  let totalTokens = 0;
  const systemTokens = estimateTokens(SYSTEM_PROMPT);

  // Start from most recent and work backwards
  const allMessages = await Message.find({ chatId })
    .sort({ createdAt: -1 })
    .lean();

  for (const msg of allMessages) {
    const msgTokens = estimateTokens(msg.content);
    if (totalTokens + msgTokens + systemTokens > maxTokens) {
      break;
    }
    messages.unshift(msg);
    totalTokens += msgTokens;
  }

  // Add system prompt at beginning
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map(m => ({
      role: m.role,
      content: m.content
    }))
  ];
}

// Rough token estimation (1 token ≈ 4 characters)
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}
```

---

## Error Handling

### Error Types & Responses

#### 1. Authentication Error (401)
```json
{
  "success": false,
  "error": "Unauthorized",
  "code": "AUTH_FAILED",
  "statusCode": 401
}
```

#### 2. Rate Limit Exceeded (429)
```json
{
  "success": false,
  "error": "Too many requests. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED",
  "statusCode": 429,
  "retryAfter": 60
}
```

#### 3. OpenAI API Error (500)
```json
{
  "success": false,
  "error": "Failed to get response from AI. Please try again.",
  "code": "OPENAI_ERROR",
  "statusCode": 500
}
```

#### 4. Validation Error (400)
```json
{
  "success": false,
  "error": "Invalid input",
  "code": "VALIDATION_ERROR",
  "statusCode": 400,
  "details": {
    "message": "Message must not be empty"
  }
}
```

#### 5. Not Found Error (404)
```json
{
  "success": false,
  "error": "Chat not found",
  "code": "CHAT_NOT_FOUND",
  "statusCode": 404
}
```

### Error Handling Strategy

```javascript
// Backend error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);

  // OpenAI specific errors
  if (err.name === 'OpenAIError') {
    return res.status(500).json({
      success: false,
      error: 'AI service temporarily unavailable',
      code: 'OPENAI_ERROR'
    });
  }

  // Database errors
  if (err.name === 'MongoError') {
    return res.status(500).json({
      success: false,
      error: 'Database error',
      code: 'DB_ERROR'
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR'
  });
};
```

---

## Security Considerations

### 1. API Key Management
```javascript
// ✅ CORRECT: Store in backend .env
process.env.OPENAI_API_KEY

// ❌ WRONG: Expose in frontend
process.env.REACT_APP_OPENAI_KEY
```

### 2. Authentication
- Use JWT tokens for all API calls
- Verify token on every backend request
- Use httpOnly cookies for tokens
- Implement token refresh mechanism

### 3. Authorization
- Ensure users can only access their own chats
- Verify userId from JWT matches request
- Implement role-based access control (RBAC)

```javascript
// Middleware: Check ownership
const verifyChatOwnership = async (req, res, next) => {
  const { chatId } = req.params;
  const userId = req.user.id; // From JWT

  const chat = await ChatSession.findById(chatId);
  if (!chat || chat.userId !== userId) {
    return res.status(403).json({
      success: false,
      error: 'Unauthorized access'
    });
  }

  next();
};
```

### 4. Input Validation
- Validate message length (min/max)
- Sanitize input to prevent injection
- Rate limit by user and IP

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/chat/send-message',
  body('message')
    .trim()
    .notEmpty().withMessage('Message cannot be empty')
    .isLength({ min: 1, max: 5000 }).withMessage('Message too long'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Continue...
  }
);
```

### 5. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  message: 'Too many chat requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

app.post('/api/chat/send-message', chatLimiter, sendMessage);
```

### 6. HTTPS Only
- Force HTTPS in production
- Use secure cookies
- Set CORS properly

```javascript
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});
```

### 7. CORS Configuration
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## Environment Setup

### Backend `.env` File
```env
# Server Config
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourfrontend.com

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/prep-ai
DB_NAME=prep_ai_db

# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-5
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=20

# Logging
LOG_LEVEL=info

# Monitoring (optional)
SENTRY_DSN=
```

### Frontend Updated `.env` (Remove API Key)
```env
# Remove REACT_APP_OPENAI_KEY

# Backend API
REACT_APP_BASE_URL=https://api.yourbackend.com
REACT_APP_API_TIMEOUT=80000
```

---

## Implementation Examples

### Backend Implementation

#### 1. OpenAI Service (`src/services/openaiService.js`)
```javascript
const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.model = process.env.OPENAI_MODEL || 'gpt-5';
  }

  async sendMessage(messages, maxTokens = 2000) {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: maxTokens,
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE || 0.7),
        timeout: 80000
      });

      return {
        content: response.choices[0].message.content,
        tokens: {
          prompt: response.usage.prompt_tokens,
          completion: response.usage.completion_tokens,
          total: response.usage.total_tokens
        }
      };
    } catch (error) {
      console.error('OpenAI Error:', error);
      throw new Error('Failed to get response from OpenAI');
    }
  }
}

module.exports = new OpenAIService();
```

#### 2. Chat Service (`src/services/chatService.js`)
```javascript
const ChatSession = require('../models/ChatSession');
const Message = require('../models/Message');
const openaiService = require('./openaiService');
const { SYSTEM_PROMPT } = require('../config/systemPrompt');

class ChatService {
  async sendMessage(userId, chatId, userMessage) {
    // Create new chat if not exists
    let chat = chatId ? 
      await ChatSession.findById(chatId) : 
      await this.createNewChat(userId);

    if (!chat) {
      throw new Error('Chat not found');
    }

    // Verify ownership
    if (chat.userId !== userId) {
      throw new Error('Unauthorized');
    }

    // Get conversation context
    const conversationMessages = await this.getConversationContext(chat._id);

    // Build messages for OpenAI
    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationMessages,
      { role: 'user', content: userMessage }
    ];

    // Call OpenAI
    const aiResponse = await openaiService.sendMessage(apiMessages);

    // Save user message
    await Message.create({
      chatId: chat._id,
      userId,
      role: 'user',
      content: userMessage,
      metadata: { wordCount: userMessage.split(' ').length }
    });

    // Save AI response
    const savedMessage = await Message.create({
      chatId: chat._id,
      userId,
      role: 'assistant',
      content: aiResponse.content,
      metadata: {
        tokensUsed: aiResponse.tokens,
        wordCount: aiResponse.content.split(' ').length
      }
    });

    // Update chat
    await ChatSession.findByIdAndUpdate(chat._id, {
      messageCount: (chat.messageCount || 0) + 2,
      updatedAt: new Date(),
      lastMessageAt: new Date(),
      $inc: { totalTokensUsed: aiResponse.tokens.total }
    });

    return {
      chatId: chat._id,
      messageId: savedMessage._id,
      assistantMessage: aiResponse.content,
      tokensUsed: aiResponse.tokens
    };
  }

  async getConversationContext(chatId, limit = 10) {
    const messages = await Message.find({ chatId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return messages
      .reverse()
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));
  }

  async createNewChat(userId, title = null) {
    const chat = new ChatSession({
      userId,
      title: title || `Chat ${new Date().toLocaleDateString()}`,
      messageCount: 0,
      totalTokensUsed: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await chat.save();

    // Add initial assistant message
    await Message.create({
      chatId: chat._id,
      userId,
      role: 'assistant',
      content: "Hello! I'm Prepo AI, your academic study assistant. How can I help you with your studies today?",
      metadata: { wordCount: 17 }
    });

    return chat;
  }

  async getChatHistory(userId, limit = 20, offset = 0) {
    const chats = await ChatSession.find({
      userId,
      status: { $ne: 'deleted' }
    })
      .sort({ lastMessageAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean();

    const total = await ChatSession.countDocuments({
      userId,
      status: { $ne: 'deleted' }
    });

    return {
      chats,
      total,
      limit,
      offset
    };
  }

  async deleteChat(chatId, userId) {
    const chat = await ChatSession.findById(chatId);
    if (!chat || chat.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await ChatSession.findByIdAndUpdate(chatId, { status: 'deleted' });
    await Message.deleteMany({ chatId });
  }
}

module.exports = new ChatService();
```

#### 3. Chat Controller (`src/controllers/chatController.js`)
```javascript
const chatService = require('../services/chatService');
const { validationResult } = require('express-validator');

class ChatController {
  async sendMessage(req, res) {
    try {
      // Check validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { chatId, message } = req.body;
      const userId = req.user.id;

      const result = await chatService.sendMessage(userId, chatId, message);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getChatHistory(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 20, offset = 0 } = req.query;

      const result = await chatService.getChatHistory(
        userId,
        parseInt(limit),
        parseInt(offset)
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getChat(req, res) {
    try {
      const { chatId } = req.params;
      const userId = req.user.id;

      const chat = await ChatSession.findById(chatId);
      if (!chat || chat.userId !== userId) {
        return res.status(404).json({
          success: false,
          error: 'Chat not found'
        });
      }

      const messages = await Message.find({ chatId }).lean();

      res.json({
        success: true,
        data: {
          ...chat.toObject(),
          messages
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteChat(req, res) {
    try {
      const { chatId } = req.params;
      const userId = req.user.id;

      await chatService.deleteChat(chatId, userId);

      res.json({
        success: true,
        message: 'Chat deleted'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new ChatController();
```

### Frontend Integration

#### 1. API Service (`src/services/chatApi.js`)
```javascript
import api from './api';

const chatApi = {
  sendMessage: (chatId, message) =>
    api.post('/chat/send-message', { chatId, message }),

  getChatHistory: (limit = 20, offset = 0) =>
    api.get('/chat/history', { params: { limit, offset } }),

  getChat: (chatId) =>
    api.get(`/chat/${chatId}`),

  deleteChat: (chatId) =>
    api.delete(`/chat/${chatId}`),

  updateChatTitle: (chatId, title) =>
    api.patch(`/chat/${chatId}`, { title })
};

export default chatApi;
```

#### 2. Updated ChatBotAi Component (`src/pages/NewPages/AssessmentAssistancePage/ChatBotAi.jsx`)
```javascript
// Import
import chatApi from '../../../services/chatApi';

const ChatBotAi = () => {
  const [messages, setMessages] = useState([...]);
  const [loading, setLoading] = useState(false);
  // ... other state

  const sendMessage = async () => {
    const userMessage = input.trim();
    if (!userMessage || loading) return;

    addMessage('user', userMessage);
    setInput('');
    setLoading(true);

    addMessage('assistant', '');

    try {
      // Call backend instead of OpenAI directly
      const response = await chatApi.sendMessage(currentChatId, userMessage);

      if (response.data.success) {
        const { assistantMessage, chatId } = response.data.data;
        setCurrentChatId(chatId);
        updateLastAssistantMessage(assistantMessage);
        saveCurrentChatToHistory();
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      updateLastAssistantMessage(
        `❌ ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Load history from backend
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await chatApi.getChatHistory();
        if (response.data.success) {
          setChatHistory(response.data.data.chats);
        }
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    };

    loadChatHistory();
  }, []);

  // ... rest of component
};
```

---

## Deployment Checklist

- [ ] Backend environment variables configured
- [ ] OpenAI API key securely stored in backend `.env`
- [ ] MongoDB database set up and connected
- [ ] JWT authentication implemented
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] HTTPS enabled in production
- [ ] API endpoints tested with Postman/Insomnia
- [ ] Frontend updated to call backend endpoints
- [ ] Frontend `.env` updated (API key removed)
- [ ] Error handling tested
- [ ] Chat history persistence verified
- [ ] Rate limiting tested
- [ ] Authorization/ownership checks verified
- [ ] Security audit completed
- [ ] Logging and monitoring set up
- [ ] Backup strategy for database

---

## Monitoring & Analytics

### Track Key Metrics
- API response times
- Token usage per user
- Error rates
- Chat creation rate
- User engagement
- Cost per conversation

### Suggested Monitoring
```javascript
// Log API usage
async function logApiUsage(userId, chatId, tokensUsed) {
  await ApiUsage.create({
    userId,
    chatId,
    tokensUsed,
    cost: tokensUsed * 0.000002, // Example: $0.002 per 1K tokens
    timestamp: new Date()
  });
}
```

---

## Future Enhancements

1. **Streaming Responses** - Use Server-Sent Events (SSE) for real-time typing effect
2. **Chat Export** - Allow users to export chats as PDF/JSON
3. **Voice Input** - Integrate speech-to-text
4. **Image Uploads** - Support GPT-4V for image analysis
5. **Search** - Full-text search across all chats
6. **Sharing** - Allow users to share specific chats
7. **Collaboration** - Real-time collaborative chats
8. **Analytics Dashboard** - User usage analytics
9. **Custom Models** - Support for different OpenAI models
10. **Prompt Templates** - Pre-built prompts for specific subjects

