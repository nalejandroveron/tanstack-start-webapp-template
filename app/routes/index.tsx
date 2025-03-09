// app/routes/index.tsx
import * as fs from 'node:fs';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { authClient } from '../lib/auth.client';
import { getSession } from '../lib/auth.server';

const userDetails = createServerFn({
  method: 'GET',
}).handler(() => {
  return getSession();
});

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await userDetails(),
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <div>
      Hello, {state?.user.name ?? 'unknown foreigner'}.
      <div>
        <button
          type="button"
          onClick={() => authClient.signOut().then(() => router.invalidate())}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
