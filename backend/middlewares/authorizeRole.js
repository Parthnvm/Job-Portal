/**
 * Middleware to restrict route access based on user role.
 * Must be mounted AFTER isAuthenticated middleware.
 *
 * @param  {...string} allowedRoles - List of authorized roles (e.g. 'recruiter', 'student', 'admin')
 */
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User identity or role could not be verified.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of [${allowedRoles.join(", ")}] permissions. Current role is '${req.user.role}'.`,
      });
    }

    return next();
  };
};

export default authorizeRole;
