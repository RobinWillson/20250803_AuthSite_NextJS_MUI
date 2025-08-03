import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import { generateToken } from './tokenUtils.js';

const configurePassport = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const googleEmail = profile.emails[0].value.toLowerCase();

      // Find user by googleId first. This is the fastest path for returning users.
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        // If no user with that googleId, check if an account with that email already exists.
        // This handles linking a Google account to an existing email/password account.
        user = await User.findOne({ email: googleEmail });

        if (user) {
          // User exists, link their googleId to this account for future logins.
          user.googleId = profile.id;
        } else {
          // If no user found at all, create a brand new user.
          const isAdmin = googleEmail === 'robinheck101@gmail.com';
          user = new User({
            googleId: profile.id,
            email: googleEmail,
            name: profile.displayName,
            isAdmin: isAdmin,
          });
        }
        await user.save(); // Save the new user or the updated user with the linked googleId
      }

      const token = generateToken(user);
      return done(null, { user, token });
    } catch (error) {
      return done(error, null);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
};

export default configurePassport;