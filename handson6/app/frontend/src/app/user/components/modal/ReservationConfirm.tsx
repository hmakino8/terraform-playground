import { useReservation } from "@/user/hooks/useReservation";
import { Separator } from "../ui/Separator";

export const ReservationConfirm = () => {
  const { reservationData, cartItemsDetails } = useReservation();

  const totalPrice = cartItemsDetails.reduce(
    (acc, item) => acc + Math.floor(item.price) * item.quantity,
    0
  );
  const discount = totalPrice * 0.1;
  const totalWithoutDiscount = totalPrice - discount;
  const tax = Math.floor(totalWithoutDiscount * 0.1);
  const total = totalWithoutDiscount + tax;

  return (
    <div className="p-5">
      <div className="pt-5">
        <div className="text-start text-base font-bold">利用方法</div>
        <div className="text-start">
          {reservationData?.is_takein ? "持ち帰り" : "店内"}
        </div>
        <div className="h-[1px] bg-gray-300 my-2"></div>
      </div>
      <div>
        <div className="text-start text-base font-bold">予約時間</div>
        <div className="text-start">
          {reservationData?.reservation_date}{" "}
          {reservationData?.reservation_time_start} ~{" "}
          {reservationData?.reservation_time_end}
        </div>
        <div className="h-[1px] bg-gray-300 my-2"></div>
      </div>
      <div>
        <div className="text-start text-base font-bold">座席番号</div>
        <div className="text-start">{reservationData?.seat}</div>
      </div>
      <div className="h-[1px] bg-gray-300 my-2"></div>
      <div>
        <div className="text-start text-base font-bold">事前注文</div>
        <div className="text-start">
          {reservationData?.is_pre_order ? "あり" : "なし"}
        </div>
        <div className="h-[1px] bg-gray-300 my-2"></div>
      </div>
      <div className="pb-10 text-sm">
        <div className="text-start text-base font-bold">注文内容</div>
        {cartItemsDetails.map((item, index) => (
          <div
            key={item.product_name + index}
            className="text-start flex justify-between"
          >
            <div>
              {item.product_name} {item.size}×{item.quantity}
            </div>
            <div>{Math.floor(item.price)}円</div>
          </div>
        ))}
        <br />
        <div className="text-start flex justify-between text-gray-500">
          <div>本体合計</div>
          <div>{totalPrice}円</div>
        </div>
        <div className="text-start flex justify-between text-gray-500">
          <div>事前注文割引</div>
          <div>-{discount}円</div>
        </div>
        <div className="text-start flex justify-between text-gray-500">
          <div>消費税</div>
          <div>{tax}円</div>
        </div>
        <div className="text-start flex justify-between text-lg ">
          <div>総合計</div>
          <div>{total}円</div>
        </div>
      </div>
    </div>
  );
};
