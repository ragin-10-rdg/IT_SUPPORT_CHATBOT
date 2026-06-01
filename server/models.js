const mongoose = require('mongoose');

// ── Message Schema ────────────────────────────────────────────────────────
const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'bot', 'ai'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  source: {
    type: String,
    enum: ['user', 'database', 'claude_ai', 'escalation', 'system'],
    default: 'user'
  },
  matchedQuery: {
    type: String,
    default: null
  },
  category: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// ── Conversation Schema ───────────────────────────────────────────────────
const ConversationSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userAgent: String,
  status: {
    type: String,
    enum: ['active', 'resolved', 'escalated'],
    default: 'active'
  },
  stage: {
    type: String,
    enum: ['fresh', 'db_answered', 'ai_answered', 'escalated'],
    default: 'fresh'
  },
  lastMatchedEntry: {
    id: Number,
    query: String,
    category: String
  },
  lastUserQuery: String,
  messages: [MessageSchema],
  resolvedAt: Date,
  escalatedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ConversationSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// ── Analytics Schema ──────────────────────────────────────────────────────
const AnalyticsSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  totalSessions: { type: Number, default: 0 },
  resolved: { type: Number, default: 0 },
  escalated: { type: Number, default: 0 },
  dbResolved: { type: Number, default: 0 },
  aiResolved: { type: Number, default: 0 },
  topCategories: [{ category: String, count: Number }]
});

module.exports = {
  Conversation: mongoose.model('Conversation', ConversationSchema),
  Analytics: mongoose.model('Analytics', AnalyticsSchema)
};
