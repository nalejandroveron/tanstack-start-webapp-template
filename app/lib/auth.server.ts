import { redirect } from '@tanstack/react-router';
import { getWebRequest } from '@tanstack/react-start/server';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization } from 'better-auth/plugins';
import { eq } from 'drizzle-orm';
import { db } from '../../db';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // or 'mysql', 'sqlite'
  }),
  databaseHooks: {
    session: {
      create: {},
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      //FIXME: Implement Reset Password Email.
      console.log('Reset password Email to: ', user.email);
      console.log('URL: ', url);
      console.log('Token: ', token);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      //FIXME: Implement Verification Email.
      console.log('Verification Email to: ', user.email);
      console.log('URL: ', url);
      console.log('Token: ', token);
    },
  },
  plugins: [
    organization({
      // Organization Creation happen on signup automatically.
      allowUserToCreateOrganization: false,
    }),
  ],
});

export const getSession = async () => {
  const request = getWebRequest();

  if (request) {
    const session = await auth.api.getSession({
      headers: request?.headers,
    });

    if (session) return session;
  }

  throw redirect({ to: '/login', replace: true });
};
