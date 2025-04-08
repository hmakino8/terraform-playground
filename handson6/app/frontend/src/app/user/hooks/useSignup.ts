import { useState, ChangeEvent, FormEvent } from "react";
import { signupFormData } from "@/user/config";
import type { ValidationErrors } from "@/user/types";
import { useUIState } from "@/user/hooks/useUIState";
import { POPUP } from "@/user/constants";
import { apiClient } from "@/user/api/commonApi";

export const useSignup = () => {
  const { setPopUp, handleScreenTransition } = useUIState();
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
  });

  const [messages, setMessages] = useState<ValidationErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const csrfResponse = await apiClient.get("/get-csrf-token/");
      const { csrfToken } = csrfResponse.data;

      const response = await apiClient.post("/signup/", formValues, {
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });

      const data: ValidationErrors = await response.data;
      console.log(data);

      if (response.ok) {
        handleScreenTransition("Login");
        setPopUp(POPUP.signup);
      } else {
        const errorMessages: ValidationErrors = {};

        for (const [field, errors] of Object.entries(data)) {
          errorMessages[field] = errors;
        }
        if (formValues.password != formValues.password_confirm) {
          errorMessages["password_confirm"] = ["パスワードが一致していません"];
        }
        setMessages(errorMessages);
      }
    } catch (error) {
      console.error("アカウント作成失敗", error);
      setMessages({
        "signup error": ["※アカウント作成中にエラーが発生しました。"],
      });
    }
  };

  return {
    handleSubmit,
    handleChange,
    formValues,
    messages,
    signupFormData,
  };
};
