import { useScreen } from "@/user/hooks/useScreen";
import { useAuth } from "@/user/hooks/useAuth";
import { SCREEN_TITLES } from "@/user/constants";
import { NavigationButton } from "../ui/NavigationButton";
import { PopUp } from "../ui/PopUp";

export const Header = () => {
  const { activeScreen, setActiveScreen } = useScreen();

  const HeaderForOtherFeatures = () => {
    const handleOnClick = () => {
      const nextScreen =
        activeScreen === "SelectedProductScreen" ? "Menu" : "Home";
      setActiveScreen(nextScreen);
    };

    const title = activeScreen
      ? SCREEN_TITLES[activeScreen as keyof typeof SCREEN_TITLES]
      : "";

    const CloseOrBackIcon = "close";

    return (
      <div className="flex text-lg my-1">
        {activeScreen !== "Menu" && activeScreen !== "Reservation" && (
          <button
            className="flex hover:bg-gray-100 transition-all duration-200 rounded-full w-8 h-8 items-center justify-center"
            onClick={handleOnClick}
          >
            <span className="material-symbols-outlined">{CloseOrBackIcon}</span>
          </button>
        )}
        <div className="fixed left-1/2 -translate-x-1/2">{title}</div>
      </div>
    );
  };

  const HeaderForHome = () => {
    const { user } = useAuth();
    const { setActiveScreenCheckAuth } = useScreen();
    const greeting = "こんにちは" + (user ? `、${user.username}さん` : "");

    return (
      <div className="flex justify-between items-center my-1">
        <div className="text-black text-lg">{greeting}</div>
        <div className="flex">
          <NavigationButton
            icon="account_circle"
            label="Account"
            onClick={() => setActiveScreenCheckAuth("Account")}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="z-[500] fixed top-[-2px] left-0 right-0 max-w-lg px-3 mx-auto bg-white border-b-1 text-black h-10 shadow-md">
      {activeScreen !== "Home" ? <HeaderForOtherFeatures /> : <HeaderForHome />}
      <PopUp />
    </div>
  );
};
