import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { jwt } from 'better-auth/plugins';

const client =
  globalThis.mongoClient || new MongoClient(process.env.MONGO_DB_CLIENT_ID);

if (!globalThis.mongoClient) {
  globalThis.mongoClient = client;
}

const db = client.db('onlinelibrary');

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },

  plugins: [jwt()],

  session: {
    cookieCache: {
      enabled: true,
      strategy: 'jwt',
      maxAge: 60 * 60 * 24 * 7,
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
      requireLocalEmailVerified: false,
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),
});
