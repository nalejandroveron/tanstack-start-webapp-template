import { createFormHook } from '@tanstack/react-form';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { type } from 'arktype';
import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { member, organization } from '../../db/auth-schema';
import { FormInput, FormSubmit, createForm } from '../components/Forms';
import { auth } from '../lib/auth.server';

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
});

const signupSchema = type({
  userName: type.string.atLeastLength(1).describe('a valid username'),
  userEmail: type('string.email').describe('a valid email'),
  userPassword: type.string.atLeastLength(8).describe('a valid password'),
  organizationName: type.string
    .atLeastLength(1)
    .describe('a valid organization name'),
});

const signup = createServerFn({
  method: 'POST',
})
  .validator(signupSchema)
  .handler(async ({ data }) => {
    const { user } = await auth.api.signUpEmail({
      body: {
        name: data.userName,
        email: data.userEmail,
        password: data.userPassword,
      },
    });

    const org = await db
      .insert(organization)
      .values({
        id: sql`gen_random_uuid()`,
        createdAt: sql`now()`,
        name: data.organizationName,
        slug: `${data.organizationName.replaceAll(' ', '-').toLowerCase()}-${user.id}`,
      })
      .returning({ id: organization.id });

    await db.insert(member).values({
      id: sql`gen_random_uuid()`,
      organizationId: org[0].id,
      userId: user.id,
      role: 'owner',
      createdAt: sql`now()`,
    });
  });

const { useAppForm } = createForm({
  fieldComponents: { FormInput },
  formComponents: { FormSubmit },
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });

  const form = useAppForm({
    validators: { onChange: signupSchema },
    defaultValues: {
      userName: '',
      userEmail: '',
      userPassword: '',
      organizationName: '',
    },
    onSubmit: async ({ value }) => {
      await signup({ data: value });
      navigate({ to: '/login', search: { state: 'SIGNUP_OK' } });
    },
  });

  return (
    <div className="flex min-h-full flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              alt="Your Company"
              src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              className="h-10 w-auto"
            />
            <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">
              Create an account
            </h2>
            <p className="mt-2 text-sm/6 text-gray-500">
              Already a member?{' '}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <div>
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <form.AppField
                  name="organizationName"
                  children={(field) => (
                    <field.FormInput label="Organization Name" type="text" />
                  )}
                />
                <form.AppField
                  name="userName"
                  children={(field) => (
                    <field.FormInput label="User Name" type="text" />
                  )}
                />
                <form.AppField
                  name="userEmail"
                  children={(field) => (
                    <field.FormInput label="Email address" type="email" />
                  )}
                />
                <form.AppField
                  name="userPassword"
                  children={(field) => (
                    <field.FormInput label="Password" type="password" />
                  )}
                />
                <form.AppForm children={<form.FormSubmit label="Sign Up" />} />
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block bg-linear-to-br transition-all from-[#2C5364] via-[#203A43] to-[#0F2027]" />
    </div>
  );
}
