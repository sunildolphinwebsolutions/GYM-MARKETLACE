const db = require('../db');

// Create a new commission rule
exports.createRule = async (req, res) => {
    try {
        const { name, type, value, is_default } = req.body;

        // If setting as default, unset other defaults
        if (is_default) {
            await db.query('UPDATE commission_rules SET is_default = FALSE');
        }

        const newRule = await db.query(
            "INSERT INTO commission_rules (name, type, value, is_default) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, type, value, is_default || false]
        );

        res.json({ success: true, rule: newRule.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all commission rules
exports.getRules = async (req, res) => {
    try {
        const rules = await db.query('SELECT * FROM commission_rules ORDER BY created_at DESC');
        res.json({ success: true, rules: rules.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update a commission rule
exports.updateRule = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, value, is_default } = req.body;

        if (is_default) {
            await db.query('UPDATE commission_rules SET is_default = FALSE');
        }

        const updatedRule = await db.query(
            "UPDATE commission_rules SET name = $1, type = $2, value = $3, is_default = $4 WHERE id = $5 RETURNING *",
            [name, type, value, is_default, id]
        );

        if (updatedRule.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Rule not found' });
        }

        res.json({ success: true, rule: updatedRule.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete a commission rule
exports.deleteRule = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM commission_rules WHERE id = $1', [id]);
        res.json({ success: true, message: 'Rule deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get the effective rule (helper logic, maybe exposed or used internally)
exports.getEffectiveRule = async () => {
    // Logic to find which rule applies. For now, return default.
    const rule = await db.query('SELECT * FROM commission_rules WHERE is_default = TRUE LIMIT 1');
    return rule.rows[0];
};
