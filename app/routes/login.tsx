import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { type } from 'arktype';
import { Alert } from '../components/Alerts';
import { FormInput, FormSubmit, createForm } from '../components/Forms';
import { authClient } from '../lib/auth.client';
import useMutation from '../lib/useMutation';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  validateSearch: type({
    'state?': type('"SIGNUP_OK"'),
  }),
});

const { useAppForm } = createForm({
  fieldComponents: { FormInput },
  formComponents: { FormSubmit },
});

const loginSchema = type({
  email: type('string.email').describe('a valid email'),
  password: type.string.atLeastLength(8).describe('a valid password'),
});

const states = {
  SIGNUP_OK: 'Account Created Successfully, check your email to validate.',
};

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [state, mutate] = useMutation((value: typeof loginSchema.infer) =>
    authClient.signIn.email({
      email: value.email,
      password: value.password,
    }),
  );

  const form = useAppForm({
    validators: { onChange: loginSchema },
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await mutate(value);
      navigate({ to: '/' });
    },
  });

  const messageType = state.value?.error?.message ? 'error' : 'info';
  const message =
    state.value?.error?.message || (search?.state && states[search?.state]);

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
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm/6 text-gray-500">
              Not a member?{' '}
              <Link
                to="/signup"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Sign up
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
                  name="email"
                  children={(field) => (
                    <field.FormInput
                      label="Email address"
                      type="email"
                      autoComplete="email"
                    />
                  )}
                />
                <form.AppField
                  name="password"
                  children={(field) => (
                    <field.FormInput
                      label="Password"
                      type="password"
                      autoComplete="current-password"
                    />
                  )}
                />

                <div className="flex items-center justify-end">
                  <div className="text-sm/6">
                    <Link
                      to="/forgot-password"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div>
                  {message && <Alert type={messageType} text={message} />}
                </div>
                <div>
                  <form.AppForm
                    children={<form.FormSubmit label="Sign in" />}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block bg-linear-to-br transition-all from-[#2C5364] via-[#203A43] to-[#0F2027]" />
    </div>
  );
}
