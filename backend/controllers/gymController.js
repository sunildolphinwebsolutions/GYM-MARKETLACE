const db = require('../db');

// Create a new gym
const createGym = async (req, res) => {
    try {
        const { name, description, location, price_per_session, features, status, capacity } = req.body;
        const owner_id = req.user.id; // From authMiddleware

        // Handle image uploads
        let imagePaths = [];
        let qrCodePath = '/img/images.png'; // Default

        if (req.files) {
            // Check for gym images
            const gymImages = req.files.filter(f => f.fieldname === 'images');
            if (gymImages.length > 0) {
                imagePaths = gymImages.map(file => `/uploads/${file.filename}`);
            }

            // Check for QR code
            const qrFile = req.files.find(f => f.fieldname === 'qr_code');
            if (qrFile) {
                qrCodePath = `/uploads/${qrFile.filename}`;
            }
        }

        // Features might come as a string if using FormData
        let featuresArray = features;
        if (typeof features === 'string') {
            featuresArray = features.split(',').map(f => f.trim()).filter(f => f !== '');
        }

        const gymStatus = status === 'published' ? 'published' : 'draft';
        const gymCapacity = capacity ? parseInt(capacity) : 10;

        const newGym = await db.query(
            'INSERT INTO gyms (owner_id, name, description, location, price_per_session, features, images, status, capacity, qr_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [owner_id, name, description, location, price_per_session, featuresArray, imagePaths, gymStatus, gymCapacity, qrCodePath]
        );

        res.json({ success: true, gym: newGym.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
};

// Get gyms owned by the logged-in user
const getOwnerGyms = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ success: false, message: 'User ID missing' });
        }

        const query = `
            SELECT g.*, 
                (SELECT COUNT(DISTINCT b.user_id) 
                 FROM bookings b 
                 JOIN payments p ON b.id = p.booking_id 
                 WHERE b.gym_id = g.id AND p.status = 'completed') as member_count
            FROM gyms g 
            WHERE g.owner_id = $1
            ORDER BY g.created_at DESC
        `;

        const gyms = await db.query(query, [req.user.id]);
        res.json({ success: true, gyms: gyms.rows });
    } catch (err) {
        console.error('getOwnerGyms Error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all gyms (Public)
const getAllGyms = async (req, res) => {
    try {
        const { min_price, max_price, location, features } = req.query;

        let query = 'SELECT * FROM gyms WHERE status = \'published\'';
        let params = [];
        let paramCount = 1;

        if (min_price) {
            query += ` AND price_per_session >= $${paramCount}`;
            params.push(min_price);
            paramCount++;
        }

        if (max_price) {
            query += ` AND price_per_session <= $${paramCount}`;
            params.push(max_price);
            paramCount++;
        }

        if (location) {
            query += ` AND location ILIKE $${paramCount}`;
            params.push(`%${location}%`);
            paramCount++;
        }

        if (features) {
            // features is comma separated string
            const featureList = features.split(',').map(f => f.trim());
            // This checks if the gym's features array contains ALL of the requested features (overlap)
            // Ideally we want to check if it contains ANY or ALL. Let's do partial match for simplicity or array containment.
            // Postgres array containment: features @> $param
            query += ` AND features @> $${paramCount}`;
            params.push(featureList);
            paramCount++;
        }

        query += ' ORDER BY created_at DESC';

        const gyms = await db.query(query, params);
        res.json({ success: true, gyms: gyms.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get single gym by ID
const getGymById = async (req, res) => {
    try {
        const { id } = req.params;
        const gym = await db.query('SELECT * FROM gyms WHERE id = $1', [id]);

        if (gym.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Gym not found' });
        }

        res.json({ success: true, gym: gym.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update a gym
const updateGym = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, location, price_per_session, features, status, capacity } = req.body;
        const owner_id = req.user.id;

        // Check if gym exists and belongs to owner
        const gymCheck = await db.query('SELECT * FROM gyms WHERE id = $1', [id]);

        if (gymCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Gym not found' });
        }

        if (gymCheck.rows[0].owner_id !== owner_id) {
            return res.status(403).json({ success: false, message: 'Unauthorized to update this gym' });
        }

        // Handle image uploads if any (append to existing or replace? For MVP let's just append or keep existing if none provided)
        // A better approach for updates usually involves separate endpoints for images or a more complex logic.
        // For this MVP, if new images are uploaded, we'll append them.
        let imagePaths = gymCheck.rows[0].images || [];
        if (req.files && req.files.length > 0) {
            const newPaths = req.files.map(file => `/uploads/${file.filename}`);
            imagePaths = [...imagePaths, ...newPaths];
        }

        let featuresArray = features;
        if (typeof features === 'string') {
            featuresArray = features.split(',').map(f => f.trim()).filter(f => f !== '');
        }

        const gymStatus = status === 'published' ? 'published' : 'draft';
        const gymCapacity = capacity ? parseInt(capacity) : (gymCheck.rows[0].capacity || 10);

        const updatedGym = await db.query(
            'UPDATE gyms SET name = $1, description = $2, location = $3, price_per_session = $4, features = $5, images = $6, status = $7, capacity = $8 WHERE id = $9 RETURNING *',
            [name, description, location, price_per_session, featuresArray, imagePaths, gymStatus, gymCapacity, id]
        );

        res.json({ success: true, gym: updatedGym.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete a gym
const deleteGym = async (req, res) => {
    try {
        const { id } = req.params;
        const owner_id = req.user.id;

        // Check if gym exists and belongs to owner
        const gymCheck = await db.query('SELECT * FROM gyms WHERE id = $1', [id]);

        if (gymCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Gym not found' });
        }

        if (gymCheck.rows[0].owner_id !== owner_id) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this gym' });
        }

        await db.query('DELETE FROM gyms WHERE id = $1', [id]);

        res.json({ success: true, message: 'Gym deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get owner stats
const getOwnerStats = async (req, res) => {
    try {
        const owner_id = req.user.id;

        // Get total gyms
        const gymsCount = await db.query('SELECT COUNT(*) FROM gyms WHERE owner_id = $1', [owner_id]);

        // Get total revenue (sum of gym_owner_amount from payments for this owner's gyms)
        const revenueResult = await db.query(`
            SELECT COALESCE(SUM(p.gym_owner_amount), 0) as total
            FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            JOIN gyms g ON b.gym_id = g.id
            WHERE g.owner_id = $1 AND p.status = 'completed'
        `, [owner_id]);

        // Get active passes (bookings where status='confirmed' and date >= today - simplified logic)
        // For accurate active passes logic, we need to know if booking date is in future or today.
        const activePassesResult = await db.query(`
            SELECT COUNT(*) 
            FROM bookings b
            JOIN gyms g ON b.gym_id = g.id
            WHERE g.owner_id = $1 AND b.status = 'confirmed' AND b.booking_date >= CURRENT_DATE
        `, [owner_id]);

        const stats = {
            totalGyms: parseInt(gymsCount.rows[0].count),
            activePasses: parseInt(activePassesResult.rows[0].count),
            totalRevenue: parseFloat(revenueResult.rows[0].total),
            avgRating: 0 // Placeholder
        };

        res.json({ success: true, stats });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get Dashboard Charts Data
const getOwnerDashboardStats = async (req, res) => {
    try {
        const owner_id = req.user.id;

        // 1. Revenue Over Time (Last 30 Days)
        // Group by day.
        const revenueQuery = `
            SELECT 
                TO_CHAR(p.created_at, 'DD Mon') as name,
                SUM(p.gym_owner_amount) as revenue
            FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            JOIN gyms g ON b.gym_id = g.id
            WHERE g.owner_id = $1 
              AND p.status = 'completed'
              AND p.created_at >= NOW() - INTERVAL '30 days'
            GROUP BY TO_CHAR(p.created_at, 'DD Mon'), DATE(p.created_at)
            ORDER BY DATE(p.created_at) ASC
        `;
        const revenueResult = await db.query(revenueQuery, [owner_id]);

        // 2. Booking Status Distribution
        const statusQuery = `
            SELECT 
                b.status as name,
                COUNT(*) as value
            FROM bookings b
            JOIN gyms g ON b.gym_id = g.id
            WHERE g.owner_id = $1
            GROUP BY b.status
        `;
        const statusResult = await db.query(statusQuery, [owner_id]);

        // Format data for charts
        // Ensure we have entries for status even if 0
        const statusMap = { 'confirmed': 0, 'pending': 0, 'cancelled': 0 };
        statusResult.rows.forEach(row => {
            statusMap[row.name] = parseInt(row.value);
        });

        const statusData = [
            { name: 'Completed', value: statusMap['confirmed'] }, // Mapping confirmed to Completed for UI
            { name: 'Pending', value: statusMap['pending'] },
            { name: 'Cancelled', value: statusMap['cancelled'] }
        ];

        res.json({
            success: true,
            revenueData: revenueResult.rows,
            statusData: statusData
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    createGym,
    getOwnerGyms,
    getAllGyms,
    getGymById,
    updateGym,
    deleteGym,
    getOwnerStats,
    getOwnerDashboardStats
};
