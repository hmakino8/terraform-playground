import { useContext } from "react";
import { ScreenContext } from "@/user/providers/ScreenContext";

export const useScreen = () => {
  const context = useContext(ScreenContext);

  if (context === undefined) {
    throw new Error("useScreen must be used within an ScreenProvider");
  }
  return context;
};
