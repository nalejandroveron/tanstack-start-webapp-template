export function FormError({
  errors,
  name,
  label,
}: { errors: string[]; name: string; label: string }) {
  return errors.length ? (
    <p className="mt-2 text-xs text-red-600" id="email-error">
      {errors?.map((err) => String(err).replace(name, label)).join(', ')}.
    </p>
  ) : null;
}
