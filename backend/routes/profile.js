const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const {
      name,
      avatar,
      profile_image,
      phone,
      work,
      location,
      bio,
      social,
      age,
      has_kids,
      is_retired,
      marital_status,
      birthday,
      languages,
      can_drive,
      dietary,
      spiritual_gifts,
      current_groups,
      desired_groups,
      hobbies,
      available,
      need_help_with,
      is_business_owner,
      business_name,
      business_description,
      joined
    } = req.body;

    const result = await pool.query(
      `UPDATE users SET
        name = COALESCE($1, name),
        avatar = COALESCE($2, avatar),
        profile_image = COALESCE($3, profile_image),
        phone = COALESCE($4, phone),
        work = COALESCE($5, work),
        location = COALESCE($6, location),
        bio = COALESCE($7, bio),
        social = COALESCE($8, social),
        age = COALESCE($9, age),
        has_kids = COALESCE($10, has_kids),
        is_retired = COALESCE($11, is_retired),
        marital_status = COALESCE($12, marital_status),
        birthday = COALESCE($13, birthday),
        languages = COALESCE($14, languages),
        can_drive = COALESCE($15, can_drive),
        dietary = COALESCE($16, dietary),
        spiritual_gifts = COALESCE($17, spiritual_gifts),
        current_groups = COALESCE($18, current_groups),
        desired_groups = COALESCE($19, desired_groups),
        hobbies = COALESCE($20, hobbies),
        available = COALESCE($21, available),
        need_help_with = COALESCE($22, need_help_with),
        is_business_owner = COALESCE($23, is_business_owner),
        business_name = COALESCE($24, business_name),
        business_description = COALESCE($25, business_description),
        joined = COALESCE($26, joined)
      WHERE id = $27
      RETURNING *`,
      [
        name,
        avatar,
        profile_image,
        phone,
        work,
        location,
        bio,
        social,
        age,
        has_kids,
        is_retired,
        marital_status,
        birthday,
        languages,
        can_drive,
        dietary,
        spiritual_gifts,
        current_groups,
        desired_groups,
        hobbies,
        available,
        need_help_with,
        is_business_owner,
        business_name,
        business_description,
        joined,
        req.userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
