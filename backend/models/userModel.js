import { query } from "../config/db.js";

export const UserModel = {
  findAll: async () => {
    const res = await query(
      `SELECT id, name, email, role, location, phone, created_at AS "createdAt", updated_at AS "updatedAt" FROM users ORDER BY id ASC`
    );
    return res.rows.map(row => ({ ...row, id: String(row.id) }));
  },

  findById: async (id) => {
    const intId = parseInt(id, 10);
    if (isNaN(intId)) return null;

    const res = await query(
      `SELECT id, name, email, role, location, phone, created_at AS "createdAt", updated_at AS "updatedAt" FROM users WHERE id = $1`,
      [intId]
    );
    if (res.rows.length === 0) return null;
    return { ...res.rows[0], id: String(res.rows[0].id) };
  },

  findByEmail: async (email) => {
    const res = await query(
      `SELECT id, name, email, password, role, location, phone, created_at AS "createdAt", updated_at AS "updatedAt" FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );
    if (res.rows.length === 0) return null;
    return { ...res.rows[0], id: String(res.rows[0].id) };
  },

  create: async (userData) => {
    const { name, email, password, role, location, phone } = userData;
    const loc = location ? JSON.stringify(location) : JSON.stringify({ district: "", state: "Uttarakhand" });
    const res = await query(
      `INSERT INTO users (name, email, password, role, location, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, role, location, phone, created_at AS "createdAt", updated_at AS "updatedAt"`,
      [name, email.toLowerCase(), password, role || 'farmer', loc, phone || '']
    );
    return { ...res.rows[0], id: String(res.rows[0].id) };
  },

  update: async (id, userData) => {
    const intId = parseInt(id, 10);
    if (isNaN(intId)) return null;

    const current = await UserModel.findById(id);
    if (!current) return null;

    const updatedName = userData.name !== undefined ? userData.name : current.name;
    const updatedEmail = userData.email !== undefined ? userData.email.toLowerCase() : current.email;
    const updatedRole = userData.role !== undefined ? userData.role : current.role;
    const updatedLocation = userData.location !== undefined ? JSON.stringify(userData.location) : JSON.stringify(current.location);
    const updatedPhone = userData.phone !== undefined ? userData.phone : current.phone;

    let res;
    if (userData.password) {
      res = await query(
        `UPDATE users
         SET name = $1, email = $2, password = $3, role = $4, location = $5, phone = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING id, name, email, role, location, phone, created_at AS "createdAt", updated_at AS "updatedAt"`,
        [updatedName, updatedEmail, userData.password, updatedRole, updatedLocation, updatedPhone, intId]
      );
    } else {
      res = await query(
        `UPDATE users
         SET name = $1, email = $2, role = $3, location = $4, phone = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING id, name, email, role, location, phone, created_at AS "createdAt", updated_at AS "updatedAt"`,
        [updatedName, updatedEmail, updatedRole, updatedLocation, updatedPhone, intId]
      );
    }

    if (res.rows.length === 0) return null;
    return { ...res.rows[0], id: String(res.rows[0].id) };
  },

  delete: async (id) => {
    const intId = parseInt(id, 10);
    if (isNaN(intId)) return false;

    const res = await query(`DELETE FROM users WHERE id = $1 RETURNING id`, [intId]);
    return res.rows.length > 0;
  }
};
