const pool = require('../config/db');

// GET all applications of logged-in user
exports.getApplications = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM applications WHERE user_id = ?', [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching applications', error: err.message });
  }
};

// ADD a new application
exports.addApplication = async (req, res) => {
  try {
    const { company_name, role, status, applied_date, notes } = req.body;
    await pool.query(
      'INSERT INTO applications (user_id, company_name, role, status, applied_date, notes) VALUES (?,?,?,?,?,?)',
      [req.user.id, company_name, role, status, applied_date, notes]
    );
    res.status(201).json({ msg: 'Application added successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error adding application', error: err.message });
  }
};

// UPDATE an application (full edit ya status-only dono ke liye)
exports.updateApplication = async (req, res) => {
  try {
    const { company_name, role, status, applied_date, notes } = req.body;
    await pool.query(
      `UPDATE applications SET
        company_name = COALESCE(?, company_name),
        role = COALESCE(?, role),
        status = COALESCE(?, status),
        applied_date = COALESCE(?, applied_date),
        notes = COALESCE(?, notes)
       WHERE id = ? AND user_id = ?`,
      [
        company_name ?? null,
        role ?? null,
        status ?? null,
        applied_date ?? null,
        notes ?? null,
        req.params.id,
        req.user.id
      ]
    );
    res.json({ msg: 'Application updated successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error updating application', error: err.message });
  }
};

// DELETE an application
exports.deleteApplication = async (req, res) => {
  try {
    await pool.query('DELETE FROM applications WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
    res.json({ msg: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting application', error: err.message });
  }
};