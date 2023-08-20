import { AuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import jsonwebtoken from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt';
import bcrypt from 'bcrypt';
import { createUserUsingProvider, findUserByEmail } from '@/lib/api';

// Configuration options for authentication
export const authOptions: AuthOptions = {
  providers: [
    // GitHub authentication provider configuration
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    // Google authentication provider configuration
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Credentials authentication provider configuration
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      // Custom authorization logic for credentials-based authentication
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Invalid credentials');
          }
          // Find user by email from GraphQL API
          const user = await findUserByEmail(credentials?.email);
          const isCorrectPassword = await bcrypt.compare(
            credentials?.password,
            user?.password
          );
          if (!isCorrectPassword) {
            throw new Error('Invalid credentials');
          }
          if (user && isCorrectPassword) {
            return user;
          } else {
            throw new Error('User does not exist');
          }
        } catch (error) {
          console.error('Error making GraphQL request:', error);
          throw error;
        }
      },
    }),
  ],

  // Configure JSON Web Token (JWT) encoding and decoding
  jwt: {
    // Encoding function: Create and sign a JWT token
    encode: ({ secret, token }) => {
      return jsonwebtoken.sign(
        {
          ...token,
          iss: 'https://grafbase.com', // Issuer of the token
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60, // Expiration time (1 hour from now)
        },
        secret
      );
    },

    // Decoding function: Verify a JWT token and decode its data
    decode: async ({ secret, token }) => {
      return jsonwebtoken.verify(token!, secret) as JWT;
    },
  },

  // Configure authentication callbacks
  callbacks: {
    // JWT callback: Executed whenever a JWT is created or updated
    async jwt({ profile, token }) {
      let userId;
      if (token) {
        // Find user by email from GraphQL API
        const user = await findUserByEmail(token.email!);
        if (user) {
          userId = user.id;
          token.sub = userId;
        } else {
          // Create a custom user using token data
          let customUser = {
            username: '',
            name: token.name,
            email: token.email,
            image: token.picture,
          };
          // If GitHub profile information is available, use it
          if (profile && 'avatar_url' in profile && 'login' in profile) {
            customUser.image = profile.avatar_url as string;
            token.username = profile.login as string;
          }
          // Create the user and get the user's ID
          const createdUser = await createUserUsingProvider(customUser);
          userId = createdUser;
          token.sub = userId;
        }
      }
      return token;
    },

    // Session callback: Populate session data based on JWT information
    async session({ session, token }) {
      // Find user by email from GraphQL API
      const user = await findUserByEmail(token.email!);
      if (user) {
        const userId = user.id;
        const customUser = {
          username: token.username as string | null | undefined,
          name: token.name,
          email: token.email,
          image: token.picture,
          id: userId as string | null | undefined,
        };
        session.user = customUser; // Set custom user data in the session
      }
      return session;
    },
  },
};
