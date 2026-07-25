import { query } from "../config/db.js";

export const ChatHistoryModel = {
  findAll: async () => {
    const res = await query(
      `SELECT id, user_id, COALESCE(title, session_name, 'Conversation') AS title, messages, created_at, updated_at FROM chat_history ORDER BY updated_at DESC, id DESC`
    );
    return res.rows.map(row => ({
      id: String(row.id),
      user_id: row.user_id ? String(row.user_id) : null,
      userId: row.user_id ? String(row.user_id) : null,
      title: row.title,
      messages: typeof row.messages === 'string' ? JSON.parse(row.messages) : row.messages,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  },

  findByUserId: async (userId) => {
    const intUserId = parseInt(userId, 10);
    if (isNaN(intUserId)) return [];

    const res = await query(
      `SELECT id, user_id, COALESCE(title, session_name, 'Conversation') AS title, messages, created_at, updated_at FROM chat_history WHERE user_id = $1 ORDER BY updated_at DESC, id DESC`,
      [intUserId]
    );
    return res.rows.map(row => ({
      id: String(row.id),
      user_id: String(row.user_id),
      userId: String(row.user_id),
      title: row.title,
      messages: typeof row.messages === 'string' ? JSON.parse(row.messages) : row.messages,
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
        `SELECT id, user_id, COALESCE(title, session_name, 'Conversation') AS title, messages, created_at, updated_at FROM chat_history WHERE id = $1 AND user_id = $2`,
        [intId, intUserId]
      );
    } else {
      res = await query(
        `SELECT id, user_id, COALESCE(title, session_name, 'Conversation') AS title, messages, created_at, updated_at FROM chat_history WHERE id = $1`,
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
      `INSERT INTO chat_history (user_id, title, session_name, messages)
       VALUES ($1, $2, $2, $3)
       RETURNING id, user_id, title, messages, created_at, updated_at`,
      [isNaN(intUserId) ? null : intUserId, chatTitle, msgs]
    );
    const row = res.rows[0];
    return {
      id: String(row.id),
      user_id: row.user_id ? String(row.user_id) : null,
      userId: row.user_id ? String(row.user_id) : null,
      title: row.title,
      messages: typeof row.messages === 'string' ? JSON.parse(row.messages) : row.messages,
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

    const res = await query(
      `UPDATE chat_history
       SET title = $1, session_name = $1, messages = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4
       RETURNING id, user_id, title, messages, created_at, updated_at`,
      [updatedTitle, updatedMessages, intId, intUserId]
    );
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      id: String(row.id),
      user_id: row.user_id ? String(row.user_id) : null,
      userId: row.user_id ? String(row.user_id) : null,
      title: row.title,
      messages: typeof row.messages === 'string' ? JSON.parse(row.messages) : row.messages,
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
  }
};
