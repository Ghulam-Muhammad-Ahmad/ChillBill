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

        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('No user found with the provided email');
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        return { email: user.email }; // Return the user object
      },
    }),
  ],
  session: {
    jwt: true,
    maxAge: 24 * 60 * 60, // Set session max age to 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.iat = Date.now(); // Store the issued time
      }

      // Optional: Extend JWT expiration (e.g., 7 days)
      if (token.iat && Date.now() - token.iat > 6 * 24 * 60 * 60 * 1000) { // 6 days
        token.exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // Set expiration to 7 days
      }

      return token;
    },
    async session({ session, token }) {
      session.user.email = token.email;
      return session;
    },
  },
});