import { useState } from "react";
import { User } from "@/user/types";
import { POPUP } from "@/user/constants";
import { loginFormData } from "@/user/config";
import { useAuth } from "./useAuth";
import { useUIState } from "./useUIState";

export const useLogin = () => {
  const { login, setUser } = useAuth();
  const { setPopUp, handleScreenTransition } = useUIState();
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userData: User | null = await login(
        formValues.username,
        formValues.password
      );
      setUser(userData);
      handleScreenTransition("Home");
      setPopUp(POPUP.login);
    } catch (error) {
      setMessage("メールアドレスもしくはパスワードが正しくありません");
    }
  };
  return {
    handleSubmit,
    handleChange,
    formValues,
    message,
    loginFormData,
  };
};
