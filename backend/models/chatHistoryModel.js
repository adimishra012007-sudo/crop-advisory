import { query } from "../config/db.js";

export const ChatHistoryModel = {
  findAll: async () => {
    const res = await query(
      `SELECT id, user_id AS "userId", session_name AS "sessionName", messages, created_at AS "createdAt", updated_at AS "updatedAt" FROM chat_history ORDER BY id DESC`
    );
    return res.rows.map(row => ({ ...row, id: String(row.id), userId: row.userId ? String(row.userId) : null }));
  },

  findByUserId: async (userId) => {
    const intUserId = parseInt(userId, 10);
    if (isNaN(intUserId)) return [];

    const res = await query(
      `SELECT id, user_id AS "userId", session_name AS "sessionName", messages, created_at AS "createdAt", updated_at AS "updatedAt" FROM chat_history WHERE user_id = $1 ORDER BY id DESC`,
      [intUserId]
    );
    return res.rows.map(row => ({ ...row, id: String(row.id), userId: String(row.userId) }));
  },

  findById: async (id) => {
    const intId = parseInt(id, 10);
    if (isNaN(intId)) return null;

    const res = await query(
      `SELECT id, user_id AS "userId", session_name AS "sessionName", messages, created_at AS "createdAt", updated_at AS "updatedAt" FROM chat_history WHERE id = $1`,
      [intId]
    );
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return { ...row, id: String(row.id), userId: row.userId ? String(row.userId) : null };
  },

  create: async (chatData) => {
    const { userId, sessionName, messages } = chatData;
    const intUserId = userId ? parseInt(userId, 10) : null;
    const msgs = messages ? JSON.stringify(messages) : JSON.stringify([]);
    const sessName = sessionName || `Session ${new Date().toLocaleDateString()}`;

    const res = await query(
      `INSERT INTO chat_history (user_id, session_name, messages)
       VALUES ($1, $2, $3)
       RETURNING id, user_id AS "userId", session_name AS "sessionName", messages, created_at AS "createdAt", updated_at AS "updatedAt"`,
      [isNaN(intUserId) ? null : intUserId, sessName, msgs]
    );
    const row = res.rows[0];
    return { ...row, id: String(row.id), userId: row.userId ? String(row.userId) : null };
  },

  update: async (id, chatData) => {
    const intId = parseInt(id, 10);
    if (isNaN(intId)) return null;

    const current = await ChatHistoryModel.findById(id);
    if (!current) return null;

    const updatedSessionName = chatData.sessionName !== undefined ? chatData.sessionName : current.sessionName;
    const updatedMessages = chatData.messages !== undefined ? JSON.stringify(chatData.messages) : JSON.stringify(current.messages);

    const res = await query(
      `UPDATE chat_history
       SET session_name = $1, messages = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, user_id AS "userId", session_name AS "sessionName", messages, created_at AS "createdAt", updated_at AS "updatedAt"`,
      [updatedSessionName, updatedMessages, intId]
    );
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return { ...row, id: String(row.id), userId: row.userId ? String(row.userId) : null };
  },

  delete: async (id) => {
    const intId = parseInt(id, 10);
    if (isNaN(intId)) return false;

    const res = await query(`DELETE FROM chat_history WHERE id = $1 RETURNING id`, [intId]);
    return res.rows.length > 0;
  }
};
