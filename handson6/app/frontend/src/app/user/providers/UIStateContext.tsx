import { createContext } from "react";
import { ModalState } from "@/user/types";

type UIStateContextType = {
  popUp: string | undefined;
  setPopUp: (popUp: string | undefined) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  pendingScreen: string | null;
  handleScreenTransition: (screen: string | null) => void;
  modalState: ModalState;
  setModalState: (modalState: ModalState) => void;
  handleModalOpen: (message: string, btnCount: number) => void;
  handleModalClose: (result: "ok" | "cancel") => void;
  resetModal: () => void;
};

export const UIStateContext = createContext<UIStateContextType | undefined>(
  undefined
);
