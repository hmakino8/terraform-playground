"use client";

import { useSignup } from "@/user/hooks/useSignup";
import { useScreen } from "@/user/hooks/useScreen";
import { AuthForm } from "./AuthForm";

export const SignupScreen = () => {
  const { setActiveScreen } = useScreen();
  const { handleSubmit, signupFormData, formValues, handleChange, messages } =
    useSignup();

  return (
    <AuthForm
      formData={signupFormData}
      formValues={formValues}
      messages={messages}
      linkText="ログイン画面に戻る"
      submitText="登録"
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      onClick={() => setActiveScreen("Login")}
    />
  );
};
