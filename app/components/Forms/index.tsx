import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import type { ComponentType, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { FormError } from './utils';

const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const createForm = <
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  TComponents extends Record<string, ComponentType<any>>,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  TFormComponents extends Record<string, ComponentType<any>>,
>({
  fieldComponents,
  formComponents,
}: { fieldComponents: TComponents; formComponents: TFormComponents }) =>
  createFormHook<TComponents, TFormComponents>({
    fieldContext,
    formContext,
    fieldComponents,
    formComponents,
  });

interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'name' | 'type' | 'clasName'
  > {
  label: string;
  type: 'email' | 'password' | 'search' | 'text' | 'url';
}

export function FormInput({ label, type }: InputProps) {
  const field = useFieldContext<string>();

  return (
    <div>
      <label
        htmlFor={field.name}
        className="block text-sm/6 font-medium text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          type={type}
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          className={twMerge(
            'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6',
            field.state.meta.errors.length &&
              'text-red-900 outline-red-300 placeholder:text-red-300 focus:outline-red-600',
          )}
        />
      </div>
      <FormError
        errors={field.state.meta.errors}
        name={field.name}
        label={label}
      />
    </div>
  );
}

export function FormSubmit({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-600/40"
        >
          {label}
        </button>
      )}
    </form.Subscribe>
  );
}
