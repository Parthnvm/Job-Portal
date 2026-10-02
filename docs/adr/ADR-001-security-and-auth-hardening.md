# ADR 001: Security Architecture and Zero-Trust Authentication Hardening

## Context
During the security audit, the original implementation of `isAuthenticated.js` contained an insecure fallback mechanism:
1. When no token was provided, it inspected client-supplied `x-user-id` headers and accepted them directly without cryptographic verification.
2. If headers were absent, it executed a fallback query on MongoDB (`User.findOne({ role: "student" })` or `User.findOne({})`) and automatically authenticated any anonymous incoming request as that user.
3. In addition, role checking was solely performed client-side, allowing student accounts to access recruiter-only endpoints (`/api/v1/job/post`, `/company/register`, and `/application/status/:id/update`), creating severe IDOR (Insecure Direct Object Reference) and privilege escalation risks.

## Decision
1. **Zero-Trust JWT Verification:**
   - Completely eliminate `x-user-id` header inspection and database user guessing from `isAuthenticated.js`.
   - Require a signed JSON Web Token (JWT) supplied either via `httpOnly` cookie or the standard `Authorization: Bearer <token>` header.
   - Attach the verified user entity (`req.user`) and user ID (`req.id`) to the request object.
2. **Server-Side Role-Based Access Control (RBAC):**
   - Introduce `authorizeRole(...roles)` middleware to guard administrative and recruiter actions.
   - Enforce resource ownership checks in controllers (`company.userId === req.id` and `job.created_by === req.id`).
3. **Dual Token Delivery:**
   - Return `{ token, user, success: true }` in JSON for `login` and `googleLogin`, allowing standard header-based API interaction while maintaining `httpOnly` cookie support.
4. **Offline Test Automation:**
   - Adopt Node.js native test runner (`node:test`) for unit and integration testing without requiring external cloud databases or mock frameworks.

## Consequences
- **Positive:** Closes complete authentication bypass, blocks IDOR across companies and job applications, enables predictable API behavior, and satisfies OWASP API Security Top 10 guidelines.
- **Trade-offs:** Client requests to protected routes without a valid JWT are strictly rejected with HTTP 401. Existing unauthenticated developer scripts must authenticate via `/api/v1/user/login` first.
