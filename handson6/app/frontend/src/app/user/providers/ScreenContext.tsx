import { createContext } from "react";

type ScreenContextType = {
  activeScreen: string | null;
  setActiveScreen: (screen: string | null) => void;
  setActiveScreenCheckAuth: (screen: string | null) => void;
};

export const ScreenContext = createContext<ScreenContextType | undefined>(
  undefined
);
