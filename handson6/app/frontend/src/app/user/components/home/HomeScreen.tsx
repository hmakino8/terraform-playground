import { lato } from "@/user/config";
import { useAuth } from "@/user/hooks/useAuth";
import { AuthPromptBar } from "../ui/AuthPromptBar";
import { Separator } from "../ui/Separator";
import { useScreen } from "@/user/hooks/useScreen";
import { useReservation } from "@/user/hooks/useReservation";

export const HomeScreen = () => {
  const { user } = useAuth();
  return (
    <>
      {user && <ReservationStatus />}
      <HeroSection />
      <WhatIsNewSection />
      {!user && <AuthPromptBar />}
    </>
  );
};

const ReservationStatus = () => {
  const { reservationData } = useReservation();
  console.log("reservationData", reservationData);
  return (
    <div className="mt-5 p-5 w-full bg-white">
      <p className="text-black w-full text-md font-bold text-start">
        ご予約状況
      </p>
      {reservationData ? (
        <div className="w-full my-5 h-[50px] bg-gray-100 border border-gray-200 rounded-md">
          <div>予約日時 : {reservationData.reservation_date}</div>
          <div>座席 : {reservationData.seat}</div>
        </div>
      ) : (
        <div className="w-full my-5 h-[50px] bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center">
          現在予約はありません
        </div>
      )}
    </div>
  );
};

const HeroSection = () => {
  const { setActiveScreenCheckAuth } = useScreen();

  return (
    <div className="relative my-5">
      <img
        src="/images/Smart_deicafe.png"
        alt="Smart_deicafe"
        className="object-cover w-full h-[250px]"
      />
      <div className="absolute flex flex-col items-center justify-center top-0 h-full w-full">
        <p className={`text-center text-2xl text-white/90 ${lato.className}`}>
          SMART dei café
        </p>
        <button
          className="btn-green-wide"
          onClick={() => setActiveScreenCheckAuth("Reservation")}
        >
          座席を予約する
        </button>
      </div>
    </div>
  );
};

const WhatIsNewSection = () => {
  return (
    <div className="p-5 h-auto text-sm bg-white rounded-md">
      <p className="text-black font-bold w-full text-2xl text-start pb-5">
        What's New
      </p>

      <Contents
        image="Mango_Yogurt_smoothie.png"
        description="・〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜"
      />
      <Separator />

      <Contents
        image="Non_alcohol_Mojito.jpg"
        description={`[新商品情報]
ノンアルコール モヒート`}
      />
      <Separator />

      <Contents
        image="Very_Berry_smoothie.png"
        description="・〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜"
      />
    </div>
  );
};

const Contents = (props: { image: string; description: string }) => {
  const { image, description } = props;
  return (
    <div className="flex w-full max-h-40">
      <div className="w-1/3 min-w-[120px]">
        <img
          src={`/images/${image}`}
          alt={image}
          width={120}
          height={120}
          className="object-cover border rounded-md"
        />
      </div>
      <div className="w-2/3 pl-4">
        <div className="h-4/5 overflow-y-auto">
          <p className=" break-words whitespace-pre-wrap">{description}</p>
        </div>
        <div className="h-1/5 text-blue-500">続きを見る</div>
      </div>
    </div>
  );
};
