import db from '../db.js';

// Get user's role and permissions
export const getUserRole = async (userId) => {
    try {
        const [rows] = await db.query(`
            SELECT r.name, r.permissions 
            FROM roles r
            INNER JOIN user_roles ur ON ur.role_id = r.id
            WHERE ur.user_id = ?
            LIMIT 1
        `, [userId]);

        if (rows.length === 0) {
            return { name: null, permissions: {} };
        }

        return {
            name: rows[0].name,
            permissions: JSON.parse(rows[0].permissions || '{}')
        };
    } catch (error) {
        console.error('Error fetching user role:', error);
        return { name: null, permissions: {} };
    }
};

// Middleware: Require specific role
export const requireRole = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Unauthorized: No user found' });
            }

            const userRole = await getUserRole(req.user.id);

            if (!userRole.name || !allowedRoles.includes(userRole.name)) {
                return res.status(403).json({
                    message: 'Forbidden: Insufficient permissions',
                    required: allowedRoles,
                    current: userRole.name
                });
            }

            // Attach role info to request for later use
            req.userRole = userRole;
            next();
        } catch (error) {
            console.error('RBAC middleware error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
};

// Middleware: Require specific permission
export const requirePermission = (resource, action) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: 'Unauthorized: No user found' });
            }

            const userRole = await getUserRole(req.user.id);

            // Admin has all permissions
            if (userRole.permissions.all === true) {
                req.userRole = userRole;
                return next();
            }

            // Check specific permission
            const resourcePermissions = userRole.permissions[resource];
            if (!resourcePermissions || !resourcePermissions.includes(action)) {
                return res.status(403).json({
                    message: `Forbidden: Missing permission '${action}' on '${resource}'`,
                    required: `${resource}.${action}`,
                    role: userRole.name
                });
            }

            req.userRole = userRole;
            next();
        } catch (error) {
            console.error('Permission middleware error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
};

// Middleware: Audit logger (auto-log changes)
export const auditLog = async (req, res, next) => {
    // Store original res.json to intercept response
    const originalJson = res.json.bind(res);

    res.json = function (data) {
        // Only log on successful modify operations
        if (res.statusCode >= 200 && res.statusCode < 300) {
            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
                logAudit(req, data).catch(err => console.error('Audit log error:', err));
            }
        }
        return originalJson(data);
    };

    next();
};

// Helper function to create audit log entry
const logAudit = async (req, responseData) => {
    try {
        const userId = req.user?.id;
        if (!userId) return;

        const action = {
            'POST': 'create',
            'PUT': 'update',
            'PATCH': 'update',
            'DELETE': 'delete'
        }[req.method] || 'unknown';

        const pathParts = req.path.split('/');
        const targetTable = pathParts[2] || 'unknown'; // e.g., /api/users/123 -> users
        const targetId = parseInt(pathParts[3]) || null;

        await db.query(`
            INSERT INTO audit_logs (user_id, action, target_table, target_id, changes, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            userId,
            action,
            targetTable,
            targetId,
            JSON.stringify({
                path: req.path,
                method: req.method,
                body: req.body,
                response: responseData
            }),
            req.ip || req.connection.remoteAddress,
            req.get('User-Agent')
        ]);
    } catch (error) {
        console.error('Failed to create audit log:', error);
    }
};

export default { requireRole, requirePermission, auditLog, getUserRole };
