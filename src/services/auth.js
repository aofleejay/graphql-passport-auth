const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (!user.password === password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

exports.signup = ({ email, password, context }) => {
  const user = new User({ email, password });
  return User.findOne({ email })
    .then(existingUser => {
      if (existingUser) { throw new Error('Email in use'); }
      return user.save();
    })
    .then(user => {
      return new Promise((resolve, reject) => {
        context.logIn(user, (err) => {
          if (err) { reject(err); }
          resolve(user);
        });
      });
    });
};

exports.login = ({ email, password, context }) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user) => {
      console.log(err, user)
      if (!user) { reject('Invalid credentials.') }

      context.login(user, () => resolve(user));
    })({ body: { email, password } });
  });
};
