import { FormEvent, ChangeEvent } from "react";
import type { FormData, ValidationErrors } from "@/user/types";

type AuthFormProps = {
  formData: FormData;
  formValues: Record<string, string>;
  messages: ValidationErrors;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  linkText: string;
  submitText: string;
  onClick: () => void;
};

export const AuthForm = ({
  formData,
  formValues,
  messages,
  handleSubmit,
  handleChange,
  linkText,
  submitText,
  onClick,
}: AuthFormProps) => {
  return (
    <form
      method="post"
      noValidate
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <LoginErrorMessage
        isError={(submitText === "ログイン" && messages?.message) as boolean}
        message={messages?.message}
      />
      {Object.entries(formData).map(([key, field]) => (
        <div key={key} className="mb-4">
          <input
            type={field.type}
            name={field.name}
            value={formValues[key as keyof typeof formValues]}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            autoFocus={field.autoFocus}
            className="w-full bg-gray-100 p-2 border-b transition-colors duration-300 focus:border-b-1 focus:border-blue-500 focus:outline-none"
          />
          <SignupErrorMessage
            isError={messages[key]?.length > 0}
            message={messages[key]}
          />
        </div>
      ))}
      <div className="flex justify-between items-center">
        <button
          type="button"
          className={"text-blue-500 hover:text-blue-400"}
          onClick={onClick}
        >
          {linkText}
        </button>
        <button
          type="submit"
          className={`${
            submitText === "ログイン" ? "btn-blue-small" : "btn-green-small"
          }`}
        >
          {submitText}
        </button>
      </div>
    </form>
  );
};

const LoginErrorMessage = ({
  isError,
  message,
}: {
  isError: boolean;
  message: string[] | undefined;
}) => {
  if (isError)
    return (
      <div className="py-2 text-red-500 text-sm text-center">{message}</div>
    );
};

const SignupErrorMessage = ({
  isError,
  message,
}: {
  isError: boolean;
  message: string[] | undefined;
}) => {
  if (isError)
    return (
      <div className="py-2 text-red-500 text-sm text-center">{message}</div>
    );
};
