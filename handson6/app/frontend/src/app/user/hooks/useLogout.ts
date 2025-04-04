import { POPUP } from "@/user/constants";
import { useAuth } from "./useAuth";
import { useUIState } from "./useUIState";
import { useReservation } from "@/user/hooks/useReservation";

export const useLogout = () => {
  const { logout } = useAuth();
  const { handleScreenTransition, setPopUp } = useUIState();
  const { setReservationData } = useReservation();

  const handleLogout = async () => {
    try {
      await logout();
      handleScreenTransition("Home");
      setPopUp(POPUP["logout"]);
      setReservationData(null);
    } catch (error) {
      console.error("ERROR: handleLogout");
    }
  };
  return { handleLogout };
};
