const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { salt_value } = require('../const/jwt');

const saltRounds = salt_value;

  const register = async({ name, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const checkUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) throw new Error('Email already exists');

    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      [name, email, hashedPassword]
    );

    const userId = result.rows[0].id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);

    return { token, userId: String(userId) };
  }

  const login = async({ email, password }) => {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) throw new Error('Invalid credentials');
    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid credentials');

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    return { token, userId: String(user.id) };
  }

  const followUser = async({ userId, followUserId }) => {
    if (userId === followUserId) throw new Error("You can't follow yourself.");

    await db.query(
      `INSERT INTO follower (follower_id, following_id)
       VALUES ($1, $2)
       ON CONFLICT (follower_id, following_id) DO NOTHING`,
      [userId, followUserId]
    );

    return { message: 'Following now' };
  }

  const unfollowUser=  async({ userId, followUserId }) => {
    await db.query(
      `DELETE FROM follower WHERE follower_id = $1 AND following_id = $2`,
      [userId, followUserId]
    );

    return { message: 'Unfollowed successfully' };
  }

  const getFollowers=  async ({ userId, page_size = 1, limit = 10 }) => {
    
      const countResult = await db.query(
        `SELECT COUNT(*) FROM follower WHERE following_id = $1`,
        [userId]
      );
      const totalFollowers = parseInt(countResult.rows[0].count, 10);
    
      // Fetch paginated results
      const result = await db.query(
        `SELECT follower_id FROM follower
         WHERE following_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, page_size, page_number]
      );
    
      return {
        followers_info: result.rows,
        total_count: totalFollowers
      };
    };
  

  module.exports = {
    register,
    login,
    followUser,
    unfollowUser,
    getFollowers
  }
