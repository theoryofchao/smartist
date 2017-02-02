let settings = require('./settings');

const cookieSession = require(`cookie-session`)({
  name: 'session',
  secret: settings.secret,
  maxAge: 5 * 60 * 1000
});

module.exports = cookieSession;
