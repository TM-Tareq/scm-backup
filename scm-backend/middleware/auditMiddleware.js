import db from '../db.js';

export const auditLog = (action, resource) => {
    return async (req, res, next) => {
        // Capture the original send function to intercept response
        const originalSend = res.json;

        res.json = function (data) {
            res.json = originalSend; // Restore original

            // Only log successful operations or specific errors
            if (res.statusCode >= 200 && res.statusCode < 400) {
                const userId = req.user ? req.user.id : null;
                const ipAddress = req.ip || req.connection.remoteAddress;

                // Don't wait for DB write
                db.query(
                    'INSERT INTO audit_logs (user_id, action, resource, details, ip_address) VALUES (?, ?, ?, ?, ?)',
                    [
                        userId,
                        action,
                        resource,
                        JSON.stringify({ body: req.body, response: data }),
                        ipAddress
                    ]
                ).catch(err => console.error('Audit Log Error:', err));
            }

            return originalSend.call(this, data);
        };

        next();
    };
};
