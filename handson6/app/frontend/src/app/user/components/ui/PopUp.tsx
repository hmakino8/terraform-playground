import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIState } from "@/user/hooks/useUIState";

export const PopUp = () => {
  const { popUp, setPopUp, isLoading } = useUIState();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPopUp(undefined);
    }, 3000);

    return () => clearTimeout(timer);
  }, [popUp, setPopUp]);

  return (
    <AnimatePresence mode="wait">
      {popUp && !isLoading && (
        <motion.div
          className="absolute top-10 left-0 right-0 w-full flex items-center justify-center bg-white/80 text-green-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <span className="material-symbols-outlined">check_circle</span>
          {popUp}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
