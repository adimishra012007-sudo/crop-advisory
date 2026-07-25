import { query } from "../config/db.js";

export const ChatHistoryModel = {
  findAll: async () => {
    const res = await query(
      `SELECT id, user_id, COALESCE(title, session_name, 'Conversation') AS title, messages, COALESCE(is_pinned, false) AS is_pinned, COALESCE(is_favorite, false) AS is_favorite, created_at, updated_at FROM chat_history ORDER BY is_pinned DESC, is_favorite DESC, updated_at DESC, id DESC`
    );
    return res.rows.map(row => ({
      id: String(row.id),
      user_id: row.user_id ? String(row.user_id) : null,
      userId: row.user_id ? String(row.user_id) : null,
      title: row.title,
      messages: typeof row.messages === 'string' ? JSON.parse(row.messages) : row.messages,
      is_pinned: Boolean(row.is_pinned),
      isPinned: Boolean(row.is_pinned),
      is_favorite: Boolean(row.is_favorite),
      isFavorite: Boolean(row.is_favorite),
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  },

  findByUserId: async (userId) => {
    const intUserId = parseInt(userId, 10);
    if (isNaN(intUserId)) return [];

    const res = await query(
      `SELECT id, user_id, COALESCE(title, session_name, 'Conversation') AS title, messages, COALESCE(is_pinned, false) AS is_pinned, COALESCE(is_favorite, false) AS is_favorite, created_at, updated_at FROM chat_history WHERE user_id = $1 ORDER BY is_pinned DESC, is_favorite DESC, updated_at DESC, id DESC`,
      [intUserId]
    );
    return res.rows.map(row => ({
      id: String(row.id),
      user_id: String(row.user_id),
      userId: String(row.user_id),
      title: row.title,
      messages: typeof row.messages === 'string' ? JSON.parse(row.messages) : row.messages,
      is_pinned: Boolean(row.is_pinned),
      isPinned: Boolean(row.is_pinned),
      is_favorite: Boolean(row.is_favorite),
      isFavorite: Boolean(row.is_favorite),
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  },

  findById: async (id, userId = null) => {
    const intId = parseInt(id, 10);
    if (isNaN(intId)) return null;

    let res;
    if (userId) {
      const intUserId = parseInt(userId, 10);
      if (isNaN(intUserId)) return null;
      res = await query(
        `SELECT id, user_id, COALESCE(title, session_name, 'Conversation') AS title, messages, COALESCE(is_pinned, false) AS is_pinned, COALESCE(is_favorite, false) AS is_favorite, created_at, updated_at FROM chat_history WHERE id = $1 AND user_id = $2`,
        [intId, intUserId]
      );
    } else {
      res = await query(
        `SELECT id, user_id, COALESCE(title, session_name, 'Conversation') AS title, messages, COALESCE(is_pinned, false) AS is_pinned, COALESCE(is_favorite, false) AS is_favorite, created_at, updated_at FROM chat_history WHERE id = $1`,
        [intId]
      );
    }

    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      id: String(row.id),
      user_id: row.user_id ? String(row.user_id) : null,
      userId: row.user_id ? String(row.user_id) : null,
      title: row.title,
      messages: typeof row.messages === 'string' ? JSON.parse(row.messages) : row.messages,
      is_pinned: Boolean(row.is_pinned),
      isPinned: Boolean(row.is_pinned),
      is_favorite: Boolean(row.is_favorite),
      isFavorite: Boolean(row.is_favorite),
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  },

  create: async (chatData) => {
    const { userId, title, messages } = chatData;
    const intUserId = userId ? parseInt(userId, 10) : null;
    const msgs = messages ? JSON.stringify(messages) : JSON.stringify([]);
    const chatTitle = title || `Conversation ${new Date().toLocaleDateString()}`;

    const res = await query(
      `INSERT INTO chat_history (user_id, title, session_name, messages, is_pinned, is_favorite)
       VALUES ($1, $2, $2, $3, false, false)
       RETURNING id, user_id, title, messages, COALESCE(is_pinned, false) AS is_pinned, COALESCE(is_favorite, false) AS is_favorite, created_at, updated_at`,
      [isNaN(intUserId) ? null : intUserId, chatTitle, msgs]
    );
    const row = res.rows[0];
    return {
      id: String(row.id),
      user_id: row.user_id ? String(row.user_id) : null,
      userId: row.user_id ? String(row.user_id) : null,
      title: row.title,
      messages: typeof row.messages === 'string' ? JSON.parse(row.messages) : row.messages,
      is_pinned: Boolean(row.is_pinned),
      isPinned: Boolean(row.is_pinned),
      is_favorite: Boolean(row.is_favorite),
      isFavorite: Boolean(row.is_favorite),
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  },

  update: async (id, userId, chatData) => {
    const intId = parseInt(id, 10);
    const intUserId = parseInt(userId, 10);
    if (isNaN(intId) || isNaN(intUserId)) return null;

    const current = await ChatHistoryModel.findById(id, userId);
    if (!current) return null;

    const updatedTitle = chatData.title !== undefined ? chatData.title : current.title;
    const updatedMessages = chatData.messages !== undefined ? JSON.stringify(chatData.messages) : JSON.stringify(current.messages);
    const updatedPinned = chatData.isPinned !== undefined ? chatData.isPinned : (chatData.is_pinned !== undefined ? chatData.is_pinned : current.is_pinned);
    const updatedFavorite = chatData.isFavorite !== undefined ? chatData.isFavorite : (chatData.is_favorite !== undefined ? chatData.is_favorite : current.is_favorite);

    const res = await query(
      `UPDATE chat_history
       SET title = $1, session_name = $1, messages = $2, is_pinned = $3, is_favorite = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND user_id = $6
       RETURNING id, user_id, title, messages, COALESCE(is_pinned, false) AS is_pinned, COALESCE(is_favorite, false) AS is_favorite, created_at, updated_at`,
      [updatedTitle, updatedMessages, updatedPinned, updatedFavorite, intId, intUserId]
    );
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      id: String(row.id),
      user_id: row.user_id ? String(row.user_id) : null,
      userId: row.user_id ? String(row.user_id) : null,
      title: row.title,
      messages: typeof row.messages === 'string' ? JSON.parse(row.messages) : row.messages,
      is_pinned: Boolean(row.is_pinned),
      isPinned: Boolean(row.is_pinned),
      is_favorite: Boolean(row.is_favorite),
      isFavorite: Boolean(row.is_favorite),
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  },

  togglePin: async (id, userId, isPinned) => {
    const intId = parseInt(id, 10);
    const intUserId = parseInt(userId, 10);
    if (isNaN(intId) || isNaN(intUserId)) return null;

    const res = await query(
      `UPDATE chat_history
       SET is_pinned = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING id, user_id, title, messages, COALESCE(is_pinned, false) AS is_pinned, COALESCE(is_favorite, false) AS is_favorite, created_at, updated_at`,
      [Boolean(isPinned), intId, intUserId]
    );
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      id: String(row.id),
      user_id: row.user_id ? String(row.user_id) : null,
      userId: row.user_id ? String(row.user_id) : null,
      title: row.title,
      messages: typeof row.messages === 'string' ? JSON.parse(row.messages) : row.messages,
      is_pinned: Boolean(row.is_pinned),
      isPinned: Boolean(row.is_pinned),
      is_favorite: Boolean(row.is_favorite),
      isFavorite: Boolean(row.is_favorite),
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  },

  toggleFavorite: async (id, userId, isFavorite) => {
    const intId = parseInt(id, 10);
    const intUserId = parseInt(userId, 10);
    if (isNaN(intId) || isNaN(intUserId)) return null;

    const res = await query(
      `UPDATE chat_history
       SET is_favorite = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING id, user_id, title, messages, COALESCE(is_pinned, false) AS is_pinned, COALESCE(is_favorite, false) AS is_favorite, created_at, updated_at`,
      [Boolean(isFavorite), intId, intUserId]
    );
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      id: String(row.id),
      user_id: row.user_id ? String(row.user_id) : null,
      userId: row.user_id ? String(row.user_id) : null,
      title: row.title,
      messages: typeof row.messages === 'string' ? JSON.parse(row.messages) : row.messages,
      is_pinned: Boolean(row.is_pinned),
      isPinned: Boolean(row.is_pinned),
      is_favorite: Boolean(row.is_favorite),
      isFavorite: Boolean(row.is_favorite),
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  },

  delete: async (id, userId = null) => {
    const intId = parseInt(id, 10);
    if (isNaN(intId)) return false;

    let res;
    if (userId) {
      const intUserId = parseInt(userId, 10);
      if (isNaN(intUserId)) return false;
      res = await query(`DELETE FROM chat_history WHERE id = $1 AND user_id = $2 RETURNING id`, [intId, intUserId]);
    } else {
      res = await query(`DELETE FROM chat_history WHERE id = $1 RETURNING id`, [intId]);
    }

    return res.rows.length > 0;
  },

  getAnalytics: async (userId) => {
    const intUserId = parseInt(userId, 10);
    if (isNaN(intUserId)) {
      return {
        totalConversations: 0,
        totalMessages: 0,
        favoriteCount: 0,
        pinnedCount: 0,
        averageMessagesPerConversation: 0,
        longestConversation: 0,
        recentConversationDate: null,
        oldestConversationDate: null,
        topConversations: [],
        growthTimeline: []
      };
    }

    const statsRes = await query(
      `SELECT 
         COUNT(*)::int AS total_conversations,
         COALESCE(SUM(jsonb_array_length(messages)), 0)::int AS total_messages,
         COUNT(*) FILTER (WHERE is_favorite = true)::int AS favorite_count,
         COUNT(*) FILTER (WHERE is_pinned = true)::int AS pinned_count,
         COALESCE(AVG(jsonb_array_length(messages)), 0)::float AS avg_messages,
         COALESCE(MAX(jsonb_array_length(messages)), 0)::int AS max_messages,
         MAX(created_at) AS recent_date,
         MIN(created_at) AS oldest_date
       FROM chat_history
       WHERE user_id = $1`,
      [intUserId]
    );

    const stats = statsRes.rows[0] || {};

    const conversationsRes = await query(
      `SELECT id, COALESCE(title, session_name, 'Conversation') AS title, jsonb_array_length(messages)::int AS message_count, created_at
       FROM chat_history
       WHERE user_id = $1
       ORDER BY created_at ASC`,
      [intUserId]
    );

    const topConversations = [...conversationsRes.rows]
      .sort((a, b) => b.message_count - a.message_count)
      .slice(0, 5)
      .map(c => ({
        id: String(c.id),
        title: c.title,
        messageCount: c.message_count
      }));

    const dateMap = {};
    conversationsRes.rows.forEach(c => {
      if (c.created_at) {
        const dateKey = new Date(c.created_at).toISOString().split('T')[0];
        dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
      }
    });

    const growthTimeline = Object.keys(dateMap).map(date => ({
      date,
      count: dateMap[date]
    }));

    return {
      totalConversations: stats.total_conversations || 0,
      totalMessages: stats.total_messages || 0,
      favoriteCount: stats.favorite_count || 0,
      pinnedCount: stats.pinned_count || 0,
      averageMessagesPerConversation: parseFloat((stats.avg_messages || 0).toFixed(1)),
      longestConversation: stats.max_messages || 0,
      recentConversationDate: stats.recent_date || null,
      oldestConversationDate: stats.oldest_date || null,
      topConversations,
      growthTimeline
    };
  }
};
