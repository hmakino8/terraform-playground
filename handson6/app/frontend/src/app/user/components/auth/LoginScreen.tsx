"use client";

import { useLogin } from "@/user/hooks/useLogin";
import { useScreen } from "@/user/hooks/useScreen";
import { AuthForm } from "./AuthForm";

export const LoginScreen = () => {
  const { setActiveScreen } = useScreen();
  const { handleSubmit, loginFormData, formValues, handleChange, message } =
    useLogin();

  return (
    <AuthForm
      formData={loginFormData}
      formValues={formValues}
      messages={{ message: [message] }}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      linkText="アカウントを作成する"
      submitText="ログイン"
      onClick={() => setActiveScreen("Signup")}
    />
  );
};
