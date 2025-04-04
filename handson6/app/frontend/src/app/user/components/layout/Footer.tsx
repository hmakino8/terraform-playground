import { NavigationButton } from "../ui/NavigationButton";
import { useScreen } from "@/user/hooks/useScreen";

export const Footer = () => {
  const { activeScreen, setActiveScreen, setActiveScreenCheckAuth } =
    useScreen();

  const isHidden =
    activeScreen === "Login" ||
    activeScreen === "Signup" ||
    activeScreen === "Account" ||
    activeScreen === "SelectedProductScreen";

  if (isHidden) return null;

  return (
    <div className="z-[500] fixed bottom-5 py-2 left-0 right-0 w-60 bg-gray-50/50 backdrop-blur-md m-auto flex items-center rounded-full shadow-lg">
      <div className="w-full flex">
        <NavigationButton
          icon="home"
          label="Home"
          isActive={activeScreen === "Home"}
          onClick={() => setActiveScreen("Home")}
        />
        <NavigationButton
          icon="menu_book"
          label="Menu"
          isActive={activeScreen === "Menu"}
          onClick={() => setActiveScreen("Menu")}
        />
        <NavigationButton
          icon="calendar_month"
          label="Reserve"
          isActive={activeScreen === "Reservation"}
          onClick={() => setActiveScreenCheckAuth("Reservation")}
        />
      </div>
    </div>
  );
};
