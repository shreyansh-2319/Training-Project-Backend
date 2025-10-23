/**
 * Middleware for Role-Based Access Control (RBAC).
 * Checks if the authenticated user has one of the required roles.
 * * @param {Array<string>} roles - Array of roles allowed to access the route (e.g., ['admin', 'student']).
 */
exports.checkRole = (roles) => (req, res, next) => {
    // This assumes authenticateJWT has successfully run and req.user is populated.
    if (!req.user) {
        return res.status(403).json({ message: 'Access forbidden: User object missing (Authentication required first).' });
    }

    // Safely retrieve the role from the user object (handles both Mongoose objects and plain JWT payload)
    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
        // User's role is not in the allowed list
        return res.status(403).json({ 
            message: 'Access forbidden: Insufficient privileges.',
            requiredRoles: roles,
            yourRole: userRole
        });
    }

    // User has the correct role
    next();
};