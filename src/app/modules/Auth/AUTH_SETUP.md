# Authentication Setup

## Overview

This auth module uses **bcrypt** for password hashing and **JWT** for stateless authentication.

## Token Delivery: Authorization Header

Tokens are returned in the response body.
Store them client-side and send via header:

```
Authorization: Bearer <accessToken>
```

---

## Test Credentials

- Email: `admin@test.com`
- Password: `SecurePassword123`

---

## Test the Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "admin@test.com", "password": "SecurePassword123" }'
```

---

## Production Checklist

- [ ] Change `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in `.env`
- [ ] Use strong random secrets (32+ characters)
- [ ] Set `NODE_ENV=production` so cookies use `secure: true`
- [ ] Hash passwords with `bcrypt.hash(password, 10)` before any user creation
- [ ] Add rate limiting on `/auth/login` (already included via `rateLimiter.ts`)

---

## Security Notes

- Never log passwords
- Always use HTTPS in production
- CORS — restrict allowed origins
