export type User = {
  username: string;
  email: string;
  role: string;
};

export interface FormField {
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
  autoFocus?: boolean;
}

export interface FormData {
  username: FormField;
  email?: FormField;
  password: FormField;
  password_confirm?: FormField;
}

export type ValidationErrors = {
  [key: string]: string[];
};

export type ModalState = {
  isOpen: boolean;
  result: "ok" | "cancel" | null;
  message: string;
  btnCount: number;
} | null;
