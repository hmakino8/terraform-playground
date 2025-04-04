import { AnimatePresence, motion } from "framer-motion";
import { useScreen } from "@/user/hooks/useScreen";
import { useUIState } from "@/user/hooks/useUIState";
import { HomeScreen } from "../home/HomeScreen";
import { UserProfileScreen } from "../userProfile/UserProfileScreen";
import { LoginScreen } from "../auth/LoginScreen";
import { SignupScreen } from "../auth/SignupScreen";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { MenuScreen } from "../menu/MenuScreen";
import { ReservationScreen } from "../reservation/ReservationScreen";
import { SelectedProductScreen } from "../menu/SelectedProductScreen";
import { Modal } from "../modal/Modal";

export const ScreenHub = () => {
  const { activeScreen } = useScreen();
  const { isLoading } = useUIState();
  const { modalState } = useUIState();

  return (
    <AnimatePresence>
      {isLoading && <LoadingSpinner />}

      {modalState?.isOpen && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0 }}
          className="fixed z-[1000] inset-0 max-w-lg mx-auto flex justify-center bg-black/40 items-center shadow-2xl"
        >
          {modalState?.isOpen && <Modal />}
        </motion.div>
      )}

      {(activeScreen === "Home" || activeScreen === "Account") && (
        <motion.div
          key="Home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0 }}
          className="screen-layout pt-10 px-0 bg-orange-50 z-0"
        >
          <HomeScreen />
        </motion.div>
      )}

      {activeScreen === "Account" && (
        <motion.div
          key="Account"
          initial={{ y: 1000 }}
          animate={{ y: 0 }}
          exit={{ y: 1000 }}
          transition={{ duration: 0.3 }}
          className="screen-layout bg-gray-100"
        >
          <UserProfileScreen />
        </motion.div>
      )}

      {activeScreen === "Login" && (
        <motion.div
          key="Login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="screen-layout bg-gray-100"
        >
          <LoginScreen />
        </motion.div>
      )}

      {activeScreen === "Signup" && (
        <motion.div
          key="Signup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="screen-layout bg-gray-100"
        >
          <SignupScreen />
        </motion.div>
      )}

      {(activeScreen === "Menu" ||
        activeScreen === "SelectedProductScreen" ||
        activeScreen === "Reservation" ||
        activeScreen === "Calendar") && (
        <>
          <motion.div
            key="Menu"
            initial={{ opacity: 0 }}
            animate={{
              opacity: activeScreen === "Menu" ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0 }}
            className="screen-layout bg-white"
          >
            <MenuScreen />
          </motion.div>

          <motion.div
            key="SelectedProductScreen"
            initial={{ opacity: 0, y: -1000 }}
            animate={{
              opacity: activeScreen === "SelectedProductScreen" ? 1 : 0,
              y: activeScreen === "SelectedProductScreen" ? 0 : 1000,
            }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0 }}
            className="screen-layout bg-white"
          >
            <SelectedProductScreen />
          </motion.div>

          <motion.div
            key="Reservation"
            initial={{ opacity: 0 }}
            animate={{
              opacity: activeScreen === "Reservation" ? 1 : 0,
              x: activeScreen === "Reservation" ? 0 : 1000,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="screen-layout bg-gray-100"
          >
            <ReservationScreen />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
