import { useUIState } from "@/user/hooks/useUIState";
import { ReservationConfirm } from "@/user/components/modal/ReservationConfirm";
import { useScreen } from "@/user/hooks/useScreen";
import { useReservation } from "@/user/hooks/useReservation";
import { reservationApi, ReservationData } from "@/user/api/reservationApi";

export const Modal = () => {
  const { modalState, handleModalClose, setPopUp } = useUIState();
  const modalHeight = modalState?.btnCount === 2 ? "" : "h-[150px]";
  const modalWidth = modalState?.btnCount === 2 ? "w-[400px]" : "w-[300px]";
  const btnLocate = modalState?.btnCount === 2 ? "right-40" : "right-24";
  const { activeScreen, setActiveScreen } = useScreen();
  const { reservationData, setReservationData } = useReservation();
  const { createReservation } = reservationApi;

  // ... existing code ...

  const handleModalOk = async () => {
    if (activeScreen === "Reservation") {
      try {
        await createReservation(reservationData as ReservationData);
        setReservationData(reservationData);
        setActiveScreen("Home");
        setPopUp("予約が完了しました。");
        handleModalClose("ok");
      } catch (error) {
        console.error("予約の登録に失敗しました:", error);
      }
    }
    handleModalClose("ok");
  };

  // ... existing code ...

  return (
    <div className="relative">
      <div
        className={`bg-white p-4 ${modalWidth} ${modalHeight} rounded-md border border-gray-300 shadow-xl`}
      >
        <p className="text-center pt-5">{modalState?.message}</p>
        {modalState?.btnCount === 2 && <ReservationConfirm />}
        <div className="flex justify-end">
          {modalState?.btnCount === 2 && (
            <button
              className={`absolute bottom-5 ${btnLocate} text-blue-500 text-sm rounded-md hover:text-blue-400`}
              onClick={() => handleModalClose("cancel")}
            >
              {modalState?.btnCount === 2 ? "戻る" : "キャンセル"}
            </button>
          )}
          <button
            className="absolute bottom-5 right-10 text-blue-500 text-sm rounded-md hover:text-blue-400"
            onClick={handleModalOk}
          >
            {modalState?.btnCount === 2 ? "予約確定" : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
};
