import { useEffect } from "react";
import { useUIState } from "@/user/hooks/useUIState";
import { useScreen } from "@/user/hooks/useScreen";

export const LoadingSpinner = () => {
  const { setIsLoading, pendingScreen } = useUIState();
  const { setActiveScreen } = useScreen();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (pendingScreen) {
        setActiveScreen(pendingScreen);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed z-[1000] inset-0 max-w-lg mx-auto flex justify-center bg-gray-500/50 items-center shadow-2xl">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-100 rounded-full animate-[spin_2s_ease-in-out_infinite]">
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-gray-200 rounded-full animate-[spin_1s_cubic-bezier(0.6,0.2,0.4,0.8)_infinite] border-t-transparent"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
      </div>
    </div>
  );
};
