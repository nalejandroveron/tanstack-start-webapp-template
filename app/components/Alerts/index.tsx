import { match } from 'ts-pattern';

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid';

type AlertProps = {
  text: string;
};

type AllAlertsProps = {
  text: string;
  type: 'success' | 'warning' | 'error' | 'info';
};

export const SuccessAlert = ({ text }: AlertProps) => {
  return (
    <div className="rounded-md bg-green-50 p-4">
      <div className="flex">
        <div className="shrink-0">
          <CheckCircleIcon
            aria-hidden="true"
            className="size-5 text-green-400"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">{text}</p>
        </div>
      </div>
    </div>
  );
};

export const WarningAlert = ({ text }: AlertProps) => {
  return (
    <div className="rounded-md bg-yellow-50 p-4">
      <div className="flex">
        <div className="shrink-0">
          <ExclamationTriangleIcon
            aria-hidden="true"
            className="size-5 text-yellow-400"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-yellow-700">{text}</p>
        </div>
      </div>
    </div>
  );
};

export const ErrorAlert = ({ text }: AlertProps) => {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="shrink-0">
          <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-red-800">{text}</p>
        </div>
      </div>
    </div>
  );
};

export const InfoAlert = ({ text }: AlertProps) => {
  return (
    <div className="rounded-md bg-blue-50 p-4">
      <div className="flex">
        <div className="shrink-0">
          <InformationCircleIcon
            aria-hidden="true"
            className="size-5 text-blue-400"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-blue-700">{text}</p>
        </div>
      </div>
    </div>
  );
};

export const Alert = ({ text, type }: AllAlertsProps) =>
  match(type)
    .with('success', () => <SuccessAlert text={text} />)
    .with('warning', () => <WarningAlert text={text} />)
    .with('error', () => <ErrorAlert text={text} />)
    .with('info', () => <InfoAlert text={text} />)
    .exhaustive();
