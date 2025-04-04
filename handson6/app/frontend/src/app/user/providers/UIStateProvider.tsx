import { useState } from "react";
import { UIStateContext } from "./UIStateContext";
import { ModalState } from "@/user/types";

export const UIStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [popUp, setPopUp] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingScreen, setPendingScreen] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState | null>(null);

  const handleScreenTransition = (screen: string | null) => {
    setIsLoading(true);
    setPendingScreen(screen);
  };

  const handleModalOpen = (message: string, btnCount: number) => {
    setModalState({
      isOpen: true,
      result: null,
      message,
      btnCount,
    });
  };

  const handleModalClose = (result: "ok" | "cancel") => {
    setModalState({ isOpen: false, result, message: "", btnCount: 0 });
  };

  const resetModal = () => {
    setModalState(null);
  };

  return (
    <UIStateContext.Provider
      value={{
        popUp,
        setPopUp,
        isLoading,
        setIsLoading,
        pendingScreen,
        handleScreenTransition,
        modalState,
        setModalState,
        handleModalOpen,
        handleModalClose,
        resetModal,
      }}
    >
      {children}
    </UIStateContext.Provider>
  );
};
