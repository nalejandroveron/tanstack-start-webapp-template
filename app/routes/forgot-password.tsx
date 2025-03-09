import { Link, createFileRoute } from '@tanstack/react-router';
import { type } from 'arktype';
import { Alert } from '../components/Alerts';
import { FormInput, FormSubmit, createForm } from '../components/Forms';
import { authClient } from '../lib/auth.client';
import useMutation from '../lib/useMutation';

export const Route = createFileRoute('/forgot-password')({
  component: RouteComponent,
});

const { useAppForm } = createForm({
  fieldComponents: { FormInput },
  formComponents: { FormSubmit },
});

const forgotPasswordSchema = type({
  email: type('string.email').describe('a valid email'),
});

function RouteComponent() {
  const [state, mutate] = useMutation(
    (value: typeof forgotPasswordSchema.infer) =>
      authClient.forgetPassword({
        email: value.email,
      }),
  );

  const form = useAppForm({
    validators: { onChange: forgotPasswordSchema },
    defaultValues: {
      email: '',
    },
    onSubmit: ({ value }) => mutate(value),
  });

  const hasMessage = state.value?.error?.message || state.value?.data?.status;
  const messageType = state.value?.error?.message ? 'error' : 'info';
  const message =
    state.value?.error?.message || 'Check your email for further instructions.';

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
              Recover Password
            </h2>
            <p className="mt-2 text-sm/6 text-gray-500">
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Go back to login
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

                <div>
                  {hasMessage && <Alert type={messageType} text={message} />}
                </div>
                <div>
                  <form.AppForm children={<form.FormSubmit label="Send" />} />
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
