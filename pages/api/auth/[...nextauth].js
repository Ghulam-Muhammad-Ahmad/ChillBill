import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '../../../lib/auth'; // Import utility
import User from '../../../models/User';
import connect from '../../../lib/mongodb';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connect();
        const { email, password } = credentials;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('No user found with the provided email');
        }

        // Validate password
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        // Return the user object with required details
        return {
          email: user.email,
          username: user.username,
          currency: user.currency,
        };
      },
    }),
  ],

  session: {
    jwt: true,
    maxAge: 24 * 60 * 60, // Session lasts for 24 hours
  },

  callbacks: {
    // Handle JWT updates
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Store the user details in the token when logging in or when the user data changes
        token.email = user.email;
        token.username = user.username;
        token.currency = user.currency;
      }

      // If the trigger is 'update', refresh the token with new user data
      if (trigger === 'update') {
        // If the user is being updated, make sure to update relevant fields
        token.username = user.username;
        token.currency = user.currency;
      }

      // Optionally extend JWT expiration (example: 6 days)
      if (token.iat && Date.now() - token.iat * 1000 > 6 * 24 * 60 * 60 * 1000) {
        token.exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // Extend for 7 days
      }

      return token;
    },

    // Handle session updates
    async session({ session, token }) {
      session.user.email = token.email;
      session.user.username = token.username; // Set updated username in session
      session.user.currency = token.currency; // Set updated currency in session
      return session;
    },
  },

  events: {
    async createUser(message) {
      console.log('A new user has been created:', message);
    },
  },
});
