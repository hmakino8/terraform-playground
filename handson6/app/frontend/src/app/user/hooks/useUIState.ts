import { useContext } from "react";
import { UIStateContext } from "@/user/providers/UIStateContext";

export const useUIState = () => {
  const context = useContext(UIStateContext);
  if (context === undefined) {
    throw new Error("useUIState must be used within an UIStateProvider");
  }
  return context;
};
