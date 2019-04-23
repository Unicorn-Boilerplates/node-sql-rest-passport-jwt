# node-sql-rest-passport-jwt
Boilerplate for serving rest API via Node, includes sql support and user authentication.

## Technology Stack:


- [x] Node (Server)
- [ ] Nginx (Serving)
- [x] Express (API serving)
- [ ] HTTP-status (Handling API error)
- [x] Sequelize (ORM for SQL/Postgress)
- [x] Passport Local Authentication
- [x] Facebook Authentication
- [x] Instagram Authentication
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
  FACEBOOK_APP_ID: '--your-app-id-for-facebook--',
  FACEBOOK_APP_SECRET: '--your-app-secret-for-facebook--',
  TOKEN: '--string-of-your-choice--',
};
```

## Authentication Routes:

```
/signup
```
Accepts username and password as registration mechanism, return JWT token.

You can use the following react native snippet to test the signup post call
```javascript
  onSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:80/signup', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 200) {
        console.log(res.json())
        //this.props.history.push('/');
      } else {
        const error = new Error(res.error);
        throw error;
      }
    })
    .catch(err => {
      console.error(err);
      //alert('Error logging in please try again');
    });
  }
```

Where this.state is:
```
{
	username: 'name',
	password: 'pwd'
}
```


```
/signin
```
Uses normal username and password to sign in

```
/auth/instagram
```
Uses instagram OAuth to signup and/or signin
```
auth/facebook/
```
Uses facebook OAuth to signup and/or signin
