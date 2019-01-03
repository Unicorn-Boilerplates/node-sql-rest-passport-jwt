# node-sql-rest-passport-jwt
Boilerplate for serving rest API via Node, includes sql support and user authentication.

## Technology Stack:

- [x] Node (Server)
- [ ] Nginx (Serving)
- [x] Express (API serving)
- [ ] HTTP-status (Handling API error)
- [x] Sequelize (ORM for SQL/Postgress)
- [ ] Passport (Authentication)
- [ ] Jwt (Authentication interface)
- [x] EsLint (Code convention)
- [ ] Log4j (Logging)
- [ ] Express-status-monitor (Monitoring)
- [x] Nodemon (Development productivity)
- [ ] PM2 (Production serving)

## Setup

Create secret.js file in /config folder.

The file should contain:
```javascript
module.exports = {
  INSTAGRAM_CLIENT_ID: '--your-client-id-for-instagram--',
  INSTAGRAM_CLIENT_SECRET: '--your-client-secret-for-instagram--',
};
```

## Authentication Routes:

/signup
/signin
/auth/instagram
