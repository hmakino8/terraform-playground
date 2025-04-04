import { useState, useEffect } from "react";
import { useScreen } from "@/user/hooks/useScreen";
import { Separator } from "../ui/Separator";
import { SelectButton } from "../ui/SelectButton";
import { Calendar } from "../Calendar/Calendar";
import { useCalendar } from "@/user/hooks/useCalendar";
import { useReservation } from "@/user/hooks/useReservation";
import { useUIState } from "@/user/hooks/useUIState";
import { format } from "date-fns";

export const ReservationScreen = () => {
  const [isTakein, setIsTakein] = useState(true);
  const [isPreOrder, setIsPreOrder] = useState(true);
  const { isCalendarOpen, setIsCalendarOpen, reservationTime } = useCalendar();
  const { setActiveScreenCheckAuth } = useScreen();
  const {
    cart,
    handleDeleteCartItem,
    setReservationData,
    setCartItemsDetails,
  } = useReservation();
  const { selectedSeat, setSelectedSeat } = useReservation();
  const { selectedDate } = useCalendar();
  const { handleModalOpen } = useUIState();

  useEffect(() => {
    if (!isTakein && !isPreOrder) {
      setIsPreOrder(true);
    }
  }, [isTakein, isPreOrder]);

  const ToggleCalendarButton = () => {
    return (
      <div className="mb-5">
        <p className="text-[14px] font-bold">・予約日時</p>
        {reservationTime && (
          <div>
            <p className="font-bold text-[12px] mr-10 text-red-500">
              ※選択した日時は予約確定後に確保されます。
            </p>
          </div>
        )}
        <div className="flex items-center justify-start">
          <button
            className="flex items-center justify-start text-start text-blue-500 hover:text-blue-400"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            <span className="material-symbols-outlined mr-1 p-2">
              calendar_month
            </span>
          </button>
          {reservationTime ? (
            <div className="flex items-center justify-start w-full">
              <p className="w-4/5">{reservationTime}</p>
              <button className="flex justify-center items-center border border-gray-200 rounded-full w-5 h-5 hover:bg-gray-200">
                <span className="material-symbols-outlined text-gray-400">
                  remove
                </span>
              </button>
            </div>
          ) : (
            <div>予約時間を選択してください</div>
          )}
        </div>
      </div>
    );
  };

  const ProductCart = () => {
    return (
      <>
        <p className="text-[14px] font-bold">・商品カート</p>
        <button
          className="flex items-center justify-start w-full text-start text-blue-500 hover:text-blue-400"
          onClick={() => setActiveScreenCheckAuth("Menu")}
        >
          <span className="material-symbols-outlined mr-1 p-2">add_circle</span>
          <p className="text-base">商品を追加</p>
        </button>
        {cart.map((cartItem, index) => (
          <div
            className="flex items-center justify-start text-base w-full mb-2"
            key={index}
          >
            <div className="w-3/5">
              {cartItem.product.name}({cartItem.size})
            </div>
            <div className="flex w-1/5">
              <p className="">×{cartItem.quantity}</p>
            </div>
            <button
              className="flex justify-center items-center border border-gray-200 rounded-full w-5 h-5 hover:bg-gray-200"
              onClick={() => handleDeleteCartItem(cartItem.id)}
            >
              <span className="material-symbols-outlined text-gray-400">
                remove
              </span>
            </button>
          </div>
        ))}
      </>
    );
  };

  const SelectSeatButton = () => {
    return (
      <>
        <p className="text-[14px] font-bold">・座席選択</p>
        <div className="flex justify-start items-center my-2 mx-auto text-white">
          <SelectButton
            isSelected={selectedSeat === 1}
            setIsSelected={() => setSelectedSeat(1)}
            size="S"
            btnText="席1"
            location="left"
          />
          <SelectButton
            isSelected={selectedSeat === 2}
            setIsSelected={() => setSelectedSeat(2)}
            size="S"
            btnText="席2"
            location="center"
          />
          <SelectButton
            isSelected={selectedSeat === 3}
            setIsSelected={() => setSelectedSeat(3)}
            size="S"
            btnText="席3"
            location="center"
          />
          <SelectButton
            isSelected={selectedSeat === 4}
            setIsSelected={() => setSelectedSeat(4)}
            size="S"
            btnText="席4"
            location="right"
          />
        </div>
        <div className="flex justify-start items-center my-2 mx-auto text-white">
          <SelectButton
            isSelected={selectedSeat === 5}
            setIsSelected={() => setSelectedSeat(5)}
            size="S"
            btnText="席5"
            location="left"
          />
          <SelectButton
            isSelected={selectedSeat === 6}
            setIsSelected={() => setSelectedSeat(6)}
            size="S"
            btnText="席6"
            location="center"
          />
          <SelectButton
            isSelected={selectedSeat === 7}
            setIsSelected={() => setSelectedSeat(7)}
            size="S"
            btnText="席7"
            location="center"
          />
          <SelectButton
            isSelected={selectedSeat === 8}
            setIsSelected={() => setSelectedSeat(8)}
            size="S"
            btnText="席8"
            location="right"
          />
        </div>
      </>
    );
  };

  const handleReservation = async () => {
    try {
      const reservationData = {
        cart_items: cart
          .map((cartItem) => cartItem.id)
          .filter((id): id is number => id !== undefined),
        is_takein: isTakein,
        is_pre_order: isPreOrder,
        reservation_date: selectedDate?.start
          ? format(selectedDate.start, "yyyy-MM-dd")
          : "",
        reservation_time_start: selectedDate?.start
          ? format(selectedDate.start, "HH:mm")
          : "",
        reservation_time_end: selectedDate?.end
          ? format(selectedDate.end, "HH:mm")
          : "",
        seat: selectedSeat,
      };
      setReservationData(reservationData);

      const cartItemsWithDetails = cart.map((cartItem) => ({
        product_name: cartItem.product.name,
        size: cartItem.size,
        quantity: cartItem.quantity,
        price:
          cartItem.size === "S"
            ? cartItem.product.price_s
            : cartItem.size === "M"
            ? cartItem.product.price_m
            : cartItem.product.price_l,
      }));
      setCartItemsDetails(cartItemsWithDetails);
      console.log("cartItemsWithDetails", cartItemsWithDetails);
      handleModalOpen("予約を確定してよろしいですか？", 2);
    } catch (error) {
      console.error("予約の作成に失敗しました", error);
    }
  };

  return (
    <div>
      <p className="text-[14px] font-bold">・ご利用方法</p>
      <div className="flex justify-start items-center my-2 mx-auto text-white">
        <SelectButton
          isSelected={isTakein}
          setIsSelected={() => setIsTakein(!isTakein)}
          size="L"
          btnText="店内"
          location="left"
          disabled={false}
        />
        <SelectButton
          isSelected={!isTakein}
          setIsSelected={() => setIsTakein(!isTakein)}
          size="L"
          btnText="持ち帰り"
          location="right"
          disabled={false}
        />
      </div>
      <Separator />

      <p className="text-[14px] font-bold">・事前注文</p>
      <div className="flex justify-start items-center my-2 mx-auto text-white">
        <SelectButton
          isSelected={isPreOrder}
          setIsSelected={() => setIsPreOrder(!isPreOrder)}
          size="S"
          btnText="有"
          location="left"
          disabled={!isTakein}
        />
        <SelectButton
          isSelected={!isPreOrder}
          setIsSelected={() => setIsPreOrder(!isPreOrder)}
          size="S"
          btnText="無"
          location="right"
          disabled={!isTakein}
        />
      </div>
      <Separator />

      {isPreOrder && <ProductCart />}

      <Separator />

      {isTakein && (
        <>
          <SelectSeatButton />
          <Separator />
        </>
      )}

      <ToggleCalendarButton />
      <div className="w-full">
        {isCalendarOpen && <Calendar />}

        <Separator />
      </div>

      <div className="flex justify-end">
        <button
          className="btn-green-wide text-white"
          onClick={handleReservation}
        >
          内容を確認する
        </button>
      </div>
    </div>
  );
};
