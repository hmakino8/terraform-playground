import { useState } from "react";
import { ScreenContext } from "./ScreenContext";
import { useAuth } from "@/user/hooks/useAuth";

export const ScreenProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeScreen, setActiveScreen] = useState<string | null>("Home");
  const { user } = useAuth();
  const setActiveScreenCheckAuth = (screen: string | null) => {
    if (user) {
      setActiveScreen(screen);
    } else {
      setActiveScreen("Login");
    }
  };

  // useEffect(() => {
  //   if (activeScreen !== "Home") {
  //     document.body.classList.add("overflow-hidden");
  //   } else {
  //     document.body.classList.remove("overflow-hidden");
  //   }
  //   console.log(activeScreen);
  // }, [activeScreen]);

  return (
    <ScreenContext.Provider
      value={{ activeScreen, setActiveScreen, setActiveScreenCheckAuth }}
    >
      {children}
    </ScreenContext.Provider>
  );
};
